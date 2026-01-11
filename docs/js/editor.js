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
    // Supprime le prepend pour mettre les boutons en bas
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.className = 'preview-btn';
    previewBtn.onclick = () => previewEdits(container, item);

    toolbar.appendChild(editBtn);
    toolbar.appendChild(previewBtn);

    container.appendChild(toolbar); // ajout **en bas** de la fiche
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

    // Actions en bas
    let actions = container.querySelector('.edit-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'edit-actions';
        container.appendChild(actions);
    } else {
        actions.innerHTML = '';
    }

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEdits(container, item);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits();

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
}

// Prévisualisation locale
function previewEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        const fieldDiv = container.querySelector(`[data-field="${t.dataset.editField}"]`);
        if (fieldDiv) fieldDiv.innerHTML = `<strong>${t.dataset.editField} :</strong> ${t.value}`;
    });
}

function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        item[t.dataset.editField] = t.value;
    });

    alert('Modifications enregistrées (localement)');
    container.classList.remove('editing');
    performSearch(); // rafraîchit l’affichage
}

function cancelEdits() {
    performSearch();
}
