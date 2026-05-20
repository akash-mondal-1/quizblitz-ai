# ⚡ QuizBlitz AI

> Think Fast. Rank Faster.

QuizBlitz AI is a production-quality, realtime multiplayer quiz platform powered by Google Gemini 2.0 Flash. Create AI-generated quizzes in seconds on any topic, invite friends via a room code, and compete in real-time with live leaderboards, streaks, and anti-cheat mechanisms.

![QuizBlitz AI Preview](https://via.placeholder.com/1200x600/0a0a0f/3b82f6?text=QuizBlitz+AI+-+Multiplayer+Quiz+Platform)

## ✨ Features

- 🧠 **AI-Powered Generation**: Instantly generate high-quality quizzes on ANY topic using Gemini 2.0.
- 👥 **Real-Time Multiplayer**: Instant sync using Firebase Realtime Database.
- 🏆 **Live Animated Leaderboard**: Watch ranks shuffle dynamically with Framer Motion.
- 🛡️ **Anti-Cheat System**: Detects tab switching and inactivity.
- 🥇 **Achievement System**: Unlock cool badges for streaks, speed, and accuracy.
- ⚡ **Smart Time-Based Scoring**: The faster you answer correctly, the more points you get.
- 👑 **Host Control Panel**: Full control over the game flow, kicking players, and skipping questions.
- 📱 **Mobile Responsive**: Looks premium and plays perfectly on any device.

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| UI & Animations | Framer Motion, Lucide Icons, Radix UI, Canvas |
| Backend | Next.js API Routes |
| Real-Time Sync | Firebase Realtime Database |
| Data Storage | Cloud Firestore |
| Auth | Firebase Authentication (Google & Anonymous) |
| AI Integration | Google Gemini 2.0 Flash |
| State Management | Zustand |

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizblitz-ai.git
   cd quizblitz-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google provider and Anonymous).
3. Enable **Realtime Database** and deploy the `firebase.rules.json` included in the root.
4. Enable **Firestore Database** for user stats and history.
5. Get your Web App config and paste it into `.env.local`.

## 🌐 Deployment

Deploying to Vercel is highly recommended:
1. Push your code to GitHub.
2. Import project in Vercel.
3. Add all environment variables from `.env.local`.
4. Deploy!

## 🔮 Future Improvements

- Add customizable player avatars
- Implement WebRTC voice chat for lobbies
- Add global leaderboards
- Export quiz results to PDF

## 📄 License

MIT License - feel free to use this for your own hackathons and projects!
