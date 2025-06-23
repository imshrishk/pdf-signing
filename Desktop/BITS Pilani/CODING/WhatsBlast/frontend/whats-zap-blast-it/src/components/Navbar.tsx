
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">WhatsBlast</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:text-green-400 hover:bg-white/10">
            Features
          </Button>
          <Button variant="ghost" className="text-white hover:text-green-400 hover:bg-white/10">
            Pricing
          </Button>
          <Button variant="ghost" className="text-white hover:text-green-400 hover:bg-white/10">
            Contact
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
