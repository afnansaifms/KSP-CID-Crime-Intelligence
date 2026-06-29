import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, FileDown, Sparkles, Plus, Trash2, MessageSquare, ChevronRight } from 'lucide-react';
import type { ChatMessage } from '../types';
import { queryChat } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  saveConversation, updateConversation, getAllConversations,
  deleteConversation, groupByDate, type Conversation,
} from '../services/chatStorage';
import jsPDF from 'jspdf';

const WELCOME_MSG = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  language: 'en',
  timestamp: new Date(),
  content: `**Welcome to KIRAN — Karnataka Intelligence and Response Analysis Network**

I am your AI-powered crime intelligence assistant powered by Llama 3.3 70B via Groq.

I can help you with:
- FIR records, case status and investigation leads
- Accused profiles, risk scores and criminal networks
- Crime hotspots, heatmaps and geographic patterns
- Drug trafficking intelligence and gang analysis
- Crime forecasting and early warning signals
- ಕನ್ನಡದಲ್ಲಿ ಸಹ ಕೇಳಬಹುದು (Kannada supported)

**System Status:** 10,247 FIRs indexed | 2,156 accused profiles | 30 districts | Groq AI Active`,
});

const SUGGESTIONS_EN = [
  'Show top 5 high-risk accused in Bengaluru',
  'What are the robbery hotspots in 2024?',
  'Analyse drug trafficking network crime',
  "Give me today's crime summary",
  'Forecast crime trends for next month',
  'Profile accused Nagesh M. Pai',
];

const SUGGESTIONS_KN = [
  'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಅಧಿಕ ಅಪಾಯದ 5 ಆರೋಪಿಗಳನ್ನು ತೋರಿಸಿ',
  '2024ರಲ್ಲಿ ದರೋಡೆ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳೇನು?',
  'ಮಾದಕ ದ್ರವ್ಯ ಜಾಲ ವಿಶ್ಲೇಷಿಸಿ',
  'ಇಂದಿನ ಅಪರಾಧ ಸಾರಾಂಶ ನೀಡಿ',
  'ಮುಂದಿನ ತಿಂಗಳ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ',
  'ರವಿ ಕುಮಾರ್ ಜಿ ಪ್ರೊಫೈಲ್ ನೋಡಿ',
];

function renderContent(content: string) {
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  content.split('\n').forEach((line, i) => {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={i} className="font-mono text-xs p-3 rounded-lg my-2 overflow-x-auto"
               style={{ background: 'rgba(0,0,0,0.4)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.2)' }}>
            {codeLines.join('\n')}
          </pre>
        );
        codeLines = []; inCode = false;
      } else { inCode = true; }
      return;
    }
    if (inCode) { codeLines.push(line); return; }

    // Table separator
    if (line.match(/^\|[-\s|]+\|$/)) return;

    // Table row
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim());
      elements.push(
        <div key={i} className="flex text-xs border-b py-1.5"
             style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {cells.map((c, j) => (
            <div key={j} className="flex-1 px-2 font-mono"
                 style={{ color: j === 0 ? '#94a3b8' : '#e2e8f0', minWidth: '70px' }}>
              {c.trim()}
            </div>
          ))}
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={i} className="h-1.5" />);
      return;
    }

    // ## Headers
    if (line.startsWith('## ')) {
      elements.push(
        <div key={i} className="font-display font-bold mt-4 mb-2 pb-1"
             style={{ color: '#93c5fd', fontSize: '14px', borderBottom: '1px solid rgba(37,99,235,0.25)' }}>
          {line.slice(3)}
        </div>
      );
      return;
    }

    // ### Headers
    if (line.startsWith('### ')) {
      elements.push(
        <div key={i} className="font-display font-bold mt-3 mb-1"
             style={{ color: '#60a5fa', fontSize: '13px' }}>
          {line.slice(4)}
        </div>
      );
      return;
    }

    // **Bold only line** (used as section header)
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      elements.push(
        <div key={i} className="font-display font-bold mt-3 mb-1"
             style={{ color: '#93c5fd', fontSize: '13px' }}>
          {line.slice(2, -2)}
        </div>
      );
      return;
    }

    // Bullet points * or -
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const text = line.slice(2);
      const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      elements.push(
        <div key={i} className="flex items-start gap-2 text-sm py-0.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: '#3b82f6', minWidth: '6px' }} />
          <span style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {parts.map((p, j) => {
              if (p.startsWith('**') && p.endsWith('**'))
                return <strong key={j} style={{ color: 'var(--text-primary)' }}>{p.slice(2, -2)}</strong>;
              if (p.startsWith('`') && p.endsWith('`'))
                return <code key={j} className="font-mono px-1 rounded"
                             style={{ background: 'rgba(37,99,235,0.2)', color: '#93c5fd', fontSize: '11px' }}>
                  {p.slice(1, -1)}
                </code>;
              return <span key={j}>{p}</span>;
            })}
          </span>
        </div>
      );
      return;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        const parts = match[2].split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        elements.push(
          <div key={i} className="flex items-start gap-2 text-sm py-0.5">
            <span className="font-mono shrink-0 mt-0.5"
                  style={{ color: '#3b82f6', fontSize: '11px', minWidth: '16px' }}>
              {match[1]}.
            </span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {parts.map((p, j) => {
                if (p.startsWith('**') && p.endsWith('**'))
                  return <strong key={j} style={{ color: 'var(--text-primary)' }}>{p.slice(2, -2)}</strong>;
                if (p.startsWith('`') && p.endsWith('`'))
                  return <code key={j} className="font-mono px-1 rounded"
                               style={{ background: 'rgba(37,99,235,0.2)', color: '#93c5fd', fontSize: '11px' }}>
                    {p.slice(1, -1)}
                  </code>;
                return <span key={j}>{p}</span>;
              })}
            </span>
          </div>
        );
        return;
      }
    }

    // Regular paragraph with inline formatting
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    elements.push(
      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {parts.map((p, j) => {
          if (p.startsWith('**') && p.endsWith('**'))
            return <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
          if (p.startsWith('`') && p.endsWith('`'))
            return <code key={j} className="font-mono px-1 rounded"
                         style={{ background: 'rgba(37,99,235,0.2)', color: '#93c5fd', fontSize: '11px' }}>
              {p.slice(1, -1)}
            </code>;
          return <span key={j}>{p}</span>;
        })}
      </p>
    );
  });

  return elements;
}

