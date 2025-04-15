import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = (params) => {
    const navigate = useNavigate();
    return (
        <nav className='text-white w-full p-3 flex bg-slate-800 justify-around items-center'>
            <div className="logo font-bold">
                <button onClick={()=>{navigate("/home")}} className='flex items-center gap-2'>
                    
                    Password Manager
                </button>
            </div>
            <div className='flex items-center gap-12'>
                <button className='text-white flex items-center gap-2'>
                    <img width={28} className='invert' src="icons/github.png" alt="" />
                    <span className='font-semibold'>Github</span>
                </button>
                {params.loggedin && <button onClick={() => params.handleLogout()} className='text-white flex font-semibold items-center gap-2'> Log Out </button>}
                {
                    !params.loggedin && (
                        <>
                            <button onClick={() => params.login()} className='text-white font-semibold flex items-center gap-2'> Login </button>
                            <button onClick={() => params.signup()} className='text-white font-semibold flex items-center gap-2'> Sign Up </button>
                        </>
                    )
                }

            </div>
        </nav>
    )
}

export default Navbar
