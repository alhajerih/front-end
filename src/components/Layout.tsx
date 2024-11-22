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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<BarChart size={20} />} text="Statistics" />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
        <SidebarItem icon={<Package size={20} />} text="Orders" alert />
        <SidebarItem icon={<Receipt size={20} />} text="Billing" />
        <hr className="my-3 border-gray-700" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<Receipt size={20} />} text="Help" />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1  bg-gradient-to-br from-[#1C2854] to-[#132040] p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
