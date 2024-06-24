import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import Memories from './components/Memories';
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import AdminLogin from './components/admin/AdminLogin';
import AdminCreateAccount from './components/admin/AdminCreateAccount';
import MemoryForm from './components/MemoryForm';
import Home from './components/Home';
import GalleryImageUploader from './components/admin/GalleryImageUploader';
import Tribute from './components/Tribute';
import { ApproveMemories } from './components/admin/ApproveMemories';
import DeleteMemories from './components/admin/DeleteMemories';
import Timeline from './components/Timeline';
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
        <Route path="/deleteMemories" element={<DeleteMemories/>}/>
        <Route path="/galleryUpload" element={<GalleryImageUploader/>}/>
        <Route path="/approveMemories" element={<ApproveMemories/>}/>
        <Route path="/timeline" element={<Timeline/>}/>
      </Route>
      
    </Routes>   
  );
}

export default App;
