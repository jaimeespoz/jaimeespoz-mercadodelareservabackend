const cors = require('cors');

const CorsConfig = cors({
	origin: process.env.CORS_ORIGIN,
	methods: [process.env.CORS_METHOD],
	credentials: process.env.CORS_CREDENTIALS,
});

module.exports = CorsConfig;
