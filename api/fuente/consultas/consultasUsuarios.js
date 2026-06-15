const get = "SELECT id, nombre, direccion FROM usuarios";
const getById = "SELECT id, nombre, direccion FROM usuarios WHERE id = $1";
const checkNombreExists = "SELECT id, nombre, direccion FROM usuarios WHERE nombre = $1";
const add = "INSERT INTO usuarios (nombre, direccion) VALUES ($1, $2)";
const remove = "DELETE FROM usuarios WHERE id = $1";
const update = "UPDATE usuarios SET nombre=$1, direccion=$2 WHERE id = $3";

module.exports = {
    get,
    getById,
    checkNombreExists,
    add,
    remove,
    update,
}