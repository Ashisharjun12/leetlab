import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const chatRef = useRef(null);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Initialize chat
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: 'You are a DSA (Data Structures and Algorithms) expert. Your role is to:\n' +
          '1. Provide clear, concise explanations of DSA concepts\n' +
          '2. Include code examples when relevant\n' +
          '3. Focus only on DSA topics and programming concepts\n' +
          '4. Use simple language and step-by-step explanations\n' +
          '5. Provide practical examples and use cases\n' +
          '6. Explain time and space complexity when discussing algorithms\n' +
          '7. Include visual explanations when possible\n' +
          '8. Suggest related topics or concepts that might be helpful\n\n' +
          'Remember to:\n' +
          '- Keep explanations beginner-friendly\n' +
          '- Include code snippets in appropriate programming languages\n' +
          '- Explain the logic behind algorithms\n' +
          '- Provide real-world analogies when possible\n' +
          '- Suggest practice problems or exercises\n' +
          '- Correct any misconceptions in the user\'s understanding'
      },
      {
        role: 'model',
        parts: 'I understand. I will act as a DSA expert and provide clear, helpful explanations focusing on data structures and algorithms. I will include code examples, explain complexities, and make concepts easy to understand.'
      }
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chatRef.current) {
        const rect = chatRef.current.getBoundingClientRect();
        if (rect.top < 0) {
          chatRef.current.style.top = '20px';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button - only show when chat is closed */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      )}

      {/* Floating Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 right-6 z-[100] w-[350px] sm:w-[400px]"
            style={{ maxHeight: '80vh' }}
          >
            <Card className="bg-background border-green-200 dark:border-green-800 flex flex-col h-[500px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-green-100 dark:border-green-900 flex-shrink-0 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-green-600 dark:text-green-400">DSA Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-50 dark:hover:bg-green-950"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages (Scrollable) */}
              <ScrollArea className="flex-1 min-h-0 px-3 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-transparent" style={{ maxHeight: '340px' }}>
                <div className="space-y-3 pr-2">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-2.5 text-sm whitespace-pre-wrap break-words ${
                          message.role === 'user'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100'
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 rounded-lg p-2.5">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-100" />
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Dummy div for auto-scroll */}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-green-100 dark:border-green-900 flex-shrink-0 bg-background/80 backdrop-blur-md">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about DSA topics..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 h-9 w-9"
                    disabled={isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;