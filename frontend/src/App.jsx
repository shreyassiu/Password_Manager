import { useState } from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import SignUp from './pages/signup'
import Login from './pages/login'
import 'react-toastify/ReactToastify.css'
import RefreshHandler from './RefreshHandler'

function App() {
  const [isAuth, setisAuth] = useState(false)

  // const PrivateRoute = ({element})=>{
  //   return isAuth ? element : <Navigate to="/login"/>
  // }
  return (
    <>
      <div>
        <RefreshHandler setisAuth={setisAuth}/>
        <Routes>
          <Route path="/" element={<Navigate to  = "/home" />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
