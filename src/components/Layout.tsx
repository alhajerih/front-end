import Sidebar, { SidebarItem } from "@/components/SideBar";
import { LayoutDashboard, Receipt, Settings, UserCircle } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar>
        <Link href="/">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
        </Link>

        <Link href="/transactions">
          <SidebarItem icon={<Receipt size={20} />} text="Transactions" />
        </Link>
        <hr className="my-3 border-x-lime-50" />

        <Link href="/settings">
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </Link>
        <Link href="/help">
          <SidebarItem icon={<Receipt size={20} />} text="Help" />
        </Link>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1  bg-[linear-gradient(90deg,_rgba(3,3,85,1)_5%,_rgba(3,3,85,1)_74%,_rgba(40,63,107,1)_100%)] p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
