import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BsBackspace } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import { getChat, getMessages, sendMessage, reset, markRead } from '../features/chat/chatSlice'
import { addFriend } from '../features/user/userSlice'
import Spinner from '../components/Spinner'
import { MdRefresh } from 'react-icons/md'

function ChatPage() {

  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const { currentChat, isSuccess, isLoading } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()

  useEffect(() => {
    dispatch(getChat(id))
    setLoading(false)
    dispatch(reset())
  }, [])



  useEffect(() => {
    if (isLoading) {
      dispatch(reset())
      dispatch(getChat(id))
    }
  }, [isSuccess, isLoading, currentChat])

  useEffect(() => {
    if (currentChat && currentChat.readByAll !== true && currentChat.messages[currentChat.messages.length - 1].fromUser[0] !== user.email) {
      dispatch(markRead(currentChat._id))
    }
  }, [isSuccess])




  const handleSubmit = (e) => {
    e.preventDefault()

    const dataToSend = {
      messageContents: newMessage,
      time: new Date().toLocaleString('en-GB'),
      // this create a date set to the current time but in British English date formatting
      _id: currentChat._id
    }

    if (newMessage.length > 0) {
      dispatch(sendMessage(dataToSend))
    }
    setNewMessage('')
  }

  const refreshChat = () => {
    dispatch(getChat(id))
  }


  if (loading) {
    return <Spinner />
  }


  if (!loading && currentChat) {
    return (
      <div className='h-screen overflow-y-hidden'>

        <div className='flex sticky top-0 bg-white m-4 justify-between'>
          <button className='btn btn-xs' onClick={() => navigate('/')}><BsBackspace /></button>
          <div className='px-4 rounded-full pb-0.5 bg-blue-200'>
            {currentChat.chatMembers.length > 1 && currentChat.chatMembers.map((member, i) => (
              <i key={member.email}>
                {member.firstName}{i !== currentChat.chatMembers.length - 1 && ', '}
              </i>
            ))}
          </div>
          <button className="btn btn-xs text-lg" onClick={refreshChat}><MdRefresh /></button>
        </div>

        {/* if not friends */}
        {user.friends.filter(friend => friend.email === currentChat.messages[0].fromUser[0] || currentChat.messages[0].fromUser[0] === user.email).length === 0 && (
          <div className='relative'>
            <div className='text-center bg-warning p-1'>You are not friends</div>
          </div>
        )}


        <div className='mx-2'>
          <div className='overflow-y-auto' style={{ display: 'flex', flexDirection: 'column-reverse', height: '86vh' }}>

            <div>
              {currentChat.messages.length > 1 && currentChat.messages.map((message, i) => (
                <div key={message._id}>

                  <div className={`flex flex-col ${message.fromUser[3] === user.id ? 'items-end' : 'items-start'}`}>
                    <div className={`mt-6 mb-1 avatar placeholder ${message.fromUser[3] === user.id ? 'mr-2' : 'ml-2'}`}>
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-lg">{message.fromUser[1][0].toUpperCase()}{message.fromUser[2][0].toUpperCase()}</span>
                      </div>
                    </div>

                    <p className={`badge badge-primary py-2 px-4 text-md max-w-xs h-fit ${message.messageContents.split(' ').filter(word => word.length > 40).length > 0 ? 'break-all' : 'break-normal'}`}>{message.messageContents}</p>

                    <i className='text-xs center mt-1'>{message.time.split(', ')[1]}, {message.time.split(', ')[0]}</i>
                  </div>
                </div>
              ))}


              {currentChat.messages.length === 1 && (
                <div>

                  <div className={`flex flex-col ${currentChat.messages[0].fromUser[3] === user.id ? 'items-end' : 'items-start'}`}>
                    <div className={`mt-6 mb-1 avatar placeholder ${currentChat.messages[0].fromUser[3] === user.id ? 'mr-2' : 'ml-2'}`}>
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-lg">{currentChat.messages[0].fromUser[1][0].toUpperCase()}{currentChat.messages[0].fromUser[2][0].toUpperCase()}</span>
                      </div>
                    </div>

                    <p className={`badge badge-primary py-2 px-4 text-md max-w-xs h-fit ${currentChat.messages[0].messageContents.split(' ').filter(word => word.length > 40).length > 0 ? 'break-all' : 'break-normal'}`}>{currentChat.messages[0].messageContents}</p>
                    <i className='text-xs center pt-1'>{currentChat.messages[0].time.split(', ')[1]}, {currentChat.messages[0].time.split(', ')[0]}</i>
                  </div>

                </div>
              )}


              <div className="w-full sticky bottom-0 mt-4 bg-white pt-4">
                <form onSubmit={handleSubmit}>
                  <div className="form-control mx-2 relative">
                    <textarea className="textarea p-4 textarea-ghost h-24 w-full" placeholder="Message..." id='newMessage' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  </div>
                  <div className="flex justify-end ">
                    <button className={`btn m-2 ${newMessage.length > 0 ? 'btn-ghost' : 'btn-disabled'}`} type='submit'>Send</button>
                  </div>
                </form>
              </div>

            </div>

          </div>

        </div>

      </div >
    )
  }
}

export default ChatPage