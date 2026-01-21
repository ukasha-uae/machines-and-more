# Machines & More - E-Commerce Platform

A Next.js-based e-commerce application for industrial machines and vehicles in Ghana, featuring a Request to Buy system with AI-powered response suggestions.

## Features

### Public-Facing Website
- **Homepage**: Hero carousel showcasing featured machines, product filtering by category, and responsive product grid
- **Product Details**: Image gallery, specifications, seller information, and Request to Buy functionality
- **Request to Buy Flow**: Lead generation system with AI-powered response suggestions using Genkit
- **Static Pages**: Testimonials, Delivery Terms, and Contact pages
- **Verified Sellers**: Trust badges for verified sellers
- **Cash on Delivery**: Secure payment option

### Admin Dashboard
- **Product Management**: View all products in a sortable table
- **Add Products**: Multi-image upload with drag-and-drop reordering
- **Seed Database**: Populate with sample products for testing
- **Delete Products**: Remove products with confirmation dialog

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **Icons**: Lucide React
- **Backend**: Firebase
  - Firestore (Database)
  - Storage (File uploads)
  - Authentication (Coming soon)
- **AI**: Genkit for response suggestions
- **Image Carousel**: Embla Carousel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

**Important**: Due to npm limitations with spaces in folder names, we recommend moving the project to a folder without spaces.

**Option 1: Move to a folder without spaces (Recommended)**
```bash
# Create a new folder without spaces
mkdir C:\Projects\machines-and-more
# Copy all files to the new location
# Then navigate to it
cd C:\Projects\machines-and-more
npm install
```

**Option 2: Continue in current folder**

If you must use the current folder location, use the short path name:

1. **Get the short path name**
   ```powershell
   (Get-Item "c:\Users\asus\OneDrive\Desktop\Machines & More").FullName
   ```

2. **Install dependencies using the short path**
   ```bash
   # Example (adjust based on your actual short path):
   cd C:\Users\asus\ONEDRI~1\Desktop\MACHIN~1
   npm install
   ```

**Option 3: Use yarn instead of npm**
```bash
cd "c:\Users\asus\OneDrive\Desktop\Machines & More"
npm install -g yarn
yarn install
```

Once dependencies are installed:

   a. Create a new Firebase project at https://console.firebase.google.com/
   
   b. Enable Firestore Database:
      - Go to Firestore Database
      - Click "Create database"
      - Start in production mode
      - Choose a location
   
   c. Enable Firebase Storage:
      - Go to Storage
      - Click "Get started"
      - Start in production mode
   
   d. Get your Firebase config:
      - Go to Project Settings > General
      - Scroll to "Your apps" section
      - Click the web icon (</>)
      - Copy the configuration values

4. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. **Update Firebase Security Rules**

   **Firestore Rules** (Firestore Database > Rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow public read access to products
       match /products/{productId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Allow authenticated users to create purchase requests
       match /purchase_requests/{requestId} {
         allow read: if request.auth != null;
         allow create: if true;
         allow update, delete: if request.auth != null;
       }
     }
   }
   ```

   **Storage Rules** (Storage > Rules):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /products/{allPaths=**} {
         allow read: if true;
         allow write: if true; // In production, restrict to authenticated admins
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Seeding the Database

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click the "Seed Database" button
3. This will populate Firestore with 6 sample products

### Adding a Product

1. Go to Admin Dashboard ([/admin](http://localhost:3000/admin))
2. Click "Add New Product"
3. Fill in all required fields:
   - Product name, price, category
   - Description
   - Seller information
4. Upload at least one product image
   - Drag and drop to reorder images
   - First image becomes the main product image
5. Add specifications (optional)
6. Click "Add Product"

### Testing the Request to Buy Flow

1. Navigate to any product details page
2. Click "Request to Buy"
3. Fill in the form with customer details
4. Submit the form
5. View the AI-generated response suggestion

## Project Structure

```
.
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   │   ├── add-product/          # Add product page
│   │   └── page.tsx              # Admin homepage
│   ├── contact/                  # Contact page
│   ├── delivery-terms/           # Delivery terms page
│   ├── products/[slug]/          # Dynamic product details
│   ├── testimonials/             # Testimonials page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── admin/                    # Admin components
│   │   └── ImageUploader.tsx    # Multi-image upload with reordering
│   ├── home/                     # Homepage components
│   │   └── HeroCarousel.tsx     # Featured products carousel
│   ├── layout/                   # Layout components
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── products/                 # Product components
│   │   ├── AiResponseDialog.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   └── RequestBuyDialog.tsx
│   └── ui/                       # ShadCN UI components
├── lib/
│   ├── ai/                       # AI/Genkit integration
│   │   └── genkit.ts
│   ├── firebase/                 # Firebase configuration
│   │   ├── config.ts
│   │   ├── firebase.ts
│   │   ├── firestore.ts         # Firestore operations
│   │   ├── seed.ts              # Sample data
│   │   └── storage.ts           # Storage operations
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript types
└── hooks/
    └── use-toast.ts              # Toast notifications hook
```

## Key Features Explained

### Hero Carousel
- Auto-plays every 5 seconds
- Displays top 3 machines from the "Machines" category
- Responsive with navigation buttons and dots
- Touch-enabled on mobile

### Product Filtering
- Filter by main category (Machines, Vehicles, Parts)
- Cascading subcategory filter
- Real-time filtering with loading states

### Request to Buy System
1. Customer submits a request with their details
2. System generates an AI-powered response suggestion
3. Request is saved to Firestore
4. Customer sees a preview of how the sales team will respond

### Image Upload System
- Supports multiple image uploads
- Drag-and-drop reordering
- Upload progress indication
- First image is automatically the main product image
- Images stored in Firebase Storage

## Environment Variables

All environment variables should be prefixed with `NEXT_PUBLIC_` to be accessible in the browser:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

## Troubleshooting

### npm install fails with EPERM errors

This is caused by the folder name containing spaces or special characters. Rename the folder to use only lowercase letters and hyphens (e.g., `machines-and-more`).

### Module not found errors

Make sure you've renamed the folder and are running commands from inside the correct directory.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Security (Important for Production)

Before deploying to production, update your Firebase Security Rules:

**Firestore**: Restrict write access to authenticated admins only
**Storage**: Restrict write access to authenticated admins only
**Authentication**: Set up Firebase Authentication for admin users

## Contact Information

Update the placeholder phone numbers and email addresses in:
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `app/contact/page.tsx`
- `app/products/[slug]/page.tsx`

Replace `+233XXXXXXXXX` with your actual phone number and `info@machinesandmore.gh` with your email.

## Future Enhancements

- [ ] Add Firebase Authentication for admin dashboard
- [ ] Implement proper Genkit integration with API keys
- [ ] Add product search functionality
- [ ] Implement pagination for product listings
- [ ] Add product edit functionality
- [ ] Create a purchase requests dashboard for admins
- [ ] Add email notifications for new requests
- [ ] Implement user reviews and ratings
- [ ] Add product comparison feature
- [ ] Multi-language support

## License

This project is built for educational/commercial purposes.

## Support

For issues or questions, please contact the development team.
