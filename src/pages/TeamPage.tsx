import { motion } from "framer-motion";
import { Linkedin, ExternalLink } from "lucide-react";
import { teamMembers } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const TeamPage = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          The <span className="text-gradient-primary">Invisible Team</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          The brilliant minds powering Nexus behind the scenes.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-hover rounded-2xl p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xl shrink-0">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{member.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 mt-4 transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
