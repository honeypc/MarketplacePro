import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TourSchedule {
  id: number;
  startTime: string;
  endTime: string;
  availableSpots: number;
  capacity: number;
  price?: number;
  meetingPoint?: string;
}

interface TourDetail {
  id: number;
  title: string;
  description?: string;
  location: string;
  duration?: string;
  basePrice: number;
  tags: string[];
  images: string[];
  schedules: TourSchedule[];
}

export default function Tours() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const queryKey = useMemo(() => ["tours", search], [search]);

  const { data: tours = [], isLoading } = useQuery<TourDetail[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/tours?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load tours");
      return res.json();
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async ({ tourId, scheduleId, price }: { tourId: number; scheduleId: number; price: number }) => {
      const res = await fetch(`/api/tours/${tourId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourScheduleId: scheduleId, guests: 1, totalAmount: price })
      });
      if (!res.ok) throw new Error("Unable to book tour");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Booking created", description: "We reserved your spot. Check bookings for details." });
      queryClient.invalidateQueries({ queryKey: ["tour-bookings"] });
    },
    onError: (error: any) => {
      toast({ title: "Booking failed", description: error?.message || "Try another time slot", variant: "destructive" });
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tours & Tickets</h1>
          <p className="text-muted-foreground">Find upcoming experiences and lock in your seats.</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by destination or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />
        </div>
      </header>

      {isLoading ? (
        <p className="text-muted-foreground">Loading tours...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour) => (
            <Card key={tour.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tour.title}</CardTitle>
                  <Badge variant="secondary">{tour.location}</Badge>
                </div>
                <CardDescription>{tour.description}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tour.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Duration: {tour.duration || "Flexible"}</p>
                <p className="text-sm font-semibold">From ${Number(tour.basePrice).toFixed(2)}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Upcoming schedules</h4>
                  {tour.schedules?.length ? (
                    <div className="space-y-2">
                      {tour.schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">
                              {new Date(schedule.startTime).toLocaleString()} → {" "}
                              {new Date(schedule.endTime).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">
                              {schedule.availableSpots} of {schedule.capacity} spots left
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              ${Number(schedule.price ?? tour.basePrice).toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              disabled={!isAuthenticated || schedule.availableSpots < 1 || bookingMutation.isLoading}
                              onClick={() =>
                                bookingMutation.mutate({
                                  tourId: tour.id,
                                  scheduleId: schedule.id,
                                  price: Number(schedule.price ?? tour.basePrice)
                                })
                              }
                            >
                              {isAuthenticated ? "Book" : "Login to book"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No schedules published yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
