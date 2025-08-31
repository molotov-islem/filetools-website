# GitHub Pages Deployment Guide

## Prerequisites
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Make sure your repository is public or you have GitHub Pro for private repos

## Deployment Steps

### Initial Setup
1. Update the `homepage` field in `package.json` to match your GitHub Pages URL:
   \`\`\`json
   "homepage": "https://yourusername.github.io/your-repo-name"
   \`\`\`

2. Update the `basePath` and `assetPrefix` in `next.config.mjs` to match your repository name:
   \`\`\`javascript
   basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   \`\`\`

### Deploy to GitHub Pages
1. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy to GitHub Pages:
   \`\`\`bash
   npm run deploy
   \`\`\`

### Custom Domain (Optional)
If you want to use a custom domain:
1. Create a `CNAME` file in the `public/` directory with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Update the `homepage` field in `package.json` to your custom domain

### Troubleshooting
- Make sure your repository has GitHub Pages enabled in Settings > Pages
- The deployment creates a `gh-pages` branch automatically
- Static files will be in the `out/` directory after build
- Images and assets are unoptimized for static hosting compatibility

## Environment Variables
GitHub Pages doesn't support server-side environment variables. Only client-side variables prefixed with `NEXT_PUBLIC_` will work.
