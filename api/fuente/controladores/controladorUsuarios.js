const pool = require("../../database");
const queries = require('../Consultas/Consultas_Clientes');

const get = (req, res) => {
    pool.query(queries.get, (error, results) => { // Obtener todos los productos 
        if (error) throw error; 
        res.status(200).json(results.rows); // Enviar los resultados como JSON 200 código de estado HTTP
    });
}

const add = (req, res) => {
    const { nombre, direccion } = req.body;
    pool.query(queries.checkNombreExists, [nombre], (error, results) => {
        if (results.rows.length) {
            res.status(409).json({ mensaje: "El cliente ya existe" }); // 409 código de estado HTTP para conflicto
            return;
        }
        pool.query(queries.add, [nombre, direccion], (error, results) => {
            if (error) throw error;
            res.status(201).json("¡Creado exitosamente!");
        });
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
    const { nombre, direccion } = req.body;
    pool.query(queries.getById, [id], (error, results) => {
        const notFound = !results.rows.length;
        if (notFound) {
            res.status(404).send("No existe en la base de datos");
            return;
        }
        pool.query(queries.update, [nombre, direccion, id], (error, results) => {
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