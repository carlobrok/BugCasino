'use client';

import React, { useState, useRef, useEffect, JSX } from 'react';
import EmojiPicker, { Categories, EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { PlusIcon } from '@heroicons/react/16/solid';

function AvatarPicker({setInput} : {setInput: (avatar: string) => void}) : JSX.Element {
  // State to show/hide the emoji picker
  const [showPicker, setShowPicker] = useState<boolean>(false);
  // State to hold the selected emoji (avatar)
  const [avatar, setAvatar] = useState<string | null>(null);

  // Ref for the emoji picker to detect outside clicks
  const pickerRef = useRef<HTMLDivElement>(null);

  // Callback fired when an emoji is clicked.
  // The callback receives an object containing the emoji string and a native MouseEvent.
  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    setAvatar(emojiData.emoji);
    setInput(emojiData.unified);
    setShowPicker(false);
  };

  // Close the emoji picker if the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative inline-block">
      {/* Avatar circle */}
      <div
        className="size-9 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer"
        onClick={() => setShowPicker((prev) => !prev)}
      >
        {avatar ? (
          <span className="text-xl">{avatar}</span>
        ) : (
          <PlusIcon className="h-6 w-6 text-gray-500" />
        )}
      </div>

      {/* Emoji picker dropdown */}
      {showPicker && (
        <div ref={pickerRef} className="absolute z-10 mt-2 transform -translate-y-1/2 left-1/2">
          <EmojiPicker 
          onEmojiClick={onEmojiClick} 
          emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.LIGHT}
            categories={[
              {
                category: Categories.SMILEYS_PEOPLE,
                name: 'Smileys & People'
              },
              {
                category: Categories.ANIMALS_NATURE,
                name: 'Animals & Nature'
              },
              {
                category: Categories.FOOD_DRINK,
                name: 'Food & Drink'
              },
              {
                category: Categories.TRAVEL_PLACES,
                name: 'Travel & Places'
              },
              {
                category: Categories.ACTIVITIES,
                name: 'Activities'
              },
              {
                category: Categories.OBJECTS,
                name: 'Objects'
              }
            ]}
            />
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;
