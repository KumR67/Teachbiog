let data = [];
let rubriques = new Set();
const jsonUrl = 'data/tous_les_enregistrements.json';

/* Charger JSON */
fetch(jsonUrl)
.then(r => r.json())
.then(json => {
    data = json;
    data.forEach(item => {
        Object.keys(item).forEach(k => {
            if (k !== 'source') rubriques.add(k);
        });
    });
    renderRubriques();
});

/* Affiche les rubriques avec checkbox */
function renderRubriques() {
    const c = document.getElementById('rubriques-container');
    rubriques.forEach(r => {
        const d = document.createElement('div');
        d.className = 'rubrique-checkbox';
        d.innerHTML = `
            <input type="checkbox" class="rubrique-check" id="rubrique-${r}" checked>
            <label for="rubrique-${r}">${r}</label>
        `;
        c.appendChild(d);
    });
}

/* Rubriques */
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

/* Parsing avec troncature */
function parseQuery(raw) {
    const q = raw.trim();
    if (!q) return { exactPhrase: '', terms: [] };
    const exact = q.match(/^"(.*)"$/);
    if (exact) return { exactPhrase: exact[1].toLowerCase(), terms: [] };

    const parts = q.toLowerCase().split(/\s+/).filter(Boolean);
    const terms = parts.map(p => {
        const clean = p.replace(/\*/g, '');
        let regex;
        if (p.startsWith('*') && p.endsWith('*')) regex = new RegExp(clean, 'i');
        else if (p.startsWith('*')) regex = new RegExp(clean+'\\b', 'i');
        else if (p.endsWith('*')) regex = new RegExp('\\b'+clean, 'i');
        else regex = new RegExp(clean, 'i');
        return { raw: p, regex };
    });
    return { exactPhrase: '', terms };
}

/* Surlignage */
function highlightField(text, exactPhrase, terms) {
    let r = text;
    if (exactPhrase) r = r.replace(new RegExp(exactPhrase, 'gi'), m=>`<span class="match">${m}</span>`);
    terms.forEach(t => { r = r.replace(t.regex, m=>`<span class="match">${m}</span>`); });
    return r;
}
