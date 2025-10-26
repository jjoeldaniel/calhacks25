import { useState } from 'react';
import { type Room, type UserProfile } from '../App';
import { Modal } from './Modal';
import { Users, Plus, Sparkles, User, LogIn, QrCode, Copy, Check } from 'lucide-react';

interface RoomSelectorProps {
  onJoinRoom: (room: Room) => void;
  onOpenProfile: () => void;
  userProfile: UserProfile;
}

type View = 'home' | 'create' | 'join' | 'room-created';

const AI_CHARACTER_OPTIONS = [
  { name: 'Zephyr the Wise', description: 'An ancient wizard full of wisdom', color: 'from-purple-500 to-blue-500' },
  { name: 'Nova the Explorer', description: 'An intergalactic space traveler', color: 'from-cyan-500 to-purple-500' },
  { name: 'Inspector Argyle', description: 'A brilliant detective', color: 'from-amber-500 to-red-500' },
  { name: 'Jester Jim', description: 'A hilarious comedian', color: 'from-pink-500 to-yellow-500' }
];

export function RoomSelector({ onJoinRoom, onOpenProfile, userProfile }: RoomSelectorProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [rooms, setRooms] = useState<Map<string, Room>>(new Map());
  const [joinPin, setJoinPin] = useState('');
  const [joinError, setJoinError] = useState('');
  const [copiedPin, setCopiedPin] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    aiCharacter: 'Zephyr the Wise',
    description: ''
  });
  const [createdRoomPin, setCreatedRoomPin] = useState('');

  const generatePin = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateQRCodeUrl = (pin: string): string => {
    const url = `${window.location.origin}?pin=${pin}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const handleCreateRoom = () => {
    if (!newRoom.name || !newRoom.aiCharacter) {
      return;
    }

    const pin = generatePin();
    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      aiCharacter: newRoom.aiCharacter,
      description: newRoom.description,
      memberCount: 1
    };

    const newRooms = new Map(rooms);
    newRooms.set(pin, room);
    setRooms(newRooms);
    setCreatedRoomPin(pin);
    setCurrentView('room-created');
  };

  const handleJoinRoom = () => {
    const pin = joinPin.trim();
    if (!pin) {
      setJoinError('Please enter a PIN');
      return;
    }

    const room = rooms.get(pin);
    if (!room) {
      setJoinError('Invalid PIN. Please check and try again.');
      return;
    }

    // Increment member count
    room.memberCount += 1;
    onJoinRoom(room);
  };

  const handleEnterCreatedRoom = () => {
    const room = rooms.get(createdRoomPin);
    if (room) {
      onJoinRoom(room);
    }
  };

  const handleCopyPin = async () => {
    await navigator.clipboard.writeText(createdRoomPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const resetToHome = () => {
    setCurrentView('home');
    setNewRoom({ name: '', aiCharacter: 'Zephyr the Wise', description: '' });
    setJoinPin('');
    setJoinError('');
    setCreatedRoomPin('');
    setCopiedPin(false);
  };

  const handleJoinPinChange = (value: string) => {
    // Only allow digits and max 6 characters
    const sanitized = value.replace(/\D/g, '').slice(0, 6);
    setJoinPin(sanitized);
    setJoinError('');
  };

  const handleJoinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl">AI Chat Rooms</h1>
          </div>
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-4 py-2 border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <User className="w-4 h-4" />
            {userProfile.name}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Home View */}
          {currentView === 'home' && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl mb-3">Welcome!</h2>
                <p className="text-xl text-zinc-400">Create a room or join with a PIN</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Create Room Card */}
                <button
                  onClick={() => setCurrentView('create')}
                  className="group relative bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-8 hover:border-purple-500 transition-all hover:scale-105 text-left"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl mb-2">Create Room</h3>
                  <p className="text-zinc-400">Start a new chat room with an AI character and invite others</p>
                </button>

                {/* Join Room Card */}
                <button
                  onClick={() => setCurrentView('join')}
                  className="group relative bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-8 hover:border-cyan-500 transition-all hover:scale-105 text-left"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LogIn className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl mb-2">Join Room</h3>
                  <p className="text-zinc-400">Enter a PIN to join an existing chat room</p>
                </button>
              </div>
            </div>
          )}

          {/* Create Room View */}
          {currentView === 'create' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl">Create Room</h2>
                <button
                  onClick={resetToHome}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="room-name" className="block text-sm mb-2 text-zinc-300">Room Name</label>
                  <input
                    id="room-name"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    placeholder="My Awesome Chat Room"
                    className="h-11 w-full rounded-lg border px-4 py-2 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-3 text-zinc-300">Choose AI Character</label>
                  <div className="grid gap-3">
                    {AI_CHARACTER_OPTIONS.map((character) => (
                      <button
                        key={character.name}
                        onClick={() => setNewRoom({ ...newRoom, aiCharacter: character.name })}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                          newRoom.aiCharacter === character.name
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-zinc-800 bg-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center flex-shrink-0`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{character.name}</div>
                          <div className="text-sm text-zinc-400">{character.description}</div>
                        </div>
                        {newRoom.aiCharacter === character.name && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm mb-2 text-zinc-300">Description (Optional)</label>
                  <textarea
                    id="description"
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    placeholder="What's this room about?"
                    className="min-h-24 w-full rounded-lg border px-4 py-3 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoom.name}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base transition-all h-12 px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
                >
                  <Plus className="w-5 h-5" />
                  Create Room
                </button>
              </div>
            </div>
          )}

          {/* Room Created View */}
          {currentView === 'room-created' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-3xl mb-2">Room Created!</h2>
                <p className="text-zinc-400">Share this PIN with others to let them join</p>
              </div>

              <div className="space-y-6">
                {/* PIN Display */}
                <div className="bg-zinc-800 border-2 border-zinc-700 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-sm text-zinc-400 mb-2">Room PIN</div>
                    <div className="text-5xl tracking-wider mb-4 font-mono">{createdRoomPin}</div>
                    <button
                      onClick={handleCopyPin}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-all h-10 px-4 py-2 bg-zinc-700 text-white hover:bg-zinc-600"
                    >
                      {copiedPin ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy PIN
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-zinc-800 border-2 border-zinc-700 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-sm text-zinc-400 mb-4">Or scan QR Code</div>
                    <div className="inline-block p-4 bg-white rounded-xl">
                      <img 
                        src={generateQRCodeUrl(createdRoomPin)} 
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={resetToHome}
                    className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base transition-all h-12 px-6 py-3 border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={handleEnterCreatedRoom}
                    className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base transition-all h-12 px-6 py-3 bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Enter Room
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Join Room View */}
          {currentView === 'join' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl">Join Room</h2>
                <button
                  onClick={resetToHome}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-10 h-10" />
                  </div>
                  <p className="text-zinc-400">Enter the 6-digit PIN to join a room</p>
                </div>

                <div>
                  <input
                    type="text"
                    value={joinPin}
                    onChange={(e) => handleJoinPinChange(e.target.value)}
                    onKeyPress={handleJoinKeyPress}
                    placeholder="000000"
                    maxLength={6}
                    className={`h-20 w-full rounded-lg border-2 px-6 text-4xl text-center tracking-widest font-mono bg-zinc-800 text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                      joinError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-zinc-700 focus:border-cyan-500'
                    }`}
                  />
                  {joinError && (
                    <p className="text-red-500 text-sm mt-2 text-center">{joinError}</p>
                  )}
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={joinPin.length !== 6}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base transition-all h-12 px-6 py-3 bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-600"
                >
                  <LogIn className="w-5 h-5" />
                  Join Room
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
