const Cart = require('../models/cart')
const Product = require('../models/product')

exports.getShopPage = (req, res, next) => {
  Product.fetchAllProducts()
    .then(([rows, data]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getProductsPage = (req, res, next) => {
  Product.fetchAllProducts()
    .then(([rows, data]) => {
      res.render('shop/products-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.fetchProductById(prodId)
    .then(([product]) => {
      res.render('shop/product-details', {
        product: product[0],
        pageTitle: 'Product Details',
        path: `/products`,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  Cart.getProductsCart((cart) => {
    Product.fetchAllProducts((products) => {
      const cartProducts = []

      products.forEach((prod) => {
        const cartProductData = cart.products.find(
          (cartProd) => cartProd.id === prod.id
        )
        if (!!cartProductData) {
          cartProducts.push({ productData: prod, qty: cartProductData.qty })
        }
      })

      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cartProducts: cartProducts,
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.fetchProductById(prodId, (product) => {
    Cart.addProduct(product.id, product.price)
    res.redirect('/cart')
  })
}

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.id

  Product.fetchProductById(prodId, (product) => {
    Cart.deleteProduct(product.id, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}
