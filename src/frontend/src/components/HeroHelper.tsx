import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UserMemory {
  askedQuestions: Set<string>;
  lastInteraction: number;
  preferences: {
    voiceEnabled: boolean;
    backgroundMode: boolean;
  };
}

export function HeroHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMemory, setUserMemory] = useState<UserMemory>({
    askedQuestions: new Set(),
    lastInteraction: Date.now(),
    preferences: { voiceEnabled: true, backgroundMode: false }
  });
  
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isAuthenticated = !!identity;
  const isAdmin = userProfile?.role === 'admin';
  const isMember = userProfile?.role === 'member';
  const isSubscriber = userProfile?.role === 'subscriber';

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Load user memory from localStorage
  useEffect(() => {
    const savedMemory = localStorage.getItem('heroHelperMemory');
    if (savedMemory) {
      const parsed = JSON.parse(savedMemory);
      setUserMemory({
        ...parsed,
        askedQuestions: new Set(parsed.askedQuestions || [])
      });
    }
  }, []);

  // Save user memory to localStorage
  useEffect(() => {
    const memoryToSave = {
      ...userMemory,
      askedQuestions: Array.from(userMemory.askedQuestions)
    };
    localStorage.setItem('heroHelperMemory', JSON.stringify(memoryToSave));
  }, [userMemory]);

  // Initialize with personalized greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = getTimeBasedGreeting();
      setMessages([{ 
        role: 'assistant', 
        content: greeting,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUserType = () => {
    if (isAdmin) return 'admin';
    if (isMember) return 'member';
    if (isSubscriber) return 'subscriber';
    return 'guest';
  };

  const getTimeBasedGreeting = (): string => {
    const hour = currentTime.getHours();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userName = userProfile?.name || getUserType();
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const userTypeContext = isAdmin 
      ? '👑 As an admin, you have full control over the platform.'
      : isAuthenticated 
        ? '🎬 Welcome back to your entertainment hub!'
        : '✨ Login to unlock the full Dominion Network experience!';

    return `${timeGreeting}, ${userName}! ${userTypeContext}\n\nI'm Hero, your AI assistant with voice capabilities. I can help you navigate the platform, explain features, create content, and provide personalized assistance.\n\nCurrent time: ${currentTime.toLocaleTimeString()} (${timeZone})\n\nHow can I assist you today?`;
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const normalizeQuestion = (text: string): string => {
    return text.toLowerCase().trim().replace(/[?!.,]/g, '');
  };

  const hasAskedBefore = (question: string): boolean => {
    const normalized = normalizeQuestion(question);
    return userMemory.askedQuestions.has(normalized);
  };

  const markAsAsked = (question: string) => {
    const normalized = normalizeQuestion(question);
    setUserMemory(prev => ({
      ...prev,
      askedQuestions: new Set([...prev.askedQuestions, normalized]),
      lastInteraction: Date.now()
    }));
  };

  const getComprehensiveResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    const userType = getUserType();
    const hour = currentTime.getHours();

    if (hasAskedBefore(input)) {
      const responses = [
        `I remember you asked about this before! Here's a quick reminder:`,
        `We've discussed this previously. Let me refresh your memory:`,
        `You've asked about this earlier. Here's what I told you:`
      ];
      const prefix = responses[Math.floor(Math.random() * responses.length)] + '\n\n';
      return prefix + getDetailedResponse(lowerInput, userType, hour);
    }

    return getDetailedResponse(lowerInput, userType, hour);
  };

  const getDetailedResponse = (lowerInput: string, userType: string, hour: number): string => {
    if (lowerInput.includes('time') || lowerInput.includes('clock')) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return `⏰ Current time: ${currentTime.toLocaleTimeString()}\n📍 Time zone: ${timeZone}\n📅 Date: ${currentTime.toLocaleDateString()}\n\nI track time to provide you with contextual greetings and time-aware assistance!`;
    }

    if (lowerInput.includes('voice') || lowerInput.includes('speak')) {
      return `🎤 Voice Features:\n\n• Click the microphone to speak your questions\n• I'll respond with voice if enabled\n• Toggle voice output with the speaker icon\n• Hands-free interaction available\n\nVoice is currently ${voiceEnabled ? 'enabled ✅' : 'disabled ❌'}. Background mode is ${backgroundMode ? 'active 🟢' : 'inactive ⚪'}.`;
    }

    const responses = [
      `As a ${userType}, you have access to ${isAuthenticated ? 'streaming content, wallet services, and the Excalibur Mall' : 'public content and streaming partners'}. ${isAuthenticated ? 'Try asking me about specific features!' : 'Login to unlock more features!'}\n\nI can also respond to voice commands - just click the microphone!`,
      `🎯 I can help with:\n• Platform navigation\n• Feature explanations\n• Content discovery\n• Wallet and card management\n• Affiliate program\n• Content creation\n• Voice interaction\n• Time-aware assistance\n\nWhat would you like to explore?`,
      `Dominion Network offers a complete entertainment and financial ecosystem. Ask me about streaming, shopping, earning through affiliates, or managing your digital assets!\n\n💡 Tip: Use voice commands for hands-free interaction!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    markAsAsked(input);

    const response = getComprehensiveResponse(input);

    setTimeout(() => {
      const assistantMessage: Message = { role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceEnabled) {
        speak(response);
      }
    }, 800);

    setInput('');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
        {backgroundMode && (
          <Badge variant="secondary" className="animate-pulse">
            <img 
              src="/assets/generated/background-assistant-icon-transparent.dim_24x24.png" 
              alt="Background Mode" 
              className="h-3 w-3 mr-1"
            />
            Monitoring
          </Badge>
        )}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-full shadow-2xl hover:shadow-primary/50 transition-all animate-pulse-glow group shrink-0 relative bg-primary/10 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50 flex items-center justify-center"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent animate-pulse" />
          {voiceEnabled && (
            <img 
              src="/assets/generated/voice-control-icon-transparent.dim_32x32.png" 
              alt="Voice Enabled" 
              className="absolute -bottom-1 -left-1 h-4 w-4"
            />
          )}
        </button>
      </div>
    );
  }

  return (
    <Card 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[90vw] md:w-[420px] lg:w-[480px] max-w-[500px] shadow-2xl z-50 flex flex-col border-primary/30 holographic-border"
      style={{
        height: 'min(600px, calc(100dvh - 6rem))',
        maxHeight: 'calc(100dvh - 6rem)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-2 ring-primary/50 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base truncate flex items-center gap-1.5">
              Hero Helper
              <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">
                {isAdmin ? 'AI Assistant (Admin)' : `AI Assistant (${getUserType()})`}
              </span>
              <Clock className="h-3 w-3 shrink-0" />
              <span className="text-[10px]">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (!voiceEnabled) stopSpeaking();
            }}
            className="h-8 w-8"
            title={voiceEnabled ? "Disable voice" : "Enable voice"}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setBackgroundMode(!backgroundMode)}
            className="h-8 w-8"
            title={backgroundMode ? "Disable background mode" : "Enable background mode"}
          >
            <User className={`h-4 w-4 ${backgroundMode ? 'text-green-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0">
        <div className="space-y-3 pb-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted border border-border'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-line">{message.content}</p>
                <p className="text-[9px] sm:text-[10px] opacity-60 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start">
              <Badge variant="secondary" className="animate-pulse">
                <Volume2 className="h-3 w-3 mr-1" />
                Speaking...
              </Badge>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-border bg-muted/30 shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder={isAdmin ? "Ask about admin features..." : "Ask me anything or use voice..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-background text-xs sm:text-sm h-10 min-w-0"
          />
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={toggleVoice}
            className="shrink-0 h-10 w-10"
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSend} size="icon" className="shrink-0 h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
          <span>💡 Click mic for voice input</span>
          <span>{userMemory.askedQuestions.size} questions remembered</span>
        </div>
      </div>
    </Card>
  );
}
