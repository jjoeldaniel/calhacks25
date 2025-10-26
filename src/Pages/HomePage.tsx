import { motion } from 'motion/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage : React.FC = () => {
    const nav = useNavigate()
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='flex flex-col'>
                {/* Title */}
                <div className='flex flex-col items-center'>
                    <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}} className='font-[inter] text-[36px] text-main-text'>Welcome</motion.span>
                    <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}} className='font-[inter] text-[20px] text-accent-text'>Create a room or join with a PIN</motion.span>
                </div>
                {/* Title */}

                <div className='grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 p-[34px] gap-4'>
                    <motion.button initial={{opacity:0}} animate={{opacity:1,transition:{delay:.1}}} 
                        whileHover={{
                            borderColor : "var(--color-main-positive)",
                            transition: {delay:0,duration:.3}
                        }}
                        className='w-full max-w-[328px] aspect-328/236 gap-3 p-[34px] flex flex-col items-start bg-main-bg border border-main-border rounded-2xl cursor-pointer'
                    >
                        <div className='flex-center h-16 w-16 bg-main-positive rounded-full'>
                            <img src="/Icons/Plus.svg" alt="" />
                        </div>
                        <span className='font-[inter] font-medium text-[24px] text-main-text'>Create Room</span>
                        <span className='font-[inter] font-medium text-[16px] text-accent-text text-start'>Start a new chat room with an <br/> AI character and invite others</span>
                    </motion.button>

                    <motion.button onClick={() => nav('/join')} initial={{opacity:0}} animate={{opacity:1,transition:{delay:.2}}} 
                        whileHover={{
                            borderColor : "var(--color-accent-positive)",
                            transition: {delay:0,duration:.3}
                        }}
                        className='w-full max-w-[328px] aspect-328/236 gap-3 p-[34px] flex flex-col items-start bg-main-bg border border-main-border rounded-2xl cursor-pointer'
                    >
                        <div className='flex-center h-16 w-16 bg-accent-positive rounded-full'>
                            <img src="/Icons/Join.svg" alt="" />
                        </div>
                        <span className='font-[inter] font-medium text-[24px] text-main-text'>Join Room</span>
                        <span className='font-[inter] font-medium text-[16px] text-accent-text text-start'>Enter a PIN to join an existing <br/> chat room</span>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default HomePage