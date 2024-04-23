const express = require('express')
const {
  getAdminProductsPage,
  getAddProductPage,
  getEditProductPage,
  postProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const { body } = require('express-validator')

const router = express.Router()

router.get('/products', isAuth, getAdminProductsPage)
router.get('/add-product', isAuth, getAddProductPage)
router.get('/edit-product/:productId', isAuth, getEditProductPage)

router.post(
  '/add-product',
  [
    body('title', 'Please enter a title with only numbers and text!')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    // body('imageUrl', 'Please enter a valid URL!').isURL(),
    body('price', 'Please enter a price with only numbers!').isFloat(),
    body(
      'description',
      'Please enter a description no more than 400 characters!'
    )
      .isLength({ max: 400 })
      .trim(),
  ],
  isAuth,
  postProduct
)
router.post(
  '/edit-product',
  [
    body('title', 'Please enter a title with only numbers and text!')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    // body('imageUrl', 'Please enter a valid URL!').isURL(),
    body('price', 'Please enter a price with only numbers!').isFloat(),
    body(
      'description',
      'Please enter a description no more than 400 characters!'
    )
      .isLength({ max: 400 })
      .trim(),
  ],
  isAuth,
  postEditProduct
)
router.post('/delete-product', isAuth, postDeleteProduct)

module.exports = router
