# 🌐 Web Ads & Authentication Setup Guide

## ✅ What's Implemented

**For Mobile:**
- Google AdMob (banner ads)
- In-App Purchase (remove ads)

**For Web:**
- Google AdSense (display ads)
- Firebase Authentication (sign in)
- Cloud sync for premium status

---

## 💰 Google AdSense Setup (Web Ads)

### Step 1: Create AdSense Account (10 minutes)

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Get Started"
3. Enter your website URL: `https://txt-2-qr-expo-final-[yours].vercel.app`
4. Fill in account information
5. Accept terms
6. **Wait for approval** (1-7 days)

### Step 2: Create Ad Unit (5 minutes)

Once approved:
1. In AdSense dashboard, click "Ads" → "By ad unit"
2. Click "Display ads"
3. Name it: "TXT 2 QR Banner"
4. Choose "Responsive"
5. Click "Create"
6. **Copy the code** - you need two things:
   - **Publisher ID:** `ca-pub-XXXXXXXXXXXXXXXX`
   - **Ad Slot ID:** `1234567890`

### Step 3: Update Your App (2 minutes)

1. Open `/src/components/WebAds.tsx`
2. Replace line 23:
   ```typescript
   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // YOUR Publisher ID
   ```
3. Replace the `slot` prop default:
   ```typescript
   slot = '1234567890', // YOUR Ad Slot ID
   ```

### Step 4: Add AdSense Script to HTML (1 minute)

Vercel will auto-inject this, or add to `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

---

## 🔐 Firebase Authentication Setup

### Step 1: Enable Firebase Auth (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click "Authentication" in left menu
4. Click "Get started"
5. Enable sign-in methods:
   - **Email/Password** - Click "Enable" → Save
   - **Google** - Click "Enable" → Add support email → Save

### Step 2: Get Firebase Config (2 minutes)

1. Click gear icon → "Project settings"
2. Scroll to "Your apps"
3. If no web app, click "</> Web"
4. Copy the `firebaseConfig` object
5. Paste into `/src/config/firebase.ts` (replace existing)

### Step 3: Configure (Already Done!) ✅

Your app is already set up! Just need your Firebase credentials.

---

## 🎯 How It Works

### User Flow:

**Free Users (No Sign-In):**
- See ads (AdMob on mobile, AdSense on web)
- Can use all features
- QR codes saved locally only

**Signed-In Users:**
- See ads (unless premium)
- QR codes sync to cloud
- Access from any device
- Can purchase premium

**Premium Users:**
- NO ads anywhere (mobile or web!)
- Cloud sync
- All features unlocked
- Premium badge

---

## 💰 Revenue Streams

### Mobile:
- **Free users:** AdMob banner ads
- **Premium users:** $3.99 IAP (one-time)

### Web:
- **Free users:** AdSense display ads
- **Premium users:** Could add Stripe checkout ($3.99)

### Combined:
- **10K mobile users:** $20K/year (ads) + $1.2K (IAP)
- **5K web users:** $5K/year (AdSense)
- **Total:** ~$26K/year at 15K total users

---

## 🚀 Testing Right Now

### What Works (Test IDs):
- ✅ Mobile ads (AdMob test ads)
- ✅ Web ads (once AdSense approved)
- ✅ Sign in UI (once Firebase configured)
- ✅ Premium purchase flow

### To Enable Production:

**AdMob (Mobile):**
- Get real ad IDs from AdMob console
- Update `src/components/AdBanner.tsx`

**AdSense (Web):**
- Get approved (1-7 days wait)
- Update `src/components/WebAds.tsx`

**Firebase Auth:**
- Configure project
- Update `src/config/firebase.ts`

---

## 📱 Current Status

**Mobile App:**
- ✅ AdMob integrated (test ads showing)
- ✅ IAP ready (needs App Store Connect setup)
- ✅ Premium system working

**Web App:**
- ✅ AdSense code added (needs your IDs)
- ✅ Firebase Auth ready (needs config)
- ✅ Sign-in UI created
- ✅ Premium sync ready

---

## ⏱️ Setup Timeline

| Task | Time | Status |
|------|------|--------|
| AdSense signup | 10 min | ⏳ Needs doing |
| AdSense approval | 1-7 days | ⏳ Waiting |
| AdSense integration | 2 min | ✅ Code ready |
| Firebase Auth enable | 5 min | ⏳ Needs doing |
| Firebase config update | 2 min | ⏳ Needs doing |
| **Total active time** | **~20 min** | - |

---

## 🎯 Quick Start

### Option 1: Launch Without (Recommended)
- Submit to App Store now
- Add web ads/auth in v1.1
- Focus on getting users first

### Option 2: Setup Everything First
- 20 minutes of setup
- Wait 1-7 days for AdSense approval
- Then launch with full monetization

---

## 📞 Resources

- **AdSense:** https://www.google.com/adsense/
- **AdMob:** https://admob.google.com/
- **Firebase Auth:** https://firebase.google.com/docs/auth
- **IAP Guide:** `MONETIZATION.md`

---

## ✅ What You Have NOW

**Without any additional setup:**
- ✅ Full app working
- ✅ Test ads on mobile
- ✅ Premium purchase UI
- ✅ Sign-in UI ready
- ✅ Web ads code ready

**Just needs your credentials to go live!**

**Want me to walk you through Firebase setup now?** 🚀

