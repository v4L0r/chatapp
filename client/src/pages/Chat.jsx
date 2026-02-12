import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreVertical, Search, Paperclip, Smile, Phone, Video, ArrowLeft } from "lucide-react";
import socket from "../socket";
import API_URL from "../api";

export default function Chat() {
  // --- ORIGINAL LOGIC START ---
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]); 
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const lastTimestampRef = useRef(null);

  const loadHistory = async (username) => {
    const res = await fetch(
      `${API_URL}/api/messages/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setMessages(data);

    if (data.length > 0) {
      lastTimestampRef.current = data[data.length - 1].createdAt;
    } else {
      lastTimestampRef.current = null;
    }
  };


  useEffect(() => {
    socket.on("new_message", (message) => {
      console.log("📩 Incoming socket message:", message);
  
      if (message.from === activeUser) {
        setMessages((prev) => [...prev, message]);
      }
    });
  
    return () => {
      socket.off("new_message");
    };
  }, [activeUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
  
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      setUsers(data.map((u) => u.username));
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!activeUser) return;
  
    setMessages([]);             
    lastTimestampRef.current = null;
  
    loadHistory(activeUser);
  }, [activeUser]);


  const bottomRef= useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  };

  const sendMessage = async () => {
    if (!content.trim() || !activeUser) return;

    const currentUser = getCurrentUser();

    const optimisticMessage = {
      _id: crypto.randomUUID(),
      from: currentUser,        
      to: activeUser,
      content,
      createdAt: new Date().toISOString(),
      optimistic:true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        toUsername: activeUser,
        content,
      }),
    });

    setContent("");
  };
  // --- ORIGINAL LOGIC END ---

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentUser = getCurrentUser();

  return (
    // Use h-full so it fills the <main> area we created in App.jsx
    <div className="flex h-full w-full bg-gray-100 overflow-hidden font-sans text-gray-800">
      
      {/* --- Sidebar (User List) --- */}
      <div className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-full
        ${activeUser ? 'hidden md:flex md:w-1/3 lg:w-1/4' : 'w-full md:w-1/3 lg:w-1/4'}
      `}>
        
        {/* Sidebar Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
                ME
             </div>
             <h3 className="font-semibold text-lg text-gray-700">Chats</h3>
          </div>
          <div className="flex gap-4 text-gray-500">
            <motion.button whileHover={{ scale: 1.1, rotate: 10 }} className="hover:text-gray-700">
                <MoreVertical size={20} />
            </motion.button>
          </div>
        </div>


        {/* User List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {users.map((u) => (
            <motion.div
              key={u}
              onClick={() => setActiveUser(u)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(243, 244, 246, 1)",
                x: 5 
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 cursor-pointer border-b border-gray-50 transition-colors
                ${activeUser === u ? "bg-gray-100 border-l-4 border-l-emerald-500" : "hover:bg-gray-50 border-l-4 border-l-transparent"}
              `}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium shadow-sm">
                {u.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <h4 className="font-medium text-gray-900">{u}</h4>
                </div>
                <p className="text-sm text-gray-500 truncate">Click to start chatting...</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className={`flex flex-col flex-1 bg-[#efeae2] relative transition-all duration-300 h-full
         ${!activeUser ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {!activeUser ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 z-10">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4"
             >
                <span className="text-4xl">👋</span>
             </motion.div>
             <h2 className="text-2xl font-light text-gray-600">Welcome to Chat</h2>
             <p className="text-sm">Select a user to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            {/* CHANGE: Added shrink-0 to prevent header from collapsing */}
            <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-20 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                    onClick={() => setActiveUser(null)} 
                    className="md:hidden p-2 hover:bg-gray-200 rounded-full"
                >
                    <ArrowLeft size={20} />
                </button>
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold"
                >
                  {activeUser.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                    <h3 className="font-semibold text-gray-800">{activeUser}</h3>
                </div>
              </div>
              <div className="flex gap-4 text-gray-500">
                 <motion.button whileHover={{ scale: 1.1 }} className="hover:text-emerald-600"><Video size={20}/></motion.button>
                 <motion.button whileHover={{ scale: 1.1 }} className="hover:text-emerald-600"><Phone size={20}/></motion.button>
                 <div className="w-px h-6 bg-gray-300 mx-1"></div>
                 <motion.button whileHover={{ scale: 1.1 }} className="hover:text-gray-800"><Search size={20}/></motion.button>
              </div>
            </div>

            {/* Messages Area */}
            {/* CHANGE: Added min-h-0 to ensure flex child scrolling works correctly in nested flex containers */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 z-10 custom-scrollbar space-y-2 min-h-0">
              <AnimatePresence>
                {messages.map((m) => {
                  const from = typeof m.from === "string" ? m.from : m.from.username;
                  const isMe = from === currentUser;

                  return (
                    <motion.div
                      key={m._id || m.createdAt}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[60%] px-4 py-2 rounded-lg shadow-sm text-sm relative group
                          ${isMe 
                            ? "bg-emerald-100 text-gray-800 rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none"
                          }
                        `}
                      >
                        {!isMe && (
                            <span className="text-[10px] font-bold text-orange-500 block mb-1">
                                {from}
                            </span>
                        )}
                        
                        <p className="leading-relaxed">{m.content}</p>
                        
                        <span className={`text-[10px] block text-right mt-1 opacity-60 group-hover:opacity-100 transition-opacity
                            ${isMe ? "text-emerald-800" : "text-gray-500"}
                        `}>
                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {/* CHANGE: Added shrink-0 to prevent input from collapsing */}
            <div className="bg-gray-50 p-3 z-20 shrink-0">
                <div className="max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
                    <div className="flex pb-2 gap-2 pl-2 text-gray-400">
                        <motion.button whileHover={{ scale: 1.2, color: "#F59E0B" }}><Smile size={24} /></motion.button>
                        <motion.button whileHover={{ scale: 1.2, color: "#3B82F6" }}><Paperclip size={24} /></motion.button>
                    </div>

                    <textarea
                        placeholder="Type a message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 max-h-32 min-h-[40px] py-2 px-2 bg-transparent focus:outline-none resize-none text-gray-700 custom-scrollbar"
                        style={{ height: '40px' }}
                    />

                    <motion.button 
                        onClick={sendMessage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-xl flex items-center justify-center transition-colors
                            ${content.trim() ? "bg-emerald-500 text-white shadow-md" : "bg-gray-200 text-gray-400"}
                        `}
                    >
                        <Send size={20} className={content.trim() ? "ml-1" : ""} />
                    </motion.button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}