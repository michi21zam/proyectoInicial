const pool = require("../../db");
const queries = require('../consultas/consultasFacturas');

const get = (req, res) => {
    pool.query(queries.get, (error, results) => { // Obtener todas las facturas
        if (error) throw error;
        res.status(200).json(results.rows); // Enviar los resultados como JSON, 200 código de estado HTTP
    });
}

const add = (req, res) => {
    const { usuario_id, monto, fecha, descripcion } = req.body;
    pool.query(queries.add, [usuario_id, monto, fecha, descripcion], (error, results) => {
        if (error) throw error;
        res.status(201).json("¡Creado exitosamente!");
    });
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getById, [id], (error, results) => {
        const notFound = !results.rows.length;
        if (notFound) {
            res.status(404).send("No existe en la base de datos");
            return;
        }
        pool.query(queries.remove, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Eliminado exitosamente");
        });
    });
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const { usuario_id, monto, fecha, descripcion } = req.body;
    pool.query(queries.getById, [id], (error, results) => {
        const notFound = !results.rows.length;
        if (notFound) {
            res.status(404).send("No existe en la base de datos");
            return;
        }
        pool.query(queries.update, [usuario_id, monto, fecha, descripcion, id], (error, results) => {
            if (error) throw error;
            res.status(200).json({
                mensaje: "Actualizado exitosamente"
            });
        });
    });
};

module.exports = {
    get,
    getById,
    add,
    remove,
    update,
}