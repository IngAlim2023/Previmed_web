import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import {Home} from './pages/home/Home'
import SideBar from './components/navegation/SideBar'
import Login from './pages/login/Login'

function App() {

  return (
    <Router>
      <SideBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>

  )
}

export default App
