# AI Chatbot Integration - Powered by Google Gemini

## 🤖 Overview
An intelligent AI chatbot integrated into your Mega Power Gym website using Google's Gemini API. The chatbot provides instant answers about gym memberships, facilities, schedules, and fitness tips.

## ✨ Features

### 🎯 Smart Assistance
- **Membership Information**: Package details, pricing, features
- **Gym Facilities**: Equipment, amenities, services
- **Schedules & Timing**: Opening hours, class schedules
- **Fitness Guidance**: Workout tips, nutrition advice
- **General Queries**: Location, contact, policies

### 💬 User Experience
- **Floating Chat Button**: Always accessible on all pages
- **Real-time Responses**: Powered by Google Gemini AI
- **Quick Questions**: Pre-defined common queries
- **Chat History**: View conversation within session
- **Mobile Responsive**: Works perfectly on all devices
- **Typing Indicators**: Shows when AI is processing
- **Beautiful UI**: Modern gradient design matching gym theme

### 🔒 Safety Features
- Content filtering for inappropriate requests
- Error handling with graceful fallbacks
- Rate limiting protection
- Secure API key management

## 🚀 Setup Instructions

### Step 1: Get Your Gemini API Key

1. **Visit Google AI Studio**:
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

2. **Sign In**:
   - Use your Google account

3. **Create API Key**:
   - Click "Create API Key"
   - Select "Create API key in new project" or use existing project
   - Copy the generated API key

4. **Free Tier Limits**:
   - 60 requests per minute
   - 1,500 requests per day
   - Perfect for small to medium websites

### Step 2: Configure Your Project

1. **Open `.env` file** in `megapower-react-app/` folder:
   ```bash
   cd megapower-react-app
   notepad .env
   ```

2. **Add your API key**:
   ```env
   REACT_APP_GEMINI_API_KEY=AIzaSyC_your_actual_api_key_here
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. **Save the file**

### Step 3: Install Dependencies (if needed)

The chatbot uses Ant Design components already in your project. No additional packages needed!

### Step 4: Start the Application

```bash
# Start Backend
cd Backend
npm start

# Start Frontend (in new terminal)
cd megapower-react-app
npm start
```

### Step 5: Test the Chatbot

1. Open your browser: `http://localhost:3000`
2. Look for the floating chat button (bottom right)
3. Click to open the chatbot
4. Try asking: "What are your membership packages?"

## 📱 How to Use

### For Users

1. **Open Chat**: Click the purple floating button at bottom-right
2. **Ask Questions**: Type your question or click quick questions
3. **Get Answers**: AI responds instantly with helpful information
4. **Clear Chat**: Click trash icon to start fresh conversation
5. **Close Chat**: Click X to minimize (keeps chat history)

### Quick Question Examples
- 💰 What are your membership packages?
- ⏰ What are your gym timings?
- 🏋️ What equipment do you have?
- 🎯 Do you offer personal training?
- 📍 Where are you located?

## 🎨 Customization

### Change Chatbot Appearance

Edit `src/components/Chatbot.css`:

```css
/* Change chatbot colors */
.chatbot-header {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

/* Change button colors */
.chat-toggle-btn {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%) !important;
}
```

### Modify Chatbot Context

Edit `src/components/Chatbot.jsx` - Update `SYSTEM_CONTEXT`:

```javascript
const SYSTEM_CONTEXT = `You are a helpful assistant for [Your Gym Name]...
Add your gym's specific information here...`;
```

### Add More Quick Questions

In `Chatbot.jsx`, modify the `quickQuestions` array:

```javascript
const quickQuestions = [
  '💰 What are your membership packages?',
  '⏰ What are your gym timings?',
  // Add more questions here
  '🏊 Do you have a swimming pool?'
];
```

## 🔧 Troubleshooting

### Issue: Chatbot says "Failed to get response"

**Solutions**:
1. Check your API key is correct in `.env`
2. Verify you have internet connection
3. Ensure Gemini API is enabled for your project
4. Check API quota limits (60 req/min, 1500 req/day)

### Issue: API Key error

**Solutions**:
1. Make sure `.env` file is in `megapower-react-app/` folder
2. API key should start with `AIzaSy...`
3. No quotes around the API key
4. Restart React development server after changing `.env`

### Issue: Chatbot button not appearing

**Solutions**:
1. Clear browser cache
2. Check browser console for errors (F12)
3. Verify `Chatbot` component is imported in `App.js`
4. Ensure CSS file is properly imported

### Issue: Slow responses

**Possible Causes**:
- Internet connection speed
- API rate limiting
- High server load

**Solutions**:
- Wait a few seconds between requests
- Check your internet speed
- Try again in a few minutes

## 📊 API Usage Monitoring

### Check Your Usage
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Dashboard"
4. View Gemini API usage statistics

### Free Tier Limits
- **RPM (Requests Per Minute)**: 60
- **RPD (Requests Per Day)**: 1,500
- **TPM (Tokens Per Minute)**: 32,000

## 🔒 Security Best Practices

### Environment Variables
- ✅ Store API key in `.env` file
- ✅ Add `.env` to `.gitignore`
- ❌ Never commit API keys to Git
- ❌ Never expose API keys in frontend code

### API Key Protection
```bash
# Check if .env is in .gitignore
cat .gitignore | grep .env

# If not, add it:
echo ".env" >> .gitignore
```

## 🚀 Production Deployment

### For Production Sites

1. **Use Environment Variables**:
   - Don't use `.env` file in production
   - Set environment variable in hosting platform
   - Example (Vercel): Add `REACT_APP_GEMINI_API_KEY` in dashboard

2. **Enable API Key Restrictions**:
   - Go to Google Cloud Console
   - Restrict API key to your domain
   - Enable HTTP referrer restrictions

3. **Consider Backend Proxy**:
   For better security, create a backend endpoint that calls Gemini API:
   ```javascript
   // Backend endpoint
   app.post('/api/chat', async (req, res) => {
     // Call Gemini API from backend
     // This keeps API key secure on server
   });
   ```

## 📈 Future Enhancements

Potential features to add:
- [ ] Chat history persistence (save to database)
- [ ] User authentication integration
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Sentiment analysis
- [ ] Analytics dashboard
- [ ] Personalized responses based on user profile
- [ ] Integration with booking system

## 🤝 Support

### Getting Help
- **Gemini API Docs**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **React Documentation**: [https://react.dev](https://react.dev)
- **Ant Design**: [https://ant.design](https://ant.design)

### Common Resources
- [Gemini API Quickstart](https://ai.google.dev/tutorials/web_quickstart)
- [API Key Management](https://console.cloud.google.com/apis/credentials)
- [Rate Limiting Info](https://ai.google.dev/pricing)

## 📝 Testing Checklist

Before going live, test:
- [ ] Chatbot opens and closes properly
- [ ] Messages send and receive correctly
- [ ] Quick questions work
- [ ] Clear chat functionality
- [ ] Mobile responsive design
- [ ] Error handling (disconnect internet and try)
- [ ] API key is secure (not in frontend code)
- [ ] Typing indicators show
- [ ] Scroll behavior works
- [ ] Cross-browser compatibility

## 🎉 Success!

Your gym website now has an intelligent AI chatbot! Users can get instant answers 24/7 about:
- ✅ Memberships & pricing
- ✅ Facilities & equipment
- ✅ Schedules & timings
- ✅ Fitness advice
- ✅ General information

**Result**: Better user engagement, reduced support inquiries, and improved customer experience! 🎯
