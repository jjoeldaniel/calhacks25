import React from 'react'
import { ArrowLeft, Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const nav = useNavigate();

  return (
    <div className='w-full h-[77px]'>
      <div className="border-b border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => nav("/")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 hover:bg-zinc-800 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              </div>
              <div>
                <h2 className="font-medium text-white">Room Name</h2>
                <p className="text-sm text-zinc-400">Room Character</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 text-white bg-zinc-800`}
            >
              <Users className="w-4 h-4" />
              <span>7</span>
            </button>
            <button
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 hover:bg-zinc-800 text-white"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Navbar