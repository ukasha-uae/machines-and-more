# Firebase Setup Guide

Follow these steps to set up Firebase for your Machines & More application:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project (e.g., "machines-and-more")
4. Disable Google Analytics (optional, you can enable it later)
5. Click "Create project"

## 2. Register Your Web App

1. In your Firebase project, click the Web icon (</>) to add a web app
2. Register app with a nickname (e.g., "Machines & More Web")
3. Don't check "Set up Firebase Hosting" (we're using Next.js)
4. Click "Register app"

## 3. Get Your Firebase Configuration

Copy the configuration values from the Firebase Console. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 4. Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in **test mode**" (for development)
4. Select a Cloud Firestore location closest to you
5. Click "Enable"

**Important**: Test mode rules expire after 30 days. Update rules for production!

## 5. Set Up Firebase Storage

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Start in test mode
4. Click "Done"

## 6. Configure Your Application

1. Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` and paste your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 7. Seed Your Database

1. Go to http://localhost:3000/admin/seed
2. Click "Seed Database with Sample Products"
3. Wait for the success message
4. Visit http://localhost:3000 to see your products!

## 8. Update Firestore Security Rules (Production)

Before deploying to production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read by anyone, write only by admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Purchase requests - write by anyone, read by admin
    match /purchaseRequests/{requestId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 9. Update Storage Security Rules (Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Troubleshooting

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Make sure your `.env.local` file exists and has all the required variables
- Restart your development server after creating `.env.local`

### Error: "Permission denied"
- Check that your Firestore is in test mode
- Verify your security rules allow read/write access

### Products not showing up
- Make sure you've seeded the database (visit `/admin/seed`)
- Check browser console for any errors
- Verify Firebase configuration is correct

## Next Steps

✅ Firebase is configured  
✅ Database is seeded  
✅ Products are showing  

Now you can:
- Add more products via `/admin/add-product`
- Customize the product categories
- Set up Firebase Authentication for admin users
- Deploy to production

## Support

For more help, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
