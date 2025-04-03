const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Expose uploads as a static folder so files can be accessed by the frontend
app.use('/uploads', express.static(uploadDir));

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
            // console.log('Practice activity inserted:', results);
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

    db.query(
        'INSERT INTO yoga_activity (user_id, yoga_pose_id, pose_name, detail) VALUES (?, ?, ?, ?)',
        [req.user.id, poseId, poseName, 'Yoga practice recorded'],
        (err) => {
            if (err) {
                console.error('Error logging yoga practice activity:', err);
                return res.status(500).json({ error: 'Database error in yoga-practice endpoint' });
            }

            // Increase XP for practicing a pose
            const xpEarned = 20; // Adjust XP as needed
            db.query(
                'UPDATE user_achievements SET xp = xp + ?, achievements_count = achievements_count + 1 WHERE user_id = ?',
                [xpEarned, req.user.id],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating XP:', updateErr);
                    }
                }
            );

            res.status(200).json({ message: 'Yoga practice activity logged successfully' });
        }
    );
});


app.post('/api/diet-chart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const todayStr = new Date().toISOString().slice(0, 10); // Format: "YYYY-MM-DD"

  // Check if a diet chart record already exists for THIS user today
  db.query(
    'SELECT * FROM user_activity WHERE user_id = ? AND activity_type = "diet_chart" AND DATE(activity_date) = ? LIMIT 1',
    [userId, todayStr],
    (err, results) => {
      if (err) {
        console.error('Error checking existing diet chart:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Generate a personalized diet plan regardless, then upsert its value.
      function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      }
      const dietTemplates = [
        "Breakfast: Oatmeal with fruits, Lunch: Grilled chicken salad, Dinner: Steamed salmon with veggies",
        "Breakfast: Smoothie bowl, Lunch: Spinach quinoa salad, Dinner: Tofu stir-fry with brown rice",
        "Breakfast: Scrambled eggs with avocado toast, Lunch: Turkey wrap, Dinner: Pasta with marinara sauce",
        "Breakfast: Greek yogurt with granola, Lunch: Lentil soup, Dinner: Grilled shrimp with asparagus",
        "Breakfast: Banana pancakes, Lunch: Veggie burger, Dinner: Stir-fried beef with broccoli"
      ];
      // Use concatenation so the seed is unique per user and date.
      const seed = parseInt(`${userId}${todayStr.replace(/-/g, '')}`, 10);
      const randomIndex = Math.floor(seededRandom(seed) * dietTemplates.length);
      const dietPlan = dietTemplates[randomIndex];

      if (results.length > 0) {
        // Update the record so that it always reflects the current user's parameters.
        db.query(
          'UPDATE user_activity SET detail = ? WHERE id = ?',
          [`Generated diet chart: ${dietPlan}`, results[0].id],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error('Error updating diet chart activity:', updateErr);
              return res.status(500).json({ error: 'Database error while updating diet chart' });
            }
            return res.status(200).json({
              message: 'Diet chart updated successfully',
              diet: { date: todayStr, meals: dietPlan }
            });
          }
        );
      } else {
        // No record exists for this user today, so insert a new record.
        db.query(
          'INSERT INTO user_activity (user_id, activity_type, detail) VALUES (?, "diet_chart", ?)',
          [userId, `Generated diet chart: ${dietPlan}`],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error('Error logging diet chart activity:', insertErr);
              return res.status(500).json({ error: 'Database error while inserting diet chart' });
            }
            return res.status(200).json({
              message: 'Diet chart generated successfully',
              diet: { date: todayStr, meals: dietPlan }
            });
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
    // console.log(`Fetching yoga pose ${poseId} for user ${req.user.id}`);

    db.query('SELECT * FROM yoga_poses WHERE id = ?', [poseId], (err, results) => {
        if (err) {
            console.error('Database error when fetching pose:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pose not found' });
        }

        // Increase XP for viewing a pose
        const xpEarned = 10; // Change XP amount as needed
        db.query(
            'UPDATE user_achievements SET xp = xp + ? WHERE user_id = ?',
            [xpEarned, req.user.id],
            (updateErr) => {
                if (updateErr) {
                    console.error('Error updating XP:', updateErr);
                }
            }
        );

        return res.status(200).json(results[0]);
    });
});


