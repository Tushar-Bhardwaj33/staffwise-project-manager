import { NavLink } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  History, 
  Bot, 
  Users, 
  Shield, 
  PieChart
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
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside 
        className={clsx(
          "w-64 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white h-screen fixed md:relative z-30 transition-transform duration-300 top-0 left-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Staffwise</span>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <item.icon size={18} className={clsx("flex-shrink-0")} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
}
