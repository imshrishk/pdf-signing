import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const Demo = () => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    axios.get('http://localhost:8000/demo')
      .then(response => {
        console.log('Axios GET response:', response.data);
        if (response.data.qr) {
          setQrCode(response.data.qr);
        }
      })
      .catch(error => {
        console.error('Axios GET error:', error);
      });
  }, []);

  const handleSend = async () => {
    // Validate inputs
    const numbers = phoneNumbers.split(',').map(num => num.trim()).filter(num => num);
    
    if (numbers.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one phone number",
        variant: "destructive",
      });
      return;
    }
    
    if (numbers.length > 5) {
      toast({
        title: "Error", 
        description: "Maximum 5 phone numbers allowed in demo",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log(numbers);
    console.log(message);    
    try {
      const response = await axios.post('http://localhost:8000/demo', {
        numbers: numbers,
        message: message.trim()
      });

      console.log('Axios POST response:', response);
      if(response.data.status=='success'){
        toast({
          title: "Demo Messages Sent!",
          description: `Successfully sent demo message to ${numbers.length} number(s)`,
        });
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Axios POST error:', error);
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:text-green-400 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-white">WhatsBlast Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Try Our WhatsApp Automation
          </h1>
          <p className="text-xl text-gray-300">
            Send messages to multiple contacts instantly with our demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - QR Code */}
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Scan QR to Connect WhatsApp
            </h2>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
                {qrCode ? (
                  <img 
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="w-56 h-56 object-cover rounded"
                  />
                ) : (
                  <p>Loading QR code...</p>
                )}
              </div>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">
              Scan this QR code with your WhatsApp to connect your account
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send Demo Messages
            </h2>
            
            <div className="space-y-6">
              {/* Phone Numbers Input */}
              <div>
                <Label htmlFor="phones" className="text-white text-lg mb-2 block">
                  Phone Numbers (Max 5)
                </Label>
                <Input
                  id="phones"
                  placeholder="e.g., +1234567890, +0987654321"
                  value={phoneNumbers}
                  onChange={(e) => setPhoneNumbers(e.target.value)}
                  className="bg-black/20 border-green-400/30 text-white placeholder:text-gray-400 h-12"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Enter phone numbers separated by commas
                </p>
              </div>

              {/* Message Input */}
              <div>
                <Label htmlFor="message" className="text-white text-lg mb-2 block">
                  Message (Max 500 characters)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your promotional message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  className="bg-black/20 border-green-400/30 text-white placeholder:text-gray-400 min-h-[120px] resize-none"
                />
                <p className="text-gray-400 text-sm mt-2">
                  {message.length}/500 characters
                </p>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Demo...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send with WhatsBlast
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
