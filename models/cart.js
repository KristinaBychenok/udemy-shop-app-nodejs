// sequelize
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
})

module.exports = Cart

// file system
// const fs = require('fs')
// const path = require('path')

// const dirPath = require('../util/path')

// const filePath = path.join(dirPath, 'data', 'cart.json')

// module.exports = class Cart {
//   static addProduct(id, price) {
//     fs.readFile(filePath, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 }
//       if (!err && fileContent.length !== 0) {
//         cart = JSON.parse(fileContent)
//       }

//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod.id === id
//       )
//       const existingProduct = cart.products[existingProductIndex]

//       let updatedProduct
//       if (!!existingProduct) {
//         updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 }
//         cart.products = [...cart.products]
//         cart.products[existingProductIndex] = updatedProduct
//       } else {
//         updatedProduct = { id: id, qty: 1 }
//         cart.products = [...cart.products, updatedProduct]
//       }
//       cart.totalPrice = cart.totalPrice + +price

//       fs.writeFile(filePath, JSON.stringify(cart), (err) => {
//         if (err) console.log('addProduct to cart err:', err)
//       })
//     })
//   }

//   static deleteProduct(id, price) {
//     fs.readFile(filePath, (err, fileContent) => {
//       if (fileContent.length === 0) return

//       const cart = JSON.parse(fileContent)

//       const existingProduct = cart.products.find((prod) => prod.id === id)

//       const updatedProducts = cart.products.filter((prod) => prod.id !== id)
//       cart.products = [...updatedProducts]
//       cart.totalPrice = cart.totalPrice - price * existingProduct.qty

//       fs.writeFile(filePath, JSON.stringify(cart), (err) => {
//         if (err) console.log('addProduct to cart err:', err)
//       })
//     })
//   }

//   static getProductsCart(cb) {
//     fs.readFile(filePath, (err, fileContent) => {
//       if (err || fileContent.length === 0) return cb([])

//       const cart = JSON.parse(fileContent)
//       cb(cart)
//     })
//   }
// }
