const Cart = require('../models/cart')
const Product = require('../models/product')

exports.getShopPage = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((err) => {
      console.log(err)
    })
  // Product.fetchAllProducts()
  //   .then(([rows, data]) => {
  //     res.render('shop/index', {
  //       prods: rows,
  //       pageTitle: 'Shop',
  //       path: '/',
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}

exports.getProductsPage = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch((err) => {
      console.log(err)
    })

  // Product.fetchAllProducts()
  //   .then(([rows, data]) => {
  //     res.render('shop/products-list', {
  //       prods: rows,
  //       pageTitle: 'All Products',
  //       path: '/products',
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findOne({ where: { id: prodId } })
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: 'Product Details',
        path: `/products`,
      })
    })
    .catch((err) => {
      console.log(err)
    })

  // Product.fetchProductById(prodId)
  //   .then(([product]) => {
  //     res.render('shop/product-details', {
  //       product: product[0],
  //       pageTitle: 'Product Details',
  //       path: `/products`,
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((cartProducts) => {
          res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: cartProducts,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
  // Cart.getProductsCart((cart) => {
  //   Product.fetchAllProducts((products) => {
  //     const cartProducts = []

  //     products.forEach((prod) => {
  //       const cartProductData = cart.products.find(
  //         (cartProd) => cartProd.id === prod.id
  //       )
  //       if (!!cartProductData) {
  //         cartProducts.push({ productData: prod, qty: cartProductData.qty })
  //       }
  //     })

  //     res.render('shop/cart', {
  //       pageTitle: 'Cart',
  //       path: '/cart',
  //       cartProducts: cartProducts,
  //     })
  //   })
  // })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return fetchedCart.getProducts({ where: { id: prodId } })
    })
    .then((products) => {
      const product = products.length > 0 ? products[0] : null

      if (product) {
        return fetchedCart.addProduct(product, {
          through: { quantity: product.cartItem.quantity + 1 },
        })
      } else {
        return Product.findByPk(prodId)
          .then((product) => {
            return fetchedCart.addProduct(product, {
              through: { quantity: 1 },
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => {
      console.log(err)
    })

  // Product.fetchProductById(prodId, (product) => {
  //   Cart.addProduct(product.id, product.price)
  //   res.redirect('/cart')
  // })
}

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.id

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then((products) => {
      const product = products[0]
      return product.cartItem.destroy()
    })
    .then((result) => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })

  // Product.fetchProductById(prodId, (product) => {
  //   Cart.deleteProduct(product.id, product.price)
  //   res.redirect('/cart')
  // })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) =>
          order.addProducts(
            products.map((prod) => {
              prod.orderItem = {
                quantity: prod.cartItem.quantity,
              }
              return prod
            })
          )
        )
        .catch((err) => {
          console.log(err)
        })
    })
    .then(() => {
      fetchedCart.setProducts(null)
    })
    .then(() => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}
