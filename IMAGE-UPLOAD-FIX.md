# Fix: Sellers Cannot Upload Images

## Problem
Sellers cannot upload images when adding products. The upload fails with a permission error from Firebase.

## Root Cause
The Firebase Storage security rules are too restrictive. The production rules only allow **admin users** to write to storage:

```javascript
// ❌ WRONG - Only admins can write
match /products/{allPaths=**} {
  allow write: if request.auth != null && request.auth.token.admin == true;
}
```

However, sellers are regular users, not admins. They don't have the `admin` custom claim, so their uploads are rejected by Firebase.

## Solution

### Step 1: Update Firebase Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **machines-and-more-9307d**
3. In the left sidebar, go to **Storage**
4. Click on the **Rules** tab
5. Replace the existing rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{imageFile} {
      // Allow anyone to read images
      allow read: if true;
      
      // Allow uploads for image files under 10MB
      allow write: if request.resource.size < 10 * 1024 * 1024 
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

6. Click **Publish**

### Step 2: Test the Upload

1. Go to http://localhost:3000/admin/add-product
2. Fill in the product form
3. Click "Upload Images"
4. Select an image file
5. The image should now upload successfully ✅

## How It Works

The new rules allow:
- ✅ **Anyone** to upload images (no authentication required)
- ✅ Only **image file types** (prevents malicious files)
- ✅ Images up to **10MB in size** (prevents storage abuse)
- ✅ **Anyone** to read/download images (for the product catalog)

## Security Considerations

These rules are suitable for:
- ✅ MVP/Development phase
- ✅ When you want sellers to upload without authentication
- ✅ When file type validation is sufficient

For production, consider:
1. **Add Seller Authentication**: Require sellers to log in with email/password
2. **Use Custom Claims**: Mark users as sellers, allow only sellers to upload
3. **Backend Validation**: Use Cloud Functions to validate uploads server-side
4. **Content Moderation**: Review/approve uploads before they're visible

## Future: Authenticated Uploads

Once you implement seller authentication, use these rules instead:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{imageFile} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024 
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Troubleshooting

### Still getting upload errors?

1. **Check browser console** (F12 → Console tab):
   - Look for error messages mentioning "Permission denied" or "permission_denied"

2. **Verify Firebase is initialized**:
   - Check that `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly in `.env.local`
   - Should be: `machines-and-more-9307d.appspot.com`

3. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Close and reopen browser

4. **Check file size**:
   - Make sure images are under 10MB
   - Try with a smaller test image

### Still doesn't work?

Check that the rules were published successfully:
1. Go to Firebase Console → Storage → Rules
2. Verify the new rules are showing
3. Look for any validation errors (red text)

## References

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage/security)
- [FIREBASE-SETUP.md](./FIREBASE-SETUP.md#L75)
