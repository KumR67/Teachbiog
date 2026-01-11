function addEditToolbar(container, item, index) {
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => applyPreview(container);

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Modifier';
    editBtn.onclick = () => enableEditMode(container, item);

    toolbar.appendChild(editBtn);
    toolbar.appendChild(previewBtn);
    container.appendChild(toolbar);
}

function enableEditMode(container, item) {
    if(container.classList.contains('editing')) return;
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

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEditsToGitHub(container, item);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits(container);

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    container.appendChild(actions);
}

function applyPreview(container) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => {
        const parent = t.parentElement;
        parent.innerHTML = `<strong>${t.dataset.editField} :</strong> ${t.value}`;
    });
    alert('Prévisualisation appliquée (affichage brut)');
}

function cancelEdits(container) {
    container.classList.remove('editing');
    performSearch(); // recharge la fiche
}

function saveEditsToGitHub(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => item[t.dataset.editField] = t.value);

    const index = data.findIndex(d => d === item);

    // Envoi à GitHub Actions
    const repo = 'KumR67/Teachbiog';
    const workflow_id = 'modify_record.yaml';
    const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow_id}/dispatches`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `token ${YOUR_PAT_TOKEN}`, // Remplacer par secret côté serveur
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: {
                index: index.toString(),
                updated_record: JSON.stringify(item)
            }
        })
    })
    .then(resp => {
        if(resp.ok) {
            alert('Modifications enregistrées sur GitHub !');
            container.classList.remove('editing');
            performSearch();
        } else {
            resp.text().then(t => alert('Erreur GitHub: ' + t));
        }
    });
}

// function addEditToolbar(container, item) {
//     const toolbar = document.createElement('div');
//     toolbar.className = 'edit-toolbar';
//     container.appendChild(toolbar); // boutons en bas

//     const editBtn = document.createElement('button');
//     editBtn.textContent = '✏️ Modifier';
//     editBtn.className = 'edit-btn';
//     editBtn.onclick = () => enableEditMode(container, item);
//     toolbar.appendChild(editBtn);

//     const previewBtn = document.createElement('button');
//     previewBtn.textContent = '👁️ Prévisualiser';
//     previewBtn.onclick = () => previewEdits(container, item);
//     toolbar.appendChild(previewBtn);
// }

// function enableEditMode(container, item) {
//     if(container.classList.contains('editing')) return;
//     container.classList.add('editing');

//     const fields = container.querySelectorAll('[data-field]');
//     fields.forEach(div => {
//         const field = div.dataset.field;
//         const value = item[field] ?? '';
//         div.innerHTML = `<strong>${field} :</strong><br><textarea data-edit-field="${field}">${value}</textarea>`;
//     });

//     let actions = container.querySelector('.edit-actions');
//     if(!actions) {
//         actions = document.createElement('div');
//         actions.className = 'edit-actions';

//         const saveBtn = document.createElement('button');
//         saveBtn.textContent = '✔️ Valider';
//         saveBtn.onclick = () => saveEdits(container, item);

//         const cancelBtn = document.createElement('button');
//         cancelBtn.textContent = '❌ Annuler';
//         cancelBtn.onclick = () => cancelEdits(container);

//         actions.appendChild(saveBtn);
//         actions.appendChild(cancelBtn);
//         container.appendChild(actions);
//     }
// }

// function saveEdits(container, item) {
//     const edits = container.querySelectorAll('textarea[data-edit-field]');
//     edits.forEach(t => {
//         item[t.dataset.editField] = t.value;
//     });
//     alert("✅ Modifications enregistrées localement");
//     performSearch(); // refresh affichage
// }

// function cancelEdits() {
//     performSearch();
// }

// function previewEdits(container, item) {
//     const edits = container.querySelectorAll('textarea[data-edit-field]');
//     edits.forEach(t => {
//         t.value = t.value; // Ici tu pourrais ajouter un modal ou surlignage
//     });
//     alert("👁️ Prévisualisation appliquée (affichage brut)");
// }

