import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import Sidebar from '../Components/MeetingRoom/Sidebar'
import Navbar from '../Components/MeetingRoom/Navbar'
import { UIRegister, useUI } from '../Contexts/UIContext'
import { motion } from 'motion/react'
import { useSocket } from '../Contexts/SocketContext'
import type { Message } from './MeetingPage'

export interface UserData {
  headshot: string;
  userName: string;
  pronouns: string;
  role: string;
  bio: string;
}

export interface MeetingRoomData {
  loaded: boolean
  roomName: string;
  aiName: string;
  headshot: string;
  meetingId: string
  pastMessages : Message[];

  members: UserData[];
  sidebarOpen: boolean
}

const SidebarStateVariant = {
  Open: { x: 0, width: "240px" },
  Close: { x: 250, width: "0%" }
}

const MeetingLayout: React.FC = () => {
  const { id } = useParams();
  const socket = useSocket()

  UIRegister("UserSettings", {
    userName: localStorage.getItem("UserSettings:userName") || "",
    pronouns: localStorage.getItem("UserSettings:pronouns") || "",
    bio: localStorage.getItem("UserSettings:bio") || ""
  })

  UIRegister("MeetingRoomData", {
    loaded : false,
    headshot : "",
    meetingId: "",
    members: "",
    roomName : "",
    pastMessages : [],
    sidebarOpen: true,
  }, { removeOnUnmount: true })

  const [UserInfo] =useUI("UserSettings")
  const [MeetingRoomData,SetMeetingRoomData] = useUI('MeetingRoomData')

  useEffect(() => {
    socket.once("meetingInfo",(data) => {
      data['loaded'] = true
      SetMeetingRoomData(data)
    })
    
    socket.emit("getMeetingInfo",{
      meetingId: id
    })

    
    console.log('Called')
  
    return () => {
      socket.emit("leaveMeeting",{userName: UserInfo?.userName, meetingId: id})
    }
  }, [])

  useEffect(() => {
    socket.emit("joinMeeting",{userInfo:UserInfo  ,meetingId: id})
  
    return () => {
      
    }
  }, [UserInfo])
  
  

  
  const [MeetingInfo] = useUI("MeetingRoomData") as unknown as [
    MeetingRoomData,
    React.Dispatch<React.SetStateAction<MeetingRoomData>>
  ];

  return (
    <div className='flex w-full h-dvh'>
      <main className='w-full h-full flex flex-col'>
        <Navbar />
        <Outlet />
      </main>
      <motion.div variants={SidebarStateVariant} animate={MeetingInfo?.sidebarOpen ? "Open" : "Close"} className='md:flex hidden'>
        <Sidebar />
      </motion.div>
    </div>
  )
}

export default MeetingLayout