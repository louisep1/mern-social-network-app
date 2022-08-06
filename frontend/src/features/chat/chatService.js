import axios from 'axios'

const API_URL = '/api/chat/'

const getMessages = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

const sendMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, messageData, config)
  return response.data
}

const sendNewMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, messageData, config)
  return response.data
}

const markRead = async (chatId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL, { chatId: chatId }, config)
  return response.data
}

const chatService = {
  getMessages,
  sendMessage,
  sendNewMessage,
  markRead,
}

export default chatService
