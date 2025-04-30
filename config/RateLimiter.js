const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    WindowMs: process.env.RATE_LIMIT_PLAZO,
    max: process.env.RATE_LIMIT_NUMERO,
    statusCode: 888,
    message: 'Llegaste el limite de consultas. Espera 10 minutos',
});

module.exports = rateLimiter;
