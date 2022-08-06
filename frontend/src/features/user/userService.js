import axios from 'axios'

const API_URL = '/api/user/'

const signUp = async formData => {
  const response = await axios.post(API_URL + 'signup', formData)
  if (response.data) {
    localStorage.setItem('socialUser', JSON.stringify(response.data))
  }
  return response.data
}

const signIn = async logInData => {
  const response = await axios.post(API_URL + 'signin', logInData)
  if (response.data) {
    localStorage.setItem('socialUser', JSON.stringify(response.data))
  }
  return response.data
}

const addFriend = async (email, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'addfriend', email, config)
  if (response.data) {
    localStorage.setItem('socialUser', JSON.stringify(response.data))
  }
  return response.data
}

const signOut = async () => {
  localStorage.removeItem('socialUser')
}

const userService = {
  signUp,
  signIn,
  addFriend,
  signOut,
}

export default userService
