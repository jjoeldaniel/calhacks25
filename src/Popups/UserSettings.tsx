import React from 'react'
import { usePopup } from '../Contexts/PopupContext'
import { motion } from 'motion/react'

const UserSettings : React.FC = () => {
    const [, hidePopup] = usePopup()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{duration: 0.25}} className='w-[400px] p-6 bg-main-bg border border-main-border rounded-2xl flex flex-col'>
        <span className='font-[inter] text-[20px] text-main-text font-medium'>User Settings</span>
        // name
        <div className='flex flex-col gap-3'>
            <label className='font-[inter] text-[14px] text-accent-text'>Name</label>
            <input type="text" className='w-full h-10 px-3 bg-main-input-bg border border-main-border rounded-lg text-main-text font-[inter] text-[14px] focus:outline-none focus:border-main-positive transition-colors' placeholder='Enter your name'/>
        </div>
        // pronouns
        <div className='flex flex-col gap-3'>
            <label className='font-[inter] text-[14px] text-accent-text'>Pronouns</label>
            <input type="text" className='w-full h-10 px-3 bg-main-input-bg border border-main-border rounded-lg text-main-text font-[inter] text-[14px] focus:outline-none focus:border-main-positive transition-colors' placeholder='Enter your pronouns (e.g. he/him)'/>
        </div>
        // bio
        <div className='flex flex-col gap-3'>
            <label className='font-[inter] text-[14px] text-accent-text'>Bio</label>
            <textarea className='w-full h-20 px-3 py-2 bg-main-input-bg border border-main-border rounded-lg text-main-text font-[inter] text-[14px] focus:outline-none focus:border-main-positive transition-colors resize-none' placeholder='Enter a short bio about yourself'/>
        </div>
        <button onClick={() => hidePopup()} className='hover:bg-green-700 w-full h-10 bg-main-positive hover:bg-main-positive-hover text-white font-[inter] text-[14px] rounded-lg transition-colors mt-4'>Save Changes</button>
    </motion.div>
  )
}

export default UserSettings