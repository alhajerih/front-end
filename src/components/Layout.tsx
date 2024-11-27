import Sidebar, { SidebarItem } from "@/components/Sidebar/SideBar";
import { LayoutDashboard, Settings } from "lucide-react";
// icon imports
import { logout } from "@/app/api/actions/auth";
import { BadgeDollarSign, LogOut, Phone, User } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar className="h-screen">
        <Link href="/">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
        </Link>
        <Link href="/transactions">
          <SidebarItem icon={<BadgeDollarSign />} text="Transactions" />
        </Link>
        <hr className="my-3 border-gray-700" />
        <Link href="/profile">
          <SidebarItem icon={<User />} text="Profile" />
        </Link>
        <Link href="/settings">
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </Link>
        <Link href="/contact">
          <SidebarItem icon={<Phone />} text="Contact Us" />
        </Link>
        <div onClick={logout}>
          <SidebarItem icon={<LogOut />} text="Logout" />
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 px-6 xl-full md:h-full sm:full xs-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
