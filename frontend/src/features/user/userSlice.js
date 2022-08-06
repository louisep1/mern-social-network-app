import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userService from './userService'

const socialUser = JSON.parse(localStorage.getItem('socialUser'))

const initialState = {
  user: socialUser ? socialUser : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const signUp = createAsyncThunk(
  'user/signup',
  async (formData, thunkAPI) => {
    try {
      return await userService.signUp(formData)
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

export const signIn = createAsyncThunk(
  'user/signin',
  async (logInData, thunkAPI) => {
    try {
      return await userService.signIn(logInData)
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

export const addFriend = createAsyncThunk(
  'user/addfriend',
  async (email, thunkAPI) => {
    const token = thunkAPI.getState().user.user.token
    try {
      return await userService.addFriend(email, token)
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

export const signOut = createAsyncThunk('user/logout', async () => {
  return await userService.signOut()
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        state.isLoading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(signUp.pending, state => {
        state.isLoading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(addFriend.pending, state => {
        state.isLoading = true
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(signOut.fulfilled, state => {
        state.user = null
      })
  },
})

export const { reset } = userSlice.actions
export default userSlice.reducer
