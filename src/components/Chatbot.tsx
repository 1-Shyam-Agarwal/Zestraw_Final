import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf, Sparkles, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Zestie, your eco-assistant. How can I help you on your sustainability journey today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        { q: "What products do you offer?", key: "products" },
        { q: "How to place an order? (COD)", key: "order" },
        { q: "Sell my Parali (For Farmers)", key: "farmer" },
        { q: "Delivery & Return Policy", key: "delivery" },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const handleToggle = () => setIsOpen(true);
        window.addEventListener('toggleChatbot', handleToggle);
        return () => window.removeEventListener('toggleChatbot', handleToggle);
    }, []);

    const handleSend = (textOverride?: string) => {
        const messageText = textOverride || input;
        if (!messageText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate Bot Response
        setTimeout(() => {
            const botResponse = getBotResponse(messageText.toLowerCase());
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (query: string) => {
        // Product Range
        if (query.includes('product') || query.includes('offer') || query.includes('item') || query.includes('plate') || query.includes('bowl') || query.includes('cup') || query.includes('cutlery')) {
            return "We offer a wide range of eco-friendly tableware: \n• Plates: 6\" & 12\" (Round/Square), 2-3-4-5 Section thalis. \n• Bowls: 120ml, 180ml, 250ml, 500ml. \n• Cups: 150ml (Chai), 250ml (Juice). \n• Cutlery: Eco-friendly Forks & Spoons. \n\nFor latest prices, please visit our Shop page!";
        }

        // Order & COD
        if (query.includes('order') || query.includes('place') || query.includes('buy') || query.includes('payment') || query.includes('cod')) {
            return "Placing an order is easy: \n1. Select your items & quantity. \n2. Enter delivery details. \n3. Click 'Place Order'. \n\nWe accept Cash on Delivery (COD) ONLY. No advance payment is required—you pay only when you receive your order!";
        }

        // Shipping & Delivery
        if (query.includes('shipping') || query.includes('delivery') || query.includes('delivered') || query.includes('days')) {
            return "Standard delivery takes 3–7 working days across India. Orders are processed within 24-48 hours. Shipping charges (if any) are shown clearly at checkout before confirmation.";
        }

        // Returns & Refunds
        if (query.includes('return') || query.includes('refund') || query.includes('damaged') || query.includes('wrong')) {
            return "We accept returns only for DAMAGED or WRONG items. Please report issues within 24 hours with photos. Since we are COD only, refunds are processed via UPI or Bank Transfer within 5-7 days of approval.";
        }

        // Farmer Section
        if (query.includes('farmer') || query.includes('sell') || query.includes('buy parali') || query.includes('punjab') || query.includes('haryana') || query.includes('bihar')) {
            return "We buy Parali to stop stubble burning! \n• Punjab (Hoshiarpur): ₹2000/ton \n• Haryana (Palwal): ₹2200/ton \n• Bihar: ₹1900/ton \n\nFrom another location? Fill the form on our Marketplace page and we'll reach out!";
        }

        // General
        if (query.includes('parali') || query.includes('straw')) {
            return "Parali is rice straw residue. Instead of letting farmers burn it and cause pollution, ZESTRAW buys it to create sustainable tableware. It's safe, 100% biodegradable, and helps the planet!";
        }

        if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return "Hi there! I'm Zestie. I can help you with product info, COD orders, shipping updates, or selling Parali waste. What's on your mind?";
        }

        return "That's a good question! For specific help, you can also email us at support@zestraw.com. Would you like to check our product catalog?";
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-lora">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-teal-600 p-4 text-white flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                                    <Leaf size={20} className="text-white animate-bounce-slow" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">Zestie Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                                        <p className="text-[9px] text-white/90 uppercase tracking-widest font-black">Active Now</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-[#fffaf5] space-y-4 no-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3.5 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-teal-600 text-white rounded-tr-none shadow-md'
                                        : 'bg-white border border-border text-foreground rounded-tl-none shadow-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-border p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-teal-500/40 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-teal-500/40 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-teal-500/40 rounded-full" />
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {!isTyping && messages[messages.length - 1]?.sender === 'bot' && (
                                <div className="flex flex-wrap gap-2 pt-2 pb-4">
                                    {suggestions.map((s, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => handleSend(s.q)}
                                            className="text-[10px] font-bold bg-white border border-teal-500/30 text-teal-600 px-3.5 py-2.5 rounded-xl hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm active:scale-95"
                                        >
                                            {s.q}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-border">
                            <div className="flex items-center gap-2 bg-neutral-50 rounded-2xl p-2 border border-border focus-within:border-primary/50 transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your green query..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="bg-teal-600 text-white p-2.5 rounded-xl hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                <div className="text-[9px] text-muted-foreground flex items-center gap-1 uppercase font-black tracking-tighter">
                                    <Leaf size={10} className="text-teal-500" /> Sustainable Support
                                </div>
                                <div className="text-[9px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
                                    <Info size={10} className="text-teal-500" /> 90-day compost guide
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            {/* Simple Float Button */}
            <div className="relative">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-teal-400 rounded-full blur-md"
                        />
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative bg-teal-600 text-white w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(13,148,136,0.3)] flex items-center justify-center hover:bg-teal-700 transition-all duration-300 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isOpen ? <X size={24} /> : <MessageCircle size={26} className="group-hover:drop-shadow-lg" />}
                </motion.button>
            </div>
        </div>
    );
};

export default Chatbot;
