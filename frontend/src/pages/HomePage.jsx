import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const contactRef = useRef(null);

  const handleStart = () => setShowInput(true);

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("collabUserName", name);
      navigate('/dashboard');
    }
  };

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-black bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
            CollabGetaway
          </div>
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollTo(featuresRef)} className="hover:text-pink-300 transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-pink-300 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo(contactRef)} className="hover:text-pink-300 transition-colors">
              Contact
            </button>
          </nav>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              CollabGetaway
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Design your dream vacation with friends and family in real-time. Plan together, vote on destinations, and create unforgettable memories.
          </p>
          
          {!showInput ? (
            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-violet-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Begin Your Journey
            </button>
          ) : (
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-white placeholder-opacity-70"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={`w-full px-6 py-4 rounded-full font-semibold transition-all ${!name.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transform hover:scale-105'}`}
              >
                Continue
              </button>
            </div>
          )}
        </div>
     
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400 animate-bounce">
          <span className="text-sm mb-2">Scroll Down</span>
          <div className="w-5 h-5 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-black bg-opacity-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              Amazing Features
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: '👥',
                title: 'Real-time Collaboration',
                description: 'Plan with friends simultaneously, see changes as they happen, and chat in real-time.'
              },
              {
                icon: '🗺️',
                title: 'Interactive Maps',
                description: 'Visualize your trip with beautiful maps and pin your favorite locations.'
              },
              {
                icon: '💬',
                title: 'Group Voting',
                description: 'Can\'t decide? Let your group vote on destinations, activities, and more.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              How It Works
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Enter your Name',
                description: 'Start by creating a new trip and inviting your friends or family members.'
              },
              {
                step: '2',
                title: 'Plan Together',
                description: 'Collaborate in real-time to add destinations, activities, and accommodations.'
              },
              {
                step: '3',
                title: 'Vote & Decide',
                description: 'Use our voting system to democratically choose the best options.'
              },
              {
                step: '4',
                title: 'Book & Enjoy',
                description: 'Once everything is planned, book your trip and enjoy your perfect getaway!'
              }
            ].map((step, index) => (
              <div key={index} className="flex mb-10 last:mb-0">
                <div className="flex-shrink-0 mr-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-200">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 px-4 bg-black bg-opacity-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              Get In Touch
            </span>
          </h2>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-violet-600 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black bg-opacity-30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 mb-6 md:mb-0">
              CollabGetaway
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="hover:text-pink-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-pink-300 transition-colors">Terms of Service</a>
              <button onClick={() => scrollTo(contactRef)} className="hover:text-pink-300 transition-colors">Contact Us</button>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} CollabGetaway. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}