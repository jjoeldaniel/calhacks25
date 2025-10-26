import { useState } from 'react';
import { RoomSelector } from './components/RoomSelector';
import { ChatInterface } from './components/ChatInterface';
import { UserProfileDialog } from './components/UserProfileDialog';

export interface UserProfile {
  name: string;
  pronouns: string;
  height: string;
  favoriteColor: string;
  bio: string;
}

export interface Room {
  id: string;
  name: string;
  aiCharacter: string;
  description: string;
  memberCount: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
  hasAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'rooms' | 'chat'>('rooms');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    pronouns: 'they/them',
    height: '',
    favoriteColor: '',
    bio: ''
  });
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleJoinRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentView('chat');
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentView('rooms');
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileDialog(false);
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden">
      {currentView === 'rooms' ? (
        <RoomSelector 
          onJoinRoom={handleJoinRoom}
          onOpenProfile={() => setShowProfileDialog(true)}
          userProfile={userProfile}
        />
      ) : (
        <ChatInterface 
          room={currentRoom!}
          userProfile={userProfile}
          onLeaveRoom={handleLeaveRoom}
          onOpenProfile={() => setShowProfileDialog(true)}
        />
      )}
      
      <UserProfileDialog
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        userProfile={userProfile}
        onSave={handleUpdateProfile}
      />
    </div>
  );
}

export default App;
