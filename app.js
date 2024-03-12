const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./util/path')
const { get404Page } = require('./controllers/error')
const User = require('./models/user')
const mongoose = require('mongoose')

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
  User.findById('65f08d8a8081e9adda677d90')
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(get404Page)

mongoose
  .connect(
    'mongodb+srv://user-1:GjuzCUARIDMwutPO@cluster0.a0ycx1c.mongodb.net/shop-mongoose'
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Kris',
          email: 'test@test.test',
          cart: { items: [] },
        })
        user.save()
      }
    })
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })
