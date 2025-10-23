# TaskFlow Setup Guide

## 🚀 Quick Start Guide

Follow these steps to get TaskFlow running on your local machine.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Supabase Account** - [Sign up here](https://supabase.com)
- **Firebase Account** - [Sign up here](https://firebase.google.com)
- **Vercel Account** - [Sign up here](https://vercel.com) (for deployment)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/taskflow-app.git
cd taskflow-app

# Install dependencies
pnpm install
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `taskflow-app`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 2.2 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (for `SUPABASE_SERVICE_KEY`)

### 2.3 Set up Database
Run these SQL scripts in **SQL Editor**:

```sql
-- 1. Core tables
-- Run scripts/001_create_tables.sql

-- 2. Profile trigger
-- Run scripts/002_create_profile_trigger.sql

-- 3. Default labels
-- Run scripts/003_create_default_labels.sql

-- 4. Storage bucket
-- Run scripts/004_create_storage_bucket.sql

-- 5. Firebase tokens
-- Run scripts/006_create_firebase_tokens.sql
```

### 2.4 Configure Authentication
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

## Step 3: Firebase Setup

### 3.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `taskflow-notifications`
4. Enable Google Analytics (optional)

### 3.2 Enable Cloud Messaging
1. Go to **Build** → **Cloud Messaging**
2. Click "Get started"

### 3.3 Add Web App
1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click **Add app** → **Web** (</> icon)
4. Register app name: `TaskFlow Web`
5. Copy the config object

### 3.4 Generate Service Account Key
1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Extract `private_key` and `client_email`

### 3.5 Get VAPID Key
1. Go to **Project Settings** → **Cloud Messaging**
2. Scroll to "Web configuration"
3. Click "Generate key pair" if not exists
4. Copy the **Key pair**

## Step 4: Environment Variables

Create `.env.local` file in project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Firebase Configuration (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Start Development

```bash
# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## Step 6: Test the Application

1. **Sign Up**: Create a new account
2. **Email Verification**: Check your email and verify
3. **Create Tasks**: Add some sample tasks
4. **Test Views**: Navigate through different views
5. **Enable Notifications**: Go to Settings → Notifications

## Step 7: Deploy to Vercel

### 7.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 7.2 Deploy
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 7.3 Configure Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings
2. Add all environment variables from `.env.local`
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

### 7.4 Update Supabase Settings
1. Go to Supabase → Authentication → Settings
2. Update **Site URL** to your Vercel domain
3. Add **Redirect URLs** for your domain

## Troubleshooting

### Common Issues

**1. Authentication not working**
- Check Supabase URL and keys
- Verify redirect URLs in Supabase
- Ensure email verification is enabled

**2. Database errors**
- Run all SQL scripts in correct order
- Check RLS policies are enabled
- Verify user permissions

**3. Notifications not working**
- Check Firebase configuration
- Verify VAPID key is correct
- Ensure browser notifications are enabled
- Check service worker is registered

**4. Build errors**
- Run `pnpm install` to ensure dependencies
- Check TypeScript errors with `pnpm type-check`
- Verify all environment variables are set

### Getting Help

- 📖 Check the [Planning Document](PLANNING.md)
- 🐛 Report issues on [GitHub](https://github.com/your-username/taskflow-app/issues)
- 💬 Join our [Discord community](https://discord.gg/taskflow)

## Next Steps

Once you have TaskFlow running locally:

1. **Customize**: Modify the design and features
2. **Extend**: Add new functionality
3. **Deploy**: Set up production environment
4. **Scale**: Optimize for performance

## Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure production Firebase project
- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up monitoring and analytics
- [ ] Configure backup strategies
- [ ] Set up error reporting
- [ ] Performance optimization

---

**Happy coding! 🚀**
