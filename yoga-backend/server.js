const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

app.post('/api/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;
    if (!username || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    if (!Number.isInteger(Number(mobile)) || mobile.toString().length !== 10) {
        return res.status(400).json({ message: 'Mobile number must be a 10-digit integer.' });
    }
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO users (username, email, mobile, password) VALUES (?, ?, ?, ?)', 
                [username, email, Number(mobile), hashedPassword], (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ error: 'Failed to hash password' });
        }
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required!' });
    }
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = results[0];
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Clear any previous user_activity records for a fresh session
            db.query('DELETE FROM user_activity WHERE user_id = ?', [user.id], (delErr) => {
                if (delErr) {
                    console.error(`Error clearing user_activity for user ${user.id}:`, delErr);
                    // Optionally, continue login even if deletion fails
                }
                // Generate JWT token
                const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token });
            });
        } catch (error) {
            console.error('Error comparing password:', error);
            return res.status(500).json({ error: 'Error during login process' });
        }
    });
});

app.post('/api/logout', authenticateToken, (req, res) => {
    const userId = req.user.id;
    // Delete all user_activity records upon logout
    db.query('DELETE FROM user_activity WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error(`Error clearing user_activity for user ${userId}:`, err);
            return res.status(500).json({ error: 'Database error while clearing user activity' });
        }
        res.status(200).json({ message: 'User activity cleared on logout' });
    });
});

app.post('/api/practice', authenticateToken, (req, res) => {
    const { poseId } = req.body;
    console.log(`POST /api/practice for user ${req.user.id} received: poseId=${poseId}`);
    if (!poseId) {
        console.error('Missing poseId in the request body');
        return res.status(400).json({ error: 'Missing poseId' });
    }
    db.query(
        'INSERT INTO user_activity (user_id, activity_type, yoga_pose_id, detail) VALUES (?, ?, ?, ?)',
        [req.user.id, 'practice', poseId, 'User completed the pose successfully'],
        (err, results) => {
            if (err) {
                console.error('Error logging practice activity:', err);
                return res.status(500).json({ error: 'Database error in practice endpoint' });
            }
            console.log('Practice activity inserted:', results);
            res.status(200).json({ message: 'Practice activity logged successfully' });
        }
    );
});

app.post('/api/diet-chart', authenticateToken, (req, res) => {
    const { meals } = req.body;
    // Check if a diet chart record already exists for this user
    db.query(
        'SELECT * FROM user_activity WHERE user_id = ? AND activity_type = "diet_chart" LIMIT 1',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error('Error checking existing diet chart:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(200).json({ message: 'Diet chart already generated' });
            } else {
                db.query(
                    'INSERT INTO user_activity (user_id, activity_type, detail) VALUES (?, ?, ?)', 
                    [req.user.id, 'diet_chart', `Generated diet chart: ${meals}`],
                    (err, results) => {
                        if (err) {
                            console.error('Error logging diet chart activity:', err);
                            return res.status(500).json({ error: 'Database error' });
                        }
                        res.status(200).json({ message: 'Diet chart activity logged successfully' });
                    }
                );
            }
        }
    );
});

app.get('/api/poses', (req, res) => {
    db.query('SELECT * FROM yoga_poses', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

app.get('/api/yoga_poses/:id', authenticateToken, (req, res) => {
    const poseId = parseInt(req.params.id, 10);
    console.log(`Fetching yoga pose ${poseId} for user ${req.user.id}`);
    db.query('SELECT * FROM yoga_poses WHERE id = ?', [poseId], (err, results) => {
        if (err) {
            console.error('Database error when fetching pose:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pose not found' });
        }
        return res.status(200).json(results[0]);
    });
});

app.post('/api/recommended-poses', authenticateToken, (req, res) => {
    console.log('Received request:', req.body);
    db.query('SELECT * FROM yoga_poses', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No yoga poses found.' });
        }
        res.status(200).json(results);
    });
});

app.get('/api/progress-report', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const sessionsQuery = `
        SELECT COUNT(*) AS completed 
        FROM user_activity 
        WHERE user_id = ? AND activity_type = 'practice'
    `;
    const historyQuery = `
        SELECT 
            MAX(ua.id) AS id,
            ua.user_id,
            ua.activity_type,
            ua.yoga_pose_id,
            MAX(ua.activity_date) AS activity_date,
            ANY_VALUE(ua.detail) AS detail,
            ANY_VALUE(ua.accuracy) AS accuracy,
            ANY_VALUE(yp.image_url) AS image_url,
            ANY_VALUE(yp.name) AS name
        FROM user_activity ua
        INNER JOIN yoga_poses yp ON ua.yoga_pose_id = yp.id
        WHERE ua.user_id = ? AND ua.activity_type = 'practice'
        GROUP BY ua.yoga_pose_id
        ORDER BY activity_date DESC
    `;
    const dietQuery = `
        SELECT activity_date AS date, detail AS meals 
        FROM user_activity 
        WHERE user_id = ? AND activity_type = 'diet_chart' 
        ORDER BY activity_date DESC
        LIMIT 1
    `;
    const recommendedQuery = `
        SELECT yp.id, yp.name, yp.image_url
        FROM yoga_poses yp 
        WHERE yp.id NOT IN (
            SELECT DISTINCT yoga_pose_id 
            FROM user_activity 
            WHERE user_id = ? AND activity_type = 'practice' AND yoga_pose_id IS NOT NULL
        )
        ORDER BY RAND()
        LIMIT 6
    `;

    db.query(sessionsQuery, [userId], (err, sessionResults) => {
        if (err) {
            console.error('Error querying sessions:', err);
            return res.status(500).json({ error: 'Database error in sessions' });
        }
        db.query(historyQuery, [userId], (err, historyResults) => {
            if (err) {
                console.error('Error querying history:', err);
                return res.status(500).json({ error: 'Database error in history' });
            }
            db.query(dietQuery, [userId], (err, dietResults) => {
                if (err) {
                    console.error('Error querying diet charts:', err);
                    return res.status(500).json({ error: 'Database error in diet charts' });
                }
                db.query(recommendedQuery, [userId], (err, recommendedResults) => {
                    if (err) {
                        console.error('Error querying recommended poses:', err);
                        return res.status(500).json({ error: 'Database error in recommended poses' });
                    }
                    res.status(200).json({
                        sessions: { completed: sessionResults[0].completed, total: 20 },
                        history: historyResults,
                        dietCharts: dietResults,
                        recommendedPoses: recommendedResults
                    });
                });
            });
        });
    });
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Invalid message format" });
        }
        const result = await model.generateContent(message);
        const responseText = result.response.text();
        return res.status(200).json({ text: responseText });
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json({ error: "Error processing chatbot request" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});