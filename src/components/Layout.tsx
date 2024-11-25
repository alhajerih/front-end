import Sidebar, { SidebarItem } from "@/components/SideBar";
import {
  BarChart,
  Boxes,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
// icon imports
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { Phone } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/api/actions/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar>
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
        <div onClick={logout}>
          <SidebarItem icon={<LogOut />} text="Logout" />
        </div>
        <Link href="/settings">
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </Link>
        <Link href="/contact">
          <SidebarItem icon={<Phone />} text="Contact Us" />
        </Link>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6 xl-full md:h-full sm:full xs-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
