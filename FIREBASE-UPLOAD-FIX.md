# Firebase Storage Upload Issue - Quick Fix

## The Problem
Image uploads stuck at 0% forever means Firebase is not configured properly.

## Solution

### Step 1: Check if you have Firebase credentials

Run this in your terminal:
```bash
ls .env.local
```

If you see "cannot find" or similar error, you need to create the file.

### Step 2: Create `.env.local` file

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Firebase credentials

### Step 3: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon (⚙️) → Project Settings
4. Scroll down to "Your apps" section
5. Click the web app icon `</>` (or create a web app if you don't have one)
6. Copy the config values

### Step 4: Fill in your `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 5: Enable Firebase Storage

1. In Firebase Console, go to **Storage** in the left menu
2. Click "Get Started"
3. Choose "Start in production mode" (or test mode for now)
4. Click "Done"

### Step 6: Set Storage Rules (Important!)

Go to **Storage** → **Rules** tab and add these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{imageFile} {
      // Allow anyone to read product images
      allow read: if true;
      // Allow uploads (for now - add authentication later)
      allow write: if request.resource.size < 10 * 1024 * 1024 // 10MB limit
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Click "Publish" to save the rules.

### Step 7: Enable Firestore Database

1. Go to **Firestore Database** in the left menu
2. Click "Create database"
3. Choose "Start in production mode" (or test mode)
4. Select a location (closest to Ghana: europe-west)
5. Click "Enable"

### Step 8: Set Firestore Rules

Go to **Firestore Database** → **Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - public read, restricted write
    match /products/{productId} {
      allow read: if true;
      allow write: if true; // Change this later to require authentication
    }
    
    // Purchase requests - public write, restricted read
    match /purchase-requests/{requestId} {
      allow read: if true; // Change to admin only later
      allow write: if true;
    }
  }
}
```

Click "Publish".

### Step 9: Restart Your Dev Server

**Important!** After creating/updating `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Start it again:
```bash
npm run dev
```

### Step 10: Test Upload

1. Go to `/admin/add-product`
2. Try uploading an image
3. You should see progress: 0% → 25% → 50% → 100%

## Still Not Working?

### Check Browser Console

Press `F12` and look at the Console tab for errors:

- **"Firebase: Error (auth/..."** → Authentication issue
- **"No Firebase App..."** → Config not loaded
- **"CORS error"** → Storage rules issue
- **"Network error"** → Check internet connection

### Verify Environment Variables

Add this temporarily to your `app/admin/add-product/page.tsx`:

```typescript
useEffect(() => {
  console.log('Firebase Config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}, []);
```

If you see "undefined", your `.env.local` is not being loaded.

## Security Note

The current setup allows anyone to upload images. Once you're ready for production:

1. Set up Firebase Authentication
2. Update Storage rules to require authentication
3. Add admin user management
4. Restrict Firestore write access

## Need Help?

1. Check Firebase Console for error logs
2. Verify your Firebase project billing is active (Storage requires Blaze plan for production)
3. Make sure `.env.local` is in your `.gitignore` (it should be by default)
