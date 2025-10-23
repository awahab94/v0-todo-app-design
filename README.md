# TaskFlow - Intelligent Task Manager

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Firebase Ready](https://img.shields.io/badge/Firebase-Ready-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

> **TaskFlow** is a modern, intelligent task management application that helps you organize, prioritize, and accomplish your goals efficiently across multiple presentation layers.

## ✨ Features

### 🎯 Core Task Management
- **Smart Task Creation** - Title, description, priority levels, due dates
- **Task Organization** - Labels, categories, and hierarchical relationships
- **Recurring Tasks** - RRule support for repeating tasks
- **Task Status Tracking** - Todo, In Progress, Done with completion history

### 📱 Multiple View Modes
- **📅 Today View** - Focus on today's priorities
- **⏰ Upcoming View** - Future tasks and deadlines
- **📥 Inbox View** - Unorganized task collection
- **✅ Completed View** - Achievement archive
- **📊 Calendar View** - Visual timeline with drag-and-drop
- **🎯 Kanban Board** - Visual workflow management

### 🔔 Smart Notifications
- **Push Notifications** - Firebase Cloud Messaging integration
- **Scheduled Reminders** - 30-minute interval notifications
- **Browser Notifications** - Cross-device synchronization
- **Quiet Hours** - Customizable notification preferences

### 🎨 User Experience
- **Theme System** - Light, Dark, and System themes
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Live synchronization across devices
- **Error Handling** - Comprehensive error boundaries and recovery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Firebase project
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskflow-app.git
   cd taskflow-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your credentials:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

4. **Set up the database**
   
   Run these SQL scripts in your Supabase SQL editor:
   ```sql
   -- Core tables and authentication
   scripts/001_create_tables.sql
   scripts/002_create_profile_trigger.sql
   scripts/003_create_default_labels.sql
   scripts/004_create_storage_bucket.sql
   scripts/006_create_firebase_tokens.sql
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **React Hook Form + Zod** - Form management and validation
- **React Query** - Data fetching and caching
- **Sonner** - Toast notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database with RLS
  - Real-time subscriptions
  - Authentication system
  - Storage management

### Notifications & Deployment
- **Firebase Cloud Messaging** - Push notifications
- **Vercel** - Hosting and deployment
- **Edge Functions** - Serverless functions
- **Cron Jobs** - Scheduled notifications

## 📁 Project Structure

```
taskflow-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── app/               # Main application
│   │   ├── calendar/      # Calendar view
│   │   ├── completed/     # Completed tasks
│   │   ├── inbox/         # Inbox view
│   │   ├── kanban/        # Kanban board
│   │   ├── settings/      # User settings
│   │   └── upcoming/      # Upcoming tasks
│   ├── api/               # API routes
│   ├── error.tsx          # Error page
│   ├── not-found.tsx      # 404 page
│   └── global-error.tsx   # Global error handler
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── *.tsx             # Feature components
├── lib/                  # Utility libraries
│   ├── hooks/           # Custom React hooks
│   ├── providers/       # Context providers
│   ├── supabase/        # Supabase client
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── scripts/             # Database migration scripts
└── public/             # Static assets
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Set up authentication providers
4. Configure storage buckets
5. Run database migration scripts

### Firebase Setup
1. Create Firebase project
2. Enable Cloud Messaging
3. Generate service account key
4. Configure VAPID keys for web push
5. Set up environment variables

### Vercel Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Set up cron jobs for notifications
4. Deploy with Edge Functions

## 📊 Database Schema

### Core Tables
- `profiles` - User profile information
- `tasks` - Task data with relationships
- `labels` - Task categorization
- `task_labels` - Many-to-many relationship
- `user_settings` - User preferences
- `firebase_tokens` - Push notification tokens

### Key Features
- Row Level Security for data isolation
- Automatic profile creation on signup
- Default labels for new users
- Soft delete for data recovery
- Audit trails with timestamps

## 🎨 Design System

- **Color Palette**: Blue primary, semantic colors for states
- **Typography**: Geist Sans & Geist Mono fonts
- **Components**: shadcn/ui with custom extensions
- **Layout**: Responsive grid system
- **Accessibility**: WCAG compliant components

## 🔒 Security

- Row Level Security (RLS) enabled
- Input validation with Zod schemas
- CSRF protection
- Secure authentication flows
- Environment variable protection
- HTTPS enforcement

## 📈 Performance

- Next.js App Router for optimal loading
- React Query for efficient data fetching
- Image optimization
- Code splitting
- Edge Functions for low latency
- Service Workers for offline support

## 🧪 Testing

- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Error boundary testing
- Performance monitoring

## 🚀 Deployment

### Vercel (Recommended)
```bash
pnpm build
vercel --prod
```

### Manual Deployment
1. Build the application: `pnpm build`
2. Deploy to your preferred platform
3. Configure environment variables
4. Set up cron jobs for notifications

## 📝 Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks

# Database
# Run SQL scripts in Supabase SQL editor
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Firebase](https://firebase.google.com) for push notifications
- [Vercel](https://vercel.com) for seamless deployment

## 📞 Support

- 📧 Email: support@taskflow.app
- 💬 Discord: [Join our community](https://discord.gg/taskflow)
- 📖 Documentation: [docs.taskflow.app](https://docs.taskflow.app)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/taskflow-app/issues)

---

**Built with ❤️ by the TaskFlow Team**

*Last updated: December 2024*