# IMPORTANT: Fix Folder Name First!

The folder name "Machines & More" has spaces that break npm on Windows.

## Quick Fix (Choose ONE option):

### Option 1: Rename the folder (Easiest)
1. Close VS Code completely
2. Go to `C:\Users\asus\OneDrive\Desktop\`
3. Rename "Machines & More" to "machines-and-more" (no spaces!)
4. Reopen the renamed folder in VS Code
5. Open a new terminal and run: `npm install`

### Option 2: Move to a new location
1. Create: `C:\Projects\machines-and-more`
2. Copy ALL files from current folder to new folder
3. Open the new folder in VS Code
4. Open terminal and run: `npm install`

## Then continue with:
```bash
npm run dev
```

Visit http://localhost:3000
