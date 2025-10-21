# 🚀 Quick Start Guide

Get OpenStory running in 5 minutes!

## Step 1: Install Dependencies

```bash
# From the project root
cd server
npm install

cd ../client
npm install
cd ..
```

## Step 2: Set Up OpenAI API Key

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Create `.env` file in the `server/` directory:
   ```bash
   cd server
   touch .env
   ```

3. Add your API key to `server/.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   SESSION_SECRET=my-dev-secret-123
   PORT=3001
   ```

## Step 3: Start the Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
✅ Backend running on `http://localhost:3001`

**Terminal 2 (Frontend):**
```bash
cd client  
npm run dev
```
✅ Frontend running on `http://localhost:5173`

## Step 4: Open the App

Visit `http://localhost:5173` in your browser!

You should see three game options:
- **Fantasy Quest** - Epic fantasy adventure
- **Detective Noir** - Mystery investigation  
- **Space Explorer** - Sci-fi exploration

## Step 5: Start Playing

1. Click on any game
2. Type a message and hit Enter
3. Watch the AI respond!

Your conversation is automatically saved and will be there when you return.

---

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
➡️ Make sure you created `server/.env` with your API key

### Backend won't start
➡️ Make sure port 3001 is not already in use
➡️ Check that you ran `npm install` in the `server/` directory

### Frontend won't start  
➡️ Make sure port 5173 is not already in use
➡️ Check that you ran `npm install` in the `client/` directory

### Games not loading
➡️ Make sure the backend is running on port 3001
➡️ Check the browser console for errors

---

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check out [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
- Modify `server/games.json` to add your own games!

---

**Happy storytelling! 📖✨**

