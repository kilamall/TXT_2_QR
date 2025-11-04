# 🌐 Deploy TXT 2 QR to the Web

Get your app live on a real domain in **5 minutes**!

## 🚀 Option 1: Vercel (Recommended - Easiest!)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy!
```bash
cd /Users/kilam/Desktop/TXT2QR_EXPO_FINAL
vercel
```

### Step 3: Answer Prompts:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Select your account
- "Link to existing project?" → **No**
- "Project name?" → **txt2qr** (or your choice)
- "In which directory?" → **Press Enter** (current directory)
- "Want to modify settings?" → **No**

### Step 4: Wait 1-2 Minutes
- Build completes
- Gets URL like: `https://txt2qr.vercel.app`
- **Your app is LIVE!** 🎉

### Step 5: Custom Domain (Optional)
```bash
vercel domains add yourdomain.com
```

Follow prompts to connect your custom domain!

---

## 🚀 Option 2: Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build
```bash
cd /Users/kilam/Desktop/TXT2QR_EXPO_FINAL
npx expo export --platform web
```

### Step 3: Deploy
```bash
netlify deploy --dir=dist --prod
```

### Step 4: Get Your URL
- Gets URL like: `https://txt2qr.netlify.app`
- **Live!** 🎉

---

## 🚀 Option 3: GitHub Pages (Free!)

### Step 1: Update package.json
Add this to `package.json`:
```json
"homepage": "https://yourusername.github.io/TXT_2_QR"
```

### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Script
In `package.json`, add:
```json
"scripts": {
  "predeploy": "npx expo export --platform web",
  "deploy": "gh-pages -d dist"
}
```

### Step 4: Deploy
```bash
npm run deploy
```

**Live at:** `https://yourusername.github.io/TXT_2_QR`

---

## 💰 Cost Comparison

| Platform | Free Tier | Custom Domain | Speed |
|----------|-----------|---------------|-------|
| **Vercel** | ✅ Unlimited | ✅ Free | ⚡⚡⚡ |
| **Netlify** | ✅ 100GB/month | ✅ Free | ⚡⚡⚡ |
| **GitHub Pages** | ✅ 1GB | ✅ Free | ⚡⚡ |

**All are FREE forever for your use case!**

---

## 🎯 Quickest Method - Vercel (2 Commands!)

```bash
npm install -g vercel
cd /Users/kilam/Desktop/TXT2QR_EXPO_FINAL
vercel --prod
```

**That's it!** You get:
- ✅ Live URL (https://txt2qr.vercel.app)
- ✅ SSL certificate (HTTPS)
- ✅ Automatic deployments
- ✅ Custom domain support
- ✅ Global CDN (fast worldwide)

---

## 🌐 What Users Will Get:

**URL Example:** `https://txt2qr.vercel.app`

**Features on Web:**
- ✅ Create QR codes (text, URL, email, phone, SMS)
- ✅ Download QR codes as images
- ✅ History management
- ✅ Beautiful responsive UI
- ✅ Works on any device with browser
- ℹ️ Camera/Scanner shows "Use mobile app" (expected)

---

## 🎨 Custom Domain Setup

### If you own a domain (like txt2qr.com):

**With Vercel:**
```bash
vercel domains add txt2qr.com
```

Then update your domain's DNS:
- Add CNAME record → `cname.vercel-dns.com`

**Done! Your app will be at:** `https://txt2qr.com` 🎊

---

## 📱 Complete User Experience:

**Mobile Users:**
- Download from App Store/Play Store
- Full features (camera, scanner, OCR)

**Desktop Users:**
- Visit `https://yourdomain.com`
- Create QR codes in browser
- Download/share QR codes

**Everyone wins!** 🎉

---

## ⚡ Deploy RIGHT NOW:

**Run these 2 commands in Terminal:**

```bash
npm install -g vercel
vercel --prod
```

**Answer the prompts and you'll get a live URL in 2 minutes!**

Want me to walk you through it? Or try it yourself? 🚀

