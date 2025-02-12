"use client"

import { Emoji, EmojiStyle } from "emoji-picker-react";

export default function UserIconName( {name, avatar, size = 20} : { name: string; avatar: string, size?: number }) {
    
    // console.log(avatar);    
    return (
        <div className="flex items-center">
            <Emoji unified={avatar} size={size} emojiStyle={EmojiStyle.APPLE} />
            <span className="ml-2">{name}</span>
        </div>
    );
}
