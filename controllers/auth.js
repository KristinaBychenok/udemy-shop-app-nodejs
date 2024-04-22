const bcrypt = require('bcryptjs')
const User = require('../models/user')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

exports.getLoginPage = (req, res, next) => {
  const error = req.flash('error')

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: error.length > 0 ? error[0] : null,
    oldInput: { email: '', password: '' },
    validationErrors: [],
  })
}

exports.getSignupPage = (req, res, next) => {
  const error = req.flash('error')

  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    errorMessage: error.length > 0 ? error[0] : null,
    oldInput: { name: '', email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  })
}

exports.postLogin = (req, res, next) => {
  // Secure - don't see loggedIn cookie
  // HttpOnly - can't change loggedIn cookie
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')

  const email = req.body.email
  const password = req.body.password

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    })
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login')
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash('error', 'Invalid email or password.')
            return res.redirect('/login')
          } else {
            req.session.isAuth = true
            req.session.user = user
            return req.session.save(() => res.redirect('/'))
          }
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Sign Up',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    })
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name,
        email,
        password: hashedPassword,
        cart: { items: [] },
      })

      return user.save()
    })
    .then((result) => {
      console.log(result)
      res.redirect('/login')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getResetPage = (req, res, next) => {
  const error = req.flash('error')

  res.render('auth/reset', {
    pageTitle: 'Reset',
    path: '/reset',
    errorMessage: error.length > 0 ? error[0] : null,
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      return res.redirect('/reset')
    }

    const token = buf.toString('hex')

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset')
        }

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then((result) => {
        res.redirect('/')
        // send email
        // transporter.sendEmail({
        //   to: req.body.email,
        //   from: 'node-js-app.com',
        //   subject: 'Reset Password',
        //   html: `
        //     <p>You requested a password reset</p>
        //     <p>Click this <a href="http://localhost:3000/reset/${token}"> link </a> to set a new password</p>
        //   `
        // })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  })
}

exports.getNewPasswordPage = (req, res, next) => {
  // "http://localhost:3000/reset/${token}"
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }) //$gt - greater than ....
    .then((user) => {
      const error = req.flash('error')

      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: error.length > 0 ? error[0] : null,
        userId: user._id.toString(),
        passwordToken: token,
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() }, //$gt - greater than ....
    _id: userId,
  })
    .then((user) => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then((result) => {
      res.redirect('/login')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
