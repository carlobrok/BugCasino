import Link from "next/link";
import LogoutButton from "./LogoutButton";


export default function Header() {
    return (
      <header className="font-bold p-4 flex justify-between items-center">
        {/* Left placeholder for spacing */}
        <div className="w-24"></div>
        
        {/* Centered navigation links */}
        <nav className="flex space-x-6 text-bold ">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/tickets" className="hover:text-gray-400">Tickets</Link>
          <Link href="/profile" className="hover:text-gray-400">Profile</Link>
        </nav>
        
        {/* Logout button on the right */}
        
        <LogoutButton></LogoutButton>
      </header>
    );
  }
  
  