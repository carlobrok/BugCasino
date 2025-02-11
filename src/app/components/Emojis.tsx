"use client"

import dynamic from 'next/dynamic';

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

export default function Emojis() {
  return (
    <Picker onEmojiClick={(e, emojiObject) => console.log(emojiObject)} />
  );
}