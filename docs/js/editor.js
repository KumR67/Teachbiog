// editor.js

// ===== Ajout de la barre d'édition =====
function addEditToolbar(container, item) {
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';
    container.appendChild(toolbar); // barre en bas

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);
    toolbar.appendChild(editBtn);

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.className = 'preview-btn';
    previewBtn.onclick = () => previewEdits(container);
    toolbar.appendChild(previewBtn);
}

// ===== Activer le mode édition =====
function enableEditMode(container, item) {
    if (container.classList.contains('editing')) return;
    container.classList.add('editing');

    const fields = container.querySelectorAll('[data-field]');
    fields.forEach(div => {
        const field = div.dataset.field;
        const value = item[field] ?? '';
        div.innerHTML = `
            <strong>${field} :</strong><br>
            <textarea data-edit-field="${field}">${value}</textarea>
        `;
    });

    // Actions bas de fiche
    let actions = container.querySelector('.edit-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'edit-actions';
        container.appendChild(actions);
    }
    actions.innerHTML = '';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEdits(container, item);
    actions.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits(container);
    actions.appendChild(cancelBtn);
}

// ===== Prévisualiser =====
function previewEdits(container) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        const parent = t.parentElement;
        parent.innerHTML = `<strong>${t.dataset.editField} :</strong> ${t.value}`;
    });
    alert('Prévisualisation appliquée (affichage local)');
}

// ===== Sauvegarder les modifications =====
function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    const updatedFields = {};

    edits.forEach(t => {
        item[t.dataset.editField] = t.value; // local
        updatedFields[t.dataset.editField] = t.value;
    });

    alert('Modifications enregistrées localement');

    // Déclenchement workflow proxy GitHub
    triggerProxyWorkflow(item.Fullname, updatedFields);
}

// ===== Annuler =====
function cancelEdits() {
    performSearch(); // refresh affichage
}

// ===== Déclenche le workflow proxy =====
function triggerProxyWorkflow(fullname, updates) {
    // Envoi des données au workflow proxy via fetch API côté serveur
    fetch('https://api.github.com/repos/KumR67/Teachbiog/actions/workflows/trigger-modify-json.yaml/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
            // ne pas mettre le PAT ici ! Il est côté Actions
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: {
                fullname: fullname,
                search_text: '', // on peut ajuster si besoin
                replace_text: '', // on peut ajuster si besoin
                preview_only: 'false' // on veut commit
            }
        })
    }).then(r => {
        if(r.ok) alert('Modification envoyée à GitHub');
        else alert('❌ Erreur déclenchement workflow');
    }).catch(e => alert('❌ Erreur réseau : ' + e));
}
