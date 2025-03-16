'use client';
import React from 'react';
import UserIconName from '../UserIconName';
import { formatDoneInTime } from '@/lib/format-helper';
import Amount from '../Amount';

export function PunctualityLabel({ doneInTime }: { doneInTime: boolean }) {
  return (
    // <div className="italic bottom-5 left-5 bg-zinc-500 shadow-md text-white rounded-full my-auto px-3 py-1 text-sm"></div>
    <div className={'inline-flex text-sm rounded-full px-2 shadow-md py-1' + (doneInTime ? ' bg-green-900' : ' bg-red-900')}>
      {formatDoneInTime(doneInTime)}
    </div>
  );
}


export default function BetsList({ bets, isOpen }: {
  bets: {
    user: { name: string, avatar: string };
    amount: number;
    doneInTime: boolean;
    userId: number;
    id: number;
  }[], isOpen: boolean
}
) {
  return (
    <div
      className={`
        -translate-y-5
        mx-5
        transition-all
        duration-500
        ease-in-out
        ${isOpen ? 'max-h-80' : 'max-h-0'}
        overflow-auto
        rounded-2xl
        shadow-lg
        bg-zinc-600
      `}
    >
      {/* Replace this with your actual content */}
      <ul className='mt-10 mb-4'>
        {bets.map((bet, i) => (
          <li
            key={i}
            className="my-2 mx-6 p-3 bg-zinc-700 rounded-2xl shadow-md flex justify-between"
          >
            <UserIconName name={bet.user.name} avatar={bet.user.avatar} />
            <div className='absolute right-40 translate-x-1/2'>
              <PunctualityLabel doneInTime={bet.doneInTime} />
            </div>
            <Amount amount={bet.amount} />
          </li>
        ))}
      </ul>
    </div>
  );
}
