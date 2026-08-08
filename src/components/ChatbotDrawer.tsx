import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ChatMessage, MedicalReport } from '../types.js';
import { sendReportChatMessage } from '../services/api.js';

interface Props {
  report: MedicalReport;
  isOpen: boolean;
  onClose: () => void;
  initialHistory?: ChatMessage[];
}

export const ChatbotDrawer: React.FC<Props> = ({
  report,
  isOpen,
  onClose,
  initialHistory = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialHistory);
  }, [initialHistory]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      reportId: report.id,
      sender: 'user',
      message: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const updatedHistory = await sendReportChatMessage(report.id, userText);
      setMessages(updatedHistory);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        reportId: report.id,
        sender: 'bot',
        message: 'Sorry, I encountered an issue connecting to the AI Assistant. Please check your network or try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Explain my abnormal test values simply.',
    'Are there any dietary items I should avoid?',
    'What questions should I ask my doctor about this report?',
    'Can you explain my medication dosage and side effects?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-[#070a11] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <span>Medical AI Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 font-mono">Gemini 3.6</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs">
                Context: {report.fileName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer sub-banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-[11px] text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>AI response is grounded in report context and intended for informational reference only.</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d111d]">
          {messages.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Ask questions about your report</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                I can clarify test terminology, explain reference ranges, and suggest clinical questions for your physician.
              </p>

              <div className="space-y-2 text-left">
                <p className="text-[11px] font-semibold text-amber-400 font-mono uppercase tracking-wider px-1">Suggested Prompts:</p>
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#0f1422] hover:bg-[#131929] border border-slate-800 text-xs text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      isUser ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-[#0f1422] text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <span className={`block text-[9px] mt-1.5 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing report context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-[#070a11] border-t border-amber-500/20 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about this report..."
            disabled={loading}
            className="flex-1 bg-[#0f1422] border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-all cursor-pointer border border-amber-400 shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
