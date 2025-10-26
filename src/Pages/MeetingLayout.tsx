import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/MeetingRoom/Sidebar'
import Navbar from '../Components/MeetingRoom/Navbar'
import { UIRegister, useUI } from '../Contexts/UIContext'
import { motion } from 'motion/react'

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
  sidebarOpen: boolean
}

const SidebarStateVariant = {
  Open : {x:0,width:"240px"},
  Close : {x:250,width:"0%"}
}

const MeetingLayout : React.FC = () => {
  UIRegister("MeetingRoomData",{
    totalActiveUsers : 0,
    roomName: "2332",
    aiName: "Zephyr the Wise",
    aiIcon: "",

    sidebarOpen : true,

    activeUsers: [
      {
        headshot: "",
        username: "",
        role: "AI CHARACTER",
        pronouns: "he/him"
      }
    ]
  },{removeOnUnmount:true})
  const [MeetingInfo] = useUI("MeetingRoomData") as unknown as [
    MeetingRoomData,
    React.Dispatch<React.SetStateAction<MeetingRoomData>>
  ];

  return (
    <div className='flex w-full h-dvh'>
        <main className='w-full h-full flex flex-col'>
            <Navbar/>
            <Outlet/>
        </main>
        <motion.div variants={SidebarStateVariant} animate={MeetingInfo?.sidebarOpen ? "Open" : "Close"} className='md:flex hidden'>
            <Sidebar/>
        </motion.div>
    </div>
  )
}

export default MeetingLayout