// const fs = require('fs')
// const path = require('path')

// const dirPath = require('../util/path')
// const Cart = require('./cart')
const db = require('../util/database')

// const filePath = path.join(dirPath, 'data', 'products.json')

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)',
      [this.title, this.imageUrl, this.price, this.description]
    )
  }

  static fetchAllProducts() {
    return db.execute('SELECT * FROM products')
  }

  static fetchProductById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }

  static delete(id) {}

  // save() {
  //   fs.readFile(filePath, (err, fileContent) => {
  //     let products = []

  //     if (!err && fileContent.length !== 0) {
  //       products = JSON.parse(fileContent)
  //     }

  //     if (this.id) {
  //       const existingProductIndex = products.findIndex(
  //         (prod) => prod.id === this.id
  //       )
  //       const updatedProducts = [...products]
  //       updatedProducts[existingProductIndex] = this

  //       fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
  //         if (err) console.log('update Product err:', err)
  //       })
  //     } else {
  //       this.id = Math.random().toString()

  //       products.push(this)

  //       fs.writeFile(filePath, JSON.stringify(products), (err) => {
  //         if (err) console.log('save Product err:', err)
  //       })
  //     }
  //   })
  // }

  // static fetchAllProducts(cb) {
  //   fs.readFile(filePath, (err, fileContent) => {
  //     if (err) {
  //       cb([])
  //     } else {
  //       cb(JSON.parse(fileContent))
  //     }
  //   })
  // }

  // static fetchProductById(id, cb) {
  //   fs.readFile(filePath, (err, fileContent) => {
  //     if (!err) {
  //       const products = JSON.parse(fileContent)
  //       const product = products.find((prod) => prod.id === id)
  //       cb(product)
  //     } else {
  //       console.log('fetchProductById err:', err)
  //     }
  //   })
  // }

  // static delete(id, cb) {
  //   fs.readFile(filePath, (err, fileContent) => {
  //     if (!err) {
  //       const products = JSON.parse(fileContent)
  //       const updatedProducts = products.filter((prod) => prod.id !== id)

  //       fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
  //         if (err) console.log('save Product err:', err)
  //         const product = products.find((prod) => prod.id === id)
  //         Cart.deleteProduct(id, product.price)

  //         cb()
  //       })
  //     } else {
  //       console.log('fetchProductById err:', err)
  //     }
  //   })
  // }
}
