function addEditToolbar(container, item) {
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);

    toolbar.appendChild(editBtn);
    container.appendChild(toolbar); // le toolbar reste en bas
}

function enableEditMode(container, item) {
    if (container.classList.contains('editing')) return;
    container.classList.add('editing');

    const fields = container.querySelectorAll('[data-field]');

    fields.forEach(div => {
        const field = div.dataset.field;
        const value = item[field] ?? '';
        div.innerHTML = `<strong>${field} :</strong><br>
                         <textarea data-edit-field="${field}">${value}</textarea>`;
    });

    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => previewEdits(container);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEdits(container, item);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits();

    actions.appendChild(previewBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    container.appendChild(actions);
}

function previewEdits(container) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        const div = t.parentElement;
        div.innerHTML = `<strong>${t.dataset.editField} :</strong><br>${t.value}`;
    });
    alert('Prévisualisation appliquée (affichage brut)');
}

function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    const updates = {};
    edits.forEach(t => {
        updates[t.dataset.editField] = t.value;
    });

    // Mettre à jour localement
    Object.keys(updates).forEach(f => {
        item[f] = updates[f];
    });

    alert('Modifications enregistrées localement');

    // Déclencher le workflow proxy pour GitHub
    triggerProxyWorkflow(item['Fullname'], updates);

    // Réaffichage
    performSearch();
}

function cancelEdits() {
    performSearch();
}

function triggerProxyWorkflow(fullname, updates) {
    // On envoie les données au workflow proxy côté GitHub
    fetch('.github/workflows/trigger-modify-json.yaml', { 
        // chemin relatif au workflow proxy
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: {
                fullname: fullname,
                search_text: '', // si tu veux, on peut remplir
                replace_text: '', // à gérer côté workflow pour toutes les rubriques
                preview_only: 'false'
            }
        })
    })
    .then(r => {
        if(r.ok) alert('✅ Modification envoyée à GitHub');
        else alert('❌ Erreur déclenchement workflow');
    })
    .catch(e => alert('❌ Erreur réseau : ' + e));
}
