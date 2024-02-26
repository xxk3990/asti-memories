import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import Memories from './components/Memories';
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import AdminLogin from './components/admin/AdminLogin';
import AdminCreateAccount from './components/admin/AdminCreateAccount';
import ManageMemories from './components/admin/ManageMemories';
import MemoryForm from './components/MemoryForm';
import Home from './components/Home';
import GalleryImageUploader from './components/admin/GalleryImageUploader';
import Tribute from './components/Tribute';
function App() {
  return (
    <Routes>
      <Route element={<> <Navbar/> <Outlet /></>}>
      <Route path="/" element={<Home/>}/>
        <Route path="/memoryForm" element={<MemoryForm/>}/>
        <Route path="/memories" element={<Memories/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path ="/tribute" element={<Tribute/>}/>
        <Route path="/adminLogin" element={<AdminLogin/>}/>
        <Route path="/adminCreateAccount" element={<AdminCreateAccount/>} />
        <Route path="/manageMemories" element={<ManageMemories/>}/>
        <Route path="/galleryUpload" element={<GalleryImageUploader/>}/>
      </Route>
      
    </Routes>   
  );
}

export default App;
