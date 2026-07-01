"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface SupportChatProps {
  mode: 'investor' | 'admin';
}

export default function SupportChat({ mode }: SupportChatProps) {
  const { chatMessages, sendChatMessage, userEmail } = useApp();
  const [inputText, setInputText] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Determine active conversation email
  const activeConversationEmail = mode === 'investor' ? (userEmail || 'investor@seedglobal.com') : selectedEmail;

  // Filter messages for active conversation
  const filteredMessages = chatMessages.filter(
    (msg) => msg.investorEmail.toLowerCase() === activeConversationEmail?.toLowerCase()
  );

  // Group messages for Admin left panel selection
  const uniqueInvestors = Array.from(new Set(chatMessages.map((msg) => msg.investorEmail)));
  
  // Filter investor list based on search query
  const filteredInvestors = uniqueInvestors.filter(email => 
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  // Set default selected email for Admin if none is selected
  useEffect(() => {
    if (mode === 'admin' && !selectedEmail && uniqueInvestors.length > 0) {
      setSelectedEmail(uniqueInvestors[0]);
    }
  }, [mode, uniqueInvestors, selectedEmail]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationEmail) return;

    const senderRole = mode === 'investor' ? 'investor' : 'admin';
    sendChatMessage(activeConversationEmail, senderRole, inputText.trim());
    setInputText("");
  };

  const handleFaqClick = (question: string, answer: string) => {
    if (mode !== 'investor' || !activeConversationEmail) return;
    // Send the user question
    sendChatMessage(activeConversationEmail, 'investor', question);
    // Simulate auto-response from admin after 800ms
    setTimeout(() => {
      sendChatMessage(activeConversationEmail, 'admin', answer);
    }, 800);
  };

  const faqItems = [
    {
      q: "How does ROI payout work?",
      a: "ROI payouts are calculated based on the project's performance (e.g. computer lab rentals or fuel cost savings) and distributed directly to your simulated wallet. You can then request withdrawals."
    },
    {
      q: "What is 80G tax benefit?",
      a: "For scholarship campaigns, we provide 80G tax exemption certificates. They are issued within 15 days of contribution and can be downloaded from your portfolio tab."
    },
    {
      q: "KYC approval timeline?",
      a: "Super Admins typically audit and verify submitted Aadhaar/PAN documents within 24 hours. You'll receive a system notification once approved."
    }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '550px',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* CSS Styles injection for animations & custom scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(21, 128, 61, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: var(--success);
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
          animation: pulse 1.8s infinite;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 20px;
        }
        .investor-item {
          transition: all 0.2s ease;
        }
        .investor-item:hover {
          background-color: var(--bg-tertiary);
        }
        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 4px;
          word-break: break-word;
          box-shadow: var(--shadow-sm);
        }
        .faq-pill {
          padding: 8px 12px;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          text-align: left;
          width: 100%;
        }
        .faq-pill:hover {
          background-color: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-1px);
        }
      ` }} />

      {/* Admin Mode - Left Sidebar for Investor Selection */}
      {mode === 'admin' && (
        <div style={{
          width: '280px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--primary-light)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Sidebar Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Conversations</h3>
            <input 
              type="text" 
              placeholder="Search investor email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: 'var(--bg-secondary)'
              }}
            />
          </div>

          {/* Investor List */}
          <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            {filteredInvestors.length > 0 ? (
              filteredInvestors.map((email) => {
                const investorMessages = chatMessages.filter(m => m.investorEmail === email);
                const lastMsg = investorMessages[investorMessages.length - 1];
                const isActive = selectedEmail === email;

                return (
                  <div 
                    key={email}
                    onClick={() => setSelectedEmail(email)}
                    className="investor-item"
                    style={{
                      padding: '16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                      borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {email}
                    </div>
                    {lastMsg && (
                      <div style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '4px'
                      }}>
                        {lastMsg.senderRole === 'admin' ? 'You: ' : ''}{lastMsg.content}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No active conversations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investor Mode - Left Sidebar for FAQ suggestions */}
      {mode === 'investor' && (
        <div style={{
          width: '240px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--primary-light)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          height: '100%'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>Online Helpdesk</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Our admin compliance team typically replies in minutes.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Frequently Asked</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFaqClick(item.q, item.a)}
                  className="faq-pill"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Pane */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {/* Chat Pane Header */}
        {activeConversationEmail ? (
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {mode === 'investor' ? 'SUPPORT TICKET CHAT' : 'INVESTOR COMPLIANCE INQUIRY'}
              </div>
              <h4 style={{ fontSize: '1rem', marginTop: '2px' }}>
                {mode === 'investor' ? 'Seed Global Admins' : activeConversationEmail}
              </h4>
            </div>
            {mode === 'investor' && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', backgroundColor: 'var(--primary-light)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                🔒 Encrypted Support Channel
              </span>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</span>
            <h3>No Conversation Selected</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '320px', fontSize: '0.9rem' }}>
              Select an investor email thread from the left panel to begin support.
            </p>
          </div>
        )}

        {/* Messages List */}
        {activeConversationEmail && (
          <>
            <div className="chat-scroll" style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f8faf9'
            }}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg, index) => {
                  const isOwnMessage = (mode === 'investor' && msg.senderRole === 'investor') || 
                                      (mode === 'admin' && msg.senderRole === 'admin');

                  return (
                    <div 
                      key={msg.id || index}
                      style={{
                        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                        marginBottom: '14px',
                        width: '100%'
                      }}
                    >
                      <div 
                        className="message-bubble"
                        style={{
                          backgroundColor: isOwnMessage ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: isOwnMessage ? '#ffffff' : 'var(--text-primary)',
                          border: isOwnMessage ? 'none' : '1px solid var(--border-color)',
                          borderBottomRightRadius: isOwnMessage ? '4px' : '16px',
                          borderBottomLeftRadius: isOwnMessage ? '16px' : '4px'
                        }}
                      >
                        {msg.content}
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        marginRight: isOwnMessage ? '4px' : '0px',
                        marginLeft: isOwnMessage ? '0px' : '4px',
                        marginTop: '2px',
                        opacity: 0.8
                      }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  No messages yet. Start the conversation below!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '12px',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <input 
                type="text"
                placeholder="Type your message to support..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0 24px', height: '46px', margin: 0 }}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
