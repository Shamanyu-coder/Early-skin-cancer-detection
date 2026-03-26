import React, { useState } from 'react';
import { MessageCircle, X, Send, Mic } from 'lucide-react';
import { getBotResponse } from '../utils/chatbotLogic';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I am the Skin Detection AI clinical assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const currentInput = input;
    setMessages(prev => [...prev, { text: currentInput, sender: 'user' }]);
    setInput('');
    
    setTimeout(() => {
      const response = getBotResponse(currentInput);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SkinCare Assistant</span>
            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === 'bot' ? 'bot-msg' : 'user-msg'}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="chatbot-input-area">
            <input 
              type="text" 
              className="input-field" 
              style={{ marginTop: 0, border: 'none', background: 'rgba(15, 23, 42, 0.8)' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
            />
            <button 
              onClick={startListening}
              style={{ background: isListening ? 'var(--danger)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <Mic size={18} />
            </button>
            <button 
              onClick={handleSend}
              style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} color="white" />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
