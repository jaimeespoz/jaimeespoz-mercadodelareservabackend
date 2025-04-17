const {
    generateAccessToken,
    generateRefreshToken,
} = require('../src/authServer');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');

let refreshTokens = [];

const login = async (req, res) => {
    console.log('login');
    console.log(req.body);
    const { username, password } = req.body;
    console.log('username', username);
    console.log('password', password);
    const user = { name: username };
    try {
        const data = await Users.findOne({ username: username });
        if (data) {
            bcrypt.compare(password, data.password, (err, data) => {
                if (err) throw err;
                if (data) {
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);
                    refreshTokens.push(refreshToken);
                    const data = {
                        retorno: '00',
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };
                    console.log(data);
                    res.status(200).json({ data });
                    // res.status(200).json({
                    //     data: {
                    //         retorno: '00',
                    //         accessToken: accessToken,
                    //         refreshToken: refreshToken,
                    //     },
                    // });
                } else {
                    res.status(491).json({
                        retorno: '91',
                        error: 'Problemas con la Clave',
                    });
                }
            });
        } else {
            res.status(490).json({
                retorno: '90',
                error: 'Problemas de Usuario',
            });
        }
    } catch (error) {
        res.status(599).json({ retorno: '99.', mensaje: error.message });
    }
};

const logout = async (req, res) => {
    console.log('logout');
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.status(204);
};

const token = async (req, res) => {
    console.log('token');
    const username = req.body.username;
    const user = { name: username };
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken))
        res.status(499).json({ retorno: '99', mensaje: res });
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, user) => {
            if (error)
                res.status(499).json({
                    retorno: '99',
                    mensaje: error.message,
                });
            const accessToken = generateAccessToken({ user });
            res.json({ retorno: '00', accessToken: accessToken });
        }
    );
};

module.exports = {
    login,
    logout,
    token,
};
