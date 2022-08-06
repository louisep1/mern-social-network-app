const express = require('express')
const router = express.Router()
const {signUp, signIn, addFriend} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/signup', signUp)
router.post('/signin', signIn)
router.put('/addfriend', protect, addFriend)


module.exports = router