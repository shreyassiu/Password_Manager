import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import RefreshHandler from '../RefreshHandler'
import { jwtDecode } from 'jwt-decode'
const url = import.meta.env.VITE_API_PRODUCTS_URL


const home = () => {
  const navigate = useNavigate()
  const [loggedInUser, setLoggedInUser] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setisAuth] = useState(false)
  const ref = useRef()
  const passRef = useRef()
  const [form, setForm] = useState({ email: "", site: "", username: "", password: "", id: "" })
  const [passwordArray, setPasswordArray] = useState([])

  const getPasswords = async () => {
    const token = localStorage.getItem('Token');
    const email = localStorage.getItem('loggedInUser'); // Retrieve email from localStorage
    const req = await fetch(url, {
      headers: {
        Authorization: token,
        Email: email, // Send email in headers
      },
    })
    let passwords = await req.json();
    setPasswordArray(passwords.map(password => ({ ...password, id: password._id })));
    setIsLoading(false)
    console.log(isLoading)
  };
  const checkTokenValidity = () => {
    const token = localStorage.getItem('Token');
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp > currentTime; // Check if token is still valid
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('Token')) {
      if (!checkTokenValidity()) {
        alert('Session expired. Please log in again.');
        handleLogout(); // Log the user out
      } else {
        setisAuth(true)
        const user = localStorage.getItem('loggedInUser');
        setLoggedInUser(user);
        setForm({ ...form, email: user });
        getPasswords();
      }
    }
    else{
      setisAuth(false)
      setIsLoading(false)
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("loggedInUser")
    handleSuccess("Logging out...")
    setTimeout(() => {
      setLoggedInUser("")
      navigate("/login")
    }, 2000)
  }
  const showPassword = () => {
    passRef.current.type = passRef.current.type === "password" ? "text" : "password";
    if (ref.current.src.includes("/icons/hide.png"))
      ref.current.src = "/icons/eye.png"
    else
      ref.current.src = "/icons/hide.png"
  }
  const savePassword = async () => {
    if(!localStorage.getItem("Token")){
      toast('Please login to save passwords', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
      return;
    }
    
    if (form.site !== "" && form.username !== "" && form.password !== "") {
      const existingPassword = passwordArray.find((item) => item.id === form.id);
      if (existingPassword) {
        // Update the existing password in the database
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem("Token")
          },
          body: JSON.stringify({ ...form, _id: form.id }),
        });
        setPasswordArray(
          passwordArray.map((item) =>
            item.id === form.id ? { ...form } : item
          )
        );
      } else {
        const email = localStorage.getItem('loggedInUser');
        const newPassword = { ...form,email ,id: uuidv4() };
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem("Token")
          },
          body: JSON.stringify(newPassword),
        });
        setPasswordArray([...passwordArray, newPassword]);
      }

      setForm({ site: "", username: "", password: "", id: "" });
      toast('Password Saved', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
    } else {
      toast('Please fill all the fields', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
    }
  };
  const deletePassword = async (id) => {
    let c = confirm("Do you wish to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": localStorage.getItem("Token")
        },
        body: JSON.stringify({ id }),
      });
      toast('Password Deleted', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
    }
  };
  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    setForm({ ...passwordToEdit }); // Preserve the `_id` in the form state
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const copyText = async (text) => {
    await navigator.clipboard.writeText(text)
    toast('Copied to clipboard', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  }
  const loggingIn = () => {
    navigate("/login")
  }
  const signingUp = () => {
    navigate("/signup")
  }
  return (
    <div>
      <RefreshHandler setisAuth={setisAuth} />
      <Navbar loggedin={isAuth} handleLogout={handleLogout} login={loggingIn} signup={signingUp} />
      <div className='p-2 md:container mx-auto'>
        <div className="p-10 text-center mx-auto">
          <h1 className="logo text-3xl font-semibold">
            Your own password manager
          </h1>
          {/* <p className='text-purple-900 text-lg' >Your own password manager</p> */}

          <div className="text-white flex flex-col p-4 gap-3">
            <input
              onChange={handleChange}
              className="p-1 px-3 text-black rounded-lg w-full border border-slate-700"
              value={form.site}
              type="text"
              name="site"
              id="site"
              placeholder="Website URL"

            />
            <div className="flex flex-col md:flex-row w-full justify-between gap-4">
              <input
                onChange={handleChange}
                className="w-full p-1 px-3 text-black rounded-lg border border-slate-700"
                value={form.username}
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
              <div className="w-full relative">
                <input
                  ref={passRef}
                  onChange={handleChange}
                  className="w-full p-1 px-3 text-black rounded-lg border border-slate-700"
                  value={form.password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <span
                  onClick={showPassword}
                  className="text-black absolute right-2 cursor-pointer"
                >
                  <img
                    ref={ref}
                    className="p-1"
                    width={35}
                    src="icons/eye.png"
                    alt=""
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={savePassword}
              className="gap-2 px-4 py-2 flex items-center justify-center rounded-full text-white bg-slate-700 hover:bg-slate-600 font-semibold"
            >
              <lord-icon
                src="https://cdn.lordicon.com/sbnjyzil.json"
                trigger="hover"
                colors="primary:#ffffff,secondary:#ffffff"
              ></lord-icon>
              Save
            </button>
          </div>

          <div className="Passwords mt-8">
            <h2 className="font-semibold text-2xl py-4 text-center md:text-left">
              Your Passwords
            </h2>
            {isLoading && <div className="text-center">Loading....</div>}
            {(!isLoading && isAuth && passwordArray.length === 0) && (
              <div className="text-center">No passwords to show</div>
            )}
            {!isLoading && !isAuth && (
              <div className="text-center">Login to see passwords</div>
            )}
            {passwordArray.length !== 0 && (
              <div className="overflow-x-auto">
                <table className="table-auto w-full rounded-md overflow-hidden">
                  <thead className="bg-slate-700 text-white">
                    <tr>
                      <th className="py-2 text-sm md:text-base">Website</th>
                      <th className="py-2 text-sm md:text-base">Username</th>
                      <th className="py-2 text-sm md:text-base">Password</th>
                      <th className="py-2 text-sm md:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-100">
                    {passwordArray.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center min-w-20 py-2 text-sm md:text-base">
                          <div className="flex items-center justify-center gap-1">
                            <a href={item.site} target="_blank">
                              {item.site}
                            </a>
                            <lord-icon
                              className="cursor-pointer"
                              onClick={() => copyText(item.site)}
                              src="https://cdn.lordicon.com/lyrrgrsl.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </td>
                        <td className="text-center min-w-20 py-2 text-sm md:text-base">
                          <div className="flex items-center justify-center gap-1">
                            {item.username}
                            <lord-icon
                              className="cursor-pointer"
                              onClick={() => copyText(item.username)}
                              src="https://cdn.lordicon.com/lyrrgrsl.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </td>
                        <td className="text-center min-w-20 py-2 text-sm md:text-base">
                          <div className="flex items-center justify-center gap-1">
                            {item.password}
                            <lord-icon
                              className="cursor-pointer"
                              onClick={() => copyText(item.password)}
                              src="https://cdn.lordicon.com/lyrrgrsl.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </td>
                        <td className="text-center min-w-20 py-2 text-sm md:text-base">
                          <div className="flex items-center justify-center gap-2">
                            <span>
                              <lord-icon
                                src="https://cdn.lordicon.com/hwjcdycb.json"
                                trigger="hover"
                                colors="primary:#121331,secondary:#000000"
                                className="cursor-pointer"
                                onClick={() => deletePassword(item.id)}
                              ></lord-icon>
                            </span>
                            <span>
                              <lord-icon
                                src="https://cdn.lordicon.com/exymduqj.json"
                                trigger="hover"
                                stroke="bold"
                                state="hover-line"
                                colors="primary:#121331,secondary:#000000"
                                style={{ width: "25px", height: "25px" }}
                                className="cursor-pointer"
                                onClick={() => editPassword(item.id)}
                              ></lord-icon>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default home
