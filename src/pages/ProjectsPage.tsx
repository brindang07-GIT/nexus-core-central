import { motion } from "framer-motion";
import { Star, GitBranch, ExternalLink } from "lucide-react";
import { projects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const ProjectsPage = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          The <span className="text-gradient-primary">Archive</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          A curated gallery of everything we've built.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-hover rounded-2xl overflow-hidden group"
          >
            {/* Project visual header */}
            <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-primary" />
              </div>
              <Badge
                className={`absolute top-4 right-4 ${
                  project.status === "active"
                    ? "bg-accent/20 text-accent border-accent/30"
                    : "bg-secondary text-muted-foreground"
                }`}
                variant="outline"
              >
                {project.status === "active" ? "Active" : "Completed"}
              </Badge>
            </div>

            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4 text-accent" />
                  {project.stars}
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.contributors.length} contributors
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Contributors */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Contributors</p>
                <div className="flex -space-x-2">
                  {project.contributors.map((name) => (
                    <div
                      key={name}
                      className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary"
                      title={name}
                    >
                      {name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
