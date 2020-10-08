const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes')
const { checkUser } = require('./middleware/auth');

//load config
dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

app.use(morgan('dev'));

//body parser
app.use(express.urlencoded({extended: false}));

app.use(express.json());

//cookie parser
app.use(cookieParser());

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//handlebars helper 
const { formatDate, stripTags, truncate, editIcon, select, trans } = require('./helpers/hbs');

//handlebars
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    helpers: {formatDate, stripTags, truncate, editIcon, select, trans  },
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs', defaultLayout: 'main' }));


app.use(express.static(path.join(__dirname, 'public')))

//set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next();
});

//Routes
app.get('*', checkUser);
app.use(homeRoutes);
app.use(authRoutes);
app.use(postRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, 
        console.log(`Server running on ${PORT}`));