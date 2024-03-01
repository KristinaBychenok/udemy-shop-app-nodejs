const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./util/path')
const { get404Page } = require('./controllers/error')

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

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(get404Page)

app.listen(3000)

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
