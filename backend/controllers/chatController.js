const { json } = require('express')
const asyncHandler = require('express-async-handler')

const Chat = require('../models/chatModel')
const User = require('../models/userModel')

// @ desc    Get all user's messages
// @route    GET /api/chat/
// @access   Private
const getMessages = asyncHandler(async (req, res) => {
  const me = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  }
  const chats = await Chat.find({ chatMembers: me })
  res.status(200).json(chats)
})

// @ desc    Update chat to be read
// @route    PUT /api/chat/
// @access   Private
const markRead = asyncHandler(async (req, res) => {
  const { chatId } = req.body
  const markedRead = await Chat.findByIdAndUpdate(chatId, {
    readByAll: true,
  })

  if (markedRead) {
    res.status(201).json(markedRead)
  } else {
    res.status(400)
    throw new Error(`Read status couldn't be updated`)
  }
})

// @ desc    Send a message
// @route    Post /api/chat/
// @access   Private
const sendMessage = asyncHandler(async (req, res) => {
  const { messageContents, time, chatMembers, _id } = req.body

  if (!messageContents) {
    res.status(400)
    throw new Error('There is no message to send...')
  }

  if (!_id && !chatMembers && !time) {
    res.status(400)
    throw new Error('There is insufficient data to make the request')
  }

  // Check if id is submitted in body - if so:
  // Check if chat already exits by searching Chat for matching _id
  // Then - just add an extra message to messages
  if (_id) {
    const existingChat = await Chat.findById(_id)
    const updatedChat = await Chat.findByIdAndUpdate(_id, {
      messages: [
        ...existingChat.messages,
        {
          messageContents,
          time,
          fromUser: [
            req.user.email,
            req.user.firstName,
            req.user.lastName,
            req.user._id,
          ],
        },
      ],
    })

    if (updatedChat) {
      res.status(201).json({
        _id,
        id: updatedChat._id,
        messages: updatedChat.messages,
        chatMembers: updatedChat.chatMembers,
      })
    } else {
      res.status(400)
      throw new Error(`Couldn't send message to requested group`)
    }
  } else {
    // Else - if chat doesn't exist -  make new chat:

    // firstly, for a normal 2-people chat (group chats to be added in future):
    if (typeof chatMembers === 'string') {
      const chatMemberUser = await User.findOne({ email: chatMembers })
      const newChat = await Chat.create({
        messages: [
          {
            messageContents,
            time,
            fromUser: [
              req.user.email,
              req.user.firstName,
              req.user.lastName,
              req.user._id,
            ],
          },
        ],
        chatMembers: [
          {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
          {
            email: chatMemberUser.email,
            firstName: chatMemberUser.firstName,
            lastName: chatMemberUser.lastName,
          },
        ],
      })

      if (newChat) {
        res.status(201).json({
          _id,
          messages: newChat.messages,
          chatMembers: newChat.chatMembers,
          id: newChat._id,
        })
      } else {
        res.status(400)
        throw new Error(`New chat couldn't be created`)
      }
    }
  }
})

module.exports = {
  getMessages,
  sendMessage,
  markRead,
}
