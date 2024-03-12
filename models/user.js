const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
})

userSchema.methods.addToCart = function(product) {
  const existingCartProdIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  )

  let updatedCartItems = [...this.cart.items]

  if (existingCartProdIndex < 0) {
    updatedCartItems.push({
      productId: new ObjectId(product._id),
      quantity: 1,
    })
  } else {
    updatedCartItems[existingCartProdIndex] = {
      productId: new ObjectId(product._id),
      quantity: updatedCartItems[existingCartProdIndex].quantity + 1,
    }
  }

  this.cart.items = updatedCartItems

  return this.save()
}

userSchema.methods.deleteItemFromCart = function(productId) {
  const filteredCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  )
  this.cart.items = filteredCartItems

  return this.save()
}

userSchema.methods.clearCart = function() {
  this.cart.items = []

  return this.save()
}

module.exports = mongoose.model('User', userSchema)

// const { getDB } = require('../util/database')

// class User {
//   constructor(username, email, userId, cart) {
//     this.name = username
//     this.email = email
//     this._id = userId
//     this.cart = cart //{items: []}
//   }

//   save() {
//     const db = getDB()
//     return db.collection('users').insertOne(this)
//   }

//   addToCart(product) {
//     const db = getDB()
//     const objId = new ObjectId(this._id)

//     const existingCartProdIndex = this.cart.items.findIndex(
//       (item) => item.productId.toString() === product._id.toString()
//     )

//     let updatedCartItems = [...this.cart.items]

//     if (existingCartProdIndex < 0) {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: 1,
//       })
//     } else {
//       updatedCartItems[existingCartProdIndex] = {
//         productId: new ObjectId(product._id),
//         quantity: updatedCartItems[existingCartProdIndex].quantity + 1,
//       }
//     }

//     return db.collection('users').updateOne(
//       { _id: objId },
//       {
//         $set: {
//           cart: {
//             items: updatedCartItems,
//           },
//         },
//       }
//     )
//   }

//   getCart() {
//     const db = getDB()
//     const productIds = this.cart.items.map((item) => item.productId)
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => ({
//           ...prod,
//           quantity: this.cart.items.find(
//             (item) => item.productId.toString() === prod._id.toString()
//           ).quantity,
//         }))
//       })
//       .catch((err) => console.log(err))
//   }

//   deleteItemFromCart(productId) {
//     const filteredCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     )

//     const db = getDB()
//     const objId = new ObjectId(this._id)
//     return db.collection('users').updateOne(
//       { _id: objId },
//       {
//         $set: {
//           cart: {
//             items: filteredCartItems,
//           },
//         },
//       }
//     )
//   }

//   addOrder() {
//     const db = getDB()
//     const objId = new ObjectId(this._id)

//     return this.getCart()
//       .then((cartProducts) => {
//         const order = {
//           items: cartProducts,
//           userId: this._id,
//         }

//         return db.collection('orders').insertOne(order)
//       })
//       .then((result) => {
//         this.cart = { items: [] }
//         return db.collection('users').updateOne(
//           { _id: objId },
//           {
//             $set: {
//               cart: {
//                 items: [],
//               },
//             },
//           }
//         )
//       })
//       .catch((err) => console.log(err))
//   }

//   getOrders() {
//     const db = getDB()
//     const objId = new ObjectId(this._id)

//     return db
//       .collection('orders')
//       .find({ userId: objId })
//       .toArray()
//       .then((orders) => orders)
//       .catch((err) => console.log(err))
//   }

//   static findById(id) {
//     const db = getDB()
//     const objId = new ObjectId(id)
//     return db
//       .collection('users')
//       .find({ _id: objId })
//       .next()
//   }
// }

// module.exports = User
