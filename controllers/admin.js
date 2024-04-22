const { validationResult } = require('express-validator')
const Product = require('../models/product')

exports.getAdminProductsPage = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // in the Product add only title price info, without _id
    // .select('title price -_id')
    // in the userId add info about user (only name field)
    // .populate('userId', 'name')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  })
}

exports.getEditProductPage = (req, res, next) => {
  const prodId = req.params.productId
  const isEditMode = req.query.edit === 'true'

  if (!isEditMode) {
    return res.redirect('/')
  }

  Product.findById(prodId)
    .then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: isEditMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: { title, imageUrl, price, description },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user._id,
  })
  product
    .save()
    .then((result) => {
      res.redirect('/admin/products')
    })
    .catch((err) => {
      // return res.redirect('/500')
      const error = new Error('Creating a product faild.')
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render(`admin/edit-product`, {
      pageTitle: 'Edit Product',
      path: `/admin/edit-product`,
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

  // Product.findByIdAndUpdate(prodId, {
  //   title: updatedTitle,
  //   imageUrl: updatedImageUrl,
  //   price: updatedPrice,
  //   description: updatedDescription,
  // })
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = updatedTitle
      product.imageUrl = updatedImageUrl
      product.price = updatedPrice
      product.description = updatedDescription
      return product.save().then((result) => {
        res.redirect('/admin/products')
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id

  // Product.findByIdAndDelete(prodId)
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      console.log('DELETED PRODUCT!!!')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
