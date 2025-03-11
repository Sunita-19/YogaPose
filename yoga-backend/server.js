// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Middleware for verifying JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;

    // Validate input
    if (!username || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if mobile is a valid integer
    if (!Number.isInteger(Number(mobile)) || mobile.toString().length !== 10) {
        return res.status(400).json({ message: 'Mobile number must be a 10-digit integer.' });
    }

    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            db.query('INSERT INTO users (username, email, mobile, password) VALUES (?, ?, ?, ?)', 
            [username, email, Number(mobile), hashedPassword], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ error: 'Failed to hash password' });
        }
    });
});

// User login endpoint
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

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error comparing password:', error);
            return res.status(500).json({ error: 'Error during login process' });
        }
    });
});

// Feedback submission endpoint
app.post('/api/feedback', authenticateToken, (req, res) => {
    const { name, email, satisfaction, comments } = req.body;

    // Ensure all required fields are provided
    if (!name || !email || !satisfaction || !comments) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Insert feedback into the database including user_id from the authenticated user
    db.query('INSERT INTO feedback (user_id, name, email, satisfaction, comments) VALUES (?, ?, ?, ?, ?)', 
    [req.user.id, name, email, satisfaction, comments], (err, results) => {
        if (err) {
            console.error('Database error while submitting feedback:', err.message); // Log error message
            return res.status(500).json({ error: 'Database error', details: err }); // Include error details
        }
        res.status(201).json({ message: 'Feedback submitted successfully' });
    });
});

// Get achievements for a user
app.get('/api/achievements', authenticateToken, (req, res) => {
    db.query('SELECT * FROM achievements WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to add a new reward
app.post('/api/rewards', authenticateToken, (req, res) => {
    const { points, description } = req.body;

    if (!points || !description) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    db.query('INSERT INTO rewards (user_id, points, description) VALUES (?, ?, ?)', 
    [req.user.id, points, description], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Reward added successfully' });
    });
});

// Endpoint to update user profile information
app.put('/api/profile', authenticateToken, (req, res) => {
    const { name, bio, profile_image } = req.body;

    if (!name && !bio && !profile_image) {
        return res.status(400).json({ message: 'At least one field must be updated!' });
    }

    db.query('UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), profile_image = COALESCE(?, profile_image) WHERE id = ?', 
    [name, bio, profile_image, req.user.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Endpoint to get all yoga poses
app.get('/api/poses', (req, res) => {
    db.query('SELECT * FROM yoga_poses', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to get yoga pose details by ID
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
        
        console.log(`Inserting click activity for user ${req.user.id} and pose ${poseId}`);
        db.query(
            'INSERT INTO user_activity (user_id, activity_type, yoga_pose_id, detail) VALUES (?, ?, ?, ?)',
            [req.user.id, 'click', poseId, 'User clicked on the pose for more details'],
            (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Error logging activity:', insertErr);
                } else {
                    console.log(`Activity logged successfully for user ${req.user.id} on pose ${poseId}`);
                }
                return res.status(200).json(results[0]);
            }
        );
    });
});

app.post('/api/recommended-poses', authenticateToken, (req, res) => {
    console.log('Received request:', req.body); // Debugging
  
    db.query('SELECT * FROM yoga_poses', (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No yoga poses found.' });
      }
  
    //   console.log('Fetched poses:', results);
      res.status(200).json(results);
    });
  });
  
// Chatbot endpoint
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY); // Use environment variable
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

app.get('/api/progress-report', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Query total practice sessions
  const sessionsQuery = `
    SELECT COUNT(*) AS completed 
    FROM user_activity 
    WHERE user_id = ? AND activity_type = 'practice'
  `;
  
  // Query user's activity history (all types) ordered by date (most recent first)
  const historyQuery = `
    SELECT id, user_id, activity_type, yoga_pose_id, activity_date, detail, accuracy
    FROM user_activity 
    WHERE user_id = ? 
    ORDER BY activity_date DESC
  `;
  
  // Query diet charts: return activity_date as date and detail as meals
  const dietQuery = `
    SELECT activity_date AS date, detail AS meals 
    FROM user_activity 
    WHERE user_id = ? AND activity_type = 'diet_chart' 
    ORDER BY activity_date DESC
  `;
  
  // Query recommended poses:
  // Return poses where the user has not done a practice. Adjust limit as needed.
  const recommendedQuery = `
    SELECT yp.id, yp.name 
    FROM yoga_poses yp 
    WHERE yp.id NOT IN (
      SELECT DISTINCT yoga_pose_id 
      FROM user_activity 
      WHERE user_id = ? AND activity_type = 'practice' AND yoga_pose_id IS NOT NULL
    )
    LIMIT 5
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
          
          // Returning total sessions (total can be set from application settings; here we use a fixed goal of 20)
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

// Practice endpoint
app.post('/api/practice', authenticateToken, (req, res) => {
    const { poseId, accuracy } = req.body;
    console.log(`POST /api/practice triggered for user ${req.user.id} with poseId: ${poseId} and accuracy: ${accuracy}`);
    
    db.query(
        'INSERT INTO user_activity (user_id, activity_type, yoga_pose_id, detail, accuracy) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'practice', poseId, 'User completed the pose successfully', accuracy],
        (err, results) => {
            if (err) {
                console.error('Error logging practice activity:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Practice record inserted:', results);
            res.status(200).json({ message: 'Practice activity logged successfully' });
        }
    );
});

// Diet chart endpoint
app.post('/api/diet-chart', authenticateToken, (req, res) => {
    const { meals } = req.body;
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
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});