import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import chatService from './chatService'

const initialState = {
  chats: [],
  currentChat: null,
  awaitingMessage: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const getMessages = createAsyncThunk(
  '/chat/getMessages',
  async (__, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      return await chatService.getMessages(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//getChat for single chat - also needed to update when new messages come and go
export const getChat = createAsyncThunk(
  '/chat/getChat',
  async (chatId, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      const allMessageData = await chatService.getMessages(token)
      const currentChat = allMessageData.filter(chat => chat._id === chatId)
      return currentChat[0]
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const sendMessage = createAsyncThunk(
  '/chat/sendMessage',
  async (messageData, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      return await chatService.sendMessage(messageData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const sendNewMessage = createAsyncThunk(
  '/chat/sendNewMessage',
  async (messageData, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      return await chatService.sendMessage(messageData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const markRead = createAsyncThunk(
  'chat/read',
  async (chatId, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      return await chatService.markRead(chatId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    logoutReset: state => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getMessages.pending, state => {
        state.isLoading = true
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.chats = action.payload
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(getChat.pending, state => {
        state.isLoading = true
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentChat = action.payload
        state.awaitingMessage = false
      })
      .addCase(getChat.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(sendMessage.pending, state => {
        state.isLoading = true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentChat = action.payload
        state.awaitingMessage = true
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(sendNewMessage.pending, state => {
        state.isLoading = true
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentChat = action.payload
        state.awaitingMessage = true
      })
      .addCase(sendNewMessage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(markRead.pending, state => {
        state.isLoading = true
      })
      .addCase(markRead.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(markRead.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, logoutReset } = chatSlice.actions
export default chatSlice.reducer
