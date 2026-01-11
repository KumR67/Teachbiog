let data = [];
let rubriques = new Set();
const jsonUrl = 'data/Word_to_Json_BiblioTeacher.json';

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

function parseQuery(raw) {
    const q = raw.trim();
    if (!q) return { exactPhrase: '', terms: [] };

    // Phrase exacte entre ""
    const exactMatch = q.match(/"(.*)"/);
    if(exactMatch) return { exactPhrase: exactMatch[1].toLowerCase(), terms: [] };

    // Termes simples
    const parts = q.split(/\s+/).filter(Boolean);
    const terms = parts.map(p => {
        const clean = p.replace(/\*/g, '');
        return { raw: p, regex: new RegExp(clean, 'i') };
    });
    return { exactPhrase: '', terms };
}
