import { motion } from 'motion/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonVariant from '../Variants/ButtonVariant'

const JoinPage : React.FC = () => {
    const nav = useNavigate()
    const [CurrentPin, setCurrentPin] = useState("")

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5, ease:"easeIn"}} 
                className='w-full max-w-2xl h-[430px] flex flex-col p-[33px] bg-secondary-bg rounded-2xl gap-6'
            >
                {/* Top Bar */}
                <div className='w-full justify-between flex font-[inter] font-medium items-center'>
                    <span className='text-[30px] text-main-text'>Join Room</span>
                    <motion.span whileHover={{color:"#ffff"}} transition={{duration:.5}} onClick={() => nav('/')} className='text-[16px] text-accent-text cursor-pointer'>Cancel</motion.span>
                </div>
                {/* Top Bar */}

                {/* Content */}
                <div className='flex flex-col gap-8 items-center'>
                    {/* Icon */}
                    <div className='gap-4 flex flex-col items-center'>
                        <div className='flex-center h-16 w-16 bg-accent-positive rounded-full'>
                            <img src="/Icons/Join.svg" alt="" />
                        </div>
                        <span className='font-[inter] text-[16px] text-accent-text'>Enter the 6-digit PIN to join a room</span>
                    </div>
                    {/* Icon */}

                    {/* Input */}
                    <input type="number" value={CurrentPin} onChange={(event : React.ChangeEvent<HTMLInputElement>) => {
                        console.log((event.target.value).length , event.target.maxLength )
                        if ((event.target.value).length > event.target.maxLength ) return
                        setCurrentPin(event.target.value)
                    }} maxLength={6} placeholder='000000' className='w-full h-20 px-6 bg-accent-bg rounded-[10px] font-[inter] text-[36px] text-[#52525C] outline-0' />

                    <motion.button onClick={() => nav("/meeting/123")} variants={ButtonVariant} whileHover={'Hover'} whileTap={"Tap"} className='w-full h-12 flex items-center justify-center bg-[#0092B8] rounded-[10px] gap-2 cursor-pointer disabled:pointer-events-none'>
                        <img src="/Icons/Join.svg" alt="" className='h-[15px]' />
                        <span className='font-[inter] text-[16px] text-main-text'>Join Room</span>
                    </motion.button>
                </div>
                {/* Content */}

            </motion.div>
        </div>
    )
}

export default JoinPage