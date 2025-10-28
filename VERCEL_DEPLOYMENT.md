# 🚀 Deploy ContextGuard to Vercel

Complete guide to deploy your Flask application to Vercel.

---

## ✅ Prerequisites

- GitHub account (to import from repository)
- Vercel account (free tier available)
- Your code pushed to GitHub

---

## 📋 Step-by-Step Deployment

### **Method 1: Deploy via Vercel Dashboard (Easiest)**

1. **Sign Up/Login to Vercel**
   - Go to: https://vercel.com
   - Click "Sign Up" or "Login"
   - Sign in with GitHub

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Find: `Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   SECRET_KEY=your-secret-key-change-in-production
   GEMINI_API_KEY=your-google-gemini-api-key
   FLASK_ENV=production
   DEBUG=False
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
   
   Optional (if using Firebase):
   ```
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

---

### **Method 2: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd "e:\hackthons\New folder (2)\ContextGuard"
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - Project name? `contextguard` (or your choice)
   - Directory? `./`
   - Override settings? `N`

5. **Add Environment Variables**
   ```bash
   vercel env add SECRET_KEY
   vercel env add GEMINI_API_KEY
   vercel env add FLASK_ENV
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration Files Created

✅ **vercel.json** - Vercel configuration
- Routes Flask app requests
- Serves static files
- Sets Python runtime

✅ **index.py** - Vercel entry point
- Imports Flask app
- Compatible with Vercel's Python runtime

✅ **.vercelignore** - Files to exclude from deployment
- Virtual environments
- Cache files
- Local scripts

---

## 🌐 After Deployment

### Update CORS Settings
After deployment, update your allowed origins:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app,chrome-extension://
   ```

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Enable Analytics
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable "Web Analytics" for free traffic insights

---

## 🔍 Troubleshooting

### Build Failed
- **Check logs** in Vercel dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify Python version compatibility

### App Not Loading
- Check environment variables are set correctly
- Verify `index.py` imports `app` correctly
- Check browser console for errors

### Static Files Not Loading
- Verify static file paths in templates
- Check `vercel.json` routes configuration
- Use `url_for('static', filename='...')` in templates

### Database/Firebase Issues
- Ensure Firebase credentials are properly set
- Check Firestore security rules
- Verify API keys are active

---

## 📊 Vercel Free Tier Limits

- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (10 second timeout)

**Note**: Flask apps on Vercel run as serverless functions. Each request has a 10-second execution limit on free tier.

---

## 🎯 Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] App tested and working
- [ ] Custom domain added (optional)
- [ ] CORS settings updated

---

## 🚀 Deployment Commands Summary

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project directory
cd "e:\hackthons\New folder (2)\ContextGuard"
vercel

# Deploy to production
vercel --prod

# Add environment variables
vercel env add SECRET_KEY
vercel env add GEMINI_API_KEY

# View deployment logs
vercel logs

# Open deployed app
vercel open
```

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Python on Vercel**: https://vercel.com/docs/functions/serverless-functions/runtimes/python
- **Your Deployments**: https://vercel.com/kanithisathvik

---

## 🎉 After Successful Deployment

Your app will be live at a URL like:
```
https://contextguard.vercel.app
```

You can then:
1. ✅ Test all features
2. ✅ Share the live URL
3. ✅ Add to your portfolio
4. ✅ Configure custom domain
5. ✅ Monitor analytics

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Every push to GitHub creates a preview deployment
2. **Environment Variables**: Different variables for production/preview/development
3. **Logs**: Use `vercel logs` to debug issues
4. **Rollback**: Easy rollback to previous deployments in dashboard
5. **Team Collaboration**: Invite team members to manage deployments

---

## ⚠️ Important Notes

- **Serverless Limitations**: 10-second timeout on free tier
- **Cold Starts**: First request may be slower
- **File System**: Read-only filesystem (use external storage for uploads)
- **Database**: Use external database (Firebase, MongoDB, etc.)

---

**Ready to deploy?** Just push your code to GitHub and import it in Vercel! 🚀
