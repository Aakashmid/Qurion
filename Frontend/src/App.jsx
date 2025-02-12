import { useState } from 'react'

import Chatpage from './pages/Chatpage'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import ServerErrorPage from './pages/ServerErrorPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <header>
      <Header/>
    </header>
    <Routes>
      <Route path="/" element={<Chatpage />}></Route>
      <Route path="/server-error" element={<ServerErrorPage />}></Route>
      <Route path="/conversations/:conversation_name" element={<Chatpage />}></Route>
    </Routes>
      
    </>
  )
}

export default App
