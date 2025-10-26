import { motion } from 'motion/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../Contexts/SocketContext'
import { useUI } from '../Contexts/UIContext'
import type { UserData } from './MeetingLayout'

const HomePage: React.FC = () => {
    const nav = useNavigate()
    const socket = useSocket()

    const [userSettings] = useUI("UserSettings") as unknown as [
        UserData,
        React.Dispatch<React.SetStateAction<UserData>>,
        () => void
    ];

    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, ease: "easeIn" }} className='flex flex-col'>
                {/* Title */}
                <div className='flex flex-col items-center'>
                    <span className='font-[inter] text-[36px] text-main-text'>Welcome</span>
                    <span className='font-[inter] text-[20px] text-accent-text'>Create a room or join with a PIN</span>
                </div>
                {/* Title */}

                <div className='grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 p-[34px] gap-4'>
                    <motion.button onClick={() => nav('/create')}
                        whileHover={{
                            borderColor: "var(--color-main-positive)",
                            transition: { delay: 0, duration: .3 }
                        }}
                        className='w-full max-w-[328px] aspect-328/236 gap-3 p-[34px] flex flex-col items-start bg-secondary-bg border border-main-border rounded-2xl cursor-pointer'
                    >
                        <div className='flex-center h-16 w-16 bg-main-positive rounded-full'>
                            <img src="/Icons/Plus.svg" alt="" />
                        </div>
                        <span className='font-[inter] font-medium text-[24px] text-main-text'>Create Room</span>
                        <span className='font-[inter] font-medium text-[16px] text-accent-text text-start'>Start a new chat room with an <br /> AI character and invite others</span>
                    </motion.button>

                    <motion.button
                        onClick={() => nav('/join')}
                        whileHover={{
                            borderColor: "var(--color-accent-positive)",
                            transition: { delay: 0, duration: .3 }
                        }}
                        className='w-full max-w-[328px] aspect-328/236 gap-3 p-[34px] flex flex-col items-start bg-secondary-bg border border-main-border rounded-2xl cursor-pointer'
                    >
                        <div className='flex-center h-16 w-16 bg-accent-positive rounded-full'>
                            <img src="/Icons/Join.svg" alt="" />
                        </div>
                        <span className='font-[inter] font-medium text-[24px] text-main-text'>Join Room</span>
                        <span className='font-[inter] font-medium text-[16px] text-accent-text text-start'>Enter a PIN to join an existing <br /> chat room</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

export default HomePage