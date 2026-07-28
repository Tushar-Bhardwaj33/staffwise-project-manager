import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const employeeNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/projects", label: "Projects", icon: "◫" },
  { to: "/my-projects", label: "My Projects", icon: "◱" },
  { to: "/ai-assistant", label: "AI Assistant", icon: "✦" },
  { to: "/profile", label: "Profile", icon: "◎" },
];

const adminOnlyNav: NavItem[] = [
  { to: "/admin/employees", label: "Employees", icon: "◈" },
  { to: "/admin/teams", label: "Teams", icon: "◉" },
  { to: "/admin/projects/new", label: "New Project", icon: "+" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#e8f5fe] text-[#0284c7] font-semibold"
        : "text-[#5b6b79] hover:bg-[#f0f4f8] hover:text-[#0f1419]"
    }`;

  return (
    <aside className="hidden md:flex w-56 flex-col bg-white border-r border-[#e3e8ee] min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#e3e8ee]">
        <span className="h-2 w-2 rounded-full bg-[#20beff]" />
        <span className="font-bold text-[#0f1419] tracking-tight">Staffwise</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {employeeNav
          .filter((item) => {
            if (item.to === "/my-projects" && user?.role === "admin") return false;
            return true;
          })
          .map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === "/dashboard"}>
              <span className="w-5 text-center text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Admin
              </span>
            </div>
            {adminOnlyNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end>
                <span className="w-5 text-center text-base leading-none">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#e3e8ee] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20beff] text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#0f1419]">{user?.name}</p>
            <p className="text-xs text-[#9ca3af] capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full text-left text-xs text-[#9ca3af] hover:text-[#d93025] transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}