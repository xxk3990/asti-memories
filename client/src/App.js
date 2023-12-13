import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import Memories from './components/Memories';
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Landing from './components/Landing';
function App() {
  return (
    <Routes>
      <Route element={<> <Navbar/> <Outlet /></>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/memories" element={<Memories/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
      </Route>
    </Routes>   
  );
}

export default App;
