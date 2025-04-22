import React, { createContext } from 'react'
import { useState } from 'react'
export const Userdatacontext=createContext()
const Usercontext = ({children}) => {
  const [ridedata, setridedata] = useState({});
    const [user, setuser] = useState({
        email:'',
        fullname:{
            firstname:'',
            lastname:'',
        }
    })
  return (
    <div>
      <Userdatacontext.Provider value={{user, setuser,ridedata,setridedata}}>
        {children}
      </Userdatacontext.Provider>
    </div>
  );
}

export default Usercontext
