/**
 * crud_factura.js
 *
 * This file implements the CRUD (Create, Read, Update, Delete) logic
 * for managing Invoice records through a REST API.
 * It handles all communication with the backend, as well as the DOM
 * manipulation needed to keep the form, dropdowns, and table in sync.
 *
 * Each invoice belongs to a user, so this file also fetches the list of
 * users to populate the "owner" dropdowns used when adding or editing
 * an invoice.
 */

// Base URL for the Invoices API endpoint.
const invoicesUrl = 'http://localhost:3000/api/facturas';

// Base URL for the Users API endpoint (needed to populate the owner dropdowns).
const usersUrl = 'http://localhost:3000/api/usuarios';

/**
 * Sends a GET request to the given URL and returns the parsed JSON response.
 *
 * @param {string} url - The endpoint to fetch data from.
 * @returns {Promise<Object|Array>} A promise that resolves with the parsed JSON data.
 * @throws {Error} If the response status is not OK (e.g. 404, 500).
 */
function get(url) {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error:', error);
            throw error;
        });
}

/**
 * Sends a POST request to create a new record on the server.
 *
 * @param {string} url - The endpoint to send the new record to.
 * @param {Object} data - The object containing the new record's data.
 * @returns {Promise<Object>} A promise that resolves with the created record returned by the server.
 * @throws {Error} If the request fails or the response status is not OK.
 */
function create(url, data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Converts the JS object into a JSON string for the request body.
        body: JSON.stringify(data),
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`The request could not be completed successfully. Status code: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Request error:', error);
            throw error;
        });
}

/**
 * Sends a PUT request to update an existing record on the server.
 *
 * @param {string} url - The full endpoint of the record to update (including its ID).
 * @param {Object} data - The object containing the updated field values.
 * @returns {Promise<Object>} A promise that resolves with the updated record returned by the server.
 * @throws {Error} If the request fails or the response status is not OK.
 */
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
                throw new Error('The request could not be completed successfully');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Request error:', error);
            throw error;
        });
}

/**
 * Sends a DELETE request to remove a record from the server by its ID.
 *
 * @param {string} url - The base endpoint (without the ID appended).
 * @param {string|number} id - The unique identifier of the record to delete.
 * @returns {Promise<void>} A promise that resolves once the record has been deleted.
 * @throws {Error} If the request fails or the response status is not OK.
 */
function deleteRecord(url, id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${url}/${id}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The request could not be completed successfully');
            }
            console.log(`Successfully deleted ID: ${id}`);
        })
        .catch((error) => {
            console.error(`Error deleting ID: ${id}`, error);
            throw error;
        });
}

/**
 * Fetches all users from the API and populates a given <select> element
 * with one option per user, so an invoice can be linked to its owner.
 *
 * @param {string} selectId - The id of the <select> element to populate.
 * @returns {Promise<void>}
 */
function populateUserOptions(selectId) {
    const selectElement = document.getElementById(selectId);

    return get(usersUrl)
        .then(users => {
            if (!Array.isArray(users)) {
                console.error('Error: The response is not an array of users');
                return;
            }

            selectElement.innerHTML = '<option value="">Select user</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.id}: ${user.nombre}`;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            alert(error);
        });
}

