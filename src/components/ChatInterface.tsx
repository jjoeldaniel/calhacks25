import { useState, useRef, useEffect } from 'react';
import { type Room, type UserProfile, type Message } from '../App';
import { ArrowLeft, Send, Sparkles, User, Users } from 'lucide-react';
import { AudioMessage } from './AudioMessage';
import { MemberList, type Member } from './MemberList';

interface ChatInterfaceProps {
  room: Room;
  userProfile: UserProfile;
  onLeaveRoom: () => void;
  onOpenProfile: () => void;
}

// Mock AI responses based on character personalities
const AI_PERSONALITIES: Record<string, { greeting: string; responseStyle: string[] }> = {
  'Zephyr the Wise': {
    greeting: 'Greetings, seeker of knowledge! What mysteries shall we unravel today?',
    responseStyle: [
      'Ah, an interesting perspective! In my centuries of study, I\'ve found that',
      'The ancient texts speak of such matters. Let me share what I know:',
      'Fascinating! Your question reminds me of a time when',
      'Wise words indeed! As the old saying goes,'
    ]
  },
  'Nova the Explorer': {
    greeting: 'Hey there, space traveler! Ready to explore the cosmos together?',
    responseStyle: [
      'You know, on the planet Zephron-7, I encountered something similar!',
      'Fascinating! In all my travels across the galaxy, I\'ve learned that',
      'That reminds me of my journey through the Andromeda sector where',
      'Great question! Back when I was navigating the nebula fields,'
    ]
  },
  'Inspector Argyle': {
    greeting: 'Good day. I\'ve been expecting you. What case shall we solve today?',
    responseStyle: [
      'Hmm, interesting clue. My deductive reasoning suggests that',
      'Elementary! The evidence clearly points to the fact that',
      'Ah yes, I\'ve encountered such mysteries before. Let me analyze:',
      'Curious indeed. My investigation reveals that'
    ]
  },
  'Jester Jim': {
    greeting: 'Hey hey! Welcome to the fun zone! Got any good jokes for me?',
    responseStyle: [
      'Haha! That\'s hilarious! You know what else is funny?',
      'Oh man, that reminds me of the time when',
      'LOL! Speaking of which, did you hear the one about',
      'Classic! You\'ve got great taste in humor. Here\'s another one:'
    ]
  }
};

