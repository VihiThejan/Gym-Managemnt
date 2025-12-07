# Chatbot Troubleshooting Guide

## Issue: Connection Error

If you see "Sorry, I'm having trouble connecting right now", follow these steps:

### Step 1: Check Browser Console

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Send a message in the chatbot
4. Look for error messages (red text)
5. Check what the error says

### Step 2: Verify API Key

Your API key in `.env` file should look like:
```
REACT_APP_GEMINI_API_KEY=AIzaSyBoAS5-_gFM6y4YZlTMf5Gic8Q13Rzl-LE
```

**To verify your key is valid:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check if your key is listed and active
3. If not, create a new key
4. **IMPORTANT**: Make sure you're using the **new Gemini 1.5 Flash** model (updated in code)

### Step 3: Check API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your API key
3. Click "Edit API key"
4. Check restrictions:
   - **Application restrictions**: Should be "None" for testing
   - **API restrictions**: Should allow "Generative Language API"

### Step 4: Enable the API

1. Go to [Generative Language API](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
2. Make sure it's **ENABLED** for your project
3. If not, click "ENABLE"

### Step 5: Check Rate Limits

Gemini API Free Tier Limits:
- **60 requests per minute**
- **1,500 requests per day**

If you exceeded limits, wait a bit and try again.

### Step 6: Restart Development Server

After changing `.env` file:

```powershell
# Stop the server (Ctrl+C)
# Then restart:
cd megapower-react-app
npm start
```

**Environment variables are only loaded on server start!**

## Common Errors and Solutions

### Error: "400 Bad Request"
- **Cause**: Invalid API request format or model name
- **Solution**: Code updated to use `gemini-1.5-flash` model (newer and better)

### Error: "403 Forbidden"
- **Cause**: API key invalid or restricted
- **Solution**: 
  1. Generate new key at [AI Studio](https://aistudio.google.com/app/apikey)
  2. Remove all restrictions (for testing)
  3. Make sure Generative Language API is enabled

### Error: "429 Too Many Requests"
- **Cause**: Exceeded rate limits
- **Solution**: Wait 1 minute and try again

### Error: "CORS policy"
- **Cause**: Browser blocking cross-origin request
- **Solution**: This should NOT happen with Gemini API (CORS enabled by default)

## Debug Console Messages

The updated chatbot now logs helpful debug information:

```
✅ Gemini API Key loaded: AIzaSyBoAS...
🔄 Sending request to Gemini API...
📤 Request URL: https://generativelanguage.googleapis.com/...
📥 Response status: 200
✅ Response received: {...}
💬 AI Response: Hello! How can I help you today?
```

OR error messages like:

```
❌ API Error Response: { error: { message: "API key not valid" } }
❌ Gemini API Error: Error: API key access denied
```

## Testing Your API Key Manually

Test your key with curl:

```powershell
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d '{\"contents\":[{\"parts\":[{\"text\":\"Hello\"}]}]}'
```

Replace `YOUR_API_KEY` with your actual key.

**Expected response**: JSON with AI-generated text  
**Error response**: JSON with error message explaining the issue

## Still Not Working?

1. **Create a NEW API key**: Old keys might be invalid
   - Go to [AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API key"
   - Select or create a Google Cloud project
   - Copy the new key

2. **Update .env file** with new key:
   ```
   REACT_APP_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```

3. **Restart the server** (must restart after .env changes)

4. **Clear browser cache**: Ctrl+Shift+Delete → Clear cached data

5. **Try incognito mode**: Rules out browser extension interference

## Model Update

**Changed model from `gemini-pro` to `gemini-1.5-flash`**

Why?
- `gemini-1.5-flash` is newer and more reliable
- Faster response times
- Better accuracy
- Still free tier available

If you still get errors, the model name might have changed. Check the latest at:
https://ai.google.dev/gemini-api/docs/models/gemini

## Contact Support

If none of these solutions work:
1. Share the **full error message** from console (F12)
2. Share your API key status (active/restricted)
3. Confirm API is enabled in Google Cloud Console

---

## Quick Checklist

- [ ] API key added to `.env` file
- [ ] Server restarted after .env change
- [ ] Generative Language API enabled in Google Cloud
- [ ] No restrictions on API key (for testing)
- [ ] Browser console checked for errors
- [ ] Not exceeding rate limits (60/min)
- [ ] Using latest model: `gemini-1.5-flash`
