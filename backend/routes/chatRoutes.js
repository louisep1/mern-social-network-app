const express = require('express')
const router = express.Router()
const {getMessages, sendMessage, markRead} = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getMessages).post(protect, sendMessage).put(protect, markRead)

module.exports = router