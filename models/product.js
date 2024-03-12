const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Product', productSchema)

// const { ObjectId } = require('mongodb')
// const { getDB } = require('../util/database')

// module.exports = class Product {
//   constructor(title, imageUrl, price, description, prodId, userId) {
//     this.title = title
//     this.imageUrl = imageUrl
//     this.price = price
//     this.description = description
//     this._id = prodId
//     this.userId = userId
//   }

//   save() {
//     const db = getDB()
//     let dbOperation
//     if (this._id) {
//       dbOperation = db.collection('products').updateOne(
//         { _id: new ObjectId(this._id) },
//         {
//           $set: {
//             title: this.title,
//             imageUrl: this.imageUrl,
//             price: this.price,
//             description: this.description,
//           },
//         }
//       )
//     } else {
//       dbOperation = db.collection('products').insertOne(this)
//     }
//     return dbOperation
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err))
//   }

//   static fetchAll() {
//     const db = getDB()
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => products)
//       .catch((err) => console.log(err))
//   }

//   static findById(prodId) {
//     const objId = new ObjectId(prodId)
//     const db = getDB()
//     return db
//       .collection('products')
//       .find({ _id: objId })
//       .next()
//       .then((product) => {
//         return product
//       })
//       .catch((err) => console.log(err))
//   }

//   static delete(prodId) {
//     const objId = new ObjectId(prodId)
//     const db = getDB()
//     return db
//       .collection('products')
//       .deleteOne({ _id: objId })
//       .then((result) => result)
//       .catch((err) => console.log(err))
//   }
// }
