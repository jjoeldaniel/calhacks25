import React, { useMemo, useState, useEffect, useRef } from "react";
import type { Message } from "../../Pages/MeetingPage";
import type { MeetingRoomData, UserData } from '../../Pages/MeetingLayout';
import { useUI } from "../../Contexts/UIContext";
import { AudioMessage } from './AudioMessage';
import { Sparkles } from "lucide-react";

const ChatInterface: React.FC = () => {
    const [MeetingInfo] = useUI("MeetingRoomData") as unknown as [
        MeetingRoomData,
        React.Dispatch<React.SetStateAction<MeetingRoomData>>,
        () => void
    ];
    const [userSettings] = useUI("UserSettings") as unknown as [
        UserData,
        React.Dispatch<React.SetStateAction<UserData>>,
        () => void
    ];

    console.log("User Settings in ChatInterface:", userSettings);

    const sampleMessages: Message[] = useMemo(() => [
        {
            userId: 'ai',
            userName: (MeetingInfo?.aiName) || 'Zephyr the Wise',
            content: 'Welcome to the room — feel free to ask me anything!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isAI: true,
            // AI messages include an audio chunk
            audioDuration: 12,
            audioUrl: '/buh.mp3'
        },
        {
            userId: 'user2',
            userName: 'Alex Chen',
            content: 'Hey everyone — excited to be here!',
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            isAI: false
        },
        {
            userId: 'user1',
            userName: userSettings.userName,
            content: "Hi Alex — glad you made it!",
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            isAI: false
        },
        {
            userId: 'ai2',
            userName: (MeetingInfo?.aiName) || 'Zephyr the Wise',
            content: 'Curious minds make the best conversations. What shall we explore first?',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            isAI: true,
            audioDuration: 16,
            audioUrl: '/buh.mp3'
        },
        {
            userId: 'user3',
            userName: 'Sarah Martinez',
            content: 'Has anyone tried the new dataset augmentation techniques?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isAI: false
        },
        {
            userId: 'user1b',
            userName: userSettings.userName,
            content: 'Not yet — but I can share some notes later.',
            timestamp: new Date(),
            isAI: false
        }
    ], [MeetingInfo?.aiName, userSettings.userName]);

    const [messages] = useState<Message[]>(sampleMessages);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex-1 min-h-0 bg-chat-bg overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => {
                  const isSelf = message.userName === userSettings.userName;
                  // Left-aligned (other users / AI)
                  if (!isSelf) {
                    return (
                      <div key={message.userName + String(message.timestamp)} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message.isAI ? 'bg-linear-to-br from-purple-500 to-pink-500' : 'bg-zinc-700'}`}>
                          {message.isAI ? <Sparkles className="w-5 h-5" /> : <span className="text-sm">{message.userName}</span>}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={message.isAI ? 'text-purple-400' : 'text-white'}>
                              {message.userName}
                            </span>
                            {message.isAI && (
                              <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">AI</span>
                            )}
                            <span className="text-xs text-zinc-500">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="text-zinc-300 wrap-break-word">{message.content}</p>
                          {/* Audio Message for AI */}
                          {message.isAI && (
                            <AudioMessage duration={message.audioDuration || 10} audioUrl={message.audioUrl || "/buh.mp3"} />
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Right-aligned (current user)
                  return (
                    <div key={message.userName + String(message.timestamp)} className="flex gap-3 justify-end">
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-baseline gap-2 mb-1 justify-end">
                          <span className={'text-white font-medium'}>{message.userName}</span>
                          <span className="text-xs text-zinc-500">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="inline-block bg-purple-600 text-white px-4 py-2 rounded-bl-2xl rounded-tl-2xl rounded-tr-lg wrap-break-word">{message.content}</p>
                      </div>

                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-zinc-700`}>
                        <span className="text-sm">{message.userName}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

export default ChatInterface