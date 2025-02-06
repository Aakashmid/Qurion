import { useState } from 'react'

import Chatpage from './pages/Chatpage'
import { Routes,Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Chatpage />}></Route>
    </Routes>
      
    </>
  )
}

export default App
