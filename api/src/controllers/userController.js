const pool = require("../../app_db");
const queries = require("../queries/userQueries");

const getUsers = (req, res) => {
    pool.query(queries.get, (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
};

const createUser = (req, res) => {
    const { name, address } = req.body;

    pool.query(
        queries.checkNameExists,
        [name],
        (error, results) => {
            if (error) throw error;

            if (results.rows.length) {
                return res.status(409).json({
                    message: "User already exists"
                });
            }

            pool.query(
                queries.add,
                [name, address],
                (error, results) => {
                    if (error) throw error;

                    res.status(201).json({
                        message: "User created successfully"
                    });
                }
            );
        }
    );
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        const notFound = !results.rows.length;

        if (notFound) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        pool.query(queries.remove, [id], (error, results) => {
            if (error) throw error;

            res.status(200).json({
                message: "User deleted successfully"
            });
        });
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);

    const {
        name,
        address
    } = req.body;

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        const notFound = !results.rows.length;

        if (notFound) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        pool.query(
            queries.update,
            [name, address, id],
            (error, results) => {
                if (error) throw error;

                res.status(200).json({
                    message: "User updated successfully"
                });
            }
        );
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};