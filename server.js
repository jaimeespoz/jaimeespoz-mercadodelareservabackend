require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const webpack = require('webpack');
const morgan = require('morgan');
const webpackDevMiddleware = require('webpack-dev-middleware');

const cors = require('cors');

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
    .use(cors());

const usersRoute = require('./routes/users.routes');
const jwtRoute = require('./routes/jwt.routes');

// Routes
app.use('/api/users', usersRoute);
app.use('/api/jwt', jwtRoute);

// Static Files
app.use('/src', express.static(path.join(__dirname, 'src')))
    .use('/icons', express.static(path.join(__dirname, 'src/assets/icons')))
    .use('/images', express.static(path.join(__dirname, 'src/assets/images')));

// Server start
app.listen(app.get('port'), () => {
    console.log('Server running on port ', app.get('port'));
});
