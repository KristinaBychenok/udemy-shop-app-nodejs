const Product = require('../models/product')

exports.getAdminProductsPage = (req, res, next) => {
  // .getProducts = get + Name of module (Products)
  req.user
    .getProducts()
    // Product.findAll()
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

  // Product.fetchAllProducts((products) =>
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products',
  //   })
  // )
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

  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findOne({ where: { id: prodId } })
    .then((products) => {
      const product = products[0]
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

  // Product.fetchProductById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect('/')
  //   }

  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: isEditMode,
  //     product: product,
  //   })
  // })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  // sequelize
  // .createProduct = create + Name of module (Product)
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
      userId: req.user.id,
    })
    .then((result) => {
      res.redirect('/admin/products')
    })
    .catch((err) => console.log(err))

  // sql
  // Product.create({
  //   title: title,
  //   imageUrl: imageUrl,
  //   price: price,
  //   description: description,
  //   userId: req.user.id,
  // })

  // file system
  // const product = new Product(null, title, imageUrl, price, description)
  // product
  //   .save()
  //   .then(() => res.redirect('/'))
  //   .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findOne({ where: { id: prodId } })
    .then((products) => {
      const product = products[0]
      product.title = updatedTitle
      product.imageUrl = updatedImageUrl
      product.price = updatedPrice
      product.description = updatedDescription
      product.save()
    })
    .then((result) => {
      console.log('UPDATED PRODUCT!!!')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log(err)
    })

  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedPrice,
  //   updatedDescription
  // )
  // updatedProduct.save()
  // res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id

  Product.destroy({
    where: {
      id: prodId,
    },
  })
    .then((result) => {
      console.log('DELETED PRODUCT!!!')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log(err)
    })

  // Product.delete(prodId, () => {
  //   res.redirect('/admin/products')
  // })
}
