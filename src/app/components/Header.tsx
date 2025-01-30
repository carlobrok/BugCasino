import LogoutButton from "./LogoutButton";


export default function Header() {
    return (
      <header className="font-bold p-4 flex justify-between items-center">
        {/* Left placeholder for spacing */}
        <div className="w-24"></div>
        
        {/* Centered navigation links */}
        <nav className="flex space-x-6 text-bold ">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">Tickets</a>
          <a href="#" className="hover:text-gray-400">Profile</a>
        </nav>
        
        {/* Logout button on the right */}
        
        <LogoutButton></LogoutButton>
      </header>
    );
  }
  
  