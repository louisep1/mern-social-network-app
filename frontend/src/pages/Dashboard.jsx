import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { BsBackspace } from 'react-icons/bs'
import { signIn, signUp, signOut, reset, addFriend } from '../features/user/userSlice'
import { getMessages, sendNewMessage, sendMessage, logoutReset, reset as resetChat } from '../features/chat/chatSlice'
import ChatListItem from '../components/ChatListItem'
import Spinner from '../components/Spinner'
import { MdRefresh } from 'react-icons/md'

function Dashboard() {
  const [loading, setLoading] = useState(true)

  const { user, isLoading, isError, message } = useSelector(state => state.user)
  const { chats, currentChat, isSuccess } = useSelector(state => state.chat)

  const [signUpForm, setSignUpForm] = useState(false)
  const [signInForm, setSignInForm] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    password2: ''
  })

  const { email, firstName, lastName, password, password2 } = formData

  const [friendsEmail, setFriendsEmail] = useState('')

  const dispatch = useDispatch()




  useEffect(() => {
    if (user) {
      setSignInForm(false)
      setSignUpForm(false)
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        password2: ''
      })

      dispatch(getMessages())
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (isError && !isLoading) {
      console.log(message)
      toast.error(`Oops! ${message}`)
    }
    dispatch(reset())
    dispatch(resetChat())
  }, [isError, isLoading, isSuccess])



  const handleChange = e => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    if (signUpForm) {
      if (password !== password2) {
        toast.error('Passwords do not match')
      } else {
        const data = { email, firstName, lastName, password }
        dispatch(signUp(data))
      }
    }

    if (signInForm) {
      const data = { email, password }
      dispatch(signIn(data))
    }
  }


  // to add a new friend
  const submitEmail = (e) => {
    e.preventDefault()

    const addFriendData = { email: friendsEmail }
    dispatch(addFriend(addFriendData))

    // see if chat already exits (if this person has already added you):
    const filtered = chats.filter(chat => chat.chatMembers.find(member => member.email === friendsEmail))
    if (filtered.length === 0) {
      const sendNewMessageData = {
        messageContents: `${user.firstName} ${user.lastName} has added you as a friend`,
        time: new Date().toLocaleString('en-GB'),
        chatMembers: friendsEmail,
      }
      dispatch(sendNewMessage(sendNewMessageData))
    }

    // Originally this couldn't be done, as chatMembers was sourcing data from User's friend list (which hadn't been fulfilled yet from the first dispatch) - but changed it to get the chatMembers data by searching the User database for matching email and then get rest of details
    setFriendsEmail('')
  }

  const signOutUser = () => {
    dispatch(signOut())
    dispatch(logoutReset())
  }

  const refreshChatList = () => {
    dispatch(getMessages())
  }


  if (loading) {
    return <Spinner />
  }


  // Log in/register page:
  if (!loading && !user) {
    return (
      <div>

        <div className="text-lg mt-12 font-bold text-center">Welcome to the</div>
        <div className="text-xl mt-2 font-bold text-center">Social Network App</div>
        {!signInForm && !signUpForm && (

          <div className='flex flex-col justify-center items-center mt-20'>
            <button className='btn mb-2' onClick={() => setSignUpForm(true)}>Sign up here</button>
            <button className='btn' onClick={() => setSignInForm(true)}>Already have an account?</button>
          </div>
        )
        }


        {
          !user && signInForm && (
            <div className='mt-6'>
              <button className='btn btn-sm md:ml-20' onClick={() => setSignInForm(false)}><BsBackspace /></button>
              <div className='text-center text-2xl mb-4'>Sign in</div>
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center'>
                  <label htmlFor="email">Enter your email:</label>
                  <input className='text-center mb-4 mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="email" id='email' value={email} onChange={handleChange} placeholder='Email address' />

                  <label htmlFor="password">Enter password:</label>
                  <input className='text-center mb-8 text-center mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="password" id='password' value={password} onChange={handleChange} placeholder='Password' />
                  <button className='btn btn-primary' type='submit'>Submit</button>
                </div>
              </form>
            </div>
          )
        }

        {
          !user && signUpForm && (
            <div className='mt-6'>
              <button className='btn btn-sm md:ml-20' onClick={() => setSignUpForm(false)}><BsBackspace /></button>
              <div className='text-center text-2xl mb-4'>Sign up</div>

              <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center'>
                  <label htmlFor="email">Email</label>
                  <input className='text-center mb-4 mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="email" id='email' value={email} onChange={handleChange} placeholder='Email' />
                  <label htmlFor="firstName">First Name</label>
                  <input className='text-center mb-4 mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="text" id='firstName' value={firstName} onChange={handleChange} placeholder='Name' />
                  <label htmlFor="lastName">Last Name</label>
                  <input className='text-center mb-4 mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="text" id='lastName' value={lastName} onChange={handleChange} placeholder='Last name' />
                  <label htmlFor="password">Password</label>
                  <input className='text-center mb-4 mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="password" id='password' value={password} onChange={handleChange} placeholder='Password' />
                  <label htmlFor="password2">Confirm Password</label>
                  <input className='mb-8 text-center mt-1.5 input input-sm input-bordered input-primary w-full max-w-xs' type="password" id='password2' value={password2} onChange={handleChange} placeholder='Enter password again' />
                  <button className='btn btn-primary' type='submit'>Submit</button>
                </div>
              </form>
            </div>
          )
        }
      </div >
    )
  }


  // Page once logged in
  if (!loading) {
    return (
      <div>
        <div className='text-lg font-bold mt-4 ml-4'>Chat list</div>
        <div className="flex justify-between p-4 ">
          <div className='p-2 badge badge-primary'>Welcome back, {user.firstName}!</div>
          <button className='btn btn-xs mr-2' onClick={signOutUser}>Sign out</button>
        </div>

        {/* Search for friends / Add new friend section */}
        <form onSubmit={submitEmail}>
          <input className='m-4 input input-bordered input-xs input-primary w-8/12 max-w-xs' id='friendsEmail' value={friendsEmail} onChange={(e) => setFriendsEmail(e.target.value)} placeholder='Search for friends' />
        </form>

        <button className="btn btn-xs text-lg mt-2 ml-6" onClick={refreshChatList}><MdRefresh /></button>

        <div className='mt-4'>
          {chats && chats.length > 1 && chats.slice().sort((a, b) => new Date(b.messages[b.messages.length - 1].time) - new Date(a.messages[a.messages.length - 1].time))
            .map(chat => (
              <ChatListItem key={chat._id} chat={chat} />
            ))
          }

          {chats && chats.length === 1 &&
            <ChatListItem chat={chats[0]} />
          }
        </div>
      </div>
    )
  }
}

export default Dashboard