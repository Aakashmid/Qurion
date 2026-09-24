<!-- has to update still  -->
<div align="center">

# 💬 Qurion

**A ChatGPT‑like AI chat app providing real‑time responses and persistent chat history.**

[Live Demo](https://qurion.vercel.app/) · [Demo Video](https://youtu.be/KqijN0bC2rs) · [Report Bug](https://github.com/Aakashmid/Qurion/issues)

![Django](https://img.shields.io/badge/Django%20REST-092E20?logo=django&logoColor=white)
![Channels](https://img.shields.io/badge/Django%20Channels-WebSocket-092E20)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black)

<!-- screenshots of application  , -->
![Qurion Screenshot]([./docs/screenshots/home.png])   

</div>

---

## About

Qurion is a full-stack AI chat application, similar to ChatGPT, where users can start new conversations, ask questions, and receive real-time AI-generated responses over WebSockets. Every conversation is saved, so users can return to any previous chat and continue where they left off.

I Built this  to understand how real-time AI chat products like ChatGPT work under the hood .


## Features

- **Authentication** — Secure signup/login using JWT (access + refresh tokens)
- **Real-time AI Chat** — Ask questions and get token-by-token streamed AI responses via WebSockets (Django Channels)
- **Chat History Management** — Every chat is saved; users can revisit, rename, or delete old conversations
- **Auto-Generated Chat Titles** — New chats are automatically titled based on the first message
- **Markdown & Code Rendering** — AI responses render formatted markdown, including code blocks, lists, and bold text
- **WebSocket Auto-Reconnect** — Automatically re-establishes the WebSocket connection on network drops, without losing chat state
- **Responsive UI** — Built with Tailwind CSS for a clean experience across devices
## Tech Stack

| Layer                | Technologies                                      |
| --------------------- | -------------------------------------------------- |
| **Backend**            | Django, Django REST Framework, Django Channels (WebSocket) , |
| **Real-time Layer**    | Django Channels + Redis (channel layer)            |
| **Frontend**           | React.js, Tailwind CSS, Axios, React Router , React Markdown  |
| **Database**           | PostgreSQL (supabase)                                   |
| **Authentication**     | JWT (djangorestframework-simplejwt)                 |
| **Deployment**   | Vercel (frontend) , Render (backend) , Upstash (redis) , Supabase (PostgreSQl) |
<!-- | **AI Integration**     | [Name of AI API used — e.g. OpenAI API / Gemini API / your own model] | -->



**Why this stack:**
- **Django Channels + Redis**: handles WebSocket connections so AI responses can be pushed to the user in real time instead of the client repeatedly polling the server.
- **Django REST Framework**: handles standard CRUD — auth, chat list, chat history — over normal HTTP.
- **JWT Authentication**: keeps the API stateless and lets the frontend and backend stay decoupled.


## Project Structure

```

├── backend/
│   ├── ChatBotSApp/           # main chat app 
│   │   ├── routing.py         # WebSocket URL routing
│   │   ├── consumers.py       # WebSocket consumers (Django Channels)
│   │   ├── models.py          # Chat, Message models
│   │   ├── serializers.py
│   │   ├── views.py           # REST endpoints (chat history , etc.)
│   │   └── urls.py            # REST urls
|   |
│   ├── accounts/
│   │   ├── backends.py        # custorm auth backend
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py           # Register, login, refresh ,logout JWT views
|   |
│   ├── ChatBotProject/
|   │   ├── settings/
|   │   │   ├── base.py            # common settings config
|   │   │   ├── development.py     # dev environment configurations
|   │   │   └── production.py      # production environment configurations
|   │   ├── asgi.py                #  ASGI entrypoint (required for Channels/WebSocket)
|   │   ├── urls.py                # Root URL routing
|   |
│   └── manage.py
│   └── requirments.txt            
|
├── frontend/
│   ├── src/
│   │   ├── components/          # ChatWindow, Sidebar, MessageBubble, etc.
│   │   ├── pages/               # Login, Register, ChatPage
│   │   ├── hooks/               # e.g. useSocket.js
│   │   ├── context/             # Auth context / chat context
│   │   ├── services/            # API calls  funtions
│   │   ├── api.jsx              #  centralized axios instance
│   │   └── App.jsx
│   └── package.json
|
└── README.md
```



## Getting Started

### Prerequisites

- Python `>= 3.12.4`
- Node.js `>= 22.17.0`
- Redis (running locally or via [Docker / Redis Cloud])
- [PostgreSQL if used, else skip]
- An API key from [your AI provider, e.g. OpenAI]

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aakashmid/Qurion.git
   ```

2. **Backend setup**

   ```bash
   cd Backend
   python -m venv venv
   source venv/Scripts/activate   # On Windows: .\venv\Scripts\activate
   

   pip install -r requirements.txt

   # Copy the example file and fill in your values (see `Backend/.env.example` for a description of each variable):
   cp .env.example .env       

   python manage.py migrate
   ```

3. **Start Redis**

   ```bash
   redis-server
   # or with Docker(first start docker):
   docker run -p 6379:6379 redis
   ```

4. **Run the Django ASGI server** (needed for WebSockets/Channels)

   ```bash
   [daphne ChatBotProject.asgi:application --port 8000]
   # or, if using runserver with Channels dev setup:
   python manage.py runserver
   ```

5. **Frontend setup**

   ```bash
   cd ../Frontend
   npm install

   # Copy the example file and fill in your values (see `Frontend/.env.example` for a description of each variable):
   cp .env.example .env       

   npm run dev
   ```

6. Visit `http://localhost:5173` (frontend) — backend runs at `http://localhost:8000`


## API Reference

| Method    | Endpoint                     | Description                          | Auth |
| ----------- | ------------------------------- | --------------------------------------- | ------ |
| POST        | `/api/auth/register/`            | Register a new user                     | ❌    |
| POST        | `/api/auth/logout/`            | Logout user                     | ❌    |
| POST        | `/api/auth/login/`               | Log in, returns JWT access & refresh    | ❌    |
| POST        | `/api/auth/refresh/`             | Refresh access token                    | ✅    |
| GET         | `/api/conversations/`                    | List all chats for the logged-in user   | ✅    |
| POST        | `/api/conversations/`                    | Create a new chat                       | ✅    |
| PATCH         | `/api/conversations/<id>/`               | rename chat | ✅    |
| GET         | `/api/conversations/<id>/messages/`               | Get messages/history for a specific chat| ✅    |
| DELETE      | `/api/conversations/<id>/`               | Delete a chat                           | ✅    |
| WS          | `ws/conversation/send-message/<id>/`            | WebSocket connection for live AI chat   | ✅    |


**Example WebSocket message (client → server)**

```json
{
  "message": "What is the capital of France?"
}
```

**Example WebSocket message (server → client)**

```json
{
  "sender": "ai",
  "message": "The capital of France is Paris.",
  "timestamp": "2026-09-22T10:30:00Z"
}
```

[Adjust these payloads to match your actual consumer's message format]


<!-- will add later -->
<!-- ## Challenges & Learnings

[Pick 2–3 real challenges you faced. Interviewers love this section. Examples of the kind of thing to write below — replace with what actually happened:]

- **Problem:** [e.g. Managing WebSocket connection state when a user has multiple chats open across tabs.]
  **Solution:** [e.g. Scoped each Channels consumer to a chat-specific group using chat ID as the group name.]
- **Problem:** [e.g. AI response latency made the chat feel unresponsive.]
  **Solution:** [e.g. Added a typing indicator and streamed partial responses over the WebSocket.]
- **Problem:** [e.g. JWT access tokens expiring mid-conversation.]
  **Solution:** [e.g. Implemented silent refresh-token rotation on the frontend using an axios interceptor.] -->


## Deployment

- **Frontend**: [e.g. Vercel]
- **Backend**: [e.g. Render / Railway — must support ASGI for WebSockets]
- **Redis**: [e.g. Redis Cloud / Upstash]
- **Database**: [e.g. Render Postgres / Supabase]


## Author

**Aakash Kumar Jha**

- LinkedIn: https://www.linkedin.com/in/aakash-kr-jha/
- GitHub: https://github.com/Aakashmid
- Email: aakash.k.jha13@gmail.com

---

<div align="center">⭐ If you found Qurion useful, please give it a star!</div>