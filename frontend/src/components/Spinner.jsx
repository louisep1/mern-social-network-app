import loading from '../assets/Loading_icon.gif'

function Spinner() {
  return (
    <div>
      <img className='mx-auto' src={loading} alt="loading..." />
    </div>
  )
}

export default Spinner