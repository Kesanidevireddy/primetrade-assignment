# PrimeTrade Assignment – Full Stack Application

This project is a Task Management Application built as part of the PrimeTrade Frontend Developer Task.
It includes both backend (Node.js + Express + SQLite) and frontend (React.js) implementations.

---

##  Features

###  Authentication
- Secure **JWT-based login and signup**
- **Role-based access control** (Admin & User)

###  Task Management
- Create, Read, Update, and Delete tasks
- Admin can view all tasks; users can view only their own
- Input validation and error handling

###  Additional Features
- Swagger API documentation
- CORS-enabled for frontend integration
- Modular folder structure for scalability

---

##  Tech Stack

**Frontend:**
- React.js  
- Axios  
- React Router  
- CSS / Tailwind (if used)

**Backend:**
- Node.js  
- Express.js  
- SQLite  
- JWT for authentication  
- bcrypt.js for password hashing  

---

##  Setup Instructions

###  Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend

2.Install dependencies:
npm install

3.Create a .env file in the backend root:
PORT=5000
JWT_SECRET=MySuperStrongSecretKey@2025 

4.Start the backend server:
npm start

Backend runs on: http://localhost:5000

💻 Frontend Setup
1.Navigate to the frontend folder:
cd frontend

2.Install dependencies:
npm install

3.Start the React app:
npm start

Frontend runs on: http://localhost:3000

🔗 API Documentation

Swagger documentation is available at:
 http://localhost:5000/api-docs
If you use Postman, export and attach the Postman collection file (.json). 

 Folder Structure
primetrade-assignment/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── docs/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
