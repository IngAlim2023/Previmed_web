 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';  
import {Home} from './pages/home/Home';  
import SideBar from './components/navegation/SideBar';  
import Login from './pages/login/Login';  
import Dashboard from './pages/dashboard/Dashboard';  
import HomeMedico from './pages/medicos/HomeMedico';

function App() {  
  return (  
    <Router>  
      <Routes>  
        <Route path='/' element={<Home />} />  
        <Route path='/login' element={<Login />} />  
        <Route path='/dashboard' element={<Dashboard />} /> 
        <Route path='/homemedico' element={<HomeMedico />} />
      </Routes>  
    </Router>  
  );  
}  

export default App;  