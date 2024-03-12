const Product = require('../models/product')

exports.getAdminProductsPage = (req, res, next) => {
  Product.find()
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
      console.log(err)
    })
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

  Product.findById(prodId)
    .then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: isEditMode,
        product: product,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

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
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  Product.findByIdAndUpdate(prodId, {
    title: updatedTitle,
    imageUrl: updatedImageUrl,
    price: updatedPrice,
    description: updatedDescription,
  })
    // Product.findById(prodId)
    //   .then((product) => {
    //     product.title = updatedTitle
    //     product.imageUrl = updatedImageUrl
    //     product.price = updatedPrice
    //     product.description = updatedDescription
    //     return product.save()
    //   })
    .then((result) => {
      res.redirect('/admin/products')
    })
    .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id

  Product.findByIdAndDelete(prodId)
    .then((result) => {
      console.log('DELETED PRODUCT!!!')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log(err)
    })
}
