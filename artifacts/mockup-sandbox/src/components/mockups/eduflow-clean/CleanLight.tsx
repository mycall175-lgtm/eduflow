import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, Star, Users, CheckCircle, ArrowRight, Play } from 'lucide-react';
import './_group.css';

export function CleanLight() {
  const courses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      tutor: "Dr. Angela Yu",
      rating: 4.8,
      students: "124,000",
      image: "/__mockup/images/eduflow-course-1.png",
      tag: "Best Seller"
    },
    {
      id: 2,
      title: "Python for Beginners",
      tutor: "Jose Portilla",
      rating: 4.9,
      students: "89,000",
      image: "/__mockup/images/eduflow-course-2.png",
      tag: "Highest Rated"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      tutor: "Gary Simon",
      rating: 4.7,
      students: "45,000",
      image: "/__mockup/images/eduflow-course-3.png",
      tag: "New"
    }
  ];

  return (
    <div className="eduflow-clean min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">EduFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground transition-colors hover:text-primary">Home</a>
            <a href="#" className="transition-colors hover:text-primary">Courses</a>
            <a href="#" className="transition-colors hover:text-primary">Instructors</a>
            <a href="#" className="transition-colors hover:text-primary">About</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex text-muted-foreground hover:text-foreground font-medium">
              Log in
            </Button>
            <Button className="font-semibold shadow-sm">
              Register
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient pt-20 pb-28 px-4 border-b">
          <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                🎉 New courses added for 2024
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
                Learn Without Limits. <br />
                <span className="text-primary">Anytime, Anywhere.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Build skills with courses, certificates, and degrees online from world-class universities and companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="font-bold text-base h-12 px-8 shadow-md">
                  Explore Courses
                </Button>
                <Button size="lg" variant="outline" className="font-semibold text-base h-12 px-8 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Video
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-6 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src="/__mockup/images/eduflow-hero.png" 
                alt="Student learning online" 
                className="rounded-[2rem] shadow-xl w-full object-cover aspect-[4/3] border bg-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg">
                  A+
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Course Passed</p>
                  <p className="font-bold text-slate-900">Advanced React</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Courses</h2>
                <p className="text-muted-foreground text-lg">Hand-picked by our experts. The most popular courses right now.</p>
              </div>
              <Button variant="ghost" className="text-primary font-semibold group hover:bg-primary/5">
                View all courses
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <Card key={course.id} className="group overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-sm border-none">
                        {course.tag}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg">
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <h3 className="font-bold text-lg leading-tight text-slate-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{course.tutor}</p>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 flex-1">
                    <div className="flex items-center gap-3 text-sm font-medium mt-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-slate-700 font-bold">{course.rating}</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="font-bold text-xl text-slate-900">$89.99</div>
                    <Button variant="outline" className="font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                      Watch Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Start your learning journey today</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">Join millions of learners from around the world learning new skills.</p>
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold px-8 h-14 text-lg relative z-10 shadow-lg">
              Sign Up for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">EduFlow</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering learners around the world to master new skills and advance their careers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Browse Courses</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Certificates</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">EduFlow for Business</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900">Community</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Learners</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900">More</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
            <p>© 2024 EduFlow Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