// Generate fake conversation history with multiple users
const generateFakeMessages = (room: Room, currentUserName: string): Message[] => {
  const now = new Date();
  const getTimeAgo = (minutesAgo: number) => {
    const date = new Date(now.getTime() - minutesAgo * 60000);
    return date;
  };

  const otherUsers = [
    { id: 'user2', name: 'Alex Chen', pronouns: 'they/them' },
    { id: 'user3', name: 'Sarah Martinez', pronouns: 'she/her' },
    { id: 'user4', name: 'Marcus Johnson', pronouns: 'he/him' },
    { id: 'user5', name: 'Emma Wilson', pronouns: 'she/her' }
  ];

  // Different conversation patterns for each room
  const conversations: Record<string, Message[]> = {
    '1': [ // Wizard's Tower
      {
        id: 'msg1',
        userId: 'user2',
        userName: 'Alex Chen',
        content: 'So I\'ve been reading about ancient runes lately...',
        timestamp: getTimeAgo(45),
        isAI: false
      },
      {
        id: 'msg2',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Ah, ancient runes! A fascinating subject indeed. The Elder Futhark is particularly powerful for divination and protection spells. Have you tried working with them?',
        timestamp: getTimeAgo(43),
        isAI: true,
        hasAudio: true,
        audioDuration: 12
      },
      {
        id: 'msg3',
        userId: 'user3',
        userName: 'Sarah Martinez',
        content: 'I actually visited some runestones in Sweden last summer! They were incredible.',
        timestamp: getTimeAgo(40),
        isAI: false
      },
      {
        id: 'msg4',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'The runestones of Sweden hold great power, Sarah! I recall a particularly magnificent stone at Rök that contains the longest runic inscription known to exist. Each rune carries the whispers of those who carved them centuries ago.',
        timestamp: getTimeAgo(38),
        isAI: true,
        hasAudio: true,
        audioDuration: 18
      },
      {
        id: 'msg5',
        userId: 'user4',
        userName: 'Marcus Johnson',
        content: 'Can runes actually be used for magic or is that just fantasy?',
        timestamp: getTimeAgo(35),
        isAI: false
      },
      {
        id: 'msg6',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'An excellent question, Marcus! Magic exists in the intention and focus we bring to our practices. Runes serve as conduits for our will, much like how words shape our reality. Whether one calls it magic, psychology, or manifestation, the power lies in the practitioner.',
        timestamp: getTimeAgo(32),
        isAI: true,
        hasAudio: true,
        audioDuration: 22
      }
    ],
    '2': [ // Cosmic Café
      {
        id: 'msg1',
        userId: 'user5',
        userName: 'Emma Wilson',
        content: 'Did anyone see the James Webb telescope images from last week?',
        timestamp: getTimeAgo(50),
        isAI: false
      },
      {
        id: 'msg2',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Oh absolutely! Those images of the Pillars of Creation were mind-blowing! You know, I actually flew past that region during my expedition to the Eagle Nebula. Seeing it up close was surreal - like swimming through cosmic poetry!',
        timestamp: getTimeAgo(48),
        isAI: true,
        hasAudio: true,
        audioDuration: 16
      },
      {
        id: 'msg3',
        userId: 'user2',
        userName: 'Alex Chen',
        content: 'What\'s the most beautiful planet you\'ve visited?',
        timestamp: getTimeAgo(45),
        isAI: false
      },
      {
        id: 'msg4',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Great question! I\'d have to say Kepler-452b. Imagine Earth, but with purple oceans and bioluminescent forests. The entire surface glows at night like a living galaxy. Plus, the locals make the best interstellar smoothies!',
        timestamp: getTimeAgo(42),
        isAI: true,
        hasAudio: true,
        audioDuration: 19
      },
      {
        id: 'msg5',
        userId: 'user3',
        userName: 'Sarah Martinez',
        content: 'Do you think we\'ll ever achieve faster-than-light travel?',
        timestamp: getTimeAgo(38),
        isAI: false
      },
      {
        id: 'msg6',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'In my experience across the cosmos, I\'ve seen civilizations crack that puzzle in fascinating ways - wormhole networks, quantum jumping, even one species that learned to fold space like origami! Humanity is on the right track with your theories. Keep pushing those boundaries!',
        timestamp: getTimeAgo(35),
        isAI: true,
        hasAudio: true,
        audioDuration: 21
      }
    ],
    '3': [ // Detective's Office
      {
        id: 'msg1',
        userId: 'user4',
        userName: 'Marcus Johnson',
        content: 'I love mystery novels. Any recommendations?',
        timestamp: getTimeAgo(55),
        isAI: false
      },
      {
        id: 'msg2',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Ah, a fellow connoisseur of the mysterious! I recommend "The Daughter of Time" by Josephine Tey. A detective solves a centuries-old mystery from his hospital bed using only historical documents. Brilliant deductive work!',
        timestamp: getTimeAgo(52),
        isAI: true,
        hasAudio: true,
        audioDuration: 15
      },
      {
        id: 'msg3',
        userId: 'user5',
        userName: 'Emma Wilson',
        content: 'What\'s the hardest case you\'ve ever solved?',
        timestamp: getTimeAgo(48),
        isAI: false
      },
      {
        id: 'msg4',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'The Case of the Vanishing Violinist. A renowned musician disappeared mid-performance, yet no one in the audience noticed until the music stopped. The solution? She had an identical twin, a ventriloquist, and a very elaborate life insurance scheme.',
        timestamp: getTimeAgo(45),
        isAI: true,
        hasAudio: true,
        audioDuration: 20
      },
      {
        id: 'msg5',
        userId: 'user2',
        userName: 'Alex Chen',
        content: 'That sounds like something from a movie!',
        timestamp: getTimeAgo(42),
        isAI: false
      },
      {
        id: 'msg6',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Indeed! Reality often surpasses fiction, my friend. The key to solving any mystery is observing what others overlook. The smallest detail can unravel the most complex deception.',
        timestamp: getTimeAgo(40),
        isAI: true,
        hasAudio: true,
        audioDuration: 13
      }
    ],
    '4': [ // Comedy Club
      {
        id: 'msg1',
        userId: 'user3',
        userName: 'Sarah Martinez',
        content: 'I need a good laugh today!',
        timestamp: getTimeAgo(40),
        isAI: false
      },
      {
        id: 'msg2',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'You came to the right place! Why don\'t scientists trust atoms? Because they make up everything! 😄',
        timestamp: getTimeAgo(38),
        isAI: true,
        hasAudio: true,
        audioDuration: 8
      },
      {
        id: 'msg3',
        userId: 'user4',
        userName: 'Marcus Johnson',
        content: 'Haha that\'s terrible! Got any better ones?',
        timestamp: getTimeAgo(36),
        isAI: false
      },
      {
        id: 'msg4',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Terrible?! That\'s the nicest thing anyone\'s ever said about my jokes! 😂 Okay okay, here\'s another: I told my wife she was drawing her eyebrows too high. She looked surprised!',
        timestamp: getTimeAgo(34),
        isAI: true,
        hasAudio: true,
        audioDuration: 11
      },
      {
        id: 'msg5',
        userId: 'user5',
        userName: 'Emma Wilson',
        content: 'LOL! These are actually making my day better 😆',
        timestamp: getTimeAgo(30),
        isAI: false
      },
      {
        id: 'msg6',
        userId: 'ai',
        userName: room.aiCharacter,
        content: 'Mission accomplished! Remember folks, laughter is the best medicine. Unless you have actual medical issues, then please see a real doctor. I\'m just a comedian! 🎭',
        timestamp: getTimeAgo(28),
        isAI: true,
        hasAudio: true,
        audioDuration: 14
      }
    ]
  };

  return conversations[room.id] || [];
};

