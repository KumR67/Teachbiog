// main.js - fusion de search.js et main.js

let data = [];
let rubriques = new Set();
const jsonUrl = 'data/Word_to_Json_BiblioTeacher.json';

// ===== Chargement du JSON =====
fetch(jsonUrl)
  .then(r => r.json())
  .then(json => {
      data = json;
      console.log("✅ JSON chargé :", data.length, "enregistrements");

      // Collecte des rubriques (tous les champs sauf 'source')
      data.forEach(item => {
          Object.keys(item).forEach(k => {
              if (k !== 'source') rubriques.add(k);
          });
      });

      renderRubriques();
  })
  .catch(e => console.error("❌ Erreur chargement JSON :", e));

// ===== Rubriques =====
function renderRubriques() {
    const container = document.getElementById('rubriques-container');
    container.innerHTML = '';
    rubriques.forEach(r => {
        const div = document.createElement('div');
        div.className = 'rubrique-checkbox';
        div.innerHTML = `
            <input type="checkbox" class="rubrique-check" id="rubrique-${r}" checked>
            <label for="rubrique-${r}">${r}</label>
        `;
        container.appendChild(div);
    });
}

function getSelectedRubriques() {
    return [...rubriques].filter(r => {
        const cb = document.getElementById(`rubrique-${r}`);
        return cb && cb.checked;
    });
}

function checkAllRubriques() {
    document.querySelectorAll('.rubrique-check').forEach(cb => cb.checked = true);
}

function uncheckAllRubriques() {
    document.querySelectorAll('.rubrique-check').forEach(cb => cb.checked = false);
}

// ===== Parsing de la requête =====
function parseQuery(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) return { exact: '', terms: [] };

    // Phrase exacte entre guillemets
    const exactMatch = q.match(/^"(.*)"$/);
    if (exactMatch) {
        return { exact: exactMatch[1], terms: [] };
    }

    const parts = q.split(/\s+/).filter(Boolean);
    const terms = parts.map(p => {
        const clean = p.replace(/\*/g, '');
        let regex;
        if (p.startsWith('*') && p.endsWith('*')) regex = new RegExp(clean, 'i');
        else if (p.startsWith('*')) regex = new RegExp(clean + '\\b', 'i');
        else if (p.endsWith('*')) regex = new RegExp('\\b' + clean, 'i');
        else regex = new RegExp(clean, 'i');
        return { raw: p, regex };
    });

    return { exact: '', terms };
}

// ===== Recherche et affichage =====
function performSearch() {
    const input = document.getElementById('search').value;
    const { exact, terms } = parseQuery(input);
    const selected = getSelectedRubriques();

    const sourcesCol = document.getElementById('sources-column');
    const recordsCol = document.getElementById('records-column');
    const countDiv = document.getElementById('results-count');

    sourcesCol.innerHTML = '';
    recordsCol.innerHTML = '';
    countDiv.innerHTML = '';

    const results = data.filter(item => {
        return Object.entries(item).some(([k, v]) => {
            if (k === 'source') return false;
            if (selected.length && !selected.includes(k)) return false;

            const text = String(v).toLowerCase();
            if (exact) return text.includes(exact);
            if (terms.length) return terms.every(t => t.regex.test(text));

            return true;
        });
    });

    countDiv.textContent = `${results.length} enregistrement(s) trouvé(s)`;

    results.forEach((item, i) => {
        const recordId = `record-${i}`;

        // Colonne sources
        const s = document.createElement('div');
        s.className = 'source-item';
        s.textContent = item.source;
        s.onclick = () => document.getElementById(recordId).scrollIntoView({ behavior: 'smooth' });
        sourcesCol.appendChild(s);

        // Colonne enregistrements
        const d = document.createElement('div');
        d.className = 'result';
        d.id = recordId;

        const title = document.createElement('div');
        title.className = 'source';
        title.textContent = item.source;
        d.appendChild(title);

        // Affichage des champs
        Object.keys(item).forEach(f => {
            if (f !== 'source') {
                const line = document.createElement('div');
                line.dataset.field = f;
                line.innerHTML = `<strong>${f} :</strong> ${highlightField(item[f], exact, terms)}`;
                d.appendChild(line);
            }
        });

        addEditToolbar(d, item); // editor.js gère les boutons Modifier / Valider / Annuler
        recordsCol.appendChild(d);
    });
}

// ===== Surlignage des termes =====
function highlightField(html, exact, terms) {
    let result = html;

    if (exact) {
        const re = new RegExp(exact, 'gi');
        result = result.replace(re, m => `<span class="match">${m}</span>`);
    }

    if (terms && terms.length) {
        terms.forEach(t => {
            if (!t.regex) return;
            result = result.replace(t.regex, m => `<span class="match">${m}</span>`);
        });
    }

    return result; // HTML interprété dans innerHTML
}

// ===== Événements =====
document.getElementById('search').addEventListener('keydown', e => {
    if (e.key === 'Enter') performSearch();
});

// Bouton retour en haut
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
