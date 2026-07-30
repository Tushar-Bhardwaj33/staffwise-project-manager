import { NavLink } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  History, 
  Bot, 
  Users, 
  Shield,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/useAuth";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  
  const commonNav = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "AI Assistant", path: "/ai-assistant", icon: Bot },
  ];

  const employeeNav = [
    { name: "My Projects", path: "/my-projects", icon: History },
  ];

  const adminNav = [
    { name: "Employees", path: "/admin/employees", icon: Users },
    { name: "Teams", path: "/admin/teams", icon: Shield },
  ];

  const navItems = [
    ...commonNav,
    ...(user?.role === "employee" ? employeeNav : []),
    ...(user?.role === "admin" ? adminNav : []),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside 
        className={clsx(
          "w-64 flex-shrink-0 flex flex-col bg-[#0f1419] h-screen fixed md:relative z-30 transition-transform duration-300 top-0 left-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#20beff] to-[#0f9fdb] flex items-center justify-center shadow-lg shadow-[#20beff]/20">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Staffwise</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "text-white bg-[#20beff]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#20beff] rounded-r-full shadow-[0_0_10px_#20beff]" />
                  )}
                  
                  <item.icon 
                    size={18} 
                    className={clsx(
                      "flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-[#20beff]" : "text-gray-500 group-hover:text-gray-300"
                    )} 
                  />
                  <span className="z-10">{item.name}</span>
                  
                  {/* Hover Ripple Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse pointer-events-none" />
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-[#20beff]/30 transition-colors cursor-pointer">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#20beff]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
            <h4 className="text-sm font-bold text-white mb-1 relative z-10">Pro Workspace</h4>
            <p className="text-xs text-gray-400 relative z-10">Manage projects effectively</p>
          </div>
        </div>
      </aside>
    </>
  );
}
