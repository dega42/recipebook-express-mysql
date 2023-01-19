const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');
const multer  = require('multer')

const upload = multer({ dest: 'uploads/' })

// head meta data load
const metas = require('./metas.json');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'))

// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/main-layout');

// public dir setup
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// year for copyright
app.locals.copyrightYear = () => {
    return new Date().getFullYear();
};


// Routes
const recipeRouter = require('./routes/recipe.route');
app.get('/', (req, res) => {
    const meta = metas.find(e => e.name == 'home');
    res.render('pages/main/home', { meta });
});
app.use('/recipe', recipeRouter);

// --- Error handler
app.use((req, res, next) => {
    res.status(404).render('error', {
        success: 'false',
        message: 'Page not found',
        error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this server',
        },
        meta: {
            title: 'Error'
        },
    });
})

app.use((err, req, res, next) => {
    console.error('Error stack: ', err.stack)
    res.status(500).render('error', {
        success: 'false',
        message: 'Internal Server Error',
        error: {
            statusCode: 500,
            message: 'The server encountered an internal error or misconfiguration and was unable to complete your request.',
        },
        meta: {
            title: 'Error'
        },
    });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});