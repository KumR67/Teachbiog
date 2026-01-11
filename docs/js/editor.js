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

    const previewBtn = document.createElement('button');
    previewBtn.textContent = '👁️ Prévisualiser';
    previewBtn.onclick = () => {
        alert("Prévisualisation appliquée (affichage brut)");
        // Optionnel : tu pourrais mettre à jour un div preview ici
    };

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔️ Valider';
    saveBtn.onclick = () => saveEdits(container, item);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.onclick = () => cancelEdits();

    actions.appendChild(previewBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    container.appendChild(actions);
}

function saveEdits(container, item) {
    const edits = container.querySelectorAll('textarea[data-edit-field]');
    const modifiedFields = {};

    edits.forEach(t => {
        const field = t.dataset.editField;
        const value = t.value;
        item[field] = value; // mise à jour locale
        modifiedFields[field] = value; // pour envoyer au workflow
    });

    // Envoi vers GitHub Actions via workflow proxy
    const fullname = item['Fullname'];
    if (!fullname) {
        alert("Impossible : la fiche n'a pas de Fullname");
        return;
    }

    // On peut envoyer chaque rubrique modifiée une par une
    Object.entries(modifiedFields).forEach(([field, value]) => {
        triggerWorkflow(fullname, field, value);
    });

    alert('✅ Modifications envoyées à GitHub');
    container.classList.remove('editing');
    performSearch(); // rafraîchit l’affichage
}

function cancelEdits() {
    performSearch();
}

// ===== Fonction pour déclencher le workflow via fetch =====
function triggerWorkflow(fullname, field, newText) {
    fetch('https://api.github.com/repos/KumR67/Teachbiog/actions/workflows/trigger-modify-json.yaml/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + GITHUB_PAT, // à définir dans main.js ou via input
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: {
                fullname: fullname,
                rubrique: field,
                search_text: '',   // tu peux le remplir si nécessaire
                replace_text: newText,
                preview_only: 'false'
            }
        })
    })
    .then(resp => {
        if (resp.ok) console.log(`✅ Workflow déclenché pour ${fullname} → ${field}`);
        else console.error('❌ Erreur déclenchement workflow', resp.status, resp.statusText);
    })
    .catch(err => console.error('❌ Erreur fetch workflow', err));
}
