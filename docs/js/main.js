/* Recherche et affichage */
function performSearch() {
    const { exactPhrase, terms } = parseQuery(document.getElementById('search').value);
    const selectedRubriques = getSelectedRubriques();

    const sourcesCol = document.getElementById('sources-column');
    const recordsCol = document.getElementById('records-column');
    const countDiv = document.getElementById('results-count');

    sourcesCol.innerHTML = '';
    recordsCol.innerHTML = '';
    countDiv.innerHTML = '';

    const results = data.filter(item => {
        return Object.entries(item).some(([k,v])=>{
            if(k==='source') return false;
            if(selectedRubriques.length && !selectedRubriques.includes(k)) return false;
            const text = String(v);
            if(exactPhrase) return text.toLowerCase().includes(exactPhrase);
            if(terms.length) return terms.every(t=>t.regex.test(text));
            return true;
        });
    });

    countDiv.textContent = `${results.length} enregistrement(s) trouvé(s)`;

    results.forEach((item,index)=>{
        const recordId = `record-${index}`;
        const s = document.createElement('div');
        s.className = 'source-item';
        s.textContent = item.source;
        s.onclick = ()=>document.getElementById(recordId).scrollIntoView({behavior:'smooth'});
        sourcesCol.appendChild(s);

        const d = document.createElement('div');
        d.className = 'result';
        d.id = recordId;

        const title = document.createElement('div');
        title.className = 'source';
        title.textContent = item.source;
        d.appendChild(title);

        Object.keys(item).forEach(f=>{
            if(f==='source') return;
            const line = document.createElement('div');
            line.dataset.field = f;
            line.innerHTML = `<strong>${f} :</strong> ` + highlightField(String(item[f]).replace(/\n/g,'<br>'), exactPhrase, terms);
            d.appendChild(line);
        });

        recordsCol.appendChild(d);
    });
}

/* Retour en haut */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll',()=>backToTop.style.display=window.scrollY>300?'block':'none');
backToTop.addEventListener('click',()=>window.scrollTo({top:0, behavior:'smooth'}));
