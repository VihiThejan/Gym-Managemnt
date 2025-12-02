import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Card, Input, Button, Avatar, Select, message as antMessage } from 'antd';
import { 
  MenuUnfoldOutlined, 
  UserOutlined, 
  DollarOutlined, 
  NotificationOutlined, 
  CalendarOutlined, 
  MessageOutlined, 
  StarOutlined, 
  ScheduleOutlined,
  SendOutlined,
  PaperClipOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Logo from './components/Logo';
import './MemberChat.css';

let socket;

const { Header, Content, Sider } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
};

const items = [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '7', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '8', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '9', path: '/Trainerrate' },
];

export const MemberChat = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Chat state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  // Initialize socket and fetch user data
  useEffect(() => {
    // Initialize Socket.IO
    socket = io.connect('http://localhost:5000');

    // Get login data from localStorage
    const loginData = localStorage.getItem('login');
    if (loginData) {
      const userData = JSON.parse(loginData);
      
      // Detect user role and ID
      if (userData.Member_Id) {
        setCurrentUser(userData.Member_Id);
        setCurrentUserRole('Member');
      } else if (userData.User_ID) {
        setCurrentUser(userData.User_ID);
        setCurrentUserRole('Admin');
      } else if (userData.Staff_ID) {
        setCurrentUser(userData.Staff_ID);
        setCurrentUserRole('Staff');
      }
    }

    // Fetch all users (members and staff)
    fetchAllUsers();

    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all users (members + staff)
  const fetchAllUsers = async () => {
    try {
      const [membersRes, staffRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/member/list'),
        axios.get('http://localhost:5000/api/v1/staffmember/list'),
      ]);

      const members = membersRes.data.data.map((member) => ({
        id: member.Member_Id,
        name: `${member.FName} ${member.LName}`,
        role: 'Member',
        email: member.Email,
      }));

      const staff = staffRes.data.data.map((s) => ({
        id: s.Staff_ID,
        name: `${s.FName} ${s.LName}`,
        role: s.Position || 'Staff',
        email: s.Email,
      }));

      setAllUsers([...members, ...staff]);
    } catch (error) {
      console.error('Error fetching users:', error);
      antMessage.error('Failed to load users');
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        antMessage.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  // Handle file upload
  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/chat/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data.fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      antMessage.error('Failed to upload file');
      return null;
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) {
      antMessage.warning('Please enter a message or attach a file');
      return;
    }

    if (!receiverId) {
      antMessage.warning('Please select a recipient');
      return;
    }

    if (!currentUser) {
      antMessage.error('You must be logged in to send messages');
      return;
    }

    let fileUrl = null;
    if (selectedFile) {
      fileUrl = await uploadFile();
      if (!fileUrl) return;
    }

    const loginData = JSON.parse(localStorage.getItem('login'));
    const senderName = `${loginData.FName} ${loginData.LName}`;

    const messageData = {
      sender_id: currentUser,
      sender_name: senderName,
      sender_role: currentUserRole,
      receiver_id: receiverId,
      message: newMessage.trim(),
      file_url: fileUrl,
      timestamp: new Date().toISOString(),
    };

    // Emit message via socket
    socket.emit('sendMessage', messageData);

    // Add to local messages
    setMessages((prev) => [...prev, messageData]);

    // Clear inputs
    setNewMessage('');
    setSelectedFile(null);
    setFilePreview('');
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout hasSider className="member-chat-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={siderStyle}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['8']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} style={menuItemStyle} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="dashboard-content-layout">
        <Header className="member-chat-header">
          <div className="header-content">
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
              <MessageOutlined style={{ marginRight: 12 }} />
              Chat with Trainers & Staff
            </h2>
          </div>
        </Header>

        <Content className="member-chat-content">
          <div className="chat-interface">
            {/* Chat Header Info */}
            {currentUser && (
              <div className="chat-info-box">
                <UserOutlined style={{ fontSize: '18px' }} />
                <span>
                  Logged in as: <strong>{currentUserRole}</strong> (ID: {currentUser})
                </span>
              </div>
            )}

            {/* Receiver Selection */}
            <div className="receiver-section">
              <div className="receiver-input-group">
                <UserOutlined className="receiver-icon" />
                <Select
                  showSearch
                  placeholder="Select a trainer or staff member to chat with"
                  className="receiver-select"
                  value={receiverId || undefined}
                  onChange={(value) => setReceiverId(value)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {allUsers.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.name} ({user.role}) - ID: {user.id}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <MessageOutlined style={{ fontSize: '64px' }} />
                  <h3>No messages yet</h3>
                  <p>Select a recipient and start chatting!</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg, index) => {
                    const isOwnMessage = msg.sender_id === currentUser;
                    return (
                      <div
                        key={index}
                        className={`message-bubble ${
                          isOwnMessage ? 'own-message' : 'other-message'
                        }`}
                      >
                        <div className="message-header">
                          <Avatar
                            style={{
                              backgroundColor: isOwnMessage
                                ? '#667eea'
                                : '#10b981',
                            }}
                          >
                            {msg.sender_name?.charAt(0) || 'U'}
                          </Avatar>
                          <span className="message-sender">
                            {msg.sender_name} ({msg.sender_role})
                          </span>
                          <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="message-content">
                          <p>{msg.message}</p>
                          {msg.file_url && (
                            <div className="message-attachment">
                              <PaperClipOutlined />
                              <a
                                href={msg.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DownloadOutlined /> View Attachment
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="message-input-area">
              {filePreview && (
                <div className="file-preview">
                  <PaperClipOutlined />
                  <span>{filePreview}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  />
                </div>
              )}
              <div className="input-controls">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <Button
                  className="attach-button"
                  icon={<PaperClipOutlined />}
                  onClick={() => fileInputRef.current?.click()}
                />
                <TextArea
                  className="message-textarea"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <Button
                  className="send-button"
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MemberChat;
