import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/MeetingRoom/Sidebar'
import Navbar from '../Components/MeetingRoom/Navbar'

const MeetingLayout : React.FC = () => {
  return (
    <div className='flex w-full h-dvh'>
        <main className='w-full h-full flex flex-col'>
            <Navbar/>
            <Outlet/>
        </main>
        <div className='md:flex hidden'>
            <Sidebar/>
        </div>
    </div>
  )
}

export default MeetingLayout