/**
 * Reads the values from the add-invoice form (owner, amount, date,
 * description), validates them, and sends them to the API to create
 * a new invoice. On success, it clears the form and refreshes both
 * the table and the invoice dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function addInvoice() {
    const userId = document.getElementById('ownerSelect').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Basic client-side validation: owner, amount, and date are required.
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
    } catch (error) {
        alert('Error adding invoice.');
    }
}

/**
 * Reads the selected invoice's ID along with the new owner, amount,
 * date, and description values from the edit form, validates them,
 * and sends an update request to the API. On success, it clears the
 * form and refreshes both the table and the invoice dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function editInvoice() {
    const selectedId = document.getElementById('selectInvoice').value;
    const userId = document.getElementById('ownerSelectEdit').value;
    const amount = document.getElementById('amountEdit').value;
    const date = document.getElementById('dateEdit').value;
    const description = document.getElementById('descriptionEdit').value;

    // Basic client-side validation: an invoice must be selected and the required fields filled in.
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
        alert('Invoice edited successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch (error) {
        alert('Error editing invoice.');
    }
}

/**
 * Reads the currently selected invoice's ID and sends a delete request
 * to the API. On success, it clears the form and refreshes both the
 * table and the invoice dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function removeInvoice() {
    const selectedId = document.getElementById('selectInvoice').value;

    // An invoice must be selected before deletion can proceed.
    if (!selectedId) {
        alert('Please select an invoice to delete.');
        return;
    }

    try {
        await deleteRecord(invoicesUrl, selectedId);
        alert('Invoice deleted successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch (error) {
        alert(`Error deleting ID: ${selectedId}.`);
    }
}

/**
 * Fetches all invoices from the API and populates the "selectInvoice"
 * dropdown with one option per invoice. It also attaches a "change"
 * event listener so that, when an invoice is selected, its data is
 * loaded into the edit form fields (including the owner dropdown).
 *
 * @returns {void}
 */
function populateSelect() {
    const selectInvoice = document.getElementById('selectInvoice');

    get(invoicesUrl)
        .then(invoices => {
            if (!Array.isArray(invoices)) {
                console.error('Error: The response is not an array of invoices');
                return;
            }

            // Reset the dropdown before repopulating it.
            selectInvoice.innerHTML = '<option value="">Select</option>';

            invoices.forEach(invoice => {
                const option = document.createElement('option');
                option.value = invoice.id;
                option.textContent = `${invoice.id}: ${invoice.usuario_nombre} - ${invoice.monto}`;
                selectInvoice.appendChild(option);
            });

            // When an invoice is picked, load its data into the edit form.
            selectInvoice.addEventListener('change', function () {
                const selectedId = this.value;
                const selectedInvoice = invoices.find(invoice => invoice.id == selectedId);

                if (selectedInvoice) {
                    document.getElementById('ownerSelectEdit').value = selectedInvoice.usuario_id;
                    document.getElementById('amountEdit').value = selectedInvoice.monto;
                    // The date from the API includes a timestamp; keep only the YYYY-MM-DD part
                    // since that is the format the <input type="date"> element expects.
                    document.getElementById('dateEdit').value = selectedInvoice.fecha.split('T')[0];
                    document.getElementById('descriptionEdit').value = selectedInvoice.descripcion;
                } else {
                    clearForm();
                }
            });
        })
        .catch(error => {
            alert(error);
        });
}

/**
 * Fetches all invoices from the API and renders them as rows inside the
 * "invoiceList" table body, replacing whatever was previously displayed.
 *
 * @returns {void}
 */
function refreshList() {
    const invoiceList = document.getElementById('invoiceList');

    return get(invoicesUrl)
        .then(invoices => {

            if (!Array.isArray(invoices)) {
                console.error('Error: The response is not an array of invoices');
                return;
            }

            // Clear the table before rendering the updated list.
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
        .catch(error => {
            alert(error);
        });
}

/**
 * Clears all input fields in both the "add invoice" form and the
 * "edit invoice" form, including resetting the owner dropdowns.
 * Typically called after a successful create, update, or delete operation.
 *
 * @returns {void}
 */
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

/**
 * Entry point of the script. Waits for the DOM to be fully loaded, then:
 * 1. Wires up the Add/Edit/Delete buttons to their respective handler functions.
 * 2. Populates the owner dropdowns with the current list of users.
 * 3. Performs the initial population of the invoice dropdown and the invoice table.
 */
document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');

    addButton.addEventListener('click', addInvoice);
    editButton.addEventListener('click', editInvoice);
    deleteButton.addEventListener('click', removeInvoice);

    populateUserOptions('ownerSelect');
    populateUserOptions('ownerSelectEdit');
    populateSelect();
    refreshList();
});