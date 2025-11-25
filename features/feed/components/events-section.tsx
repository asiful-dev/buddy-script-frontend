"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

// Mock data - replace with API data later
const events = [
  {
    id: "1",
    title: "No more terrorism no more cry",
    date: { day: "10", month: "Jul" },
    image: "/assests/event1.png",
    attendance: 17,
  },
  {
    id: "2",
    title: "No more terrorism no more cry",
    date: { day: "10", month: "Jul" },
    image: "/assests/event2.png",
    attendance: 17,
  },
];

export default function EventsSection() {
  return (
    <Card className="bg-white dark:bg-[#112032] rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Events</h4>
          <Link href="#" className="text-sm text-blue-500 hover:underline font-medium">
            See all
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Event Image */}
              <div className="relative w-full h-40">
                <Image
                  src={event.image || "/assests/event-default.png"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded flex flex-col items-center justify-center">
                    <span className="text-white font-bold text-sm leading-tight">
                      {event.date.day}
                    </span>
                    <span className="text-white text-xs leading-tight">
                      {event.date.month}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-white flex-1 pt-1">
                    {event.title}
                  </h5>
                </div>

                {/* Attendance and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.attendance} People Going
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 bg-white dark:bg-[#112032] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Going
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

