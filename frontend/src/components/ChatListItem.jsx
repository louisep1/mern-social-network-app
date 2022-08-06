import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getChat } from '../features/chat/chatSlice'
import { v4 as uuidv4 } from 'uuid';

function ChatListItem({ chat }) {
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleClick = e => {
    dispatch(getChat(chat._id))
    navigate(`/${chat._id}`)
  }

  return (
    <>
      <div className={`my-1 p-4 hover:bg-base-300 cursor-pointer ${chat.readByAll === false && chat.messages[chat.messages.length - 1].fromUser[0] !== user.email && 'font-bold'}`} onClick={handleClick}>

        {chat.chatMembers.slice(0, 4).filter(member => member.email !== user.email).map((member, i) => (
          <i key={uuidv4()}>{member.firstName} {member.lastName}{i !== chat.chatMembers.slice(0, 4).filter(member => member.email !== user.email).length - 1 && ', '}{chat.chatMembers.length > 5 && i === chat.chatMembers.slice(0, 4).filter(member => member.email !== user.email).length - 1 && '...'}</i>
        ))
        }

        <br />
        {chat.messages[chat.messages.length - 1].messageContents.substr(0, 40)}{chat.messages[chat.messages.length - 1].messageContents.length > 40 && '...'}
        <br />
        <i>{chat.messages[chat.messages.length - 1].time}</i>
      </div>
    </>
  )
}

export default ChatListItem