import { useState, useEffect } from 'react';
import { type UserProfile } from '../App';
import { Modal } from './Modal';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function UserProfileDialog({ isOpen, onClose, userProfile, onSave }: UserProfileDialogProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }

    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Profile">
      <p className="text-sm text-zinc-400 mb-4">Customize your info so the AI can recognize you better</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-2">Name *</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            className="h-9 w-full rounded-md border px-3 py-1 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label htmlFor="pronouns" className="block text-sm mb-2">Pronouns</label>
          <input
            id="pronouns"
            value={formData.pronouns}
            onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
            placeholder="e.g., they/them, she/her, he/him"
            className="h-9 w-full rounded-md border px-3 py-1 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm mb-2">Height</label>
          <input
            id="height"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="e.g., 5'8&quot;, 173cm"
            className="h-9 w-full rounded-md border px-3 py-1 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label htmlFor="favorite-color" className="block text-sm mb-2">Favorite Color</label>
          <input
            id="favorite-color"
            value={formData.favoriteColor}
            onChange={(e) => setFormData({ ...formData, favoriteColor: e.target.value })}
            placeholder="e.g., Blue, Purple"
            className="h-9 w-full rounded-md border px-3 py-1 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm mb-2">Bio</label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us a bit about yourself..."
            className="min-h-20 w-full rounded-md border px-3 py-2 text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-4 py-2 border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-9 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700"
          >
            Save Profile
          </button>
        </div>
      </div>
    </Modal>
  );
}
