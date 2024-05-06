const express = require('express')

const {
  getShopPage,
  getProductsPage,
  getProduct,
  getCart,
  getOrders,
  getInvoice,
  getCheckout,
  getCheckoutSuccess,
  postCart,
  postDeleteCartItem,
  // postOrder,
} = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', getShopPage)
router.get('/products', getProductsPage)
router.get('/products/:productId', getProduct)
router.get('/cart', isAuth, getCart)
router.get('/orders', isAuth, getOrders)
router.get('/orders/:orderId', isAuth, getInvoice)
router.get('/checkout/success', getCheckoutSuccess)
router.get('/checkout/cancel', isAuth, getCheckout)
router.get('/checkout', isAuth, getCheckout)

router.post('/cart', isAuth, postCart)
router.post('/cart-delete-item', isAuth, postDeleteCartItem)
//router.post('/create-order', isAuth, postOrder)

module.exports = router
