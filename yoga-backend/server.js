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
    host: 'localhost',
    user: 'root',
    password: 'Sunita', // Replace with your MySQL password
    database: 'YogaPose' // Your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

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

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required!' });
    }

    // Find user in the database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Check if user exists
        if (results.length === 0) {
            console.log(`Login failed: User with username "${username}" not found.`);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare password with hashed password
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log(`Login failed: Incorrect password for user "${username}".`);
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, username: user.username }, 'a542a514d22883fcde61769d3ed74301984ce993cb021a3560194e298176516712fcb2bbf17e63c6af548a1a745621a96c825221bbfa1c54445f974de8dc46e5', { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error comparing password:', error);
            return res.status(500).json({ error: 'Error during login process' });
        }
    });
});

// Feedback submission endpoint
app.post('/api/feedback', (req, res) => {
    const { user_id, name, email, satisfaction, comments } = req.body;

    // Validate input
    if (!user_id || !name || !email || !satisfaction || !comments) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Insert feedback into the database
    db.query('INSERT INTO feedback (user_id, name, email, satisfaction, comments) VALUES (?, ?, ?, ?, ?)', 
    [user_id, name, email, satisfaction, comments], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Feedback submitted successfully' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
