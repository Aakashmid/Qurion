import { useState } from 'react'
import Chatpage from './pages/Chatpage'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import ServerErrorPage from './pages/ServerErrorPage'

function App() {
  return (
    <>
    <header>
      <Header/>
    </header>
    <Routes>
      <Route path="/" element={<Chatpage />}></Route>
      <Route path="/server-error" element={<ServerErrorPage />}></Route>
      <Route path="/c/:conversation_token" element={<Chatpage />}></Route>
    </Routes>
      
    </>
  )
}

export default App