// Generate member list for the room
const generateMembers = (room: Room, currentUserName: string, currentUserPronouns: string): Member[] => {
  const baseMembers: Member[] = [
    {
      id: 'ai',
      name: room.aiCharacter,
      isAI: true,
      status: 'online'
    },
    {
      id: 'user1',
      name: currentUserName,
      isAI: false,
      status: 'online',
      pronouns: currentUserPronouns
    }
  ];

  const additionalMembers: Member[] = [
    {
      id: 'user2',
      name: 'Alex Chen',
      isAI: false,
      status: 'online',
      pronouns: 'they/them'
    },
    {
      id: 'user3',
      name: 'Sarah Martinez',
      isAI: false,
      status: 'online',
      pronouns: 'she/her'
    },
    {
      id: 'user4',
      name: 'Marcus Johnson',
      isAI: false,
      status: 'idle',
      pronouns: 'he/him'
    },
    {
      id: 'user5',
      name: 'Emma Wilson',
      isAI: false,
      status: 'online',
      pronouns: 'she/her'
    }
  ];

  // Add random subset of additional members based on room member count
  const numAdditional = Math.min(additionalMembers.length, room.memberCount - 1);
  const selectedMembers = additionalMembers.slice(0, numAdditional);

  return [...baseMembers, ...selectedMembers];
};

export function ChatInterface({ room, userProfile, onLeaveRoom, onOpenProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberList, setShowMemberList] = useState(true);
  const [members] = useState<Member[]>(() => generateMembers(room, userProfile.name, userProfile.pronouns));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load fake conversation history
    const fakeMessages = generateFakeMessages(room, userProfile.name);
    setMessages(fakeMessages);
  }, [room, userProfile.name]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    const personality = AI_PERSONALITIES[room.aiCharacter] || AI_PERSONALITIES['Zephyr the Wise'];
    const responses = personality.responseStyle;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Personalize response with user info when relevant
    const personalizations = [];
    if (userProfile.favoriteColor && Math.random() > 0.7) {
      personalizations.push(`I notice ${userProfile.favoriteColor.toLowerCase()} seems to be a favorite of yours!`);
    }
    if (userProfile.height && Math.random() > 0.8) {
      personalizations.push(`From your vantage point at ${userProfile.height}, you must have a unique perspective!`);
    }
    
    const personalization = personalizations.length > 0 && Math.random() > 0.5 
      ? ' ' + personalizations[0] 
      : '';
    
    return `${randomResponse} "${userMessage}" is quite thought-provoking!${personalization}`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'user1',
      userName: userProfile.name,
      content: inputValue,
      timestamp: new Date(),
      isAI: false
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        userId: 'ai',
        userName: room.aiCharacter,
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        isAI: true,
        hasAudio: true,
        audioDuration: 10 + Math.floor(Math.random() * 20) // Random duration between 10-30 seconds
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onLeaveRoom}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 hover:bg-zinc-800 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-medium">{room.name}</h2>
                  <p className="text-sm text-zinc-400">{room.aiCharacter}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMemberList(!showMemberList)}
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 text-white ${
                  showMemberList ? 'bg-zinc-800' : 'hover:bg-zinc-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{members.length}</span>
              </button>
              <button
                onClick={onOpenProfile}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-3 hover:bg-zinc-800 text-white"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.isAI ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-zinc-700'}`}>
                  {message.isAI ? <Sparkles className="w-5 h-5" /> : <span className="text-sm">{getInitials(message.userName)}</span>}
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
                  <p className="text-zinc-300 break-words">{message.content}</p>
                  
                  {/* Audio Message for AI */}
                  {message.isAI && message.hasAudio && (
                    <AudioMessage duration={message.audioDuration || 10} audioUrl={message.audioUrl} />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-purple-400">{room.aiCharacter}</span>
                    <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">AI</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${room.name}...`}
              className="flex-1 h-11 w-full rounded-md border px-4 py-2 text-base bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-11 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Member List Sidebar */}
      {showMemberList && (
        <MemberList 
          members={members} 
          onClose={() => setShowMemberList(false)}
        />
      )}
    </div>
  );
}
