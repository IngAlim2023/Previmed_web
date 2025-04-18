import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import {Home} from './pages/home/Home'
import SideBar from './components/navegation/SideBar'

function App() {

  return (
    <Router>
      <SideBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </Router>

  )
}

export default App
