# ✈️ Airport Baggage Handling System

A full-stack Airport Baggage Handling System that simulates the baggage workflow of an airport using real-time communication and message queues. The project is designed with an industry-inspired architecture using React, Node.js, Express, MySQL, RabbitMQ, Socket.IO, and Docker.

---

## 📖 Overview

The Airport Baggage Handling System automates the complete lifecycle of passenger baggage from check-in to checkout.

The application enables airport staff to:

- Check-in baggage
- Track baggage status
- View live dashboard statistics
- Monitor recent activities
- Perform baggage checkout
- Store records in MySQL
- Process events asynchronously using RabbitMQ
- Receive real-time updates through Socket.IO

---

# 🚀 Features

- ✅ Passenger baggage check-in
- ✅ Baggage checkout
- ✅ Live baggage tracking
- ✅ Dashboard with statistics
- ✅ Recent activity log
- ✅ Search & filter records
- ✅ RabbitMQ message queues
- ✅ Socket.IO real-time updates
- ✅ MySQL database integration
- ✅ Dockerized application

---

# 🛠 Tech Stack

### Frontend

- React (Vite)
- HTML5
- CSS3
- JavaScript
- Axios

### Backend

- Node.js
- Express.js
- Socket.IO

### Database

- MySQL

### Messaging Queue

- RabbitMQ

### DevOps

- Docker
- Docker Compose

---

# 🏗 Project Architecture

```
React Frontend
        │
        ▼
Node.js + Express API
        │
        ├────────► MySQL Database
        │
        ├────────► RabbitMQ
        │              │
        │              ├── Tracking Queue
        │              ├── Security Queue
        │              └── Loading Queue
        │
        ▼
Socket.IO
        │
        ▼
Real-Time Dashboard
```

---

# 📂 Project Structure

```
Airport-Baggage-System
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── routes
│   ├── controllers
│   ├── config
│   ├── consumers
│   ├── models
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/HJjiit27/Airport-Baggage-System.git
```

Move into project

```bash
cd Airport-Baggage-System
```

---

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

# 🐳 Run Using Docker

```bash
docker compose up --build
```

---

# 🗄 Database

Database used:

- MySQL

Stores:

- Baggage Records
- Activity Logs

---

# 📨 RabbitMQ Workflow

The system publishes baggage events to RabbitMQ.

Queues include:

- Tracking Queue
- Security Queue
- Loading Queue

This allows asynchronous communication between airport services.

---

# 📸 Screenshots

Coming Soon

- Dashboard
- Check-in Page
- Checkout Page
- Records
- RabbitMQ Management
- Docker Containers

---

# 🔮 Future Improvements

- Authentication & Authorization
- Barcode/QR Code Integration
- Passenger Portal
- Flight Management Module
- Email Notifications
- Analytics Dashboard
- Kubernetes Deployment

---

# 👨‍💻 Author

**Hardik Jain**

GitHub:
https://github.com/HJjiit27

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub.
