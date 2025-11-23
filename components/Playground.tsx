
import React, { useState, useEffect, useRef } from 'react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage, Role } from '../types';
import { PromptInputBox } from './ui/ai-prompt-box';
import { Content } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, Menu, X, Home, History, ExternalLink, Brain, ShieldAlert, Layout, MessageCircleQuestion, Link as LinkIcon, Sparkles, Bot, Key, ChevronRight } from 'lucide-react';
import { PersonaKey, PERSONAS } from '../constants';
import ReactMarkdown from 'react-markdown';

// --- Types for Storage ---
interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
  persona?: PersonaKey;
}

const STORAGE_KEY = 'thinkfirst_chats';
const API_KEY_STORAGE = 'thinkfirst_api_key';

// Helper for Persona Icons
export const getPersonaIcon = (iconId: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (iconId) {
    case 'brain': return <Brain {...props} />;
    case 'shield-alert': return <ShieldAlert {...props} />;
    case 'layout': return <Layout {...props} />;
    case 'message-circle-question': return <MessageCircleQuestion {...props} />;
    case 'link': return <LinkIcon {...props} />;
    default: return <Brain {...props} />;
  }
};

// Optimized Markdown Content with better code styling
const MarkdownContent: React.FC<{ content: string, className?: string }> = ({ content, className = "" }) => {
    return (
        <div className={`prose prose-stone max-w-none prose-p:leading-relaxed ${className}`}>
            <ReactMarkdown 
                components={{
                    a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline" {...props} />,
                    pre: ({node, ...props}) => (
                      <div className="my-4 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 shadow-sm">
                        <div className="flex items-center px-4 py-2 bg-stone-100/50 border-b border-stone-200">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                          </div>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm text-stone-800 font-mono" {...props} />
                      </div>
                    ),
                    code: ({node, className, children, ...props}: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match && !String(children).includes('\n');
                      return isInline ? (
                        <code className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-brand-700 font-mono text-sm" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

// --- Formatting Component ---
const FormattedMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const text = message.text;
  
  // Helper to render citations
  const renderCitations = () => {
    if (!message.groundingMetadata?.web || message.groundingMetadata.web.length === 0) return null;
    
    // Deduplicate URLs
    const uniqueSources = Array.from(new Map(message.groundingMetadata.web.map(item => [item.uri, item])).values()) as { uri: string; title: string }[];

    return (
      <div className="mt-4 pt-4 border-t border-stone-200/60">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ExternalLink size={10} />
          Sources
        </p>
        <div className="flex flex-wrap gap-2">
          {uniqueSources.map((source, idx) => (
            <a 
              key={idx} 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-stone-200 hover:border-brand-300 hover:text-brand-700 rounded-md text-xs text-stone-600 transition-all shadow-sm max-w-[200px] truncate"
            >
              <span className="truncate max-w-[150px]">{source.title}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  if (text.includes('###')) {
    const sections = text.split('###').filter(s => s.trim());
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const [titleLine, ...contentArr] = section.split('\n');
          
          const cleanTitle = titleLine.trim();
          const cleanContent = contentArr.join('\n').trim();
          
          if (!cleanTitle && !cleanContent) return null;

          let Icon = Sparkles;
          let titleColor = 'text-stone-800';
          let bgColor = 'bg-white';
          let borderColor = 'border-stone-200';
          
          if (cleanTitle.toLowerCase().includes('questions')) {
            Icon = MessageCircleQuestion;
            titleColor = 'text-brand-700';
            bgColor = 'bg-brand-50/50'; 
            borderColor = 'border-brand-100';
          } else if (cleanTitle.toLowerCase().includes('perspectives')) {
             Icon = Sparkles;
             titleColor = 'text-amber-700';
             bgColor = 'bg-amber-50/50';
             borderColor = 'border-amber-100';
          } else if (cleanTitle.toLowerCase().includes('structure')) {
             Icon = Layout;
             titleColor = 'text-emerald-700';
             bgColor = 'bg-emerald-50/50';
             borderColor = 'border-emerald-100';
          }

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className={`p-5 rounded-2xl border-l-4 ${bgColor} ${borderColor} bg-opacity-50`}
            >
              <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${titleColor}`}>
                <Icon className="w-5 h-5" /> {cleanTitle}
              </h4>
              <div className="text-stone-800 text-base leading-relaxed">
                 <MarkdownContent content={cleanContent} />
              </div>
            </motion.div>
          );
        })}
        {renderCitations()}
      </div>
    );
  }
  
  return (
    <div className="text-base leading-relaxed text-stone-800">
      <MarkdownContent content={text} />
      {renderCitations()}
    </div>
  );
};

interface PlaygroundProps {
  onBack?: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ onBack }) => {
  // --- State ---
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [activePersona, setActivePersona] = useState<PersonaKey>('default');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // API Key State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef(true);

  // --- Storage Logic ---
  
  // Load sessions and API key on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          const mostRecent = parsed.sort((a: ChatSession, b: ChatSession) => b.lastModified - a.lastModified)[0];
          loadSession(mostRecent);
        } else {
          createNewSession();
        }
      } catch (e) {
        console.error("Failed to load chats", e);
        createNewSession();
      }
    } else {
      createNewSession();
    }

    const storedKey = localStorage.getItem(API_KEY_STORAGE);
    if (storedKey) {
      setUserApiKey(storedKey);
    }
  }, []);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setUserApiKey(tempApiKey.trim());
      localStorage.setItem(API_KEY_STORAGE, tempApiKey.trim());
      setIsApiKeyModalOpen(false);
      setError(null);
    }
  };

  // Update current session in list when messages or persona change
  useEffect(() => {
    if (!currentSessionId || messages.length === 0) return;
    
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        // Generate title from first user message if generic
        let title = session.title;
        if (title === 'New Chat' && messages.length > 0) {
           const firstUserMsg = messages.find(m => m.role === Role.USER);
           if (firstUserMsg) {
             title = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
           }
        }
        return {
          ...session,
          messages: messages,
          title: title,
          persona: activePersona, // Save the current persona
          lastModified: Date.now()
        };
      }
      return session;
    }));
  }, [messages, currentSessionId, activePersona]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [{
        id: 'init',
        role: Role.MODEL,
        text: "Ready to think. What's on your mind?",
        timestamp: Date.now()
      }],
      persona: 'default',
      lastModified: Date.now()
    };
    
    setSessions(prev => [newSession, ...prev]);
    loadSession(newSession);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setActivePersona(session.persona || 'default'); // Restore persona
    setError(null);
    // Reset scroll on load
    setTimeout(() => {
       if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: "auto" });
       }
    }, 10);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions)); // Force save immediately
    
    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        loadSession(newSessions[0]);
      } else {
        createNewSession();
      }
    }
  };

  // --- Chat Logic & Smart Scrolling ---

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      isAutoScrollEnabled.current = isNearBottom;
    }
  };

  useEffect(() => {
    if (isAutoScrollEnabled.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger scroll when messages update, but only if allowed

  const getHistory = (): Content[] => {
    return messages
        .filter(m => m.text && m.id !== 'init') 
        .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
  };

  const handleSend = async (input: string, files?: File[], mode: 'default' | 'search' | 'think' = 'default', persona: PersonaKey = 'default') => {
    if ((!input.trim() && (!files || files.length === 0)) || isLoading) return;
    
    // Enable auto-scroll when user sends a message
    isAutoScrollEnabled.current = true;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Ensure activePersona is synced if it changed during send (though it's controlled)
    setActivePersona(persona);

    try {
      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: Role.MODEL,
        text: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      
      await streamChatResponse(
        userMessage.text,
        files || [],
        { mode, persona, history: getHistory(), apiKey: userApiKey },
        (update) => {
          if (update.text) {
             fullText += update.text;
          }
          
          setMessages(prev => prev.map(msg => {
            if (msg.id === modelMessageId) {
               const updatedMsg = { ...msg, text: fullText };
               if (update.groundingMetadata) {
                 // Merge existing sources with new ones if any
                 updatedMsg.groundingMetadata = update.groundingMetadata;
               }
               return updatedMsg;
            }
            return msg;
          }));
        }
      );
      
    } catch (err: any) {
      console.error(err);
      // Check for specific API Key errors
      if (err.message.includes("API Key missing") || err.message.includes("401") || err.message.includes("403") || err.message.includes("400")) {
        setIsApiKeyModalOpen(true);
        // Remove the temporary messages to allow retry
        setMessages(prev => prev.filter(m => m.id !== userMessage.id && m.role !== Role.MODEL));
        setError("Missing or invalid API Key. Please enter it below.");
      } else {
        setError("Connection interrupted. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden relative">
      
      {/* --- API Key Modal --- */}
      <AnimatePresence>
        {isApiKeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsApiKeyModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                   <Key className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Enter API Key</h3>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                  To use the Playground, you need a Google Gemini API Key. 
                  Your key is stored locally in your browser.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      API Key
                    </label>
                    <input 
                      type="password" 
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                  
                  <a 
                    href="https://aistudio.google.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors group"
                  >
                    <span className="text-sm font-medium text-stone-700">Get an API Key from Google AI Studio</span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-brand-600" />
                  </a>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                 <button 
                   onClick={() => setIsApiKeyModalOpen(false)}
                   className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-700 text-sm font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveApiKey}
                   disabled={!tempApiKey.trim()}
                   className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                 >
                   Save Key
                   <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Sidebar --- */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-stone-100 border-r border-stone-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          ${sidebarOpen ? 'shadow-xl md:shadow-none' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Top Left Header in Sidebar */}
          <div className="p-6 pb-4 border-b border-stone-200">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
               ThinkFirst
            </h1>
            <button 
               onClick={onBack} 
               className="mt-2 flex items-center gap-2 text-stone-500 hover:text-stone-900 text-xs font-medium transition-colors"
            >
               <Home size={14} />
               Back to Home
            </button>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-6 right-4 md:hidden text-stone-400">
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <button 
              onClick={createNewSession}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 hover:text-brand-600 py-3 px-4 rounded-xl shadow-sm border border-stone-200 transition-all duration-200 font-medium group"
            >
              <Plus size={18} className="text-stone-400 group-hover:text-brand-600 transition-colors" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2 mt-2">Recent</div>
            <div className="space-y-1">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => {
                    loadSession(session);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                    ${currentSessionId === session.id ? 'bg-white shadow-sm border border-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200/50'}
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Use the persona icon for the chat session if available, else MessageSquare */}
                    {session.persona ? (
                       <span className={currentSessionId === session.id ? 'text-brand-600' : 'text-stone-400'}>
                         {getPersonaIcon(PERSONAS[session.persona]?.iconId, "w-4 h-4")}
                       </span>
                    ) : (
                       <MessageSquare size={16} className={currentSessionId === session.id ? 'text-brand-500' : 'text-stone-400'} />
                    )}
                    <span className="truncate text-sm font-medium">{session.title || 'New Chat'}</span>
                  </div>
                  <button 
                    onClick={(e) => deleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer: API Key Settings */}
          <div className="p-4 border-t border-stone-200">
            <button 
              onClick={() => {
                setTempApiKey(userApiKey);
                setIsApiKeyModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors text-sm font-medium"
            >
              <Key size={16} />
              {userApiKey ? 'Update API Key' : 'Set API Key'}
            </button>
          </div>
        </div>
      </div>

      {/* --- Overlay for Mobile Sidebar --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto">
        
        {/* Header (Internal - Mobile Only for Title) */}
        <div className="flex-none h-16 px-4 flex items-center justify-between bg-stone-50/80 backdrop-blur-sm z-10">
           <div className="flex items-center gap-3 w-full">
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="p-2 -ml-2 text-stone-500 hover:bg-stone-200 rounded-lg md:hidden"
             >
               <Menu size={20} />
             </button>
             
             {/* Title - Visible on mobile, Hidden on Desktop (moved to sidebar) */}
             <div className="flex flex-col md:hidden">
               <h1 className="text-stone-900 font-bold text-lg tracking-tight leading-none">ThinkFirst</h1>
             </div>

             {/* Session Title - Visible everywhere */}
             <span className="ml-auto md:ml-0 text-stone-400 text-xs font-medium flex items-center gap-1">
                 <History size={12} />
                 <span className="max-w-[150px] truncate">
                   {sessions.find(s => s.id === currentSessionId)?.title || 'New Chat'}
                 </span>
             </span>
           </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[95%] sm:max-w-[85%] ${
                    msg.role === Role.USER ? '' : 'w-full'
                  }`}
                >
                  {msg.role === Role.USER ? (
                     <div className="bg-white border border-stone-200 shadow-sm text-stone-800 px-5 py-3 rounded-2xl rounded-tr-sm text-base leading-relaxed">
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                     </div>
                  ) : (
                     <div className="text-stone-800 pl-2">
                        {/* Clean output without avatar/logo */}
                        <FormattedMessage message={msg} />
                     </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full pl-2">
               <div className="px-4 py-3 rounded-2xl bg-white border border-stone-100 shadow-sm inline-flex items-center gap-3">
                 <Bot className="w-4 h-4 text-stone-400" />
                 <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Thinking</span>
                 <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
             </motion.div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm text-center rounded-xl mx-auto max-w-md flex flex-col items-center gap-2">
              <span>{error}</span>
              {error.includes("API Key") && (
                 <button 
                   onClick={() => setIsApiKeyModalOpen(true)}
                   className="text-xs bg-white px-3 py-1 rounded-full border border-red-200 shadow-sm hover:bg-red-50 font-bold"
                 >
                   Enter API Key
                 </button>
              )}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="flex-none p-4 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent relative z-20">
          <div className="max-w-3xl mx-auto">
            <PromptInputBox 
              onSend={handleSend} 
              isLoading={isLoading} 
              placeholder="Start a dialogue..."
              className="shadow-xl shadow-stone-200/50"
              selectedPersona={activePersona}
              onPersonaChange={setActivePersona}
            />
            <p className="text-center text-xs text-stone-400 mt-3">
               AI can make mistakes. Double check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
