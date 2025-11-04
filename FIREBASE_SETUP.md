# 🔥 Firebase Setup for File Uploads

Your app now supports **cloud file uploads**! Users can upload PDFs, documents, images, etc., and generate QR codes with download links.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: **"TXT2QR"** (or your choice)
4. Disable Google Analytics (optional for this app)
5. Click **"Create project"**
6. Wait 30 seconds for project to be created

### Step 2: Enable Storage

1. In your new Firebase project, click **"Storage"** in the left menu
2. Click **"Get started"**
3. Click **"Next"** (use default security rules for now)
4. Choose location (us-central1 recommended)
5. Click **"Done"**

### Step 3: Get Configuration

1. Click the **gear icon** (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **"Web" button** (</> icon)
4. Register app:
   - App nickname: **"TXT 2 QR"**
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
5. Copy the **firebaseConfig** object

### Step 4: Update Your App

1. Open `/Users/kilam/Desktop/TXT2QR_EXPO_FINAL/src/config/firebase.ts`
2. Replace the configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 5: Update Security Rules (Important!)

1. In Firebase Console, go to **Storage** → **Rules**
2. Replace with these rules (allows anyone to upload/download):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow anyone to upload files
      allow write: if request.resource.size < 50 * 1024 * 1024; // 50MB limit
      // Allow anyone to read files
      allow read: if true;
    }
  }
}
```

3. Click **"Publish"**

---

## 🎯 How It Works

### User Flow:
1. User taps **"File" button** in your app
2. Selects PDF, document, image, etc.
3. App shows: **"Upload File to Cloud?"**
   - Filename
   - File size
   - Confirmation buttons
4. User taps **"Upload & Create QR"**
5. Upload progress shows (0% → 100%)
6. Success! **QR code created with download link**
7. Anyone scanning the QR code **downloads the file**!

### What Gets Uploaded:
- ✅ PDFs
- ✅ Word docs (.doc, .docx)
- ✅ Images (.jpg, .png, .gif)
- ✅ Spreadsheets (.xlsx, .csv)
- ✅ Text files (.txt)
- ✅ Any file type!

### Limits:
- **Max file size:** 50 MB (configurable in security rules)
- **Free tier:** 5 GB storage, 1 GB downloads/day
- **Paid tier:** ~$0.026 per GB storage, $0.12 per GB downloads

---

## 🆓 Firebase Free Tier

**Generous free limits:**
- **Storage:** 5 GB
- **Downloads:** 1 GB/day (30 GB/month)
- **Operations:** 50,000 reads + 20,000 writes/day

**Perfect for starting out!**

For 1000 active users sharing files:
- ~500 MB storage used
- ~2 GB downloads/month
- **Completely free!** ✅

---

## 🔒 Security Considerations

### Current Setup (Demo):
- ✅ Anyone can upload files
- ✅ Anyone can download files
- ⚠️ Files stored permanently (no auto-delete)

### Production Recommendations:

**Option 1: Require Authentication** (More Secure)
```javascript
allow write: if request.auth != null; // Must be signed in
allow read: if true; // Anyone can download
```

**Option 2: Auto-Delete Old Files**
Set up Cloud Function to delete files after 30 days

**Option 3: Virus Scanning**
Add Cloud Functions to scan uploaded files

---

## 🧪 Testing File Upload

### On Your iPhone (once Firebase is configured):

1. **Create QR Code** section
2. Tap **"File" button**
3. Select a PDF or document
4. Confirm upload
5. **Wait for upload** (progress shows)
6. **QR code created!**
7. **Scan the QR code** (with another device/app)
8. **File downloads!** 🎉

### What Users Can Share:
- 📄 Menu PDFs for restaurants
- 📊 Presentation files
- 📋 Forms and documents
- 🖼️ High-res images
- 📝 Resume/CV
- 🎫 Event tickets (PDF)
- 📱 App downloads (APK)

---

## ⚠️ Before Launching to App Store

1. **Set up your own Firebase project** (don't use demo config!)
2. **Update security rules** for production
3. **Monitor usage** in Firebase Console
4. **Consider costs** if you expect high traffic
5. **Add file size limits** to prevent abuse

---

## 💡 Alternative: Use Free Cloud Storage

If you don't want to use Firebase, you can use:
- **Cloudinary** (25 GB free)
- **AWS S3** (5 GB free first year)
- **Supabase** (1 GB free)
- **Vercel Blob** (limits apply)

Just update `/src/utils/fileUploadService.ts` with their API!

---

## ✅ Quick Start Checklist

- [ ] Create Firebase project
- [ ] Enable Storage
- [ ] Copy configuration
- [ ] Update `firebase.ts`
- [ ] Publish security rules
- [ ] Test file upload
- [ ] Verify QR code works
- [ ] Test download from QR

**Takes 5-10 minutes total!** 🚀

---

## 📞 Need Help?

Firebase docs: https://firebase.google.com/docs/storage
Support: Include in your app's support email

**Once configured, users can share ANY file via QR code!** 🎊

