import { motion } from 'motion/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Sparkles } from 'lucide-react'
import { socket } from '../Contexts/SocketContext'
import type { UserData } from './MeetingLayout'
import { useUI } from '../Contexts/UIContext'

const CreateRoom: React.FC = () => {
    const nav = useNavigate()
    const [userSettings] = useUI("UserSettings") as unknown as [
        UserData,
        React.Dispatch<React.SetStateAction<UserData>>,
        () => void
    ];

    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    const AI_CHARACTER_OPTIONS = [
        {
            name: "Zephyr the Wise",
            description: "A knowledgeable and friendly AI ready to assist you.",
        },
        {
            name: "Luna the Creative",
            description: "An imaginative AI that sparks creativity and fun.",
        },
        {
            name: "Orion the Explorer",
            description: "An adventurous AI eager to explore new ideas with you.",
        }]

    function handleCreateRoom() {
        socket.once('onCreateSuccess', (meetingId) => {
            nav(`/meeting/${meetingId}`)
        })
        socket.emit('createMeeting', {
            "modelId": "54e3a85ac9594ffa83264b8a494b901b",
            "user": {
                userName: userSettings?.userName || "You",
                pronouns: userSettings?.pronouns || "they/them",
                bio: userSettings?.bio || ""
            }
        })
    }

    return (
        <div className="bg-primary-bg border overflow-auto w-full h-full flex flex-col justify-center items-center text-white border-zinc-800 rounded-2xl p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25, ease: "easeIn" }} className="w-full max-w-2xl bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl">Create Room</h2>
                    <button
                        onClick={() => nav("/")}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm mb-3 text-zinc-300">Choose AI Character</label>
                        <div className="grid gap-3">
                            {AI_CHARACTER_OPTIONS.map((character) => (
                                <button
                                    key={character.name}
                                    type="button"
                                    onClick={() => setSelectedCharacter(character.name)}
                                    aria-pressed={selectedCharacter === character.name}
                                    className={`outline-none focus:outline-none focus:bg-purple-500/10 flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left border-zinc-800 bg-zinc-800 hover:border-zinc-700 ${selectedCharacter === character.name ? 'ring-2 ring-purple-500' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-full bg-linear-to-br  flex items-center justify-center shrink-0`}>
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{character.name}</div>
                                        <div className="text-sm text-zinc-400">{character.description}</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full bg-purple-500 items-center justify-center shrink-0 ${selectedCharacter === character.name ? 'flex' : 'invisible'}`}>
                                        <Check className="w-3 h-3 " />
                                    </div>

                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateRoom}
                        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base transition-all h-12 px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
                    >
                        <Plus className="w-5 h-5" />
                        Create Room
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default CreateRoom