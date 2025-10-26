import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/MeetingRoom/Sidebar'
import Navbar from '../Components/MeetingRoom/Navbar'
import { UIRegister } from '../Contexts/UIContext'

export interface UserData {
  headshot : string;
  username : string;
  role: string;
  pronouns: string
}

export interface MeetingRoomData {
  totalActiveUsers : number;
  roomName: string;
  aiName: string;
  aiIcon: string;

  activeUsers: [UserData]
}

const MeetingLayout : React.FC = () => {
  UIRegister("MeetingRoomData",{
    totalActiveUsers : 0,
    roomName: "2332",
    aiName: "Zephyr the Wise",
    aiIcon: "",

    activeUsers: [
      {
        headshot: "",
        username: "",
        role: "AI CHARACTER",
        pronouns: "he/him"
      }
    ]
  },{removeOnUnmount:true})

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