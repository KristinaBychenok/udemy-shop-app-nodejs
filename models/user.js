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
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
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
