// editor.js

function addEditToolbar(container, item) {
    if(container.querySelector('.edit-toolbar')) return; // éviter doublons

    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);

    toolbar.appendChild(editBtn);
    container.prepend(toolbar);
}

function enableEditMode(container, item) {
    if (container.classList.contains('editing')) return;
    container.classList.add('editing');

    const fields = container.querySelectorAll('[data-field]');
    fields.forEach(div => {
        const field = div.dataset.field;
        const value = item[field] ?? '';
        div.innerHTML = `<strong>${field} :</strong><br><textarea data-edit-field="${field}">${value}</textarea>`;
    });

    // Actions en bas
    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => previewEdits(container);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => commitEdits(container, item);

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
        const field = t.dataset.editField;
        const value = t.value;
        const div = t.parentElement;
        div.innerHTML = `<strong>${field} :</strong> ${value}`;
    });
    alert("Prévisualisation appliquée (affichage brut)");
}

function commitEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    const updates = {};

    edits.forEach(t => {
        const field = t.dataset.editField;
        const value = t.value;
        item[field] = value; // local
        updates[field] = value; // pour le workflow
    });

    // Déclenchement du workflow proxy
    triggerProxyWorkflow(item.Fullname, updates);

    alert("Modification envoyée à GitHub (workflow déclenché)");
    container.classList.remove('editing');
    performSearch(); // rafraîchir l'affichage
}

function cancelEdits() {
    performSearch();
}

// --- Déclenchement du workflow proxy ---
function triggerProxyWorkflow(fullname, updates) {
    const payload = {
        fullname: fullname,
        search_text: '',       // peut être vide, on utilise les rubriques
        replace_text: '',      // idem
        preview_only: 'false'
    };

    // Ajouter toutes les rubriques modifiées comme input 'rubrique=valeur'
    Object.keys(updates).forEach((field, idx) => {
        payload[`rubrique_${idx}`] = field + '||' + updates[field];
    });

    fetch('https://api.github.com/repos/KumR67/Teachbiog/actions/workflows/trigger-modify-json.yaml/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
            // pas de token côté client, workflow proxy s'en occupe
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: payload
        })
    })
    .then(r => {
        if(r.ok) console.log('✅ Workflow déclenché');
        else r.text().then(txt => console.error('❌ Erreur déclenchement workflow :', txt));
    })
    .catch(e => console.error('❌ Erreur réseau workflow:', e));
}
