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
            // No deletion of previous records here.
            // Generate JWT token after successful login.
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error comparing password:', error);
            return res.status(500).json({ error: 'Error during login process' });
        }
    });
});

app.post('/api/logout', authenticateToken, (req, res) => {
    // Do not delete any records on logout.
    res.status(200).json({ message: 'Logout successful' });
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

app.post('/api/yoga-practice', authenticateToken, (req, res) => {
    const { poseId, poseName } = req.body;
    if (!poseId || !poseName) {
        console.error('Missing poseId or poseName in the request body');
        return res.status(400).json({ error: 'Missing poseId or poseName' });
    }
    // Insert into the yoga_activity table (assumes columns: user_id, yoga_pose_id, pose_name, detail)
    db.query(
        'INSERT INTO yoga_activity (user_id, yoga_pose_id, pose_name, detail) VALUES (?, ?, ?, ?)',
        [req.user.id, poseId, poseName, 'Yoga practice recorded from Yoga.js'],
        (err, results) => {
            if (err) {
                console.error('Error logging yoga practice activity:', err);
                return res.status(500).json({ error: 'Database error in yoga-practice endpoint' });
            }
            // console.log('Yoga practice activity inserted:', results);
            res.status(200).json({ message: 'Yoga practice activity logged successfully' });
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

    // Fallback yoga.js list (the same as your dropdown list)
    const fallbackPoseList = [
      'Tree',
      'Chair',
      'Cobra',
      'Warrior',
      'Dog',
      'Shoulderstand',
      'Triangle',
      'Tadasana',
      'Virabhadrasana I',
      'Balasana',
      'Paschimottanasana',
      'Setu Bandhasana',
      'Marjaryasana-Bitilasana',
      'Ardha Chandrasana (Half Moon Pose)',
      'Bakasana (Crow Pose)',
      'Navasana (Boat Pose)',
      'Phalakasana (Plank Pose)',
      'Parivrtta Trikonasana (Revolved Triangle Pose)',
      'Eka Pada Rajakapotasana (Pigeon Pose)',
      'Ustrasana (Camel Pose)'
    ];

    db.query('SELECT * FROM yoga_poses', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Create fallback data objects (you can assign a null image_url so the frontend uses its poseImages)
        const fallbackPoses = fallbackPoseList.map(poseName => ({
          id: `fallback-${poseName}`,
          name: poseName,
          image_url: null
        }));
        
        // Merge fallback with database results; only add fallback if not already provided by the DB.
        const dbPoseNames = results.map(r => r.name);
        const merged = results.concat(fallbackPoses.filter(p => !dbPoseNames.includes(p.name)));
        
        res.status(200).json(merged);
    });
});

app.get('/api/progress-report', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    // Sessions query (if needed)
    const sessionsQuery = `
        SELECT COUNT(*) AS completed 
        FROM user_activity 
        WHERE user_id = ? AND activity_type = 'practice'
    `;
    
    // "Your Recent Detected Poses" -> use the yoga_activity table
    const detectedPosesQuery = `
        SELECT 
            id,
            yoga_pose_id,
            COALESCE(pose_name, 'Yoga Pose') AS pose_name,
            detail,
            activity_date
        FROM yoga_activity
        WHERE user_id = ?
        ORDER BY activity_date DESC
        LIMIT 30
    `;
    
    // "Your Recent Activities" -> use the user_activity table for practice records and include activity_type & image_url.
    const recentActivitiesQuery = `
        SELECT 
            id,
            yoga_pose_id,
            activity_type,
            (SELECT name FROM yoga_poses WHERE id = yoga_pose_id) AS pose_name,
            detail,
            activity_date,
            (SELECT image_url FROM yoga_poses WHERE id = yoga_pose_id) AS image_url
        FROM user_activity
        WHERE user_id = ? AND activity_type = 'practice'
        ORDER BY activity_date DESC
        LIMIT 30
    `;
    
    // Diet chart query (using user_activity table)
    const dietQuery = `
        SELECT activity_date AS date, detail AS meals 
        FROM user_activity 
        WHERE user_id = ? AND activity_type = 'diet_chart'
        ORDER BY activity_date DESC
        LIMIT 1
    `;
    
    // Recommended poses query -> union of both tables, now including image_url.
    const recommendedQuery = `
        SELECT * FROM (
            SELECT 
                id,
                yoga_pose_id,
                COALESCE(pose_name, (SELECT name FROM yoga_poses WHERE id = yoga_pose_id)) AS pose_name,
                detail,
                activity_date,
                (SELECT image_url FROM yoga_poses WHERE id = yoga_pose_id) AS image_url
            FROM yoga_activity
            WHERE user_id = ?
            UNION ALL
            SELECT 
                id,
                yoga_pose_id,
                (SELECT name FROM yoga_poses WHERE id = yoga_pose_id) AS pose_name,
                detail,
                activity_date,
                (SELECT image_url FROM yoga_poses WHERE id = yoga_pose_id) AS image_url
            FROM user_activity
            WHERE user_id = ? AND activity_type = 'practice'
        ) AS combined
        ORDER BY RAND()
        LIMIT 6
    `;
    
    // Execute queries sequentially (nesting callbacks)
    db.query(sessionsQuery, [userId], (err, sessionResults) => {
        if (err) {
            console.error('Error querying sessions:', err);
            return res.status(500).json({ error: 'Database error in sessions' });
        }
        db.query(detectedPosesQuery, [userId], (err, detectedPosesResults) => {
            if (err) {
                console.error('Error querying detected poses:', err);
                return res.status(500).json({ error: 'Database error in detected poses' });
            }
            db.query(recentActivitiesQuery, [userId], (err, recentActivitiesResults) => {
                if (err) {
                    console.error('Error querying recent activities:', err);
                    return res.status(500).json({ error: 'Database error in recent activities' });
                }
                db.query(dietQuery, [userId], (err, dietResults) => {
                    if (err) {
                        console.error('Error querying diet charts:', err);
                        return res.status(500).json({ error: 'Database error in diet charts' });
                    }
                    db.query(recommendedQuery, [userId, userId], (err, recommendedResults) => {
                        if (err) {
                            console.error('Error querying recommended poses:', err);
                            return res.status(500).json({ error: 'Database error in recommended poses' });
                        }
                        res.status(200).json({
                            sessions: sessionResults,
                            yogaHistory: detectedPosesResults, // for "Your Recent Detected Poses"
                            recentActivities: recentActivitiesResults, // for "Your Recent Activities"
                            dietCharts: dietResults,
                            recommendedPoses: recommendedResults
                        });
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