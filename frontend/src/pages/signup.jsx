import React, { use, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess, handleError } from '../utils'
import 'react-toastify/ReactToastify.css'
import Navbar from '../components/Navbar'
const url = import.meta.env.VITE_API_SIGNUP_URL



const signup = () => {

    const [signupInfo, setsignupInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [isLoading, setisLoading] = useState(false)
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copysignupInfo = { ...signupInfo }
        copysignupInfo[name] = value;
        setsignupInfo(copysignupInfo)
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError("Please fill all the fields")
        }
        setisLoading(true);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupInfo)
            })
            const data = await response.json()
            const { success, message, error } = data;
            if (success) {
                handleSuccess("Signup successful")
                setTimeout(() => {
                    setisLoading(false);
                    navigate("/login")
                }, 2000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details)
            } else if (!success) {
                handleError(message)
            }
            setisLoading(false);

        } catch (error) {
            handleError(error);
        }
    }
    const loggingIn = () => {
        navigate("/login")
    }
    const signingUp = () => {
        navigate("/signup")
    }
    return (
        <div>
            <Navbar login={loggingIn} signup={signingUp} />
            <div className="container w-full h-80vh flex flex-col justify-center items-center p-10 ">
                <div className='p-10 rounded-md flex flex-col gap-4 shadow-2xl'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-2xl font-mono'>Sign Up</h1>
                    </div>
                    <form onSubmit={handleSignup} className="flex flex-col gap-5" action="">
                        <div className='flex gap-1 flex-col'>
                            <label htmlFor='name'>Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                placeholder='Enter your name'
                                name='name'
                                autoFocus
                                className='p-1 rounded-md placeholder:italic'
                                value={signupInfo.name}
                            />
                        </div>
                        <div className='flex gap-1 flex-col'>
                            <label htmlFor='email'>Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                placeholder='Enter your email'
                                name='email'
                                className='p-1 rounded-md placeholder:italic'
                                value={signupInfo.email}
                            />
                        </div>
                        <div className='flex gap-1 flex-col'>
                            <label htmlFor='password'>Password</label>
                            <input
                                onChange={handleChange}
                                type="password"
                                placeholder='Enter your password'
                                name='password'
                                className='p-1 rounded-md placeholder:italic'
                                value={signupInfo.password}
                            />
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <button disabled={isLoading} type='submit' className='bg-slate-700 text-white flex justify-center items-center px-2 py-1 rounded-md hover:bg-slate-600 transition-all duration-200 ease-in-out w-[50%]'>
                            {!isLoading && "Sign up"}
                            {isLoading && <svg className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>}
                            </button>
                            <div>Already have an account? <Link to='/login' className='text-purple-900 underline'>Login</Link></div>
                        </div>
                    </form>
                </div>
                <ToastContainer position='top-center' autoClose={2000} theme='dark' />
            </div>
        </div>
    )
}

export default signup
