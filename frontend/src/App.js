import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <>
      <div className="container">
        <div className="content">
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/:id" element={<ChatPage />} />
            </Routes>
          </Router>

          <ToastContainer />
        </div>
      </div>
    </>
  )
}

export default App
