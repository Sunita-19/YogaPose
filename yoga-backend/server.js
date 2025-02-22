// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5000; // You can change the port if needed

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
        // console.log('Authenticated user:', req.user); // Log the user information for debugging
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

// Get all articles
app.get('/api/articles', authenticateToken, (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Get notifications for a user
app.get('/api/notifications', authenticateToken, (req, res) => {
    db.query('SELECT * FROM notifications WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
    const notificationId = req.params.id;

    db.query('UPDATE notifications SET read_status = 1 WHERE id = ? AND user_id = ?', [notificationId, req.user.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification marked as read' });
    });
});

// Endpoint to add a new environmental activity
app.post('/api/activities', authenticateToken, (req, res) => {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date || !location) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    db.query('INSERT INTO activities (user_id, title, description, date, location) VALUES (?, ?, ?, ?, ?)', 
    [req.user.id, title, description, date, location], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Activity added successfully' });
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

// Endpoint to get pose recommendations based on user input
app.post('/api/recommended-poses', authenticateToken, async (req, res) => {
  try {
    const { age, weight, gender, fitnessLevel, healthConditions, activityLevel, specificGoals, timeCommitment, preferredStyle } = req.body;

    // Basic validation
    if (!age || !weight || !preferredStyle) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get all poses from the database
    db.query('SELECT * FROM yoga_poses', async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Total poses in database:', results.length); // Log the total number of poses

      // Filter poses based on user input
      const filteredPoses = results.filter(pose => {
        // Example filtering logic - can be expanded based on requirements
        return pose.difficulty_level === fitnessLevel &&
               pose.style === preferredStyle &&
               pose.duration <= (timeCommitment === 'short' ? 15 : 
                               timeCommitment === 'medium' ? 30 : 60);
      });

      console.log('Filtered poses:', filteredPoses); // Log the filtered poses

      // Categorize poses by difficulty
      const recommendedPoses = {
        beginner: filteredPoses.filter(pose => pose.difficulty_level === 'beginner'),
        intermediate: filteredPoses.filter(pose => pose.difficulty_level === 'intermediate'),
        advanced: filteredPoses.filter(pose => pose.difficulty_level === 'advanced')
      };

      console.log('Recommended poses:', recommendedPoses); // Log the recommended poses

      res.status(200).json(recommendedPoses);
    });
  } catch (error) {
    console.error('Error in pose recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chatbot endpoint
app.post('/api/chatbot', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        // TODO: Add chatbot logic here
        const response = {
            text: `You said: ${message}`,
            timestamp: new Date().toISOString()
        };
            res.send(response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Error processing chatbot request' });
    }
});

// Endpoint to get details of a specific yoga pose
app.get('/api/yoga_poses/:id', (req, res) => {


    const poseId = req.params.id;

    db.query('SELECT * FROM yoga_poses WHERE id = ?', [poseId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Yoga pose not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});