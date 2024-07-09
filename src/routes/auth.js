import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../component/Auth/login/login'
import Signup from '../component/Auth/signup/signup'
import Forget from '../component/Auth/forget/forgetPasword';

function Auth() {
  return (
    <Routes>
            <Route index  element={<Signup />} />
            <Route  path='/Login' element={<Login />} />
            <Route path='/forget' element={<Forget />} />
    </Routes>
  );
}


export default Auth
