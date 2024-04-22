const express = require('express')
const { check, body } = require('express-validator')
const User = require('../models/user')

const {
  getLoginPage,
  getSignupPage,
  postLogin,
  postLogout,
  postSignup,
  getResetPage,
  postReset,
  getNewPasswordPage,
  postNewPassword,
} = require('../controllers/auth')

const router = express.Router()

router.get('/login', getLoginPage)
router.get('/signup', getSignupPage)
router.get('/reset', getResetPage)
router.get('/reset/:token', getNewPasswordPage)
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Invalid password')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
)
router.post('/logout', postLogout)
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email already exist.')
          }
        })
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text at least 5 characters.' //could add as second arg if we have one message for list of checks
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!')
        }
        return true
      })
      .trim(),
  ],
  postSignup
)
router.post('/reset', postReset)
router.post('/new-password', postNewPassword)

module.exports = router
