const express = require('express')
const {
  getAdminProductsPage,
  getAddProductPage,
  getEditProductPage,
  postProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin')

const router = express.Router()

router.get('/products', getAdminProductsPage)
router.get('/add-product', getAddProductPage)
router.get('/edit-product/:productId', getEditProductPage)

router.post('/add-product', postProduct)
router.post('/edit-product', postEditProduct)
router.post('/delete-product', postDeleteProduct)

module.exports = router
