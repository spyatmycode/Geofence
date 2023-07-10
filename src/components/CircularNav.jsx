import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from "../firebase/firebase";

const CircularNav = () => {

  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut(auth).then(() => {
        localStorage.removeItem("userAuthGeofence")
        navigate("/auth")
      })

    } catch (error) {
      toast.error(`${error.message}`)
    }
  }
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-10 cursor-pointer bottom-10 z-50 list-none flex flex-col items-center">
      {open && (
        
          <nav className="mobile_l">
            <Link to={'/home'}><li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4">Home</li></Link>
            <Link to={'/dashboard'}><li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4">Dashboard</li></Link>
            <Link to={'/profile'}><li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4">Profile</li></Link>
            <Link to={'/'}><li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4">New</li></Link>
            <Link to={'/messaging'}><li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4">Messaging</li></Link>
            <li className="mobile_l  rounded-full shadow-lg w-[120px] bg-blue-600 text-center text-white p-5 m-4" onClick={handleSignOut}>SignOut</li>

            
          </nav>
       
      )}

      <div
        className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-blue-950 sticky"
        onClick={() => setOpen(!open)}
      >
        {!open && <FaBars size={25} color="white" />}
        {open && <FaTimes size={25} color="white" />}
      </div>
    </div>
  );
};

export default CircularNav;
