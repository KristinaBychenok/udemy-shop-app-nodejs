const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./util/path')
const { get404Page } = require('./controllers/error')

const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

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
  User.findByPk(1)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(get404Page)

// define a relations
Product.belongsTo(User, { constraints: true, delete: 'CASCADE' })
User.hasMany(Product)
Cart.belongsTo(User)
User.hasOne(Cart)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize
  // .sync({ force: true }) // to add new tables with new relations
  .sync()
  .then((res) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' })
    }
    return Promise.resolve(user)
  })
  .then((user) => {
    user.createCart()
  })
  .then((cart) => {
    app.listen(3000)
  })
  .catch((err) => console.log(err))

// const server = http.createServer((req, res) => {
//   const url = req.url
//   const method = req.method

//   if (url === '/') {
//     res.setHeader('Content-Type', 'text/html')
//     res.write(
//       '<html><head><title>App</title></head><body><h1>Hello NodeJS!!!</h1><form action="/create-user" method="POST"><input type="text" name="username" placeholder="user name"><button type="submit">Submit</button></form></body></html>'
//     )
//     return res.end()
//   }

//   if (url === '/users') {
//     res.setHeader('Content-Type', 'text/html')
//     res.write(
//       '<html><head><title>App</title></head><body><h1>Users</h1><ul><li>User-1</li><li>User-2</li></ul></body></html>'
//     )
//     return res.end()
//   }

//   if (url === '/create-user' && method === 'POST') {
//     const users = []
//     req.on('data', (chunk) => {
//       users.push(chunk)
//     })
//     req.on('end', () => {
//       const savedUsers = []
//       fs.readFile('users.txt', 'utf8', (err, data) => {
//         savedUsers.push(data)
//       })
//       const parsedData = Buffer.concat(users).toString()
//       savedUsers.push(parsedData.split('=')[1])

//       fs.writeFile('users.txt', `${savedUsers}`, (err) => {
//         console.log('DONE!')
//       })
//     })
//     res.statusCode = 200
//     res.setHeader('Location', '/')
//     // res.write(
//     //   '<html><head><title>App</title></head><body><h1>Users</h1><ul><li>User-1</li><li>User-2</li></ul></body></html>'
//     // )
//     return res.end()
//   }

//   res.end()
// })
