const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the feedback folder exists
const feedbackDir = path.join(__dirname, "user_feedback");
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir);
}

// File to store feedback
const feedbackFile = path.join(feedbackDir, "feedback.txt");

// Serve user_feedback folder statically
app.use("/user_feedback", express.static(feedbackDir));

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
app.post("/submit", (req, res) => {
  const { name, email, feedback } = req.body;

  const entry = `
----------------------------------
Name: ${name}
Email: ${email}
Feedback: ${feedback}
Date: ${new Date().toLocaleString()}
----------------------------------
`;

  fs.appendFile(feedbackFile, entry, (err) => {
    if (err) {
      console.error("Error saving feedback:", err);
      return res.status(500).send("Error saving feedback.");
    }
    console.log("thanks")
    console.log("Feedback saved to file:", feedbackFile);

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
            color: #333;
          }
          blockquote {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .view-feedback a {
            margin: 0 10px;
            color: #007bff;
            text-decoration: none;
          }
          .view-feedback a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Thank you, ${name}!</h1>
          <p>We received your feedback successfully.</p>
          <blockquote>${feedback}</blockquote>
          <div class="view-feedback">
            <a href="/">Go back</a> | <a href="/feedbacks">View All Feedbacks</a>
          </div>
        </div>
      </body>
      </html>
    `);
  });
});

// Route to view all feedbacks nicely
app.get("/feedbacks", (req, res) => {
  fs.readFile(feedbackFile, "utf8", (err, data) => {
    if (err || !data.trim()) {
      return res.send(`
        <h2>No feedback available yet.</h2>
        <a href='/'>Go back</a>
      `);
    }

    // Split entries by separator
    const entries = data.split("----------------------------------").filter(e => e.trim() !== "");

    // Generate table rows
    const rows = entries.map(entry => {
      const lines = entry.split("\n").filter(l => l.trim() !== "");
      const name = lines.find(l => l.startsWith("Name:"))?.replace("Name:", "").trim() || "";
      const email = lines.find(l => l.startsWith("Email:"))?.replace("Email:", "").trim() || "";
      const feedback = lines.find(l => l.startsWith("Feedback:"))?.replace("Feedback:", "").trim() || "";
      const date = lines.find(l => l.startsWith("Date:"))?.replace("Date:", "").trim() || "";

      return `<tr>
                <td>${name}</td>
                <td>${email}</td>
                <td>${feedback}</td>
                <td>${date}</td>
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
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
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
  });
});


app.listen(port, () => {
  console.log(`Feedback app running at http://localhost:${port}`);
});
