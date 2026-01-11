// function addEditToolbar(container, item) {
//     const toolbar = document.createElement('div');
//     toolbar.className = 'edit-toolbar';

//     const editBtn = document.createElement('button');
//     editBtn.textContent = '✏️ Modifier';
//     editBtn.className = 'edit-btn';

//     editBtn.onclick = () => enableEditMode(container, item);

//     toolbar.appendChild(editBtn);
//     container.prepend(toolbar);
// }

// function enableEditMode(container, item) {
//     if (container.classList.contains('editing')) return;
//     container.classList.add('editing');

//     const fields = container.querySelectorAll('[data-field]');

//     fields.forEach(div => {
//         const field = div.dataset.field;
//         const value = item[field] ?? '';

//         div.innerHTML = `
//             <strong>${field} :</strong><br>
//             <textarea data-edit-field="${field}">${value}</textarea>
//         `;
//     });

//     const actions = document.createElement('div');
//     actions.className = 'edit-actions';

//     const saveBtn = document.createElement('button');
//     saveBtn.textContent = '✔️ Valider';

//     const cancelBtn = document.createElement('button');
//     cancelBtn.textContent = '❌ Annuler';

//     saveBtn.onclick = () => saveEdits(container, item);
//     cancelBtn.onclick = () => cancelEdits();

//     actions.appendChild(saveBtn);
//     actions.appendChild(cancelBtn);
//     container.appendChild(actions);
// }

// function saveEdits(container, item) {
//     const edits = container.querySelectorAll('textarea[data-edit-field]');
//     edits.forEach(t => {
//         item[t.dataset.editField] = t.value;
//     });

//     alert('Modifications enregistrées (localement)');
//     performSearch(); // refresh
// }

// function cancelEdits() {
//     performSearch();
// }

function addEditToolbar(container, item) {
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => togglePreview(container, item);

    toolbar.appendChild(editBtn);
    toolbar.appendChild(previewBtn);
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
    saveBtn.onclick = () => saveEdits(container, item);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
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
    performSearch(); // rafraîchit l'affichage
}

function cancelEdits() {
    performSearch();
}

function togglePreview(container, item) {
    let preview = container.querySelector('.preview-area');
    if (preview) {
        preview.remove();
        return;
    }

    preview = document.createElement('div');
    preview.className = 'preview-area';

    const fields = Object.keys(item).filter(k => k !== 'source');
    let html = '';
    fields.forEach(f => {
        html += `<strong>${f} :</strong> ${item[f]}<br>`;
    });

    preview.innerHTML = html;
    container.appendChild(preview);
}
