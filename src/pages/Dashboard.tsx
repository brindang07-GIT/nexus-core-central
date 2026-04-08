import { motion } from "framer-motion";
import { Zap, CalendarDays, MapPin, Users, ArrowRight, Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { announcements, events } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const upcomingEvents = events.filter((e) => e.status === "upcoming" || e.status === "ongoing");

  return (
    <div className="space-y-8">
      {/* Compact Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl glass p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Welcome to <span className="text-gradient-primary">Nexus</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your college's premier technical club.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Members", value: "156", icon: Users },
              { label: "Events", value: "24", icon: CalendarDays },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <stat.icon className="w-4 h-4 text-primary" />
                <span className="font-display text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Upcoming Events — Primary Focus */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Upcoming Events
          </h2>
          <Link
            to="/events"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-hover rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant={event.status === "ongoing" ? "secondary" : "default"}
                  className={`capitalize ${event.status === "ongoing" ? "border-accent text-accent" : ""}`}
                >
                  {event.status}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  {event.category}
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{event.description}</p>

              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  {event.date}{event.date !== event.endDate && ` — ${event.endDate}`}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  {event.attendees}/{event.maxAttendees} registered
                </div>
              </div>

              {/* Progress */}
              <div className="w-full h-1.5 rounded-full bg-secondary mb-4">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                />
              </div>

              <Button
                size="sm"
                onClick={() => toast.success(`You'll be notified about ${event.title}!`)}
                className="w-full gap-2"
              >
                <Bell className="w-4 h-4" /> Notify Me
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Announcements — Secondary */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-primary" /> Latest Announcements
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-hover rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-sm truncate">{a.title}</h3>
                {a.priority === "high" && (
                  <Badge variant="destructive" className="text-[10px] shrink-0">Urgent</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{a.author} · {a.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
