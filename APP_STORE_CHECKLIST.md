# 📋 App Store Submission Checklist

## ✅ Pre-Submission Checklist

### 1. App Assets (REQUIRED)
- [ ] App Icon (1024x1024 PNG, no transparency)
- [ ] iPhone 6.7" Screenshots (1290×2796) - Need 3-10 screenshots
- [ ] iPhone 6.5" Screenshots (1242×2688) - Need 3-10 screenshots  
- [ ] iPad Pro 12.9" Screenshots (2048×2732) - Need 3-10 screenshots
- [ ] App Preview Video (Optional but recommended, 15-30 seconds)

### 2. App Store Connect Setup
- [ ] Apple Developer Account ($99/year)
- [ ] Create App ID in Developer Portal
- [ ] Create App in App Store Connect
- [ ] Fill in app metadata:
  - [ ] App Name: "TXT 2 QR"
  - [ ] Subtitle: "QR Code Generator"
  - [ ] Description (4000 chars max)
  - [ ] Keywords (100 chars max)
  - [ ] Support URL
  - [ ] Marketing URL (optional)
  - [ ] Privacy Policy URL (REQUIRED)

### 3. Legal Requirements
- [ ] Privacy Policy (can use template below)
- [ ] Terms of Service (optional)
- [ ] Support page with contact info

### 4. App Information
- [ ] Primary Category: Utilities
- [ ] Secondary Category: Business
- [ ] Content Rating: 4+
- [ ] Pricing: Free (recommended for v1.0)
- [ ] Availability: All countries

### 5. Build & Test
- [ ] Test on iPhone (Done! ✅)
- [ ] Test on iPad
- [ ] Test all features:
  - [ ] Create QR from text
  - [ ] Create QR from URL  
  - [ ] Create QR from email
  - [ ] Create QR from phone
  - [ ] Save to history
  - [ ] Share QR code
  - [ ] Delete from history
  - [ ] Camera access
  - [ ] Photo library access

### 6. Build for Production
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo (create account if needed)
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Wait for build (10-20 minutes)
# Download .ipa file or submit directly
```

### 7. Submit to App Store
```bash
# Submit to App Store Connect
eas submit --platform ios --latest

# Or manually upload .ipa to App Store Connect
```

### 8. App Review Preparation
- [ ] App Review Information filled out
- [ ] Demo video or screenshots ready
- [ ] Notes for reviewer (see below)
- [ ] Contact information for emergencies

---

## 📝 Quick Start Guide for App Store Connect

### Step 1: Create Apple Developer Account
1. Go to https://developer.apple.com/
2. Enroll in Apple Developer Program ($99/year)
3. Complete enrollment (takes 24-48 hours)

### Step 2: Create App
1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: TXT 2 QR
   - Primary Language: English
   - Bundle ID: com.txt2qr.app
   - SKU: txt2qr-v1
   - User Access: Full Access

### Step 3: Fill App Information

**App Information Section:**
```
Name: TXT 2 QR
Subtitle: QR Code Generator
Privacy Policy URL: [Your URL]
Category: Utilities
Secondary Category: Business
```

**Pricing:**
```
Price: Free
Available in all territories
```

**App Privacy:**
- Data Not Collected (current version)
- Or if using analytics: "Data Used to Track You" → No

**Age Rating:**
- 4+ (No Restricted Content)

### Step 4: Prepare Screenshots

Take screenshots on your phone:
1. Home screen showing "Create QR Code"
2. Manual input with text entered
3. Generated QR code display
4. History screen with saved QR codes
5. Share menu open

Use [https://www.figma.com/](Figma) or [https://screenshots.pro/](Screenshots.pro) to add text overlays and make them professional.

### Step 5: Write Description

**Short Description (170 chars):**
```
Create QR codes instantly from text, URLs, emails & phone numbers. Save, share & organize all your QR codes in one beautiful app. No ads, no tracking!
```

**Full Description:**
```
TXT 2 QR - The Easiest QR Code Generator

Transform any text into a scannable QR code in seconds! Perfect for sharing links, contact info, WiFi passwords, and more.

✨ KEY FEATURES:

📝 MULTIPLE INPUT TYPES
• Plain text
• Website URLs
• Email addresses
• Phone numbers
• SMS messages
• And more!

🎨 BEAUTIFUL & SIMPLE
• Clean, intuitive interface
• Fast QR code generation
• Works offline
• No account required

💾 ORGANIZE & MANAGE
• Save unlimited QR codes
• View history anytime
• Quick search & sort
• Delete unwanted codes

📤 SHARE ANYWHERE
• Save to Photos
• Share via Messages, Email, WhatsApp
• Export as image

📷 FLEXIBLE INPUT
• Type or paste text
• Upload from photo library
• Take new photos

🔒 PRIVACY FIRST
• No data collection
• No ads
• No tracking
• Everything stored locally

PERFECT FOR:
• Business cards & contact sharing
• Website & social media links
• Event tickets & RSVPs
• WiFi password sharing
• Product information
• Restaurant menus
• And unlimited other uses!

WHO IT'S FOR:
• Business professionals
• Event organizers
• Marketers
• Small business owners
• Teachers & students
• Anyone who shares information!

