const get = "SELECT id, nombre, direccion FROM cliente";
const getById = "SELECT id, nombre, direccion FROM cliente WHERE id = $1";
const checkNombreExists = "SELECT id, nombre, direccion FROM cliente WHERE nombre = $1";
const add = "INSERT INTO cliente (nombre, direccion) VALUES ($1, $2)";
const remove = "DELETE FROM cliente WHERE id = $1";
const update = "UPDATE cliente SET nombre=$1, direccion=$2 WHERE id = $3";

module.exports = {
    get,
    getById,
    checkNombreExists,
    add,
    remove,
    update,
}