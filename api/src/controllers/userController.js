const queries = require("../queries/userQueries");

const getUsers = async (req, res) => {
    try {
        const users = await queries.get();
        res.status(200).json(users);
    } catch (error) {
        throw error;
    }
};

const createUser = async (req, res) => {
    const { name, address } = req.body;

    try {
        const existingUsers = await queries.checkNameExists(name);

        if (existingUsers.length) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        await queries.add(name, address);
        res.status(201).json({
            message: "User created successfully"
        });
    } catch (error) {
        throw error;
    }
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const user = await queries.getById(id);
        res.status(200).json(user);
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const existingUser = await queries.getById(id);
        const notFound = !existingUser.length;

        if (notFound) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await queries.remove(id);
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        throw error;
    }
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, address } = req.body;

    try {
        const existingUser = await queries.getById(id);
        const notFound = !existingUser.length;

        if (notFound) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await queries.update(id, name, address);
        res.status(200).json({
            message: "User updated successfully"
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};