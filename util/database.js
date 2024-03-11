const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (cb) => {
  MongoClient.connect(
    'mongodb+srv://user-1:00U1VgEywoeHOzgL@cluster0.a0ycx1c.mongodb.net/shop'
  )
    .then((client) => {
      console.log('Connected!')
      _db = client.db()
      cb()
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
}

const getDB = () => {
  if (_db) {
    return _db
  }
  throw 'No db!'
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB
