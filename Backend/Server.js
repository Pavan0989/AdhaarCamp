const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const util = require('util');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Adjust the password if needed
  database: 'itg', // Replace with your database name
});

// Promisify db.query for async/await
const query = util.promisify(db.query).bind(db);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Route to handle registration
app.post('/register', async (req, res) => {
  const { FirstName, LastName, Email, ContactNo, PasswordHash, Username } = req.body;

  if (!FirstName || !LastName || !Email || !ContactNo || !PasswordHash || !Username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(PasswordHash, 10);

    const existingUser = await query('SELECT * FROM Users WHERE Username = ? OR Email = ? OR ContactNo = ?', [Username, Email, ContactNo]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username, email, or contact number already exists' });
    }

    const result = await query('INSERT INTO Users (FirstName, LastName, Email, ContactNo, PasswordHash, Username) VALUES (?, ?, ?, ?, ?, ?)', 
      [FirstName, LastName, Email, ContactNo, hashedPassword, Username]);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Route to handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const results = await query('SELECT * FROM Users WHERE Username = ?', [username]);

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful', userId: user.id });
    } else {
      res.status(400).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Route to insert DEO
app.post('/api/insert-deo', async (req, res) => {
  const { salutation, name } = req.body;

  if (!salutation || !name) {
    return res.status(400).json({ success: false, message: 'Salutation and name are required.' });
  }

  try {
    await query('INSERT INTO DEO (salutation, name) VALUES (?, ?)', [salutation, name]);
    res.json({ success: true, message: 'DEO inserted successfully!' });
  } catch (error) {
    console.error('Error inserting DEO:', error.message);
    res.status(500).json({ error: 'Error inserting DEO' });
  }
});

// Route to fetch DEOs
app.get('/api/view-deos', async (req, res) => {
  try {
    const deos = await query('SELECT * FROM DEO');
    res.json({ deos });
  } catch (error) {
    console.error('Error fetching DEOs:', error.message);
    res.status(500).json({ error: 'Error fetching DEOs' });
  }
});

// Route to fetch DEO options
app.get('/api/deo-options', async (req, res) => {
  try {
    const results = await query('SELECT salutation, name FROM DEO');
    const deoOptions = results.map(row => ({
      value: `${row.salutation} ${row.name}`,
      label: `${row.salutation} ${row.name}`,
    }));
    res.json({ deoOptions });
  } catch (error) {
    console.error('Error fetching DEO options:', error.message);
    res.status(500).json({ error: 'Failed to fetch DEO options' });
  }
});

// Route to fetch attendance for a specific month
app.get('/attendance/:month/:year', async (req, res) => {
  const { month, year } = req.params;

  try {
    const results = await query(`
      SELECT p.id, p.name, p.center, a.date, a.status
      FROM participants p
      LEFT JOIN attendance a ON p.id = a.participant_id AND MONTH(a.date) = ? AND YEAR(a.date) = ?
      ORDER BY p.id, a.date
    `, [month, year]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to update attendance
app.put('/attendance', async (req, res) => {
  const updates = req.body; // Expecting an array of update objects

  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Process each update
    for (const { participant_id, date, status } of updates) {
      if (!participant_id || !date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await query(`
        INSERT INTO attendance (participant_id, date, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)
      `, [participant_id, date, status]);
    }

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});


// Route to fetch participants
// Route to fetch participants
app.get('/participants', async (req, res) => {
  try {
    const participants = await query('SELECT * FROM participants'); // Adjust the query based on your schema
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error.message);
    res.status(500).json({ error: 'Error fetching participants' });
  }
});


// Route to handle adding a participant
// Add participant route
app.post('/api/add-participant', (req, res) => {
  const { name, center } = req.body;

  // Basic validation
  if (!name || !center) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert into MySQL
  const query = 'INSERT INTO participants (name, center) VALUES (?, ?)';
  db.query(query, [name, center], (err, result) => {
    if (err) {
      console.error('Error inserting participant:', err);
      return res.status(500).json({ message: 'Failed to add participant' });
    }
    res.status(200).json({ message: 'Participant added successfully' });
  });
});



// API route to add a location
app.post("/api/add-location", (req, res) => {
  const { villagePanchayat, taluka, pin } = req.body;

  const sql = "INSERT INTO LocationDetails (village_panchayat, taluka, pin) VALUES (?, ?, ?)";
  db.query(sql, [villagePanchayat, taluka, pin], (err, result) => {
    if (err) {
      console.error("Failed to insert data", err);
      return res.status(500).json({ message: "Failed to add location" });
    }
    res.status(200).json({ message: "Location added successfully!" });
  });
});
// Assuming you have a MySQL connection already established

app.get('/api/info-page-data', (req, res) => {
  const sql = 'SELECT referenceNo, date, villagePanchayat, taluka, pin, subject, orderReferenceNo, dated, deoOfITG FROM Assignments';
  
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});
// Route to fetch villages
// Route to fetch villages
app.get('/api/villages', async (req, res) => {
  try {
    const villages = await query('SELECT * FROM LocationDetails');
    res.json(villages);
  } catch (err) {
    console.error('Error fetching villages:', err);
    res.status(500).json({ error: 'Failed to fetch villages' });
  }
});
// Route to check DEO availability

// Route to submit assignment info
app.post('/api/submit-info', async (req, res) => {
  const {
    referenceNo,
    date,
    villagePanchayat,
    taluka,
    pin,
    orderReferenceNo,
    dated,
    fromDate,
    toDate,
    deoOfITG,
  } = req.body;

  const deoOfITG_JSON = JSON.stringify(deoOfITG);

  try {
    // Insert assignment into the database
    await query(
      `
      INSERT INTO Assignments (referenceNo, date, villagePanchayat, taluka, pin, orderReferenceNo, dated, fromDate, toDate, deoOfITG)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [referenceNo, date, villagePanchayat, taluka, pin, orderReferenceNo, dated, fromDate, toDate, deoOfITG_JSON]
    );

    res.status(200).json({ message: 'Assignment info submitted successfully!' });
  } catch (error) {
    console.error('Error submitting assignment:', error.message);
    res.status(500).json({ error: 'Failed to submit assignment info.' });
  }
});



// Start the server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
