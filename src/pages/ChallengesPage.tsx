import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Clock, Send, ExternalLink } from "lucide-react";
import { challenges, leaderboard } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ChallengesPage = () => {
  const [submissionLink, setSubmissionLink] = useState("");

  const difficultyColor = (d: string) =>
    d === "Easy" ? "text-accent border-accent/30" :
    d === "Medium" ? "text-primary border-primary/30" :
    "text-destructive border-destructive/30";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Challenge <span className="text-gradient-accent">Ecosystem</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Push your skills. Climb the leaderboard. Earn recognition.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" /> Active Challenges
          </h2>
          {challenges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-hover rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className={difficultyColor(c.difficulty)}>
                  {c.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-accent text-sm font-bold">
                  <Trophy className="w-4 h-4" /> {c.points} pts
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{c.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due: {c.deadline}
                </span>
                <span>{c.submissions} submissions</span>
                <Badge variant="secondary" className="text-xs">{c.category}</Badge>
              </div>

              {/* Submission Portal */}
              <div className="flex gap-2">
                <Input
                  placeholder="Paste your project link..."
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className="bg-secondary border-border/50"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (submissionLink.trim()) {
                      toast.success("Submission received!");
                      setSubmissionLink("");
                    } else {
                      toast.error("Please enter a valid link.");
                    }
                  }}
                  className="gap-1 shrink-0"
                >
                  <Send className="w-4 h-4" /> Submit
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" /> Live Leaderboard
          </h2>
          <div className="glass rounded-2xl p-5 space-y-3">
            {leaderboard.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  entry.rank <= 3 ? "bg-secondary/50" : ""
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  entry.rank === 1 ? "bg-accent text-accent-foreground" :
                  entry.rank === 2 ? "bg-primary/20 text-primary" :
                  entry.rank === 3 ? "bg-primary/10 text-primary" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.solved} solved</p>
                </div>
                <span className="text-sm font-bold text-primary">{entry.points}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
