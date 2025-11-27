# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Database Migration

Run the SQL migration script in Supabase SQL Editor:
```bash
sql/migration_v1.sql
```

This will:
- Add new columns to `menu_items` and `orders` tables
- Create `daily_menu_planning` and `daily_menu_items` tables
- Seed the database with the complete menu data

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env.local` file
4. For testing, use test mode keys (starting with `sk_test_` and `pk_test_`)

## Resend Setup

1. Create a Resend account at https://resend.com
2. Verify your domain
3. Get your API key
4. Add it to your `.env.local` file
