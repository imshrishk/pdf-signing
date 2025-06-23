import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Users, Zap, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* WhatsApp Chat Icon Background */}
      <div className="absolute inset-0">
        <MessageCircle className="absolute w-32 h-32 top-10 left-10 text-green-400/10 transform rotate-12 animate-pulse" />
        <MessageCircle className="absolute w-24 h-24 top-32 right-20 text-green-400/8 transform -rotate-12 animate-pulse delay-1000" />
        <MessageCircle className="absolute w-40 h-40 bottom-32 left-1/4 text-green-400/6 transform rotate-45 animate-pulse delay-2000" />
        <MessageCircle className="absolute w-28 h-28 bottom-20 right-10 text-green-400/10 transform -rotate-30 animate-pulse delay-500" />
        <MessageCircle className="absolute w-20 h-20 top-1/2 left-20 text-green-400/8 transform rotate-90 animate-pulse delay-1500" />
        <MessageCircle className="absolute w-36 h-36 top-20 right-1/3 text-green-400/5 transform -rotate-45 animate-pulse delay-3000" />
        <MessageCircle className="absolute w-16 h-16 bottom-40 left-10 text-green-400/12 transform rotate-180 animate-pulse delay-2500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-green-400 text-sm font-medium mb-8 animate-fade-in">
          <Zap className="w-4 h-4 mr-2" />
          World's Fastest WhatsApp Automation
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          {/* SEND */}
          <span className="block text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">FAST & CHEAP</span>
          <span className="block">WA AUTOMATION</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Reach hundreds of customers instantly with our powerful WhatsApp automation platform.
          <span className="text-green-400 font-semibold"> Just a few clicks away.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[200px]">
            <Send className="w-5 h-5 mr-2" />
            Start Broadcasting
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/demo')}
            className="glass-effect border-green-400/30 text-white hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            Try Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-green-400 text-lg font-semibold mb-6">Trusted by 10,000+ businesses worldwide</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500M+</div>
                <div className="text-gray-400 text-sm">Messages Sent</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400 text-sm">Delivery Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
