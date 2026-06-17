/**
 * crud_usuario.js
 *
 * This file implements the CRUD (Create, Read, Update, Delete) logic
 * for managing "Usuario" (User) records through a REST API.
 * It handles all communication with the backend, as well as the DOM
 * manipulation needed to keep the form, dropdown, and table in sync.
 */

// Base URL for the Users API endpoint.
const usuarios_url = 'http://localhost:3000/api/usuarios';

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
function eliminate(url, id) {
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
async function agregarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;

    // Basic client-side validation: both fields are required.
    if (!nombre || !direccion) {
        alert('Please fill in all fields.');
        return;
    }

    const usuario = { nombre, direccion };

    try {
        await create(usuarios_url, usuario);
        alert('User added successfully');
        limpiarFormulario();
        await actualizarLista();
        llenarSelect();
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
async function editarUsuario() {
    const selectedId = document.getElementById('selectUsuario').value;
    const nombre = document.getElementById('nombreEditar').value;
    const direccion = document.getElementById('direccionEditar').value;

    // Basic client-side validation: a user must be selected and both fields filled in.
    if (!selectedId || !nombre || !direccion) {
        alert('Please fill in all fields.');
        return;
    }

    const objetoEditado = {
        nombre,
        direccion
    };

    try {
        await update(`${usuarios_url}/${selectedId}`, objetoEditado);
        alert('User edited successfully');
        limpiarFormulario();
        await actualizarLista();
        llenarSelect();
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
async function eliminarUsuario() {
    const selectedId = document.getElementById('selectUsuario').value;

    // A user must be selected before deletion can proceed.
    if (!selectedId) {
        alert('Please select a user to delete.');
        return;
    }

    try {
        await eliminate(usuarios_url, selectedId);
        alert('User deleted successfully');
        limpiarFormulario();
        await actualizarLista();
        llenarSelect();
    } catch (error) {
        alert(`Error deleting ID: ${selectedId}.`);
    }
}

/**
 * Fetches all users from the API and populates the "selectUsuario" dropdown
 * with one option per user. It also attaches a "change" event listener so that,
 * when a user is selected, their data is loaded into the edit form fields.
 *
 * @returns {void}
 */
function llenarSelect() {
    const selectUsuario = document.getElementById('selectUsuario');

    get(usuarios_url)
        .then(usuarios => {
            if (!Array.isArray(usuarios)) {
                console.error('Error: The response is not an array of users');
                return;
            }

            // Reset the dropdown before repopulating it.
            selectUsuario.innerHTML = '<option value="">Select</option>';

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = `${usuario.id}: ${usuario.nombre} ${usuario.direccion}`;
                selectUsuario.appendChild(option);
            });

            // When the user picks an option, load that user's data into the edit form.
            selectUsuario.addEventListener('change', function () {
                const selectedId = this.value;
                const usuarioSeleccionado = usuarios.find(usuario => usuario.id == selectedId);

                if (usuarioSeleccionado) {
                    document.getElementById('nombreEditar').value = usuarioSeleccionado.nombre;
                    document.getElementById('direccionEditar').value = usuarioSeleccionado.direccion;
                } else {
                    limpiarFormulario();
                }
            });
        })
        .catch(error => {
            alert(error);
        });
}

/**
 * Fetches all users from the API and renders them as rows inside the
 * "UsuariosList" table body, replacing whatever was previously displayed.
 *
 * @returns {void}
 */
function actualizarLista() {
    const UsuarioList = document.getElementById('UsuariosList');

    get(usuarios_url)
        .then(usuarios => {

            if (!Array.isArray(usuarios)) {
                console.error('Error: The response is not an array of users');
                return;
            }

            // Clear the table before rendering the updated list.
            UsuarioList.innerHTML = '';

            usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.direccion}</td>
                `;
                UsuarioList.appendChild(row);
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
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('nombreEditar').value = '';
    document.getElementById('direccionEditar').value = '';
}

/**
 * Entry point of the script. Waits for the DOM to be fully loaded, then:
 * 1. Wires up the Add/Edit/Delete buttons to their respective handler functions.
 * 2. Performs the initial population of the user dropdown and the user table.
 */
document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.getElementById('btnAgregar');
    const btnEditar = document.getElementById('btnEditar');
    const btnEliminar = document.getElementById('btnEliminar');

    btnAgregar.addEventListener('click', agregarUsuario);
    btnEditar.addEventListener('click', editarUsuario);
    btnEliminar.addEventListener('click', eliminarUsuario);

    llenarSelect();
    actualizarLista();
});