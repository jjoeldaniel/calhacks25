import { Sparkles, User as UserIcon, X } from 'lucide-react';

export interface Member {
  id: string;
  name: string;
  isAI: boolean;
  status: 'online' | 'idle' | 'offline';
  pronouns?: string;
}

interface MemberListProps {
  members: Member[];
  onClose: () => void;
}

export function MemberList({ members, onClose }: MemberListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-zinc-600';
      default:
        return 'bg-zinc-600';
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

  const aiMembers = members.filter(m => m.isAI);
  const humanMembers = members.filter(m => !m.isAI);

  return (
    <div className="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400">Members — {members.length}</span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* AI Members */}
        {aiMembers.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-zinc-500 px-2 mb-2">AI CHARACTER — {aiMembers.length}</div>
            <div className="space-y-1">
              {aiMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-purple-400 truncate">{member.name}</div>
                    {member.pronouns && (
                      <div className="text-xs text-zinc-500">{member.pronouns}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Human Members */}
        {humanMembers.length > 0 && (
          <div>
            <div className="text-xs text-zinc-500 px-2 mb-2">MEMBERS — {humanMembers.length}</div>
            <div className="space-y-1">
              {humanMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-xs">{getInitials(member.name)}</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{member.name}</div>
                    {member.pronouns && (
                      <div className="text-xs text-zinc-500">{member.pronouns}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
