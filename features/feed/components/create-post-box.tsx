"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";

export default function CreatePostBox() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 space-y-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <input
            className="flex-1 p-2 bg-[#F0F2F5] rounded-full outline-none"
            placeholder="What's on your mind?"
          />
        </div>

        <div className="flex items-center justify-between px-2">
          <label className="text-sm font-medium cursor-pointer flex items-center gap-2">
            <Image
              src="/assets/images/photo-icon.svg"
              alt="upload"
              width={20}
              height={20}
            />
            Add Image
            <input type="file" className="hidden" />
          </label>

          <Button>Post</Button>
        </div>

      </CardContent>
    </Card>
  );
}
