// const Cart = require('../models/cart')
const fs = require('fs')
const path = require('path')
const Order = require('../models/order')
const Product = require('../models/product')
const PDFDocument = require('pdfkit')
const stripe = require('stripe')(
  'sk_test_51PDNYSHf8m2CtcjNrTKSPln5V5yrERgSxCW3PGlSWCtFOUOxVKW4csUG89dENoVAZqoJADuGEm0Mlb9QodUZUpdA00nqeboyvL'
)

const ITEMS_PER_PAGE = 2

exports.getShopPage = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItems

  Product.find()
    .countDocuments()
    .then((numOfProds) => {
      totalItems = numOfProds
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviosPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProductsPage = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItems

  Product.find()
    .countDocuments()
    .then((numOfProds) => {
      totalItems = numOfProds
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviosPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: 'Product Details',
        path: `/products`,
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: products,
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product)
    })
    .then((result) => {
      res.redirect('/cart')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.id

  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders,
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        quantity: item.quantity,
        productData: { ...item.productId._doc },
      }))

      const order = new Order({
        products,
        userId: req.user._id,
      })

      return order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then((result) => {
      res.redirect('/orders')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        quantity: item.quantity,
        productData: { ...item.productId._doc },
      }))

      const order = new Order({
        products,
        userId: req.user._id,
      })

      return order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then((result) => {
      res.redirect('/orders')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No Order Found.'))
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Anauthorized.'))
      }

      const invoiceFileName = 'invoice-' + orderId + '.pdf'
      const invoicePath = path.join('data', 'invoices', invoiceFileName)

      // Generating PDFs with PDFKit
      const pdfDoc = new PDFDocument()
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceFileName + '"'
      )
      pdfDoc.pipe(res)
      pdfDoc.fontSize(26).text('Invoice', { underline: true })
      pdfDoc.text('-------------------------------------')
      let totalPrice = 0
      order.products.forEach((product) => {
        totalPrice += product.quantity * product.productData.price
        pdfDoc
          .fontSize(14)
          .text(
            `${product.productData.title} - ${product.quantity} x $${product.productData.price}`
          )
      })
      pdfDoc.text('-------------------------------------')
      pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`)
      pdfDoc.end()

      // Preloading Data

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err)
      //   }

      //   res.setHeader('Content-Type', 'application/pdf')
      //   // inline - open pdf file inline in the browser
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceFileName + '"'
      //   )
      //   // attachment - download pdf file from the browser
      //   // res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceFileName + '"')
      //   res.send(data)
      // })

      // Streaming Data

      // const file = fs.createReadStream(invoicePath)
      // res.setHeader('Content-Type', 'application/pdf')
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceFileName + '"'
      // )
      // file.pipe(res)
    })
    .catch((err) => next(err))
}

exports.getCheckout = (req, res, next) => {
  let products
  let total
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      products = user.cart.items
      total = products.reduce((acc, p) => {
        acc += p.quantity * p.productId.price
        return acc
      }, 0)

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: p.productId.title,
              },
              unit_amount: p.productId.price * 100,
            },
            quantity: p.quantity,
          }
        }),
        mode: 'payment',
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success', //http://loacalhost:3000/checkout/success
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      })
    })
    .then((session) => {
      res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        products: products,
        totalSum: total,
        sessionId: session.id,
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
