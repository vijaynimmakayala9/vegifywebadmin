import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Enquiry from './components/Enquiry'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/enquiry' element={<Enquiry/>}/>
      </Routes>
    </>
  )
}

export default App