COMING SOON:
• Full OCR text recognition
• Dark mode
• Custom QR designs
• Batch generation

Download TXT 2 QR today and start creating professional QR codes in seconds!

Questions? Contact us at support@txt2qr.app
```

**Keywords (100 chars max):**
```
qr code,qr,generator,scanner,barcode,ocr,url,business card,share,create qr
```

### Step 6: App Review Information

**Contact Information:**
```
First Name: [Your First Name]
Last Name: [Your Last Name]
Phone: [Your Phone]
Email: [Your Email]
```

**Notes for Reviewer:**
```
Thank you for reviewing TXT 2 QR!

HOW TO TEST:
1. Open the app
2. In the "Create QR Code" section, enter any text (e.g., "Hello World" or "https://google.com")
3. Select the type (Text, URL, Email, Phone, or SMS)
4. Tap "Generate QR Code"
5. View the generated QR code
6. Tap "Share" to test sharing functionality
7. Tap "Save to History" to save the QR code
8. Navigate to "History" tab to see saved codes
9. Tap any saved code to view it again
10. Tap camera icon to test photo capture (manual text entry)

NOTES:
- All features work offline
- No login or account required
- Camera permission requested for photo capture
- Photo library permission for image upload
- Currently uses manual text entry; full OCR coming in v1.1
- All data stored locally on device
- No external servers or APIs used

If you have any questions, please contact me at [your email]
```

---

## 🎨 App Icon & Assets

### App Icon Requirements:
- 1024x1024 pixels
- PNG format
- No transparency
- No rounded corners (iOS adds them)
- Should look good at small sizes

**Quick Icon Ideas:**
- Large "QR" text with QR code pattern
- Minimalist QR code symbol
- Text transforming into QR code
- Use blue (#007AFF) as primary color

**Tools to Create Icons:**
- Canva (free): https://www.canva.com/
- Figma (free): https://www.figma.com/
- App Icon Generator: https://appicon.co/

### Splash Screen:
- 2048x2732 pixels (iPad Pro size)
- Center your logo/icon
- Background: #007AFF (your brand color)
- Keep it simple and clean

---

## ⏱️ Timeline

**Before Submission:**
- Create assets: 2-4 hours
- Set up App Store Connect: 1 hour
- Write descriptions: 1 hour
- Test thoroughly: 2 hours
- **Total prep time: 6-8 hours**

**Build & Submit:**
- EAS build: 15-30 minutes
- Upload to App Store: 10 minutes
- **Total: ~1 hour**

**Apple Review:**
- Initial review: 24-48 hours typically
- If approved: Live immediately!
- If rejected: Fix issues and resubmit (24 hours)

**Total time from start to App Store: 2-3 days**

---

## 🚀 After Approval

### Launch Day:
- [ ] Share on social media
- [ ] Email friends/network
- [ ] Post on Product Hunt
- [ ] Post on Reddit (r/SideProject, r/iOSApps)
- [ ] Share on Hacker News

### First Week:
- [ ] Monitor reviews daily
- [ ] Respond to user feedback
- [ ] Track crashes in App Store Connect
- [ ] Monitor download numbers

### First Month:
- [ ] Gather feature requests
- [ ] Plan v1.1 updates
- [ ] Consider monetization strategy
- [ ] Start building user base

---

## 💰 Monetization (Optional for v1.0)

### Option 1: Keep it Free
- Build user base first
- Add monetization in v2.0
- **Recommended for launch**

### Option 2: Freemium
- Free: Basic features
- Premium ($2.99/month or $19.99/year):
  - Full OCR
  - Custom QR designs
  - Batch generation
  - Cloud sync

### Option 3: One-Time Purchase
- Free to download
- $4.99 to unlock all features

---

## 📧 Email Templates

### Privacy Policy URL
If you don't have a website, use this free service:
- https://www.privacypolicies.com/
- https://app-privacy-policy-generator.firebaseapp.com/

### Simple Privacy Policy Template:
```
TXT 2 QR Privacy Policy

Last updated: [Date]

TXT 2 QR ("we", "our", or "us") operates the TXT 2 QR mobile application.

Information Collection and Use
We do not collect, store, or transmit any personal information. All data created in the app (QR codes, history) is stored locally on your device and never leaves your device.

Camera & Photos
The app requests camera and photo library permissions to allow you to take photos or select images. These photos are only used within the app and are never uploaded or shared.

Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

Contact Us
If you have any questions about this Privacy Policy, please contact us at support@txt2qr.app
```

---

## ✅ Final Checklist Before Submit

- [ ] App tested on real device
- [ ] All features working
- [ ] No crashes
- [ ] Icons look good
- [ ] Screenshots ready
- [ ] Description written
- [ ] Privacy policy live
- [ ] App Store Connect filled out
- [ ] Build uploaded
- [ ] App Review info complete
- [ ] Contact info correct

## 🎉 You're Ready to Submit!

Once everything above is checked off, hit that "Submit for Review" button!

**Expected timeline:**
- Submission: Today
- Review: 1-2 days
- If approved: LIVE!

**Good luck! 🚀**

