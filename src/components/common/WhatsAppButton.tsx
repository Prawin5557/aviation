import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send, Bot, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { geminiService } from '../../services/geminiService';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '👋 Hi! I\'m ARMZ Support. How can I help you with aviation careers, jobs, or our services today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = '+919876543210'; // ARMZ Aviation WhatsApp
  const supportEmail = 'support@armzaviation.com';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const botResponse = await geminiService.chatBotResponse(userMessage.text);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting. Please try again or contact support directly.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDirectContact = () => {
    window.open(`tel:${whatsappNumber}`, '_blank');
    toast.success('Opening phone dialer...');
  };

  const handleEmailContact = () => {
    window.open(`mailto:${supportEmail}`, '_blank');
    toast.success('Opening email client...');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 sm:right-8 z-40 p-4 bg-linear-to-r from-green-400 to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-600/50 transition-all duration-300"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        title="Chat with us on WhatsApp"
      >
        <motion.div
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.div>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
          />
        )}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-8 z-40 w-auto sm:w-80 h-[70vh] sm:h-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
            style={{ bottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4.5rem))" }}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-green-400 to-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ARMZ Support</h3>
                  <p className="text-xs text-green-100">AI Assistant</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDirectContact}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Call us"
                >
                  <Phone className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex space-x-2 max-w-[80%] ${msg.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.isBot ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {msg.isBot ? (
                        <Bot className="h-4 w-4 text-green-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      msg.isBot 
                        ? 'bg-slate-100 text-slate-800' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isBot ? 'text-slate-500' : 'text-blue-100'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-2 max-w-[80%]">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="bg-slate-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none resize-none"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
              
              {/* Contact Options */}
              <div className="flex justify-center space-x-4 mt-3">
                <button
                  onClick={handleDirectContact}
                  className="text-xs text-slate-500 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </button>
                <button
                  onClick={handleEmailContact}
                  className="text-xs text-slate-500 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

