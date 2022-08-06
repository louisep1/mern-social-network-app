const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')

// @ desc    Create new user
// @route    POST /api/user/signup
// @access   Public
const signUp = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.status(400)
    throw new Error('Fields are incomplete')
  }

  if (password.length < 5) {
    res.status(400)
    throw new Error('Password must be more than 5 characters long')
  }

  const alreadyExists = await User.findOne({ email })

  if (alreadyExists) {
    res.status(400)
    throw new Error('This email is already registered')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      token: generateToken(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
      email,
      friends: user.friends,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @ desc    Sign user in
// @route    POST /api/user/signin
// @access   Public
const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      token: generateToken(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
      email,
      friends: user.friends,
    })
  } else {
    res.status(400)
    throw new Error('Username and password do not match')
  }
})

// @ desc    Add new user to a user's friends list
// @route    PUT /api/user/addFriend
// @access   Private
const addFriend = asyncHandler(async (req, res) => {
  // we search for the friend to add in the body of the request:
  const { email } = req.body

  // Find user you want to add
  const newFriend = await User.findOne({ email })

  if (!newFriend) {
    res.status(404)
    throw new Error(`Sorry, that user wasn't found`)
  }

  // Person doing the adding:
  const user = await User.findById(req.user._id)

  // Make sure they're not already your friend
  if (user.friends.filter(friend => friend.email === email).length > 0) {
    res.status(400)
    throw new Error('You are already friends with that person')
  }

  const addNewFriend = await User.findByIdAndUpdate(user._id, {
    friends: user.friends
      ? [
          ...user.friends,
          {
            email: newFriend.email,
            firstName: newFriend.firstName,
            lastName: newFriend.lastName,
          },
        ]
      : [
          {
            email: newFriend.email,
            firstName: newFriend.firstName,
            lastName: newFriend.lastName,
          },
        ],
  })

  res.status(200).json({
    token: generateToken(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
    friends:
      user.friends.length > 0
        ? [
            ...user.friends,
            {
              email: newFriend.email,
              firstName: newFriend.firstName,
              lastName: newFriend.lastName,
            },
          ]
        : [
            {
              email: newFriend.email,
              firstName: newFriend.firstName,
              lastName: newFriend.lastName,
            },
          ],
  })
})

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  signUp,
  signIn,
  addFriend,
}
