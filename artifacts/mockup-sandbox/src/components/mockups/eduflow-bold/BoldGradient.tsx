import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BookOpen, PlayCircle, Star, GraduationCap, ChevronRight, Play } from 'lucide-react';
import './_group.css';

export function BoldGradient() {
  const courses = [
    {
      title: 'Web Development Bootcamp',
      tutor: 'Sarah Drasner',
      rating: 4.9,
      students: '12.4k',
      image: '/__mockup/images/webdev.jpg',
      color: 'from-orange-400 to-rose-400'
    },
    {
      title: 'Python for Beginners',
      tutor: 'Corey Schafer',
      rating: 4.8,
      students: '8.2k',
      image: '/__mockup/images/python.jpg',
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: 'UI/UX Design Masterclass',
      tutor: 'Gary Simon',
      rating: 5.0,
      students: '15.1k',
      image: '/__mockup/images/uiux.jpg',
      color: 'from-rose-500 to-orange-500'
    }
  ];

  return (
    <div className="eduflow-bold-theme min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight">EduFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
          <a href="#" className="text-black hover:text-orange-500 transition-colors">Home</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Courses</a>
          <a href="#" className="hover:text-orange-500 transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="font-bold hover:bg-orange-100/50">Log in</Button>
          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold border-none shadow-lg shadow-pink-500/25 rounded-full px-6">
            Sign up free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-orange-400/20 to-pink-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 text-orange-600 font-bold text-sm mb-8 z-10">
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            New courses added daily
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] max-w-4xl z-10 text-slate-900">
            Learn Without <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500">Limits.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mb-12 z-10">
            Master the skills you need to build the future you want. Expert-led courses in tech, design, and business.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
            <Button size="lg" className="h-14 px-8 bg-black hover:bg-gray-800 text-white rounded-full font-bold text-lg w-full sm:w-auto">
              Explore Courses
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full font-bold text-lg border-2 w-full sm:w-auto hover:bg-orange-50">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="px-8 py-24 bg-white/50 border-t border-orange-100/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Featured Courses</h2>
                <p className="text-gray-500 font-medium text-lg">Hand-picked by our expert instructors</p>
              </div>
              <Button variant="ghost" className="font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 hidden md:flex">
                View all courses <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <Card key={i} className="group border-none shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white overflow-hidden rounded-3xl">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', ...course.color.split(' '));
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-pink-600 shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center text-orange-500 font-bold text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {course.rating}
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-sm font-semibold">{course.students} students</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-pink-600 transition-colors">{course.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {course.tutor}
                    </p>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Button className="w-full bg-gray-50 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white text-gray-900 font-bold transition-all duration-300">
                      Watch Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-black tracking-tight">EduFlow</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} EduFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
