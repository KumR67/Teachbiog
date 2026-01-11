function addEditToolbar(container, item) {
    if (container.querySelector('.edit-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);

    toolbar.appendChild(editBtn);
    container.appendChild(toolbar);
}

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
    cancelBtn.onclick = () => cancelEdits(container);

    actions.appendChild(previewBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    container.appendChild(actions);
}

function previewEdits(container) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        t.parentElement.innerHTML = `<strong>${t.dataset.editField} :</strong> ${t.value}`;
    });
    alert("Prévisualisation appliquée (affichage brut)");
}

function commitEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        item[t.dataset.editField] = t.value;
    });

    alert("Modifications enregistrées localement");

    // --- Appel GitHub workflow pour modifier le JSON ---
    edits.forEach(t => {
        const payload = {
            fullname: item.Fullname,
            rubrique: t.dataset.editField,
            search_text: "",          // on modifie directement la rubrique
            replace_text: t.value,
            preview_only: "false"     // commit réel
        };

        fetch('https://api.github.com/repos/KumR67/Teachbiog/actions/workflows/trigger-modify-json.yaml/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token REPLACE_WITH_YOUR_PAT`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: payload
            })
        }).then(res => {
            if(res.ok) console.log(`✅ Workflow déclenché pour ${payload.rubrique}`);
            else console.error("❌ Erreur déclenchement workflow", res.status);
        }).catch(e => console.error(e));
    });

    performSearch();
}

function cancelEdits(container) {
    container.classList.remove('editing');
    performSearch();
}
