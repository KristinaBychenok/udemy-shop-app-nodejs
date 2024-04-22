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
  postOrder,
} = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', getShopPage)
router.get('/products', getProductsPage)
router.get('/products/:productId', getProduct)
router.get('/cart', isAuth, getCart)
router.post('/cart', isAuth, postCart)
router.post('/cart-delete-item', isAuth, postDeleteCartItem)
router.get('/orders', isAuth, getOrders)
router.post('/create-order', isAuth, postOrder)

module.exports = router
