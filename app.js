const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./util/path')
const { get404Page } = require('./controllers/error')
const { mongoConnect } = require('./util/database')
const User = require('./models/user')

const app = express()

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

app.use((req, res, next) => {
  User.findById('65ef0f65a3fd5dd18b1aaa6d')
    .then((user) => {
      req.user = new User(user.name, user.email, user._id, user.cart)
      next()
    })
    .catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(get404Page)

mongoConnect(() => {
  app.listen(3000)
})
