// Query to get all invoices, joined with the user's name for display purposes.
const get = `
    SELECT f.id, f.usuario_id, u.nombre AS usuario_nombre, f.monto, f.fecha, f.descripcion
    FROM facturas f
    JOIN usuarios u ON f.usuario_id = u.id
    ORDER BY f.id
`;

const getById = `
    SELECT f.id, f.usuario_id, u.nombre AS usuario_nombre, f.monto, f.fecha, f.descripcion
    FROM facturas f
    JOIN usuarios u ON f.usuario_id = u.id
    WHERE f.id = $1
`;

const add = "INSERT INTO facturas (usuario_id, monto, fecha, descripcion) VALUES ($1, $2, $3, $4)";
const remove = "DELETE FROM facturas WHERE id = $1";
const update = "UPDATE facturas SET usuario_id=$1, monto=$2, fecha=$3, descripcion=$4 WHERE id = $5";

module.exports = {
    get,
    getById,
    add,
    remove,
    update,
}