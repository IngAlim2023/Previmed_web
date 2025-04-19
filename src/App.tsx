 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';  
import {Home} from './pages/home/Home';  
import SideBar from './components/navegation/SideBar';  
import Login from './pages/login/Login';  
import Dashboard from './pages/dashboard/Dashboard';  

function App() {  
  return (  
    <Router>  
      <SideBar />  
      <Routes>  
        <Route path='/' element={<Home />} />  
        <Route path='/login' element={<Login />} />  
        <Route path='/dashboard' element={<Dashboard />} />  
      </Routes>  
    </Router>  
  );  
}  

export default App;  