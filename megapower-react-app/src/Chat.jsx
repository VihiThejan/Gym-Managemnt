import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Avatar, Badge, message as antMessage, Select } from "antd";
import { 
  SendOutlined, 
  PaperClipOutlined, 
  UserOutlined,
  MessageOutlined,
  CloseOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import io from "socket.io-client";
import axios from "axios";
import MainLayout from "./components/Layout/MainLayout";
import "./Chat.css";

const { TextArea } = Input;
const { Option } = Select; 

// Only connect to Socket.IO when user is logged in (prevents 404 errors on page load)
let socket = null;

function Chat() {
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [file, setFile] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userList, setUserList] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]); 

    useEffect(() => {
        // Check if user is logged in via gym system
        const loginData = localStorage.getItem('login');
        if (loginData) {
            try {
                const userData = JSON.parse(loginData);
                let user = {
                    id: null,
                    name: '',
                    role: '',
                    username: ''
                };
                
                // Detect user role and set user info
                if (userData.Member_Id) {
                    user = {
                        id: userData.Member_Id,
                        name: `${userData.FName} ${userData.LName || ''}`,
                        role: 'Member',
                        username: `member_${userData.Member_Id}`
                    };
                } else if (userData.User_ID) {
                    user = {
                        id: userData.User_ID,
                        name: userData.Name,
                        role: 'Admin',
                        username: `admin_${userData.User_ID}`
                    };
                } else if (userData.Staff_ID) {
                    user = {
                        id: userData.Staff_ID,
                        name: userData.FName,
                        role: 'Staff',
                        username: `staff_${userData.Staff_ID}`
                    };
                }
                
                if (user.id) {
                    setCurrentUser(user);
                    setIsLoggedIn(true);
                    initializeSocket(user.id);
                    fetchAllUsers();
                }
            } catch (error) {
                console.error('Error parsing login data:', error);
                antMessage.error('Please login to the gym system first');
            }
        } else {
            antMessage.warning('Please login to the gym system to use chat');
        }
    }, []);

    const fetchAllUsers = async () => {
        try {
            // Only fetch Members and Staff (Admin list endpoint doesn't exist)
            const [membersRes, staffRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/member/list'),
                axios.get('http://localhost:5000/api/v1/staffmember/list')
            ]);

            const users = [];

            // Add members
            if (membersRes.data.data) {
                membersRes.data.data.forEach(member => {
                    users.push({
                        id: member.Member_Id,
                        name: `${member.FName} ${member.LName || ''}`,
                        role: 'Member',
                        type: 'member'
                    });
                });
            }

            // Add staff
            if (staffRes.data.data) {
                staffRes.data.data.forEach(staff => {
                    users.push({
                        id: staff.Staff_ID,
                        name: staff.FName,
                        role: 'Staff',
                        type: 'staff'
                    });
                });
            }

            setUserList(users);
            console.log('Loaded users:', users.length);
        } catch (error) {
            console.error('Error fetching users:', error);
            antMessage.error('Failed to load user list');
        }
    };

    const handleReceiverChange = (value) => {
        setReceiverId(value);
        const receiver = userList.find(u => u.id.toString() === value);
        setSelectedReceiver(receiver);
    };

    const initializeSocket = (userId) => {
        if (!socket) {
            socket = io.connect("http://localhost:5000");
            
            socket.on("receiveMessage", (data) => {
                // Only add message if it's from someone else (not the current user)
                if (data.sender_id !== userId) {
                    setChatMessages((prev) => [...prev, data]);
                }
            });

            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                antMessage.error("Chat server connection failed");
            });
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                socket.off("receiveMessage");
                socket.off("connect_error");
            }
        };
    }, []);

    const sendMessage = async () => {
        if (!isLoggedIn || !currentUser) {
            antMessage.warning("You must be logged in to send messages.");
            return;
        }

        if (!receiverId) {
            antMessage.warning("Please enter a receiver ID.");
            return;
        }

        if (!message.trim() && !file) {
            antMessage.warning("Please enter a message or attach a file.");
            return;
        }

        if (!socket) {
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

            const newMessage = {
                sender_id: currentUser.id,
                sender_name: currentUser.name,
                sender_role: currentUser.role,
                receiver_id: receiverId,
                message,
                file_url: fileUrl,
                voice_url: "",
                timestamp: new Date().toISOString(),
            };

            socket.emit("sendMessage", newMessage);
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
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
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

    return (
        <MainLayout>
            <div className="chat-page">
                <div className="chat-container">
                    {isLoggedIn && currentUser ? (
                        // Chat Interface
                        <div className="chat-interface">
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div className="chat-header-content">
                                    <MessageOutlined className="chat-header-icon" />
                                    <div>
                                        <h1 className="chat-title">Gym Chat</h1>
                                        <p className="chat-subtitle">
                                            {currentUser.name} ({currentUser.role})
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Receiver Selection */}
                            <div className="receiver-section">
                                <div className="receiver-input-group">
                                    <UserOutlined className="receiver-icon" />
                                    <Select
                                        showSearch
                                        value={receiverId || undefined}
                                        onChange={handleReceiverChange}
                                        placeholder="Select a user to chat with..."
                                        className="receiver-select"
                                        style={{ flex: 1 }}
                                        size="large"
                                        filterOption={(input, option) => {
                                            const searchText = input.toLowerCase();
                                            const user = userList.find(u => u.id.toString() === option.value);
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
                                            <Option key={`${user.type}_${user.id}`} value={user.id.toString()}>
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
                                {userList.length > 0 && (
                                    <p className="helper-text" style={{ marginTop: '8px', marginBottom: 0, color: '#6b7280', fontSize: '13px' }}>
                                        👥 {userList.length} users available - Search by name, role, or ID
                                    </p>
                                )}
                            </div>

                            {/* Messages Area */}
                            <div className="messages-area">
                                {chatMessages.length === 0 ? (
                                    <div className="empty-chat">
                                        <MessageOutlined style={{ fontSize: '64px', color: '#d1d5db' }} />
                                        <h3>No messages yet</h3>
                                        <p>Start a conversation by sending a message</p>
                                    </div>
                                ) : (
                                    <div className="messages-list">
                                        {chatMessages.map((msg, index) => {
                                            const isOwnMessage = msg.sender_id === currentUser.id;
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`message-bubble ${isOwnMessage ? 'own-message' : 'other-message'}`}
                                                >
                                                    <div className="message-header">
                                                        <Avatar 
                                                            icon={<UserOutlined />} 
                                                            style={{ 
                                                                backgroundColor: isOwnMessage ? '#667eea' : '#10b981' 
                                                            }}
                                                        />
                                                        <span className="message-sender">
                                                            {isOwnMessage ? 'You' : (msg.sender_name || `User ${msg.sender_id}`)}
                                                        </span>
                                                        {msg.timestamp && (
                                                            <span className="message-time">
                                                                {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="message-content">
                                                        {msg.message && <p>{msg.message}</p>}
                                                        {msg.file_url && (
                                                            <div className="message-attachment">
                                                                <PaperClipOutlined />
                                                                <a 
                                                                    href={msg.file_url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
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
                            </div>

                            {/* Message Input Area */}
                            <div className="message-input-area">
                                {file && (
                                    <div className="file-preview">
                                        <PaperClipOutlined />
                                        <span>{file.name}</span>
                                        <Button 
                                            type="text" 
                                            icon={<CloseOutlined />} 
                                            onClick={removeFile}
                                            size="small"
                                        />
                                    </div>
                                )}
                                <div className="input-controls">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        icon={<PaperClipOutlined />}
                                        onClick={() => document.getElementById('file-upload').click()}
                                        className="attach-button"
                                        size="large"
                                    />
                                    <TextArea
                                        placeholder="Type your message... (Press Enter to send)"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="message-textarea"
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={sendMessage}
                                        className="send-button"
                                        size="large"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Not Logged In Interface
                        <div className="auth-interface">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <MessageOutlined className="auth-icon" />
                                    <h1 className="auth-title">Gym Chat</h1>
                                    <p className="auth-subtitle">Connect with other gym members</p>
                                </div>

                                <div className="not-logged-in-message">
                                    <UserOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '20px' }} />
                                    <h3>Please Login First</h3>
                                    <p>You need to be logged into the gym management system to use the chat feature.</p>
                                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                                        Please navigate to the login page and sign in with your credentials (Member, Admin, or Staff account).
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Chat;
