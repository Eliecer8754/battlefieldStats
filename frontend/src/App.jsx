
import CardStats from './pages/CardStats';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogPage from './pages/LogPage';
import Menu from './components/Menu';
import { useState } from 'react';
const App = () => {
  const [togglePage, setTogglePage] = useState(false);
  const togglePageFunction = () => setTogglePage(prev=>!prev);
  return (
    <div className='h-full'>
      <Menu togglePageFunction={togglePageFunction} />
      {!togglePage ? <CardStats /> : <LogPage /> }
    </div>
    
  )
}

export default App
