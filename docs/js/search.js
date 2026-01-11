let data = [];
let rubriques = new Set();

const jsonUrl = 'data/Word_to_Json_BiblioTeacher.json'; // chemin correct depuis index.html

// Chargement du JSON
fetch(jsonUrl)
.then(r => r.json())
.then(json => {
    data = json;
    console.log("✅ JSON chargé :", data.length, "enregistrements");

    data.forEach(item => {
        Object.keys(item).forEach(k => {
            if (k !== 'source') rubriques.add(k);
        });
    });

    renderRubriques();
})
.catch(e => console.error("❌ Erreur chargement JSON :", e));

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

// Recherche
function parseQuery(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) return { exact: '', terms: [] };

    // Phrase exacte entre guillemets
    const exactMatch = q.match(/^"(.*)"$/);
    if (exactMatch) {
        return {
            exact: exactMatch[1],
            terms: []
        };
    }

    const parts = q.split(/\s+/).filter(Boolean);

    const terms = parts.map(p => {
        const clean = p.replace(/\*/g, '');
        let regex;

        if (p.startsWith('*') && p.endsWith('*')) {
            regex = new RegExp(clean, 'i');
        } else if (p.startsWith('*')) {
            regex = new RegExp(clean + '\\b', 'i');
        } else if (p.endsWith('*')) {
            regex = new RegExp('\\b' + clean, 'i');
        } else {
            regex = new RegExp(clean, 'i');
        }

        return {
            raw: p,
            regex
        };
    });

    return { exact: '', terms };
}


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

        const s = document.createElement('div');
        s.className = 'source-item';
        s.textContent = item.source;
        s.onclick = () =>
            document.getElementById(recordId)
                .scrollIntoView({ behavior: 'smooth' });
        sourcesCol.appendChild(s);

        const d = document.createElement('div');
        d.className = 'result';
        d.id = recordId;

        const title = document.createElement('div');
        title.className = 'source';
        title.textContent = item.source;
        d.appendChild(title);

        Object.keys(item).forEach(f => {
            if (f !== 'source') {
                const line = document.createElement('div');
                line.dataset.field = f;
                line.innerHTML =
                    `<strong>${f} :</strong> ` +
                    highlightField(String(item[f]), exact, terms);
                d.appendChild(line);
            }
        });

        addEditToolbar(d, item);
        recordsCol.appendChild(d);
    });
}


// function highlightField(html, exact, terms) {
//     if (!exact && (!terms || !terms.length)) return html;

//     let result = html;

//     if (exact) {
//         const re = new RegExp(exact, 'gi');
//         return result.replace(re, m => `<span class="match">${m}</span>`);
//     }

//     terms.forEach(t => {
//         if (!t.regex) return;
//         result = result.replace(t.regex, m => `<span class="match">${m}</span>`);
//     });

//     return result;
// }

function highlightField(html, exact, terms) {
    return html; // affichage brut, HTML interprété
}

document.getElementById('search').addEventListener('keydown', e => {
    if(e.key === 'Enter') performSearch();
});

