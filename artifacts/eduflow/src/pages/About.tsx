import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Video, ShieldCheck, Smartphone, Moon } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="bg-primary/5 py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About <span className="text-primary">EduFlow</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            EduFlow emerged from the need to address "educational fragmentation" in the digital era — bringing video courses, 
            student interaction, and tutor management into one clean, professional platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EduFlow is a role-based Learning Management System designed to give independent tutors and students 
                a centralized, professional learning environment. Instead of juggling WhatsApp groups, Google Drive 
                folders, and YouTube links, everything lives in one place.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tutors get a powerful admin dashboard to manage courses, upload videos, and moderate discussions. 
                Students get a clean, distraction-free portal to browse, watch, comment, and bookmark their favourite courses.
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-primary/5 border">
                <BookOpen className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Structured Playlists</h3>
                <p className="text-sm text-muted-foreground">Courses organized into clear playlists with individual video lessons.</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">Separate portals for students and tutors with appropriate permissions.</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border">
                <Smartphone className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Mobile-First Design</h3>
                <p className="text-sm text-muted-foreground">CSS Grid responsive layout that works perfectly on any screen size.</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border">
                <Moon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Persistent theme preference saved to localStorage across sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Video, title: "YouTube-Style Video Player", desc: "Responsive 16:9 video player with YouTube embedding support. Watch videos seamlessly on any device." },
              { icon: BookOpen, title: "Course Playlists", desc: "Tutors can create structured playlists (courses) and organize their video lessons in sequence." },
              { icon: Users, title: "Community Interaction", desc: "Students can like videos, leave comments, and bookmark full playlists to their personal library." },
              { icon: ShieldCheck, title: "Secure & Protected", desc: "Session-based authentication with hashed passwords. Role-based access ensures tutors and students see only what they should." },
              { icon: Smartphone, title: "Fully Responsive", desc: "Built mobile-first using CSS Grid and Flexbox. Works beautifully from a 5-inch phone to a 24-inch monitor." },
              { icon: Moon, title: "Persistent Dark Mode", desc: "Toggle between light and dark mode. Your preference is remembered with LocalStorage across all sessions." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-card border shadow-sm">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join EduFlow today — it's free for students. Browse hundreds of expert-led video courses and learn at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="secondary" size="lg">Create Free Account</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Browse Courses</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
