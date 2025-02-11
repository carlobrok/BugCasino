"use client"

import { Emoji } from "emoji-picker-react";

export default function UserIconName( {name, avatar, size = 25} : { name: string; avatar: string, size?: number }) {
    
    console.log(avatar);    
    return (
        <div className="flex items-center">
            <Emoji unified={avatar} size={size} />
            <span className="ml-2">{name}</span>
        </div>
    );
}
