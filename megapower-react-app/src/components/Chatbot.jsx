import React, { useState, useRef, useEffect } from 'react';
import { MessageOutlined, SendOutlined, CloseOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons';
import { Button, Input, Spin, message as antMessage } from 'antd';
import './Chatbot.css';

const { TextArea } = Input;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your Mega Power Gym assistant. How can I help you today? I can answer questions about:\n\n• Gym memberships & packages\n• Equipment & facilities\n• Training schedules\n• Fitness tips & nutrition\n• General gym information',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  // Log API key status on mount
  useEffect(() => {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.error('⚠️ Gemini API Key not configured! Please add your API key to .env file');
    } else {
      console.log('✅ Gemini API Key loaded:', GEMINI_API_KEY.substring(0, 10) + '...');
    }
  }, [GEMINI_API_KEY]);

  // System prompt to give context about the gym
  const SYSTEM_CONTEXT = `You are a helpful assistant for Mega Power Gym Management System. You help gym members and potential customers with:

MEMBERSHIP PACKAGES:
- Silver Package: ₹5,000/month - Basic gym access
- Gold Package: ₹14,000/3 months - Includes personal trainer (2 sessions/week) and nutrition guidance
- Premium Package: ₹25,000/6 months - Personal trainer (4 sessions/week), nutrition plan, group classes
- Platinum Package: ₹45,000/year - All premium features, priority booking, guest passes, locker facility

FACILITIES:
- Modern cardio equipment (treadmills, ellipticals, bikes)
- Full range of free weights and dumbbells
- Strength training machines (cable machines, leg press, bench press)
- Functional training area
- Group fitness classes (Yoga, Pilates, HIIT, Zumba)
- Personal training services
- Locker rooms and showers
- Nutrition counseling

FEATURES:
- Workout tracking and progress monitoring
- Online appointment booking with trainers
- Attendance tracking
- Member dashboard and payment management
- Equipment maintenance schedule
- Real-time announcements

TIMING:
- Monday to Saturday: 6:00 AM - 10:00 PM
- Sunday: 7:00 AM - 8:00 PM
- Closed on public holidays

LOCATION:
- Address: Colombo, Sri Lanka
- Contact: +94 77 123 4567
- Email: info@megapowergym.com

Provide helpful, friendly, and accurate information. Keep responses concise but informative. Use emojis appropriately to make conversations engaging.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (userMessage) => {
    try {
      console.log('🔄 Sending request to Gemini API...');
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_CONTEXT}\n\nUser Question: ${userMessage}\n\nProvide a helpful response:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      console.log('📤 Request URL:', GEMINI_API_URL.replace(GEMINI_API_KEY, 'API_KEY_HIDDEN'));
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', errorData);
        
        if (response.status === 400) {
          throw new Error('Invalid API request. Please check your API key configuration.');
        } else if (response.status === 403) {
          throw new Error('API key access denied. Please verify your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log('✅ Response received:', data);
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('💬 AI Response:', aiResponse.substring(0, 100) + '...');
        return aiResponse;
      } else if (data.error) {
        console.error('❌ API returned error:', data.error);
        throw new Error(data.error.message || 'API returned an error');
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(inputMessage);
      
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      let errorText = '❌ Sorry, I\'m having trouble connecting right now. ';
      
      if (error.message.includes('API key')) {
        errorText += 'There seems to be an issue with the API configuration. ';
      } else if (error.message.includes('Rate limit')) {
        errorText += 'Too many requests. Please wait a moment. ';
      } else if (error.message.includes('403') || error.message.includes('denied')) {
        errorText += 'API access denied. Please check your API key permissions. ';
      }
      
      errorText += 'Please try again or contact us at +94 77 123 4567.';
      
      antMessage.error(error.message || 'Failed to get response');
      
      const errorMessage = {
        role: 'assistant',
        content: errorText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Hi! I\'m your Mega Power Gym assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    antMessage.success('Chat cleared');
  };

  const quickQuestions = [
    '💰 What are your membership packages?',
    '⏰ What are your gym timings?',
    '🏋️ What equipment do you have?',
    '🎯 Do you offer personal training?',
    '📍 Where are you located?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`chatbot-float-button ${isOpen ? 'hidden' : ''}`}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={() => setIsOpen(true)}
          className="chat-toggle-btn"
        />
        <div className="chat-pulse"></div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Chat Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <RobotOutlined className="chatbot-icon" />
              <div className="chatbot-header-text">
                <h3>Gym Assistant</h3>
                <span className="chatbot-status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={clearChat}
                className="header-action-btn"
                title="Clear chat"
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsOpen(false)}
                className="header-action-btn"
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-bubble">
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-wrapper assistant-message">
                <div className="message-bubble typing-indicator">
                  <Spin size="small" />
                  <span className="typing-text">AI is typing...</span>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="quick-questions">
                <p className="quick-questions-title">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chatbot-input-container">
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading}
              className="chatbot-textarea"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            />
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            Powered by <strong>Google Gemini AI</strong>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
