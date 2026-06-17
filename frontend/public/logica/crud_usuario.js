/**
 * user.js
 *
 * This file implements the CRUD (Create, Read, Update, Delete) logic
 * for managing User records through a REST API.
 * It handles all communication with the backend, as well as the DOM
 * manipulation needed to keep the form, dropdown, and table in sync.
 */

// Base URL for the Users API endpoint.
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
 * Reads the "name" and "address" values from the add-user form,
 * validates them, and sends them to the API to create a new user.
 * On success, it clears the form and refreshes both the table and the dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function addUser() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    // Basic client-side validation: both fields are required.
    if (!name || !address) {
        alert('Please fill in all fields.');
        return;
    }

    const user = { nombre: name, direccion: address };

    try {
        await create(usersUrl, user);
        alert('User added successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch (error) {
        alert('Error adding user.');
    }
}

/**
 * Reads the selected user's ID along with the new "name" and "address"
 * values from the edit form, validates them, and sends an update request
 * to the API. On success, it clears the form and refreshes both the
 * table and the dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function editUser() {
    const selectedId = document.getElementById('selectUser').value;
    const name = document.getElementById('nameEdit').value;
    const address = document.getElementById('addressEdit').value;

    // Basic client-side validation: a user must be selected and both fields filled in.
    if (!selectedId || !name || !address) {
        alert('Please fill in all fields.');
        return;
    }

    const editedUser = {
        nombre: name,
        direccion: address
    };

    try {
        await update(`${usersUrl}/${selectedId}`, editedUser);
        alert('User edited successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch (error) {
        alert('Error editing user.');
    }
}

/**
 * Reads the currently selected user's ID and sends a delete request to the API.
 * On success, it clears the form and refreshes both the table and the dropdown.
 *
 * @async
 * @returns {Promise<void>}
 */
async function removeUser() {
    const selectedId = document.getElementById('selectUser').value;

    // A user must be selected before deletion can proceed.
    if (!selectedId) {
        alert('Please select a user to delete.');
        return;
    }

    try {
        await deleteRecord(usersUrl, selectedId);
        alert('User deleted successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch (error) {
        alert(`Error deleting ID: ${selectedId}.`);
    }
}

/**
 * Fetches all users from the API and populates the "selectUser" dropdown
 * with one option per user. It also attaches a "change" event listener so that,
 * when a user is selected, their data is loaded into the edit form fields.
 *
 * @returns {void}
 */
function populateSelect() {
    const selectUser = document.getElementById('selectUser');

    get(usersUrl)
        .then(users => {
            if (!Array.isArray(users)) {
                console.error('Error: The response is not an array of users');
                return;
            }

            // Reset the dropdown before repopulating it.
            selectUser.innerHTML = '<option value="">Select</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.id}: ${user.nombre} ${user.direccion}`;
                selectUser.appendChild(option);
            });

            // When the user picks an option, load that user's data into the edit form.
            selectUser.addEventListener('change', function () {
                const selectedId = this.value;
                const selectedUser = users.find(user => user.id == selectedId);

                if (selectedUser) {
                    document.getElementById('nameEdit').value = selectedUser.nombre;
                    document.getElementById('addressEdit').value = selectedUser.direccion;
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
 * Fetches all users from the API and renders them as rows inside the
 * "userList" table body, replacing whatever was previously displayed.
 *
 * @returns {void}
 */
function refreshList() {
    const userList = document.getElementById('userList');

    get(usersUrl)
        .then(users => {

            if (!Array.isArray(users)) {
                console.error('Error: The response is not an array of users');
                return;
            }

            // Clear the table before rendering the updated list.
            userList.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.direccion}</td>
                `;
                userList.appendChild(row);
            });
        })
        .catch(error => {
            alert(error);
        });
}

/**
 * Clears all input fields in both the "add user" form and the "edit user" form.
 * Typically called after a successful create, update, or delete operation.
 *
 * @returns {void}
 */
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('nameEdit').value = '';
    document.getElementById('addressEdit').value = '';
}

/**
 * Entry point of the script. Waits for the DOM to be fully loaded, then:
 * 1. Wires up the Add/Edit/Delete buttons to their respective handler functions.
 * 2. Performs the initial population of the user dropdown and the user table.
 */
document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');

    addButton.addEventListener('click', addUser);
    editButton.addEventListener('click', editUser);
    deleteButton.addEventListener('click', removeUser);

    populateSelect();
    refreshList();
});