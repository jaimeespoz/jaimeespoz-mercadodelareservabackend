const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // console.log(req.headers);
    if (!authHeader?.startsWith('Bearer '))
        return res.status(484).json({ retorno: '84', error: 'No es Jwt' });

    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(484).json({ retorno: '84', error: 'Falta Token' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            switch (error.message) {
                case 'invalid token':
                    return res
                        .status(481)
                        .json({ retorno: '81', error: 'Token Invalido' });
                    break;
                case 'invalid signature':
                    return res
                        .status(482)
                        .json({ retorno: '82', error: 'Firma Invalida' });
                    break;
                case 'jwt expired':
                    return res
                        .status(483)
                        .json({ retorno: '83', error: 'Token expirado' });
                    break;
                default:
                    return res.status(489).json({
                        retorno: '89',
                        error: error.message,
                    });
            }
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.EXPIRED_TOKEN_SECRET,
    });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
};