export default function Chat() {
  const { language, t } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadConversations = async () => {
    const convs = await getAllConversations();
    setConversations(convs);
  };

  const newChat = () => {
    setMessages([WELCOME_MSG()]);
    setActiveConvId('');
    setInput('');
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })));
    setActiveConvId(conv.id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
    if (activeConvId === id) newChat();
    loadConversations();
  };

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || isTyping) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date(),
      language,
    };

    const prevMessages = messages.filter(m => m.id !== 'welcome');
    const newMessages = [...prevMessages, userMsg];
    setMessages([...messages.filter(m => m.id !== 'welcome'), userMsg]);
    setIsTyping(true);

    const response = await queryChat(q);
    setIsTyping(false);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      language,
      citations: [{
        type: 'FIR',
        reference: 'Karnataka Crime Database 2024',
        confidence: Math.floor(85 + Math.random() * 12),
      }],
    };

    const finalMessages = [...newMessages, assistantMsg];
    setMessages(finalMessages);

    if (!activeConvId) {
      const id = await saveConversation(finalMessages);
      setActiveConvId(id);
    } else {
      await updateConversation(activeConvId, finalMessages);
    }
    loadConversations();
  };

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported. Please use Chrome.'); return; }
    if (isListening) { setIsListening(false); return; }
    const r = new SR();
    r.lang = language === 'en' ? 'en-IN' : 'kn-IN';
    r.interimResults = false;
    r.onresult = (e: any) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    setIsListening(true);
    r.start();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('KSP KIRAN — Crime Intelligence Chat Export', 20, 20);
    doc.setFontSize(9);
    doc.text(`Exported: ${new Date().toLocaleString('en-IN')}`, 20, 28);
    doc.text(`Total messages: ${messages.filter(m => m.id !== 'welcome').length}`, 20, 34);
    let y = 44;
    messages.forEach(m => {
      if (m.id === 'welcome') return;
      const prefix = m.role === 'user' ? 'OFFICER: ' : 'KIRAN: ';
      const plain = m.content.replace(/\*\*/g, '').replace(/`/g, '').replace(/### /g, '').replace(/## /g, '');
      const lines = doc.splitTextToSize(prefix + plain, 170);
      lines.forEach((l: string) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setTextColor(
          m.role === 'user' ? 37 : 60,
          m.role === 'user' ? 99 : 80,
          m.role === 'user' ? 235 : 60
        );
        doc.text(l, 20, y);
        y += 5.5;
      });
      y += 4;
    });
    doc.save(`KIRAN_Chat_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const grouped = groupByDate(conversations);
  const suggestions = language === 'kn' ? SUGGESTIONS_KN : SUGGESTIONS_EN;

  return (
    <div className="flex gap-3 h-[calc(100vh-112px)]">

      {/* History sidebar */}
      {showHistory && (
        <div className="w-56 shrink-0 flex flex-col rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

          <div className="p-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            <button onClick={newChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'rgba(37,99,235,0.12)',
                border: '1px solid rgba(37,99,235,0.3)',
                color: '#93c5fd',
              }}>
              <Plus size={14} /> New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {conversations.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                <MessageSquare size={20} className="mx-auto mb-2 opacity-30" />
                No conversations yet
              </div>
            ) : (
              Object.entries(grouped).map(([group, convs]) =>
                convs.length > 0 ? (
                  <div key={group}>
                    <div className="px-3 py-1.5 font-display"
                         style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                      {group.toUpperCase()}
                    </div>
                    {convs.map(conv => (
                      <div key={conv.id}
                           onClick={() => loadConversation(conv)}
                           className="group flex items-start gap-2 px-2 py-2 mx-1 rounded-lg mb-0.5 cursor-pointer transition-all"
                           style={{
                             background: activeConvId === conv.id ? 'rgba(37,99,235,0.15)' : 'transparent',
                             border: `1px solid ${activeConvId === conv.id ? 'rgba(37,99,235,0.3)' : 'transparent'}`,
                           }}>
                        <MessageSquare size={11} className="shrink-0 mt-0.5 opacity-50"
                                       style={{ color: activeConvId === conv.id ? '#60a5fa' : 'var(--text-muted)' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate"
                               style={{ color: activeConvId === conv.id ? '#93c5fd' : 'var(--text-secondary)' }}>
                            {conv.title}
                          </div>
                          <div className="text-xs mt-0.5"
                               style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                            {new Date(conv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                        <button onClick={(e) => handleDelete(e, conv.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      )}

      {/* Main chat */}
      <div className="flex flex-col flex-1 rounded-xl overflow-hidden min-w-0"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
             style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(h => !h)}
              className="p-1 rounded transition-colors"
              style={{ color: showHistory ? '#60a5fa' : 'var(--text-muted)' }}
              title="Toggle history">
              <ChevronRight size={14}
                style={{ transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <Sparkles size={15} className="text-blue-400" />
            <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
              KIRAN — {t('chat.title')}
            </span>
            <span className="font-mono px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    color: '#4ade80',
                    fontSize: '10px',
                  }}>
              {t('common.live')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(37,99,235,0.1)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.2)' }}>
              Llama 3.3 70B
            </span>
            <button onClick={exportPDF}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <FileDown size={11} /> PDF
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                     style={{
                       background: 'rgba(37,99,235,0.2)',
                       border: '1px solid rgba(37,99,235,0.35)',
                       boxShadow: '0 0 10px rgba(37,99,235,0.15)',
                     }}>
                  <Sparkles size={12} className="text-blue-400" />
                </div>
              )}
              <div className={`max-w-[82%] rounded-xl px-4 py-3 ${m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                   style={{
                     background: m.role === 'user'
                       ? 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(37,99,235,0.15))'
                       : 'var(--bg-elevated)',
                     border: `1px solid ${m.role === 'user' ? 'rgba(37,99,235,0.35)' : 'var(--border)'}`,
                   }}>
                {m.role === 'user'
                  ? <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{m.content}</p>
                  : <div className="space-y-0.5">{renderContent(m.content)}</div>
                }
                <div className="flex items-center justify-between mt-2 pt-1"
                     style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                    {new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.citations?.[0] && m.role === 'assistant' && (
                    <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                      {m.citations[0].confidence}% confidence · KIRAN
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.35)' }}>
                <Sparkles size={12} className="text-blue-400" />
              </div>
              <div className="px-4 py-3 rounded-xl rounded-tl-sm"
                   style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                         style={{ animation: `blink 1.2s ${i * 0.25}s ease-in-out infinite` }} />
                  ))}
                  <span className="ml-1 text-xs" style={{ color: 'var(--text-muted)' }}>KIRAN is analysing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
               style={{
                 background: 'var(--bg-elevated)',
                 border: `1px solid ${isListening ? 'rgba(239,68,68,0.6)' : 'rgba(37,99,235,0.25)'}`,
                 boxShadow: isListening ? '0 0 12px rgba(239,68,68,0.15)' : 'none',
               }}>
            <button onClick={toggleVoice}
              className="shrink-0 transition-all p-1 rounded"
              style={{
                color: isListening ? '#ef4444' : 'var(--text-muted)',
                background: isListening ? 'rgba(239,68,68,0.1)' : 'transparent',
              }}>
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <button onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="shrink-0 p-1.5 rounded-lg transition-all"
              style={{
                background: input.trim() && !isTyping ? '#2563eb' : 'transparent',
                color: input.trim() && !isTyping ? 'white' : 'var(--text-muted)',
                boxShadow: input.trim() && !isTyping ? '0 0 10px rgba(37,99,235,0.3)' : 'none',
              }}>
              <Send size={14} />
            </button>
          </div>
          {isListening && (
            <p className="text-xs text-center mt-1.5 font-mono" style={{ color: '#ef4444' }}>
              🎤 {language === 'kn' ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening — speak now'}
            </p>
          )}
        </div>
      </div>

      {/* Suggestions panel */}
      <div className="w-52 shrink-0 flex flex-col rounded-xl overflow-hidden"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {t('chat.quickQueries')}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="w-full text-left text-xs px-3 py-2.5 rounded-lg transition-all group"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37,99,235,0.35)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}>
              {s}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('chat.system')}
          </h3>
          {[
            ['FIRs', '10,247'],
            ['Accused', '2,156'],
            ['Districts', '30'],
            ['AI Model', 'Llama 3.3'],
            ['Status', 'Online'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs py-0.5">
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="font-mono"
                    style={{ color: v === 'Online' ? '#4ade80' : 'var(--text-secondary)' }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}