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
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.marginBottom = '5px';
    toolbar.style.position = 'sticky';
    toolbar.style.bottom = '0';
    toolbar.style.backgroundColor = '#fff';
    toolbar.style.padding = '4px 0';

    // Bouton Modifier
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => enableEditMode(container, item);
    toolbar.appendChild(editBtn);

    // Bouton Prévisualiser
    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => {
        let preview = container.querySelector('.preview-box');
        if(preview) preview.remove();

        preview = document.createElement('div');
        preview.className = 'preview-box';
        preview.style.border = '1px solid #aaa';
        preview.style.padding = '8px';
        preview.style.marginTop = '5px';
        preview.style.backgroundColor = '#f4f4f4';
        preview.style.maxHeight = '200px';
        preview.style.overflowY = 'auto';

        // On montre le contenu actuel des champs modifiables
        const edits = container.querySelectorAll('textarea[data-edit-field]');
        if(edits.length) {
            const obj = {};
            edits.forEach(t => { obj[t.dataset.editField] = t.value; });
            preview.textContent = JSON.stringify(obj, null, 2);
        } else {
            preview.textContent = JSON.stringify(item, null, 2);
        }

        container.appendChild(preview);
    };
    toolbar.appendChild(previewBtn);

    container.prepend(toolbar);
}

function enableEditMode(container, item) {
    if(container.classList.contains('editing')) return;
    container.classList.add('editing');

    const fields = container.querySelectorAll('[data-field]');

    fields.forEach(div => {
        const field = div.dataset.field;
        const value = item[field] ?? '';

        div.innerHTML = `
            <strong>${field} :</strong><br>
            <textarea data-edit-field="${field}" style="width:100%; min-height:50px;">${value}</textarea>
        `;
    });

    const actions = document.createElement('div');
    actions.className = 'edit-actions';
    actions.style.display = 'flex';
    actions.style.gap = '8px';
    actions.style.marginTop = '5px';

    // Valider
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEdits(container, item);
    actions.appendChild(saveBtn);

    // Annuler
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits();
    actions.appendChild(cancelBtn);

    container.appendChild(actions);
}

function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        item[t.dataset.editField] = t.value;
    });

    alert('Modifications enregistrées (localement)');
    performSearch(); // refresh pour appliquer
}

function cancelEdits() {
    performSearch();
}
