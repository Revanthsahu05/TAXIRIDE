import React, { useContext } from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Userlogin from './Pages/Userlogin'
import Usersignup from './Pages/Usersignup'
import Captainsignup from './Pages/Captainsignup'
import Captainlogin from './Pages/Captainlogin'
import { Userdatacontext } from './context/Usercontext'
const App = () => {
  const ans=useContext(Userdatacontext)
  console.log(ans)
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Userlogin/>}/>
        <Route path="/Usersignup" element={<Usersignup/>}/>
        <Route path="/captain-login" element={<Captainlogin/>}/>
        <Route path="/captain-signup" element={<Captainsignup/>}/>
      </Routes>
    </div>
  )
}

export default App
