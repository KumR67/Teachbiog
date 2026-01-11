function addEditToolbar(recordDiv, item) {
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Modifier cette fiche';
    editBtn.className = 'edit-btn';

    editBtn.onclick = () => enableEditing(recordDiv, item);

    toolbar.appendChild(editBtn);
    recordDiv.appendChild(toolbar);
}

function enableEditing(recordDiv, item) {
    const original = JSON.parse(JSON.stringify(item)); // clone pour annuler

    recordDiv.querySelectorAll('[data-field]').forEach(div => {
        const field = div.dataset.field;
        const value = item[field] ?? '';

        const textarea = document.createElement('textarea');
        textarea.className = 'edit-field';
        textarea.value = value;

        div.innerHTML = `<strong>${field} :</strong>`;
        div.appendChild(textarea);
    });

    const toolbar = recordDiv.querySelector('.edit-toolbar');
    toolbar.innerHTML = '';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Appliquer (local)';
    applyBtn.className = 'edit-btn confirm';

    applyBtn.onclick = () => {
        recordDiv.querySelectorAll('[data-field]').forEach(div => {
            const field = div.dataset.field;
            const textarea = div.querySelector('textarea');
            if (textarea) item[field] = textarea.value;
        });
        performSearch();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Annuler';
    cancelBtn.className = 'edit-btn cancel';

    cancelBtn.onclick = () => {
        Object.assign(item, original);
        performSearch();
    };

    toolbar.appendChild(applyBtn);
    toolbar.appendChild(cancelBtn);
}
