import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users, Bell } from "lucide-react";
import { events } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Filter = "all" | "upcoming" | "ongoing" | "past";

const EventsPage = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.status === filter);
  const filters: Filter[] = ["all", "upcoming", "ongoing", "past"];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Events & <span className="text-gradient-primary">Discovery</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore workshops, hackathons, talks, and more.
        </p>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {filtered.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-hover rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <Badge
                variant={
                  event.status === "upcoming" ? "default" :
                  event.status === "ongoing" ? "secondary" : "outline"
                }
                className={`capitalize ${event.status === "ongoing" ? "border-accent text-accent" : ""}`}
              >
                {event.status}
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {event.category}
              </Badge>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                {event.date}{event.date !== event.endDate && ` — ${event.endDate}`}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {event.attendees}/{event.maxAttendees} registered
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-secondary mb-4">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
              />
            </div>

            {event.status !== "past" && (
              <Button
                size="sm"
                onClick={() => toast.success(`You'll be notified about ${event.title}!`)}
                className="w-full gap-2"
              >
                <Bell className="w-4 h-4" /> Notify Me
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
