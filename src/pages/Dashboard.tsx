import { motion } from "framer-motion";
import { Zap, CalendarDays, Trophy, ArrowRight, Bell, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { announcements, events, challenges, leaderboard } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl glass p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Source of Truth</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Welcome to <span className="text-gradient-primary">Nexus</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your college's premier technical club — building, learning, and pushing boundaries together.
          </p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: "156", icon: Users },
          { label: "Projects", value: "12", icon: Zap },
          { label: "Events This Year", value: "24", icon: CalendarDays },
          { label: "Challenges", value: "8", icon: Trophy },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-hover rounded-xl p-5 text-center"
          >
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Announcements + Upcoming */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Announcements */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Announcements
            </h2>
          </div>
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-hover rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      {a.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{a.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">{a.author} · {a.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Events + Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" /> Upcoming
          </h2>
          <div className="space-y-3">
            {events
              .filter((e) => e.status === "upcoming")
              .slice(0, 3)
              .map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-hover rounded-xl p-4"
                >
                  <p className="font-semibold text-foreground text-sm">{e.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{e.date} · {e.location}</p>
                  <Badge variant="outline" className="mt-2 text-xs border-primary/30 text-primary">
                    {e.category}
                  </Badge>
                </motion.div>
              ))}
          </div>

          <div className="mt-4">
            <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Top Challengers
            </h3>
            <div className="glass rounded-xl p-4 space-y-3">
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={entry.rank} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    entry.rank === 1 ? "bg-accent text-accent-foreground" :
                    entry.rank === 2 ? "bg-primary/20 text-primary" :
                    "bg-secondary text-secondary-foreground"
                  }`}>
                    {entry.rank}
                  </span>
                  <span className="text-sm font-medium text-foreground flex-1">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/events"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
          >
            View all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
