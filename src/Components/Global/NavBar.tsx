import { motion } from 'motion/react'
import React from 'react'
import { usePopup } from '../../Contexts/PopupContext'
import UserSettings from '../../Popups/UserSettings'

const NavBar : React.FC = () => {
    const [showPopup] = usePopup()

    return (
        <div className='w-full h-[90px] border border-main-border shrink-0 bg-main-bg flex justify-center'>
            <div className='w-full max-w-4xl py-6 px-4 flex items-center justify-between'>
                {/* Title */}
                <div className='font-[inter] font-medium text-[24px] text-main-text'>
                    <h1>AI Chat Rooms</h1>
                </div>
                {/* Title */}

                <motion.button onClick={() => showPopup(<UserSettings/>)} whileHover={{opacity:.8, background : "var(--color-accent-bg)"}} whileTap={'Tap'} initial={'Initial'} className='flex-center min-w-[88px] h-full border border-main-border rounded-lg cursor-pointer gap-[10px]'>
                    <img src="/Icons/Profile.svg" alt="" className='h-3.5' />
                    <span className='font-[inter] text-[14px] text-main-text'>User</span>
                </motion.button>

            </div>
        </div>
    )
}

export default NavBar