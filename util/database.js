// mysql2
// const mysql = require('mysql2')
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-course',
//   password: 'QazWsx123=',
// })
// module.exports = pool.promise()

// sequelize
const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-course', 'root', 'QazWsx123=', {
  dialect: 'mysql',
  host: 'localhost',
})

module.exports = sequelize