app.post('/api/recommended-poses', authenticateToken, (req, res) => {
    // console.log('Received request:', req.body);

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
    // console.log(`Progress report request for user ${req.user.id}`);
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
        LIMIT 30
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

app.get('/api/leaderboard', (req, res) => {
  const query = 'SELECT username, xp FROM user_achievements ORDER BY xp DESC LIMIT 10';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
    res.json({ leaderboard: results });
  });
});

app.post('/api/update-xp', (req, res) => {
    const { userId, xpEarned, newAchievement } = req.body;
    const query = `
        UPDATE user_achievements
        SET xp = xp + ?, achievements_count = achievements_count + ?
        WHERE user_id = ?
    `;

    db.query(query, [xpEarned, newAchievement ? 1 : 0, userId], (err, result) => {
        if (err) {
            console.error('Error updating XP:', err);
            return res.status(500).json({ error: 'Failed to update XP' });
        }
        res.json({ message: 'XP updated successfully' });
    });
});

app.post('/api/feedback', (req, res) => {
//   console.log('Feedback payload:', req.body);
  const { name, email, satisfaction, comments } = req.body;
  
  if (!name || !email || !satisfaction || !comments) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Insert feedback into the feedback table
  db.query(
    'INSERT INTO feedback (name, email, satisfaction, comments) VALUES (?, ?, ?, ?)',
    [name, email, satisfaction, comments],
    (err, results) => {
      if (err) {
        console.error('Error inserting feedback:', err);
        return res.status(500).json({ message: 'Database error while inserting feedback' });
      }
      res.status(200).json({ message: 'Feedback submitted successfully' });
    }
  );
});

app.get('/api/achievements', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM user_achievements WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching achievements:', err);
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }
    const achievements = results.map(row => ({
      badgeUrl: row.badgeUrl || '', // The table does not store a badgeUrl so this will be empty.
      title: `Achievement ${row.achievements_count}`,
      description: `Keep practicing! You have earned ${row.xp} XP so far.`,
      progress: row.xp ? Math.min((row.xp / 500) * 100, 100) : 0,
      username: row.username,
      level: row.achievements_count
    }));
    res.json({ achievements });
  });
});

// Configure storage for profile photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// GET profile details for the logged in user
app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  // Now select profilePhoto as well as username, email, mobile
  db.query('SELECT username, email, mobile, profilePhoto FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    if (user.profilePhoto) {
      user.profilePhoto = user.profilePhoto.replace(/\\/g, '/');
    }
    res.json(user);
  });
});

// PUT update profile details (with optional profile photo upload)
app.put('/api/profile', authenticateToken, upload.single('profilePhoto'), (req, res) => {
  const { username, email, mobile } = req.body;
  const userId = req.user.id;
  const profilePhoto = req.file ? req.file.path : null;

  // Build update query dynamically
  let query = 'UPDATE users SET username = ?, email = ?, mobile = ?';
  const params = [username, email, mobile];
  if (profilePhoto) {
    query += ', profilePhoto = ?';
    params.push(profilePhoto);
  }
  query += ' WHERE id = ?';
  params.push(userId);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    // Return updated profile data
    db.query('SELECT username, email, mobile, profilePhoto FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching updated profile:', err);
        return res.status(500).json({ error: 'Failed to fetch updated profile' });
      }
      // Convert any backslashes to forward slashes
      const user = results[0];
      if (user.profilePhoto) {
        user.profilePhoto = user.profilePhoto.replace(/\\/g, '/');
      }
      res.json(user);
    });
  });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});