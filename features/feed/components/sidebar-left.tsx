import { Home, Users, Calendar, Layers } from "lucide-react";

const links = [
  { label: "Home", icon: Home },
  { label: "Friends", icon: Users },
  { label: "Groups", icon: Layers },
  { label: "Events", icon: Calendar },
];

export default function SidebarLeft() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
      {links.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <Icon className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
