import { Card, CardContent } from "@/shared/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";

export default function PostItem() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 space-y-3">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>

        <p className="text-sm text-gray-800">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="w-full h-64 bg-gray-200 rounded-md"></div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 text-sm">
            <Heart className="w-4 h-4" /> Like
          </button>

          <button className="flex items-center gap-2 text-gray-600 text-sm">
            <MessageCircle className="w-4 h-4" /> Comment
          </button>
        </div>

      </CardContent>
    </Card>
  );
}
