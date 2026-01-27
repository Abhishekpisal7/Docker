const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection details

const mongoUrl = "mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.${process.env.MONGO_URL}}:27017"; // container name
const dbName = "feedbackDB";
const collectionName = "feedback";

let feedbackCollection;

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    feedbackCollection = db.collection(collectionName);

    // Start server only after DB is ready
    app.listen(port, () => {
      console.log(`Feedback app running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });


// Feedback form page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Feedback Form</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f2f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: #fff;
          padding: 30px 40px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }
        input, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
        button {
          margin-top: 20px;
          padding: 12px 20px;
          width: 100%;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .view-feedback {
          margin-top: 20px;
          text-align: center;
        }
        .feedback-list {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>We Value Your Feedback</h1>
        <form method="POST" action="/submit">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Your Name" required>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Your Email" required>

          <label for="feedback">Your Feedback:</label>
          <textarea id="feedback" name="feedback" rows="5" placeholder="Write your feedback..." required></textarea>

          <button type="submit">Submit Feedback</button>
        </form>
        <div class="view-feedback">
          <a href="/feedbacks">View All Feedbacks</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle form submission

app.post("/submit", async (req, res) => {
  const { name, email, feedback } = req.body;

  const entry = {
    name,
    email,
    feedback,
    date: new Date()
  };

  try {
    await feedbackCollection.insertOne(entry);
    console.log("✅ Feedback inserted into MongoDB");

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Feedback Submitted</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background: #fff;
            padding: 30px 40px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            text-align: center;
          }
          h1 {
            color: #28a745;
          }
          blockquote {
            margin: 20px auto;
            padding: 15px;
            background: #f8f9fa;
            border-left: 5px solid #007bff;
            border-radius: 5px;
            font-style: italic;
            color: #333;
          }
          a {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s ease;
          }
          a:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Thank you, ${name}!</h1>
          <p>We received your feedback successfully.</p>
          <blockquote>"${feedback}"</blockquote>
          <div>
            <a href="/">Go back</a>
            <a href="/feedbacks">View All Feedbacks</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).send("Error saving feedback.");
  }
});


  

// Route to view all feedbacks nicely
// Route to view all feedbacks nicely
app.get("/feedbacks", async (req, res) => {
  try {
    // Fetch all feedbacks from MongoDB
    const feedbacks = await feedbackCollection.find().toArray();

    if (!feedbacks.length) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>No Feedbacks</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f0f2f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 50px auto; background: #fff; padding: 30px 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px; text-align: center; }
            h2 { color: #555; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; }
            a:hover { background-color: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>No feedback available yet.</h2>
            <a href="/">Go back</a>
          </div>
        </body>
        </html>
      `);
    }

    // Generate table rows from MongoDB
    const rows = feedbacks.map(fb => {
      return `<tr>
                <td>${fb.name}</td>
                <td>${fb.email}</td>
                <td>${fb.feedback}</td>
                <td>${new Date(fb.date).toLocaleString()}</td>
              </tr>`;
    }).join("");

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Feedbacks</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f0f2f5; margin: 0; padding: 0; }
          .container { max-width: 900px; margin: 50px auto; background: #fff; padding: 30px 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border: 1px solid #ccc; text-align: left; }
          th { background-color: #007bff; color: white; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .view-feedback { margin-top: 20px; text-align: center; }
          a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; }
          a:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>All Feedbacks</h1>
          <table>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback</th>
              <th>Date</th>
            </tr>
            ${rows}
          </table>
          <div class="view-feedback">
            <a href="/">Go back</a>
          </div>
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error("❌ Error fetching feedbacks:", err);
    res.status(500).send("Error fetching feedbacks.");
  }
});
