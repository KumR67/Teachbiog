function enableEditing(recordDiv, item) {
    Object.keys(item).forEach(f => {
        if (f === 'source') return;
        const fieldDiv = recordDiv.querySelector(`div[data-field="${f}"]`);
        if (!fieldDiv) return;

        const current = fieldDiv.textContent.replace(f+": ", "");
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-field';
        input.value = current;
        fieldDiv.innerHTML = '';
        fieldDiv.appendChild(input);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✔';
        saveBtn.className = 'edit-btn';
        saveBtn.onclick = () => {
            item[f] = input.value;
            fieldDiv.textContent = f+": "+input.value;
        };
        fieldDiv.appendChild(saveBtn);
    });
}
