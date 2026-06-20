// ====================
// USER CRUD MANAGEMENT
// ====================
// Relies on the shared get/create/update/deleteRecord functions defined
// in apiHelpers.js, which must be loaded before this file.

const usersUrl = 'http://localhost:3000/api/users';

// ====================
// CRUD ACTIONS
// ====================

async function addUser() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    // Validate required fields
    if (!name || !address) {
        alert('Please fill in all fields.');
        return;
    }

    const user = {
        name,
        address
    };

    try {
        await create(usersUrl, user);
        alert('User added successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error adding user.');
    }
}

async function editUser() {
    const selectedId = document.getElementById('selectUser').value;
    const name = document.getElementById('nameEdit').value;
    const address = document.getElementById('addressEdit').value;

    if (!selectedId || !name || !address) {
        alert('Please fill in all fields.');
        return;
    }

    const editedUser = {
        name,
        address
    };

    try {
        await update(`${usersUrl}/${selectedId}`, editedUser);
        alert('User edited successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error editing user.');
    }
}

async function removeUser() {
    const selectedId = document.getElementById('selectUser').value;

    if (!selectedId) {
        alert('Please select a user.');
        return;
    }

    try {
        await deleteRecord(usersUrl, selectedId);
        alert('User deleted successfully.');
        clearForm();
        await refreshList();
        populateSelect();
    } catch {
        alert('Error deleting user.');
    }
}

// ====================
// UI HELPERS
// ====================

function populateSelect() {
    const selectUser = document.getElementById('selectUser');

    get(usersUrl)
        .then(users => {
            selectUser.innerHTML = '<option value="">Select</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.id}: ${user.name} ${user.address}`;
                selectUser.appendChild(option);
            });

            // Load selected user data into edit form
            selectUser.addEventListener('change', function () {
                const selectedUser = users.find(user => user.id == this.value);

                if (selectedUser) {
                    document.getElementById('nameEdit').value = selectedUser.name;
                    document.getElementById('addressEdit').value = selectedUser.address;
                } else {
                    clearForm();
                }
            });
        })
        .catch(error => alert(error));
}

function refreshList() {
    const userList = document.getElementById('userList');

    return get(usersUrl)
        .then(users => {
            userList.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.address}</td>
                `;
                userList.appendChild(row);
            });
        })
        .catch(error => alert(error));
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('nameEdit').value = '';
    document.getElementById('addressEdit').value = '';
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addButton').addEventListener('click', addUser);
    document.getElementById('editButton').addEventListener('click', editUser);
    document.getElementById('deleteButton').addEventListener('click', removeUser);

    populateSelect();
    refreshList();
});