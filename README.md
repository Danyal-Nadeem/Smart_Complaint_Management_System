# Smart Complaint Management System 🚀

A premium, modern, and highly interactive complaint management platform built with the MERN stack. Designed with a sleek "Arctic Moonlight" aesthetic, featuring real-time updates and live resolution tracking.

## ✨ Key Features

### 👤 User Portal
- **Interactive Dashboard**: View all your complaints at a glance with status-based filtering.
- **Fast Submission**: Submit detailed complaints with title, category, and priority (Low, Medium, High).
- **Live Tracking ⏱️**: Real-time countdown timer for complaints marked as "In Progress", letting users know exactly when to expect a resolution.
- **Ticket Management**: Edit or delete pending tickets effortlessly.
- **Official Responses**: Receive clear, styled official responses from administrators.

### 🛠️ Admin Portal
- **Performance Analytics**: Visual data representation using Recharts for status, priority, and category breakdowns.
- **Advanced Management**: Dedicated "Manage Complaints" view to update statuses and provide resolutions.
- **Resolution Timer**: Admins can set estimated completion dates and times when a ticket moves to "In Progress".
- **System Control**: Global toggle to take the system online/offline for maintenance.
- **Audit Logs**: Full history and archive of resolved and rejected cases.
- **User Analytics**: Detailed breakdown of complaints per user.

## 💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication.
- **Real-time**: Socket.io for live communication.
- **Animations**: Framer Motion for premium micro-animations.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas or local MongoDB instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Smart_Complaint_Management_System
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Access the App**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
Smart_Complaint_Management_System/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Admin & User)
│   │   ├── context/     # Auth and Global state
│   │   └── App.jsx      # Main routing
├── server/           # Express backend
│   ├── models/       # Mongoose Schemas
│   ├── controllers/  # API logic
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
└── README.md         # Documentation
```

## 🛡️ Authentication
The system uses JWT (JSON Web Tokens) for secure authentication. User and Admin accounts are separated to ensure proper role-based access control.

---
Built with ❤️ by Danyal Nadeem
