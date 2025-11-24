export default function SidebarRight() {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold">People you may know</h3>
  
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">User {i + 1}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  