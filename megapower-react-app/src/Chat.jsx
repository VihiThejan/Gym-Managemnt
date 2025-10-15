import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

// Only connect to Socket.IO when user is logged in (prevents 404 errors on page load)
let socket = null;

function Chat() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [file, setFile] = useState(null);
    const [chatMessages, setChatMessages] = useState([]); 

    useEffect(() => {
        // Only initialize socket if user is logged in and socket isn't already connected
        if (token && !socket) {
            socket = io.connect("http://localhost:5000");
            
            socket.on("receiveMessage", (data) => {
                setChatMessages((prev) => [...prev, data]);
            });
        }

        return () => {
            if (socket) {
                socket.off("receiveMessage");
            }
        };
    }, [token]);

    const register = async () => {
        try {
            await axios.post("http://localhost:5000/api/v1/auth/register", { username, password });
            alert("User registered!");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Check the console for details.");
        }
    };

    const login = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/login", { username, password });
            if (response.data.token) {
                setToken(response.data.token);
                const decoded = jwtDecode(response.data.token);
                alert(`Logged in as User ID: ${decoded.id}`);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Check the console for details.");
        }
    };

    const sendMessage = async () => {
        if (!token) {
            alert("You must be logged in to send messages.");
            return;
        }

        if (!socket) {
            alert("Chat connection not established. Please try again.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            let fileUrl = "";

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const response = await axios.post("http://localhost:5000/api/v1/chat/upload", formData);
                fileUrl = response.data.fileUrl;
            }

            const newMessage = {
                sender_id: decoded.id,
                receiver_id: receiverId,
                message,
                file_url: fileUrl,
                voice_url: "",
            };

            socket.emit("sendMessage", newMessage);
            setChatMessages((prev) => [...prev, newMessage]); 
            setMessage("");
            setFile(null);
        } catch (error) {
            console.error("Message sending failed:", error);
            alert("Message sending failed. Check the console for details.");
        }
    };

    return (
        <div>
            <h2>Gym Chat App</h2>
            {token ? (
                <>
                    <input type="text" placeholder="Receiver ID" onChange={(e) => setReceiverId(e.target.value)} />
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <input type="text" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>

                    <h3>Chat History</h3>
                    <ul>
                        {chatMessages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.sender_id}:</strong> {msg.message}
                                {msg.file_url && <p><a href={msg.file_url} target="_blank" rel="noopener noreferrer">View File</a></p>}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={register}>Register</button>
                    <button onClick={login}>Login</button>
                </>
            )}
        </div>
    );
}

export default Chat;
