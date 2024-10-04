const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const https = require('https')
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
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.a0ycx1c.mongodb.net/${process.env.MONGO_DEFAULT_BADABASE}`

const app = express()
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})
const csrfProtection = csrf()

const privateKey = fs.readFileSync('server.key')
const certificate = fs.readFileSync('server.cert')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMilliseconds() + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({
    // dest: 'images',
    storage: fileStorage,
    fileFilter,
  }).single('image')
)
app.use(express.static(path.join(rootDir, 'public')))
app.use('/images', express.static(path.join(rootDir, 'images')))
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
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Error :(',
    path: '/500',
    isAuth: req.session?.isAuth,
  })
})

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.MONGO_PORT || 3000)
    app.listen(process.env.MONGO_PORT || 3000)
  })
  .catch((err) => {
    console.log(err)
  })
