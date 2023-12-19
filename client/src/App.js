import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import Memories from './components/Memories';
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Landing from './components/Landing';
import AdminLogin from './components/admin/AdminLogin';
import AdminCreateAccount from './components/admin/AdminCreateAccount';
import ManageMemories from './components/admin/ManageMemories';
function App() {
  return (
    <Routes>
      <Route element={<> <Navbar/> <Outlet /></>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/memories" element={<Memories/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
      </Route>
      <Route path="/adminLogin" element={<AdminLogin/>}/>
      <Route path="/adminCreateAccount" element={<AdminCreateAccount/>} />
      <Route path="/manageMemories" element={<ManageMemories/>}/>
    </Routes>   
  );
}

export default App;
