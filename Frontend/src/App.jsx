import React, { useContext } from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Userlogin from './Pages/Userlogin'
import Usersignup from './Pages/Usersignup'
import Captainsignup from './Pages/Captainsignup'
import Captainlogin from './Pages/Captainlogin'
import { Userdatacontext } from './context/Usercontext'
import Userlogout from './Pages/Userlogout'
import Start from './Pages/Start'
import Userprotectwrapper from './Pages/Userprotectwrapper'
import Captainhome from './Pages/Captainhome'
import Captainprotectwrapper from './Pages/Captainprotectwrapper'
import Riding from './Pages/Riding'
import Captainriding from './components/Captainriding'
const App = () => {
  const ans=useContext(Userdatacontext)
  // console.log(ans)
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/Usersignup" element={<Usersignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<Captainsignup />} />
        <Route path='/riding' element={<Riding></Riding>}></Route>
        <Route
          path="/home"
          element={
            <Userprotectwrapper>
              <Home />
            </Userprotectwrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <Userprotectwrapper>
              <Userlogout />
            </Userprotectwrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <Captainprotectwrapper>
              <Captainhome></Captainhome>
            </Captainprotectwrapper>
          }
        ></Route>
        <Route
        path='/captainriding' element={<Captainriding/>}>
        </Route>
      </Routes>
    </div>
  );
}

export default App
