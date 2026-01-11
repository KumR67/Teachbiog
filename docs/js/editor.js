function addEditToolbar(container, item) {
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
    saveBtn.onclick = () => saveEdits(container, item);

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
    performSearch();
}

// Fonction qui appelle ton workflow GitHub pour modifier le JSON
function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    edits.forEach(t => item[t.dataset.editField] = t.value);

    // Appeler le workflow pour chaque champ modifié
    const fullname = item.Fullname;
    edits.forEach(t => {
        const field_name = t.dataset.editField;
        const new_text = t.value;

        fetch('https://api.github.com/repos/KumR67/Teachbiog/actions/workflows/modify_json.yaml/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `token ${YOUR_PAT_TOKEN}`, // NE PAS mettre le token côté client ! utiliser serveur ou GitHub App
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: { fullname, field_name, new_text }
            })
        })
        .then(resp => {
            if(resp.ok) {
                console.log(`✅ ${field_name} mis à jour pour ${fullname}`);
            } else {
                resp.text().then(t => console.error('Erreur GitHub:', t));
            }
        });
    });

    alert('Modifications envoyées à GitHub !');
    container.classList.remove('editing');
    performSearch();
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

