const express = require("express");
const mysql = require("mysql2");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "megapower",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// User Signup
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json({ error: err });
        db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err, result) => {
            if (err) return res.json({ error: err });
            res.json({ message: "User registered successfully" });
        });
    });
});

// User Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return res.json({ error: err });
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ id: result[0].id }, "secret", { expiresIn: "1h" });
                    res.json({ message: "Login successful", token });
                } else {
                    res.json({ message: "Invalid credentials" });
                }
            });
        } else {
            res.json({ message: "User not found" });
        }
    });
});

// File Upload Setup
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Upload File or Voice Message
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

// Store and Send Messages
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
        const { sender_id, receiver_id, message, file_url, voice_url } = data;
        db.query(
            "INSERT INTO messages (sender_id, receiver_id, message, file_url, voice_url) VALUES (?, ?, ?, ?, ?)",
            [sender_id, receiver_id, message, file_url, voice_url],
            (err, result) => {
                if (err) throw err;
                io.emit("receiveMessage", { sender_id, receiver_id, message, file_url, voice_url });
            }
        );
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Fetch Chat History
app.get("/messages/:sender_id/:receiver_id", (req, res) => {
    const { sender_id, receiver_id } = req.params;
    db.query(
        "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp",
        [sender_id, receiver_id, receiver_id, sender_id],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});
