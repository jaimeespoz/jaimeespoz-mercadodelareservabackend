const bcrypt = require('bcryptjs');

const Users = require('../models/users');

const get = async (req, res) => {
    const username = req.params.username;
    try {
        const data = await Users.findOne({ username: username });
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(496).json({ retorno: '96' });
        }
    } catch (error) {
        res.status(599).json({ retorno: '99', mensaje: error.message });
    }
};

const getemail = async (req, res) => {
    const email = req.params.email;
    try {
        const data = await Users.findOne({ email: email });
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(496).json({ retorno: '96' });
        }
    } catch (error) {
        res.status(599).json({ retorno: '99', mensaje: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        await Users.find()
            .then((data) => res.status(200).json({ data }))
            .catch((error) =>
                res.status(599).json({ retorno: '99', mensaje: e.message })
            );
    } catch (error) {
        res.status(599).json({ retorno: '99', mensaje: error.message });
    }
};

const add = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const data = await Users.findOne({ username: username });
        if (data) {
            res.status(498).json({ retorno: '98' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const updates = {
                username: username,
                email: email,
                password: hash,
            };
            var registro = new Users(updates);
            await registro
                .save()
                .then((data) => res.status(200).json({ retorno: '00' }))
                .catch((error) =>
                    res
                        .status(599)
                        .json({ retorno: '99', mensaje: error.message })
                );
        }
    } catch (error) {
        res.status(500).json({ retorno: '99', mensaje: error.message });
    }
};

const update = async (req, res) => {
    const { username } = req.body;
    try {
        const entries = Object.keys(req.body);
        const updates = {};
        for (let i = 0; i < entries.length; i++) {
            updates[entries[i]] = Object.values(req.body)[i];
        }

        const data = await Users.findOne({ username: username });
        if (data) {
            await Users.updateOne({ username: username }, { $set: updates })
                .then((data) => {
                    if (data.modifiedCount === 1) {
                        res.status(200).json({ retorno: '00' });
                    }
                })
                .catch((error) =>
                    res.status(599).json({ retorno: '99', mensaje: e.message })
                );
        } else {
            res.status(496).json({ retorno: '96' });
        }
    } catch (error) {
        res.status(599).json({ retorno: '99', mensaje: error.message });
    }
};

const del = async (req, res) => {
    const { username } = req.body;
    try {
        const data = await Users.findOne({ username: username });
        if (data) {
            await Users.deleteOne({ username: username })
                .then((data) => {
                    if (data.deletedCount === 1) {
                        res.status(200).json({ retorno: '00' });
                    }
                })
                .catch((error) =>
                    res
                        .status(599)
                        .json({ retorno: '99', mensaje: error.message })
                );
        } else {
            res.status(496).json({ retorno: '96' });
        }
    } catch (error) {
        res.status(599).json({ retorno: '99', mensaje: error.message });
    }
};

module.exports = {
    get,
    getemail,
    getAll,
    add,
    update,
    del,
};
