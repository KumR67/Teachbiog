function addEditToolbar(container, item) {
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

        div.innerHTML = `
            <strong>${field} :</strong><br>
            <textarea data-edit-field="${field}">${value}</textarea>
        `;
    });

    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';

    saveBtn.onclick = () => saveEdits(container, item);
    cancelBtn.onclick = () => cancelEdits();

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    container.appendChild(actions);
}

function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        item[t.dataset.editField] = t.value;
    });

    alert('Modifications enregistrées (localement)');
    performSearch(); // refresh
}

function cancelEdits() {
    performSearch();
}
