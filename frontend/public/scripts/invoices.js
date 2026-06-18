// ====================
// INVOICE CRUD MANAGEMENT
// ====================

const invoicesUrl = 'http://localhost:3000/api/facturas';
const usersUrl = 'http://localhost:3000/api/usuarios';

// ====================
// API HELPERS
// ====================

function get(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function create(url, data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed. Status code: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Request error:', error);
            throw error;
        });
}

function update(url, data) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Request error:', error);
            throw error;
        });
}

function deleteRecord(url, id) {
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            throw error;
        });
}

// ====================
// UI HELPERS
// ====================

function populateUserOptions(selectId) {
    const selectElement = document.getElementById(selectId);

    return get(usersUrl)
        .then(users => {
            selectElement.innerHTML = '<option value="">Select user</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.id}: ${user.nombre}`;
                selectElement.appendChild(option);
            });
        })
        .catch(error => alert(error));
}

function populateSelect() {
    const selectInvoice = document.getElementById('selectInvoice');

    get(invoicesUrl)
        .then(invoices => {
            selectInvoice.innerHTML = '<option value="">Select</option>';

            invoices.forEach(invoice => {
                const option = document.createElement('option');
                option.value = invoice.id;
                option.textContent = `${invoice.id}: ${invoice.usuario_nombre} - ${invoice.monto}`;
                selectInvoice.appendChild(option);
            });

            // Load selected invoice data into edit form
            selectInvoice.addEventListener('change', function () {
                const selectedInvoice = invoices.find(
                    invoice => invoice.id == this.value
                );

                if (selectedInvoice) {
                    document.getElementById('ownerSelectEdit').value = selectedInvoice.usuario_id;
                    document.getElementById('amountEdit').value = selectedInvoice.monto;

                    // API returns ISO datetime; date input expects YYYY-MM-DD
                    document.getElementById('dateEdit').value =
                        selectedInvoice.fecha.split('T')[0];

                    document.getElementById('descriptionEdit').value =
                        selectedInvoice.descripcion;
                } else {
                    clearForm();
                }
            });
        })
        .catch(error => alert(error));
}

function refreshList() {
    const invoiceList = document.getElementById('invoiceList');

    return get(invoicesUrl)
        .then(invoices => {
            invoiceList.innerHTML = '';

            invoices.forEach(invoice => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${invoice.id}</td>
                    <td>${invoice.usuario_nombre}</td>
                    <td>${invoice.monto}</td>
                    <td>${invoice.fecha.split('T')[0]}</td>
                    <td>${invoice.descripcion}</td>
                `;
                invoiceList.appendChild(row);
            });
        })
        .catch(error => alert(error));
}

function clearForm() {
    document.getElementById('ownerSelect').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';

    document.getElementById('ownerSelectEdit').value = '';
    document.getElementById('amountEdit').value = '';
    document.getElementById('dateEdit').value = '';
    document.getElementById('descriptionEdit').value = '';
}

// ====================
// CRUD ACTIONS
// ====================

async function addInvoice() {
    const userId = document.getElementById('ownerSelect').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Validate required fields
    if (!userId || !amount || !date) {
        alert('Please fill in all required fields.');
        return;
    }

    const invoice = {
        usuario_id: userId,
        monto: amount,
        fecha: date,
        descripcion: description
    };

    try {
        await create(invoicesUrl, invoice);
        alert('Invoice added successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error adding invoice.');
    }
}

async function editInvoice() {
    const selectedId = document.getElementById('selectInvoice').value;
    const userId = document.getElementById('ownerSelectEdit').value;
    const amount = document.getElementById('amountEdit').value;
    const date = document.getElementById('dateEdit').value;
    const description = document.getElementById('descriptionEdit').value;

    if (!selectedId || !userId || !amount || !date) {
        alert('Please fill in all required fields.');
        return;
    }

    const editedInvoice = {
        usuario_id: userId,
        monto: amount,
        fecha: date,
        descripcion: description
    };

    try {
        await update(`${invoicesUrl}/${selectedId}`, editedInvoice);
        alert('Invoice updated successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error updating invoice.');
    }
}

async function removeInvoice() {
    const selectedId = document.getElementById('selectInvoice').value;

    if (!selectedId) {
        alert('Please select an invoice.');
        return;
    }

    try {
        await deleteRecord(invoicesUrl, selectedId);
        alert('Invoice deleted successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error deleting invoice.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addButton').addEventListener('click', addInvoice);
    document.getElementById('editButton').addEventListener('click', editInvoice);
    document.getElementById('deleteButton').addEventListener('click', removeInvoice);

    populateUserOptions('ownerSelect');
    populateUserOptions('ownerSelectEdit');
    populateSelect();
    refreshList();
});