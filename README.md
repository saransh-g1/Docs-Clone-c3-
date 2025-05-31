# 📄 C3 Docs App

C3 Docs is a powerful real-time collaborative document editor built for speed and efficiency. It enables multiple users to work together seamlessly on the same document, with changes reflected instantly across all clients.

---

## 🚀 Features

- 🧠 **Real-time Collaboration**  
  Collaborate with others in real-time using WebSockets.

- 🗃️ **Redis Caching**  
  Redis is used for fast caching of  document diffs, ensuring low latency and scalability.

- 🛡️ **Efficient Operational Transforms**  
  Ensures consistency and resolves conflicts during simultaneous edits.

- 🌐 **WebSocket-Powered Updates**  
  Live updates across all connected clients via WebSockets, creating a smooth collaborative experience.

- 🧩 **Modular Architecture**  
  Easily extendable for versioning, rich-text support, and media embedding.

---

## ⚙️ Tech Stack

- **Backend**: Node.js / Express  
- **WebSocket**: socket.io  
- **Cache**: Redis  
- **Database**: PostgreSQL 
- **Frontend**: React 

---


## 🧪 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/c3-docs.git
cd c3-docs

# Install dependencies
npm install

# Start Redis server (if not already running)
redis-server

# Start the development server
npm run dev
