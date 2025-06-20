 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';  
import {Home} from './pages/home/Home';  
import Login from './pages/login/Login';  
import Dashboard from './pages/dashboard/Dashboard';  
import HomeMedico from './pages/medicos/HomeMedico';
import {Toaster} from 'react-hot-toast';

function App() {  
  return (  
    <Router>  
      <Routes>  
        <Route path='/' element={<Home />} />  
        <Route path='/login' element={<Login />} />  
        <Route path='/dashboard' element={<Dashboard />} /> 
        <Route path='/homemedico' element={<HomeMedico />} />
      </Routes>
      <Toaster/>
    </Router>  
  );  
}  

export default App;  