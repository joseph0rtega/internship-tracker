# Internship Tracker (Full-Stack)

A simple full-stack web app to track internship applications (company, role, link, status). Built with **Node.js + Express** and **SQLite** for persistent storage, with a **vanilla HTML/CSS/JS** frontend.

## Features
- Add internship applications (company, role, link, status)
- View all applications
- Delete applications
- REST API (GET / POST / DELETE)
- SQLite persistence (data survives server restarts locally)

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** SQLite
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Tooling:** Git/GitHub

## Screenshots
> (Optional) Add screenshots here later.
> - `./screenshots/home.png`

## API Endpoints
- `GET /api/applications` → returns all applications (JSON)
- `POST /api/applications` → creates a new application  
  Body example:
  ```json
  {
    "company": "NVIDIA",
    "role": "Software Engineering Intern",
    "link": "https://example.com",
    "status": "Applied"
  }
