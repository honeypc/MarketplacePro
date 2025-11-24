import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AppNotification {
  id: number;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications = [] } = useQuery<AppNotification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    }
  });

  const markRead = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Please try again", variant: "destructive" });
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay on top of bookings, payouts, and support updates.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.isRead ? "opacity-80" : "border-primary/40"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Badge variant={notification.isRead ? "outline" : "default"}>{notification.type}</Badge>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
              </div>
              {!notification.isRead && (
                <Button size="sm" variant="ghost" onClick={() => markRead.mutate(notification.id)}>
                  Mark read
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">{notification.body || "No details provided."}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {!notifications.length && (
          <p className="text-muted-foreground text-sm">No notifications yet. Book a trip or place an order to see updates.</p>
        )}
      </div>
    </div>
  );
}
