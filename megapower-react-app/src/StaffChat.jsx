import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  Avatar,
  Badge,
  message as antMessage,
  Select,
  Row,
  Col,
  Menu
} from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  UserOutlined,
  MessageOutlined,
  CloseOutlined,
  DownloadOutlined,
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  NotificationOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  StarOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Logo from "./components/Logo";
import "./StaffInfoTable.css";
import "./staffDashboard.css";

const { TextArea } = Input;
const { Option } = Select;
const { Sider, Content, Header } = Layout;

function StaffChat() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [file, setFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const currentUserRef = useRef(null);

  const getMenuItems = () => [
    { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '/staffDashboard' },
    { label: 'My Profile', icon: <UserOutlined />, key: '/staffProfile' },
    { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
    { label: 'Announcements', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
    { label: 'My Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
    { label: 'Appointments', icon: <ScheduleOutlined />, key: '/staffAppointment' },
    { label: 'Chat', icon: <MessageOutlined />, key: '/staffChat' },
    { label: 'Rate Trainer', icon: <StarOutlined />, key: '/Trainerrate' },
    { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '/WorkoutTracker' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    let userId = null;
    const loginData = localStorage.getItem('login');
    if (loginData) {
      try {
        const userData = JSON.parse(loginData);
        let user = null;

        // Staff user detection
        if (userData.Staff_ID) {
          user = {
            id: parseInt(userData.Staff_ID),
            name: `${userData.FName} ${userData.LName || ''}`.trim(),
            role: 'Staff',
            username: `staff_${userData.Staff_ID}`
          };
        } else if (userData.Member_Id) {
          user = {
            id: parseInt(userData.Member_Id),
            name: `${userData.FName} ${userData.LName || ''}`.trim(),
            role: 'Member',
            username: `member_${userData.Member_Id}`
          };
        } else if (userData.User_ID) {
          user = {
            id: parseInt(userData.User_ID),
            name: userData.Name || `Admin ${userData.User_ID}`,
            role: 'Admin',
            username: `admin_${userData.User_ID}`
          };
        }

        if (user && user.id) {
          userId = user.id;
          setCurrentUser(user);
          setIsLoggedIn(true);
          currentUserRef.current = user;
          fetchAllUsers();
        }
      } catch (error) {
        console.error('Error parsing login data:', error);
        antMessage.error('Please login to access chat');
      }
    } else {
      antMessage.warning('Please login to use chat');
    }

    // Initialize Socket.IO
    const socket = io.connect("http://localhost:5000");
    socketRef.current = socket;

    if (userId) {
      socket.emit('joinRoom', { userId: userId });
    }

    socket.on("receiveMessage", (data) => {
      const myUser = currentUserRef.current;
      if (!myUser) return;

      const senderId = parseInt(data.sender_id);
      const senderRole = data.sender_role || '';
      const recvId = parseInt(data.receiver_id);

      // Check if the sender is actually us (same id AND same role)
      const isFromMe = senderId === myUser.id && senderRole === myUser.role;

      // Only add message if it's NOT from us AND directed to us
      if (!isFromMe && recvId === myUser.id) {
        setChatMessages((prev) => [...prev, data]);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      antMessage.error("Chat server connection failed");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.off("connect_error");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const fetchAllUsers = async () => {
    try {
      const [membersRes, staffRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/member/list'),
        axios.get('http://localhost:5000/api/v1/staffmember/list')
      ]);

      const users = [];

      if (membersRes.data.data) {
        membersRes.data.data.forEach(member => {
          users.push({
            id: parseInt(member.Member_Id),
            uniqueKey: `member_${member.Member_Id}`,
            name: `${member.FName} ${member.LName || ''}`.trim(),
            role: 'Member',
            type: 'member'
          });
        });
      }

      if (staffRes.data.data) {
        staffRes.data.data.forEach(staff => {
          users.push({
            id: parseInt(staff.Staff_ID),
            uniqueKey: `staff_${staff.Staff_ID}`,
            name: `${staff.FName} ${staff.LName || ''}`.trim(),
            role: 'Staff',
            type: 'staff'
          });
        });
      }

      setUserList(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      antMessage.error('Failed to load user list');
    }
  };

  const handleReceiverChange = async (value) => {
    // value is the uniqueKey like "member_5" or "staff_3"
    setReceiverId(value);
    const receiver = userList.find(u => u.uniqueKey === value);
    setSelectedReceiver(receiver);
    const id = receiver ? receiver.id : parseInt(value);

    if (currentUser && currentUser.id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/messages/${currentUser.id}/${id}`);
        if (response.data.code === 200) {
          setChatMessages(response.data.data || []);
        }
      } catch (error) {
        console.error('Error loading message history:', error);
        setChatMessages([]);
      }
    }
  };

  const sendMessage = async () => {
    if (!isLoggedIn || !currentUser) {
      antMessage.warning("You must be logged in to send messages.");
      return;
    }

    if (!receiverId) {
      antMessage.warning("Please select a receiver.");
      return;
    }

    if (!message.trim() && !file) {
      antMessage.warning("Please enter a message or attach a file.");
      return;
    }

    if (!socketRef.current) {
      antMessage.error("Chat connection not established. Please refresh the page.");
      return;
    }

    try {
      let fileUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await axios.post("http://localhost:5000/api/v1/chat/upload", formData);
          fileUrl = response.data.fileUrl;
        } catch (error) {
          console.error("File upload failed:", error);
          antMessage.error("File upload failed. Sending message without attachment.");
        }
      }

      // Resolve receiver's numeric ID from uniqueKey
      const receiverUser = userList.find(u => u.uniqueKey === receiverId);
      const receiverNumericId = receiverUser ? receiverUser.id : parseInt(receiverId);

      const newMessage = {
        sender_id: parseInt(currentUser.id),
        sender_name: currentUser.name,
        sender_role: currentUser.role,
        receiver_id: receiverNumericId,
        message,
        file_url: fileUrl,
        voice_url: "",
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit("sendMessage", newMessage);
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setFile(null);
      antMessage.success("Message sent!");
    } catch (error) {
      console.error("Message sending failed:", error);
      antMessage.error("Failed to send message.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        antMessage.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      antMessage.success(`File "${selectedFile.name}" attached`);
    }
  };

  const removeFile = () => {
    setFile(null);
    antMessage.info("File removed");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    antMessage.success('Logged out successfully');
    navigate('/');
  };

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
  };

  return (
    <Layout className="info-layout">
      {/* Sidebar Navigation */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
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
          selectedKeys={['/staffChat']}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          className="dashboard-menu"
          style={{ background: 'transparent', border: 'none' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(102, 126, 234, 0.1)'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuFoldOutlined style={{ fontSize: '20px', color: 'white' }} />
        </div>
      </Sider>

      {/* Main Content */}
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="info-header" style={{ background: 'white' }}>
          <div className="header-left">
            <div
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <MessageOutlined style={{ marginRight: '8px' }} />
              Staff Chat
            </h2>
          </div>

          <div className="header-right">
            {currentUser && (
              <span style={{ marginRight: '16px', color: '#6b7280', fontSize: '14px' }}>
                {currentUser.name} ({currentUser.role})
              </span>
            )}
            <Avatar
              className="user-avatar"
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="info-content">

          {isLoggedIn && currentUser ? (
            <>
              {/* Receiver Selection Card */}
              <Card
                style={{
                  marginBottom: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <UserOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                      <Select
                        showSearch
                        value={receiverId || undefined}
                        onChange={handleReceiverChange}
                        placeholder="Select a user to chat with..."
                        style={{ flex: 1 }}
                        size="large"
                        filterOption={(input, option) => {
                          const searchText = input.toLowerCase();
                          const user = userList.find(u => u.uniqueKey === option.value);
                          if (!user) return false;

                          const fullName = user.name.toLowerCase();
                          const userId = user.id.toString();
                          const role = user.role.toLowerCase();

                          return fullName.includes(searchText) ||
                            userId.includes(searchText) ||
                            role.includes(searchText);
                        }}
                      >
                        {userList.map((user) => (
                          <Option key={`${user.type}_${user.id}`} value={`${user.type}_${user.id}`}>
                            {user.name} - {user.role} (ID: {user.id})
                          </Option>
                        ))}
                      </Select>
                      {selectedReceiver && (
                        <Badge
                          count={`${selectedReceiver.name} (${selectedReceiver.role})`}
                          style={{ backgroundColor: '#10b981' }}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
                {userList.length > 0 && (
                  <p style={{ marginTop: '12px', marginBottom: 0, color: '#6b7280', fontSize: '13px' }}>
                    👥 {userList.length} users available - Search by name, role, or ID
                  </p>
                )}
              </Card>

              {/* Messages Card */}
              <Card
                style={{
                  marginBottom: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  minHeight: '500px',
                  maxHeight: '600px',
                  overflow: 'auto',
                }}
              >
                {chatMessages.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    color: '#9ca3af'
                  }}>
                    <MessageOutlined style={{ fontSize: '64px', color: '#d1d5db' }} />
                    <h3 style={{ fontSize: '20px', marginTop: '16px', color: '#6b7280' }}>No messages yet</h3>
                    <p style={{ color: '#9ca3af' }}>Start a conversation by sending a message</p>
                  </div>
                ) : (
                  <div style={{ padding: '8px' }}>
                    {chatMessages.map((msg, index) => {
                      const isOwnMessage = parseInt(msg.sender_id) === parseInt(currentUser.id) && (msg.sender_role || '') === currentUser.role;
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                            marginBottom: '16px',
                          }}
                        >
                          <div style={{
                            maxWidth: '70%',
                            background: isOwnMessage
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : '#f3f4f6',
                            color: isOwnMessage ? 'white' : '#1f2937',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px',
                            }}>
                              <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                style={{
                                  backgroundColor: isOwnMessage ? '#ffffff30' : '#667eea'
                                }}
                              />
                              <span style={{ fontWeight: '600', fontSize: '13px' }}>
                                {isOwnMessage ? 'You' : (msg.sender_name || `User ${msg.sender_id}`)}
                              </span>
                              {msg.timestamp && (
                                <span style={{
                                  fontSize: '11px',
                                  opacity: 0.8,
                                  marginLeft: 'auto'
                                }}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                            {msg.message && <p style={{ margin: 0, fontSize: '14px' }}>{msg.message}</p>}
                            {msg.file_url && (
                              <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <PaperClipOutlined />
                                <a
                                  href={msg.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: isOwnMessage ? 'white' : '#667eea', textDecoration: 'underline' }}
                                >
                                  View Attachment
                                </a>
                                <DownloadOutlined />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </Card>

              {/* Message Input Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {file && (
                  <div style={{
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <PaperClipOutlined />
                    <span style={{ flex: 1, fontSize: '14px' }}>{file.name}</span>
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={removeFile}
                      size="small"
                    />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <input
                    type="file"
                    id="file-upload-staff"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Button
                    icon={<PaperClipOutlined />}
                    onClick={() => document.getElementById('file-upload-staff').click()}
                    size="large"
                    style={{ flexShrink: 0 }}
                  />
                  <TextArea
                    placeholder="Type your message... (Press Enter to send)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={sendMessage}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      flexShrink: 0,
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <UserOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '24px', color: '#374151', marginBottom: '12px' }}>Please Login First</h3>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                You need to be logged into the gym management system to use the chat feature.
              </p>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default StaffChat;
