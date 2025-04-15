import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RefreshHandler = ({setisAuth}) => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('Token')){
            setisAuth(true)
            if(location.pathname != '/home' )
            {
                navigate("/home")
            }
        }
    },[location,navigate,setisAuth])
  return (
    <div>
     
    </div>
  )
}

export default RefreshHandler
