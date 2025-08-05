# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `kuikma-cup` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for the project to be ready (2-3 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (long string starting with `eyJ...`)

## 3. Update Environment Variables

1. Open the file `.env.local` in your project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it in the SQL Editor and click **Run**
4. This will create the `players` and `matches` tables

## 5. Test Your Setup

1. Run `npm run dev` to start your app
2. Try adding a player
3. Try recording a match
4. Check your Supabase dashboard **Table Editor** to see the data

## 6. Deploy to Vercel

1. In your Vercel dashboard, go to your project settings
2. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy your project

That's it! Your app will now persist data across all devices using Supabase.

## Troubleshooting

- **"Invalid URL" error**: Make sure your environment variables are set correctly
- **Database connection error**: Check your Supabase project is active and credentials are correct
- **Permission denied**: Make sure you ran the SQL schema to create the tables and policies