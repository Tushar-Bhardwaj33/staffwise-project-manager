import { Search, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex-1 flex items-center max-w-lg">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
            placeholder="Search projects..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <div className="relative group">
          <button className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 py-1.5 px-3 rounded-md transition-colors border border-transparent hover:border-gray-200">
            <div className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name}
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold overflow-hidden shadow-inner">
              {user?.name ? user.name[0].toUpperCase() : <UserIcon size={18} />}
            </div>
          </button>
          
          <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right">
            <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-md">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-700 rounded">
                {user?.role}
              </span>
            </div>
            <div className="p-1">
              <Link 
                to="/profile"
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <UserIcon size={16} />
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
