import React from 'react';
import './_group.css';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Clock, Users, ChevronRight, Star } from 'lucide-react';

export function ModernDark() {
  const courses = [
    {
      id: 1,
      title: 'Web Development Bootcamp 2024',
      tutor: 'Sarah Drasner',
      rating: 4.9,
      students: '12.5k',
      duration: '45 hours',
      image: '/__mockup/images/eduflow-dark-course1.png',
      tags: ['React', 'Node.js']
    },
    {
      id: 2,
      title: 'Python for Beginners: Zero to Hero',
      tutor: 'Guido van Rossum',
      rating: 4.8,
      students: '8.2k',
      duration: '22 hours',
      image: '/__mockup/images/eduflow-dark-course2.png',
      tags: ['Python', 'Data']
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      tutor: 'Gary Simon',
      rating: 4.9,
      students: '15.1k',
      duration: '30 hours',
      image: '/__mockup/images/eduflow-dark-course3.png',
      tags: ['Figma', 'Design']
    }
  ];

  return (
    <div className="eduflow-dark-theme min-h-screen flex flex-col w-full relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 eduflow-dark-glass border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a881ff] to-[#7044ff] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EduFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/90 font-medium hover:text-[#a881ff] transition-colors">Home</a>
            <a href="#" className="text-white/60 font-medium hover:text-[#a881ff] transition-colors">Courses</a>
            <a href="#" className="text-white/60 font-medium hover:text-[#a881ff] transition-colors">Paths</a>
            <a href="#" className="text-white/60 font-medium hover:text-[#a881ff] transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex text-white/70 hover:text-white hover:bg-white/5">
              Log in
            </Button>
            <Button className="bg-[#7044ff] hover:bg-[#5b33e5] text-white border-0 eduflow-dark-glow-button rounded-full px-6 font-medium">
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="container mx-auto max-w-5xl text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full eduflow-dark-glass border border-purple-500/20 mb-8 text-sm font-medium text-purple-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Over 2,000+ courses now available
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
            Learn Without <br className="hidden md:block"/>
            <span className="eduflow-dark-text-gradient">Limits.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Master the world's most in-demand skills with expert-led courses.
            Build your portfolio, earn certificates, and accelerate your career.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-[#7044ff] hover:bg-[#5b33e5] text-white rounded-full px-8 h-14 text-lg font-medium eduflow-dark-glow-button">
              Explore Courses
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-medium border-white/10 hover:bg-white/5 text-white bg-transparent">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 px-6 relative z-10 bg-black/20">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Courses</h2>
              <p className="text-white/60 text-lg">Hand-picked by our experts to start your journey.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-[#a881ff] hover:text-[#a881ff] hover:bg-[#a881ff]/10">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group eduflow-dark-glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-white/10 hover:border-[#a881ff]/30">
                <div className="relative aspect-video overflow-hidden bg-white/5">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-[#7044ff] text-white rounded-full scale-90 group-hover:scale-100 transition-transform eduflow-dark-glow-button">
                      <Play className="w-4 h-4 mr-2 fill-current" /> Preview
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-white/90">{course.rating}</span>
                    <span className="text-sm text-white/40 ml-1">({course.students} students)</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#a881ff] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-white/60 mb-6">By {course.tutor}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center text-sm text-white/50 gap-4">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> 12 Modules</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 md:hidden flex justify-center">
            <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white/5">
              View all courses
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-12 px-6 bg-black/40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#a881ff] to-[#7044ff] flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">EduFlow</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
