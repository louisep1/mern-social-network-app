const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
  {
    messages: [
      {
        messageContents: {
          type: String,
          required: [true, `There's nothing to send`],
        },
        time: {
          type: String,
        },
        fromUser: {
          type: Array,
          required: true,
        },
      },
    ],
    readByAll: {
      type: Boolean,
      default: false,
    },
    chatMembers: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Chat', chatSchema)
