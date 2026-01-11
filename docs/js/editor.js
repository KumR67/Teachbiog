function enableEditing(recordDiv, item) {
    Object.keys(item).forEach(f => {
        if(f==='source') return;
        const fieldDiv = recordDiv.querySelector(`div[data-field="${f}"]`);
        if(!fieldDiv) return;

        const current = fieldDiv.textContent.replace(f+": ","");
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-field';
        input.value = current;
        fieldDiv.innerHTML = '';
        fieldDiv.appendChild(input);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✔';
        saveBtn.className = 'edit-btn';
        saveBtn.onclick = () => {
            item[f] = input.value;
            fieldDiv.textContent = f+": "+input.value;
        };
        fieldDiv.appendChild(saveBtn);
    });
}

function addEditButtons(recordDiv, item) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Modifier cette fiche';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditing(recordDiv, item);
    recordDiv.appendChild(editBtn);

    const globalBtn = document.createElement('button');
    globalBtn.textContent = 'Remplacer dans toutes les fiches';
    globalBtn.className = 'edit-btn';
    globalBtn.onclick = () => {
        const searchText = prompt("Texte à rechercher :");
        const replaceText = prompt("Texte de remplacement :");
        if(!searchText) return;
        let count = 0;
        data.forEach(fiche => {
            Object.keys(fiche).forEach(k=>{
                if(typeof fiche[k]==='string' && fiche[k].includes(searchText)) {
                    fiche[k] = fiche[k].replaceAll(searchText, replaceText);
                    count++;
                }
            });
        });
        alert(`✅ ${count} champs modifiés dans toutes les fiches.`);
        performSearch();
    };
    recordDiv.appendChild(globalBtn);
}
