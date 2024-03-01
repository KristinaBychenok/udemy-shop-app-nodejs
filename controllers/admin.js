const Product = require('../models/product')

exports.getAdminProductsPage = (req, res, next) => {
  Product.fetchAllProducts((products) =>
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  )
}

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null,
  })
}

exports.getEditProductPage = (req, res, next) => {
  const prodId = req.params.productId
  const isEditMode = req.query.edit === 'true'

  if (!isEditMode) {
    return res.redirect('/')
  }

  Product.fetchProductById(prodId, (product) => {
    if (!product) {
      return res.redirect('/')
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: isEditMode,
      product: product,
    })
  })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  const product = new Product(null, title, imageUrl, price, description)
  product
    .save()
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  )
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id

  Product.delete(prodId, () => {
    res.redirect('/admin/products')
  })
}
