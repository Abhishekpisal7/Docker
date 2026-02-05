
// ==============================
// index.html + styles.css + server.js + app.js (combined)
// ==============================

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT;

// Serve dynamic HTML with embedded CSS and JS
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Simple Node.js Frontend</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f9; color: #333; }
        header, footer { background: #222; color: #fff; padding: 1rem; text-align: center; }
        main { padding: 2rem; text-align: center; }
        button { margin: 0.5rem; padding: 0.5rem 1rem; font-size: 16px; cursor: pointer; }
        pre { background: #eee; padding: 1rem; text-align: left; }
      </style>
    </head>
    <body>
      <header class="container">
        <h1>🚀 Simple Node.js Frontend</h1>
        <p>This page is served by an Express server.</p>
      </header>

      <main class="container card">
        <p id="status">Click a button to call an API route.</p>
        <button id="ping">Call Hello API</button>
        <button id="time">Get Server Time</button>
        <pre id="result"></pre>
      </main>

      <footer class="container footer">
        <small>Made with Express & Vanilla JS</small>
      </footer>

      <script>
        const btn = document.getElementById('ping');
        const timeBtn = document.getElementById('time');
        const statusEl = document.getElementById('status');
        const result = document.getElementById('result');

        btn.addEventListener('click', async () => {
          statusEl.textContent = 'Calling /api/hello ...';
          result.textContent = '';

          try {
            const res = await fetch('/api/hello');
            const data = await res.json();
            statusEl.textContent = 'Success!';
            result.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            statusEl.textContent = 'Something went wrong 😬';
            result.textContent = String(err);
          }
        });

        timeBtn.addEventListener('click', async () => {
          statusEl.textContent = 'Calling /api/time ...';
          result.textContent = '';

          try {
            const res = await fetch('/api/time');
            const data = await res.json();
            statusEl.textContent = 'Got time!';
            result.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            statusEl.textContent = 'Error fetching time ⏰';
            result.textContent = String(err);
          }
        });
      </script>
    </body>
    </html>
  `);
});

// API routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.get("/api/time", (req, res) => {
  res.json({ serverTime: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
