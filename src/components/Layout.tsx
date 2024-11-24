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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<BadgeDollarSign />} text="Transactions" />
        <hr className="my-3 border-gray-700" />
        <SidebarItem icon={<User />} text="Profile" />
        <SidebarItem icon={<LogOut />} text="Logout" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<Phone />} text="Contact Us" />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 bg-[url('/Background.png')] p-6 xl-full md:h-full sm:full xs-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
