"use client";
import { ChevronFirst, ChevronLast } from "lucide-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ProfileImage from "../../public/IMG-20240929-WA0018.jpg";
import ProfileDropdown from "./ProfileOpenRight";
import { getProfile } from "@/app/api/actions/auth";

interface SidebarContextProps {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextProps>({ expanded: true });

// const SidebarContext = createContext();
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getProfile();
      setUser(userData);
    }
    fetchUser();
  }, []);
  return (
    <aside className="">
      <nav className="flex flex-col h-full relative border-0 text-white bg-transparent z-0 border-r shadow-sm rounded-r-3xl overflow-hidden">
        <div className="rounded-lg shadow-lg gradient-opacity-mask"></div>

        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all font-Arimo ${
              expanded ? "w-35" : "w-0"
            }`}
          >
            TADBEER FINANCIAL <hr className=" border-WHITE -700" />
          </h1>

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-rgba(3,3,85,1) hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <hr className="my-3 border-gray-700" />

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 mt-auto">
          <div className="">
            {user ? (
              <ProfileDropdown
                profileImage={user.username.toUpperCase()}
                userName={user.username}
                userRole="Enginner"
                userEmail={user.email}
              />
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <span className="text-xs text-gray-300">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({
  icon,
  text,
  active = false,
  alert = false,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-[var(--sidebar-foreground)]"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
