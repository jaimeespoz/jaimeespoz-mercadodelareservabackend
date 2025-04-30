require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const webpack = require('webpack');
const morgan = require('morgan');
const compression = require('compression');
const RateLimiter = require('./config/RateLimiter.js');
const webpackDevMiddleware = require('webpack-dev-middleware');

const cors = require('cors');
const corsOptions = require('./config/CorsOptions');

process.env.ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString('hex');
process.env.REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString('hex');

// Initializacion
const app = express();
app.disable('x-powered-by');
const config = require('./webpack.config.js');
const compiler = webpack(config);

require('./database');

// settings
app.set('views', path.join(__dirname, 'src'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('port', process.env.PORT);

// Middleware
app.use(morgan('dev'))
    .use(
        webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
        })
    )
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use(cors(corsOptions))
    .use(RateLimiter)
    .use(compression({ filter: shouldCompress }));

const usersRoute = require('./routes/users.routes');
const jwtRoute = require('./routes/jwt.routes');

// Routes
app.use('/api/users', usersRoute);
app.use('/api/jwt', jwtRoute);

app.use((req, res, next) => {
    return res.status(400).json({ message: 'No existe esta operacion' });
});

// Static Files
app.use('/src', express.static(path.join(__dirname, 'src')));

// Server start
app.listen(app.get('port'), () => {
    console.log('Server running on port ', app.get('port'));
});

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}
