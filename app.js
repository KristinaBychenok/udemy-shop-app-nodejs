const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRouter = require('./routes/auth')
const rootDir = require('./util/path')
const { get404Page, get500Page } = require('./controllers/error')
const User = require('./models/user')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const MONGODB_URI =
  'mongodb+srv://user-1:QimZKDfQNguxkuNf@cluster0.a0ycx1c.mongodb.net/shop-mongoose'

const app = express()
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})
const csrfProtection = csrf()

app.set('view engine', 'ejs')
// app.engine(
//   'hbs',
//   expressHbs({
//     extname: 'hbs', // by default .handlebars
//     // layoutsDir: 'views/layouts', by default
//     defaultLayout: 'main-layout', // by default main.handlebars
//   })
// )
// app.set('view engine', 'hbs')
// app.set('view engine', 'pug')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {...} can add cookie seting here
  })
)
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuth = req.session.isAuth
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch((err) => {
      next(new Error(err))
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRouter)

app.get('/500', get500Page)
app.use(get404Page)
app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...)
  // res.redirect('/500')
  res.status(500).render('500', {
    pageTitle: 'Error :(',
    path: '/500',
    isAuth: req.session.isAuth,
  })
})

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })
