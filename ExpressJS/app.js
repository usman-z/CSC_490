import express from 'express'
import pkg from 'pg';
import nodemailer from 'nodemailer';
import cors from 'cors';

const { Client } = pkg;
var app = express()

app.use(cors());
app.use(express.json())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Server failed')
  })
  
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


const dbConfig = {
  host: '173.230.140.95',
  user: 'postgres',
  database: 'testing',
  password: 'devpatel',
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'campus.marketplaces@gmail.com',
      pass: 'oofk rdys wzvf ckqx'
    }
});

app.get("/any", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    // const result = await client.query('SELECT * FROM Personnel');
    // const result = await client.query('SELECT * FROM Message');
    const result = await client.query('SELECT * FROM Listing');
    res.json(result.rows);

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  } finally {
    await client.end();
  }
});

app.get("/all", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect(); // Connect to the PostgreSQL database
    const result = await client.query('SELECT * FROM Personnel');
    res.json(result.rows);

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  } finally {
    await client.end();
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM Personnel WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    }
    else {
      res.status(404).send('No such user');
    }

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  } finally {
    await client.end();
  }
});

app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const atIndex = email.indexOf('@'); // gets index of '@"
  if(atIndex === -1 || email.substring(atIndex+1).toLowerCase() !== 'uncg.edu'){  // if no index of '@' OR if after '@' it doesn't end w 'uncg.edu'
    return res.status(400).json({error: "Email is not UNCG email"});
  }

  const client = new Client(dbConfig);
  try {
    await client.connect(); // Connect to the PostgreSQL database

    const sql = 'SELECT * FROM Personnel WHERE email= $1';
    const user = await client.query(sql, [email]);
    if(user.rows[0]){
      return res.status(400).json({ error: "User already exists with the same email"})
    }

    const query = `
      INSERT INTO Personnel (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await client.query(query, [first_name, last_name, email, password, role]); // Execute the query

    const mailOptions = {
      from: 'campus.marketplaces@gmail.com',
      to: email,
      subject: 'UNCG Marketplace Registration',
      text: 'You have successfully registered for UNCG Marketplace'
    }

    // transporter.sendMail(mailOptions, (error, info) => {
    //  if (error) {
    //      console.log('Error sending email:', error);

    //  } else {
    //      console.log('Email sent:', info.response);
    //  }
    // });

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Error adding user');
  } finally {
    await client.end(); // Close the database connection
  }

});

app.post("/inbox", async (req, res) => {
  const { userId } = req.body;
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM Message WHERE sender_id = $1 OR receiver_id = $2', [userId, userId]);
    const filteredRows = result.rows.map(row => {
      if (row.sender_id === userId) {
        return { ...row, otherId: row.receiver_id, receiver_id: undefined, sender_id: undefined };
      } else if (row.receiver_id === userId) {
        return { ...row, otherId: row.sender_id, receiver_id: undefined, sender_id: undefined };
      } else {
          return row; // No match found, leave the row unchanged
      }
  });
    res.json(filteredRows);

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  } finally {
    await client.end();
  }
});

app.post("/info", async (req, res) => {
  const { userId } = req.body;
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM Personnel WHERE user_id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  } finally {
    await client.end();
  }
});