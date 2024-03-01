const express = require('express')

const {
  getShopPage,
  getProductsPage,
  getProduct,
  getCart,
  getOrders,
  getCheckout,
  postCart,
  postDeleteCartItem,
} = require('../controllers/shop')

const router = express.Router()

router.get('/', getShopPage)
router.get('/products', getProductsPage)
router.get('/products/:productId', getProduct)
router.get('/cart', getCart)
router.post('/cart', postCart)
router.post('/cart-delete-item', postDeleteCartItem)
router.get('/orders', getOrders)
router.get('/checkout', getCheckout)

module.exports = router
