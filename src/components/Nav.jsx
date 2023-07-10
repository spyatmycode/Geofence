import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';


import {
  FaHome,
  FaUser,
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaSignOutAlt,
  FaListAlt,
  FaMap,
  FaMapMarkedAlt,
  FaMapMarked,
  FaMapPin,
  FaRegMap,
  FaPen
} from 'react-icons/fa';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CircularNav from './CircularNav';




const NavBar = () => {
  const navigate = useNavigate()
  const [navExpand, setNavExpand] = useState(false);

  const toggleFunc = () => {
    setNavExpand(!navExpand);
  };

  const sidebar =
    'dark:bg-[#21334C] bg-[#E4E9F7] hidden lg:block  h-full fixed left-0 pb-10 pl-7  top-0 transition-all duration-500 w-1/5 z-10 ';

  const sidebarClose =
    'dark:bg-[#21334C] bg-[#E4E9F7] h-full pb-10 fixed left-0 hidden lg:block   top-0 transition-all duration-500 w-28  z-10';

  const handleSignOut = async () => {
    try {
      await signOut(auth).then(() => {
        navigate("/auth")
      })

    } catch (error) {
      toast.error(`${error.message}`)
    }
  }

  return (
    <>
      
      <div className='flex w-screen'>
      
        <nav className={` ${!navExpand ? sidebarClose : sidebar}`}>
          {/* header */}
          <header>
            <div className='pl-10'>
              {/* <div className='flex flex-col'>
              {navExpand && (
                <span className='text-base font-medium mt-5'>LeetCode</span>
              )}
              {navExpand && (
                <span className='text-base font-semibold transition-all duration-500 '>By DevReporters</span>
              )}
            </div> */}
            </div>
            <button
              className='absolute right-3 top-14  translate-x-full rounded-full bg-blue-500 text-white flex items-center justify-center w-6 h-6 transition-all duration-300 cursor-pointer'
              onClick={toggleFunc}
            >
              {navExpand ? <FaChevronCircleLeft /> : <FaChevronCircleRight />}
            </button>
          </header>
          {/* menu bar */}
          <div className='flex flex-col h-screen pb-8 pt-6  '>
            {/* bar beginning */}
            <div className='mt-10'>
              <ul className='flex flex-col w-full list-none justify-center dark:text-white'>
              
                <li className='flex items-center list-none mt-10 px-10 pt-0 mb-10 h-10 pr-10  rounded-lg w-48'>
                  <Link
                    to='/home'
                    className=' flex items-center h-full no-underline rounded-md transition-all duration-200 w-full'
                  >
                    <FaHome size='20px' />
                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Home</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Home</span>}
                  </Link>
                </li>
                <li className='flex items-center list-none mt-10 px-10 pt-0 mb-10 h-10 pr-10   rounded-lg w-48'>
                  <Link
                    to='/dashboard'
                    className='flex items-center h-full no-underline rounded-md transition-all duration-300 w-full'
                  >
                    <FaListAlt size='20px' />
                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Dashboard</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Dashboard</span>}
                  </Link>
                </li>

                <li className='flex items-center list-none mt-10 px-10 pt-0 mb-10 h-10 pr-10   rounded-lg w-48'>
                  <Link
                    to='/geofence'
                    className='flex items-center h-full no-underline rounded-md transition-all duration-300 w-full'
                  >
                    <FaMapMarkedAlt size='20px' />
                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Geofences</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Profile</span>}
                  </Link>
                </li>


                <li className='flex items-center list-none mt-10 px-10 pt-0 mb-10 h-10 pr-10   rounded-lg w-48'>
                  <Link
                    to='/profile'
                    className='flex items-center h-full no-underline rounded-md transition-all duration-300 w-full'
                  >
                    <FaUser size='20px' />
                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Profile</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Profile</span>}
                  </Link>
                </li>
                {/* <li className='flex items-center list-none mt-10 px-10 pt-0 mb-10 h-10 pr-10   rounded-lg w-48'>
                  <Link
                    to='/home'
                    className='flex items-center h-full no-underline rounded-md transition-all duration-300 w-full'
                  >
                    <FaPen size='20px' />
                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Test</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Test</span>}
                  </Link>
                </li>
                */}
              </ul>
            </div>
            {/* bottom content beginning */}

            <div className='items-center pt-10 mt-[100px]'>
              <li className='flex pl-10 items-center h-10 list-none  rounded-lg w-48 dark:text-white'>
                <div onClick={handleSignOut} >
                  <Link
                    to='/'
                    className=' flex  items-center duration-700 transition-all '
                  >
                    <FaSignOutAlt size='20px' />

                    {navExpand ? (
                      <span className='ml-2 font-semibold opacity-1  transition-all duration-700'>Sign Out</span>
                    ) : <span className='ml-2 font-semibold opacity-0'>Sign Out</span>}

                  </Link>
                </div>
              </li>
            </div>
          </div>
        </nav>
        <div className={navExpand === true? 'h-full w-full lg:w-4/5 bg-gray-200  transition-all duration-500 fixed overflow-scroll right-0': 'w-full lg:w-[calc(100%-7rem)] h-full bg-[#06050523]  overflow-x-hidden fixed right-0 transition-all duration-500 '}>
        <CircularNav/>
          <Outlet />
        </div>
      </div>
    </>
  );
};
//bg-[#FAFBFD]
export default NavBar;
