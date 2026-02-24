# 🚀 Fynix - Full-Stack Deployment Guide

## 📱 Combined Frontend + Backend Deployment

### Quick Start

1. **Build the project** (combines frontend and backend):
```bash
# Windows
.\build.bat

# macOS/Linux
bash build.sh
```

2. **Start the server**:
```bash
npm run backend:start
```

3. **Access the app**:
```
http://localhost:3000/
```

---

## 📂 Project Structure

```
fynix-app/
├── backend/
│   ├── index.js           (Combined Express server)
│   ├── package.json
│   ├── .env              (API keys configuration)
│   └── public/           (Built React app - generated after build)
│
├── src/                  (React source code)
├── dist/                 (React build output)
├── build.bat            (Build script for Windows)
└── package.json
```

---

## 🔧 Configuration

### Backend Environment (.env)

```env
APIFREE_LLM_KEY=apf_vtt732jgly1e9pl04yik5j51
PORT=3000
```

---

## 📋 Available Scripts

```bash
# Build frontend + prepare backend
npm run build:combined

# Start development (frontend only)
npm run dev

# Start backend only
npm run backend:start

# Develop backend live
npm run backend:dev
```

---

## 🌐 API Endpoints

All endpoints are served under `/api/`:

- `POST /api/chat` - Chat with AI (25s cooldown)
- `POST /api/summary` - Generate summaries (PDF or image)
- `POST /api/image/generate` - Generate images (2min cooldown)
- `POST /api/voice/speak` - Text-to-speech

---

## 📦 For Mobile App Deployment

### Option 1: Self-Hosted
```bash
build.bat && npm run backend:start
```

### Option 2: Docker (Coming soon)
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN cd backend && npm install
RUN npm run build:combined
EXPOSE 3000
CMD ["npm", "run", "backend:start"]
```

### Option 3: Cloud Platforms
- **Heroku**: `npm run build:combined && npm run backend:start`
- **Railway**: Same as Heroku
- **Render**: Same as Heroku
- **Vercel**: Use `npm run build` then serverless

---

## 🎯 Features

✅ Single Server (no CORS issues)  
✅ Mobile-ready (PWA support)  
✅ AI Chat with cooldown protection  
✅ Offline-first architecture  
✅ Ko-fi integration for support  

---

## 📝 Notes

- The `build.bat` script automatically copies React build to backend's `public/` folder
- API base URL is set to empty string (relative path) for same-origin requests
- All API calls work from any domain hosting this server
- Perfect for mobile app wrapping with Capacitor or Electron

---

**Ready to deploy! 🚀**
