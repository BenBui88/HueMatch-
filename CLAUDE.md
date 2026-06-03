# HueMatch — Claude Code Instructions

## What this project is
HueMatch is a React + TypeScript + Tailwind nail salon app with three user roles:
- **Client** — color match, salon discovery, booking, profile, points
- **Nail tech** — portable profile, gallery, brand catalog, rewards
- **Salon owner** — analytics, inventory, team management, back office

## What's already built
- ✅ Full project structure (Vite + React + TypeScript + Tailwind)
- ✅ Supabase client with full TypeScript types (`src/lib/supabase.ts`)
- ✅ AI color matching engine (`src/lib/aiMatch.ts`) — calls Claude API
- ✅ Zustand store for auth, match state, salon, client profile (`src/store/index.ts`)
- ✅ Shared UI components (`src/components/ui/index.tsx`)
- ✅ Global CSS with HueMatch design tokens (`src/index.css`)
- ✅ Tailwind config with brand colors and fonts (`tailwind.config.js`)
- ✅ Landing page with role selection + auth (`src/pages/LandingPage.tsx`)
- ✅ Full Match screen — outfit upload, skin tone camera, AI results (`src/pages/MatchScreen.tsx`)
- ✅ SkinTonePanel, CameraModal, MatchResults components
- ✅ All routes wired in `src/App.tsx`
- ✅ Stub pages for all unbuilt screens (`src/pages/StubPages.tsx`)

## What you need to build
Replace each stub in `src/pages/StubPages.tsx` with full implementations.
Source HTML prototypes are in the same directory as this project.

### Priority order:
1. `DiscoverScreen` — from `huematch-map.html` — salon map, color-filtered pins, detail sheet
2. `CommunityScreen` — from `huematch-catalog-gallery.html` — feed, seasonal banner, public/private posts
3. `ProfileScreen` — from `huematch-client-profile.html` — saved looks, following, bookings, HuePoints
4. `TechProfilePage` — from `huematch-tech-profile.html` — portfolio, reviews, career, points
5. `TechGalleryPage` — from `huematch-catalog-gallery.html`
6. `TechCatalogPage` — from `huematch-catalog-gallery.html`
7. `TechRewardsPage` — from `huematch-rewards.html`
8. `OwnerAnalytics` — from `huematch-owner-dashboard-v2.html`
9. `OwnerInventory` — from `huematch-owner-dashboard-v2.html`
10. `OwnerSalon` / `OwnerTechs` — from `huematch-booking.html` + `huematch-rewards.html`

## Design system
- Font: `font-display` = Cormorant Garamond, `font-sans` = Outfit
- Colors: `text-rose` (#C4546A), `text-navy` (#2C2B4B), `text-gold` (#C4934A), `text-emerald` (#1D9E75)
- Use `bg-rose-light` / `bg-navy-light` / `bg-gold-light` for tinted backgrounds
- All screens use `StatusBar` + `TopBar` + `BottomNav` from `src/components/ui`
- Screens wrap content with `flex flex-col min-h-full pb-[72px]`
- Phone frame is applied at App level — screens just fill it

## Supabase setup
Run this SQL in your Supabase project:
```sql
create table salons (id uuid primary key default gen_random_uuid(), name text, address text, phone text, instagram text, booking_url text, booking_platform text, lat float, lng float, created_at timestamptz default now());
create table colors (id uuid primary key default gen_random_uuid(), salon_id uuid references salons(id), name text, brand text, hex text, type text, code text);
create table techs (id uuid primary key default gen_random_uuid(), salon_id uuid references salons(id), name text, specialty text, color text, available boolean default true, pts int default 0, tier text default 'Bronze', rating float default 0, review_count int default 0);
create table posts (id uuid primary key default gen_random_uuid(), user_name text, user_initials text, user_color text, nails text[], caption text, tags text[], image_url text, is_public boolean default true, season_tag text, likes int default 0, comments int default 0, saves int default 0, created_at timestamptz default now());
create table catalog_colors (id uuid primary key default gen_random_uuid(), name text, brand text, type text, code text, hexes jsonb, salon_count int default 1, notes text);
create table buy_list (id uuid primary key default gen_random_uuid(), salon_id uuid references salons(id), category text, name text, brand text, qty int, cost text, urgency text, note text, link text, color text, ordered boolean default false);
create table surplus_items (id uuid primary key default gen_random_uuid(), salon_id uuid references salons(id), category text, name text, brand text, qty int, price text, note text, color text, posted boolean default false);

-- Enable RLS and set public read/write policies for dev
alter table salons enable row level security;
alter table colors enable row level security;
alter table techs enable row level security;
alter table posts enable row level security;
alter table catalog_colors enable row level security;
alter table buy_list enable row level security;
alter table surplus_items enable row level security;

create policy "public_read"   on salons for select using (true);
create policy "public_insert" on salons for insert with check (true);
create policy "public_read"   on colors for select using (true);
create policy "public_insert" on colors for insert with check (true);
create policy "public_read"   on techs for select using (true);
create policy "public_insert" on techs for insert with check (true);
create policy "public_read"   on posts for select using (true);
create policy "public_insert" on posts for insert with check (true);
create policy "public_read"   on catalog_colors for select using (true);
create policy "public_insert" on catalog_colors for insert with check (true);
create policy "public_read"   on buy_list for select using (true);
create policy "public_insert" on buy_list for insert with check (true);
create policy "public_read"   on surplus_items for select using (true);
create policy "public_insert" on surplus_items for insert with check (true);
```

## Environment variables
Copy `.env.example` to `.env.local` and fill in:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ANTHROPIC_API_KEY` (dev only — move to Edge Function for production)

## Deploy to Vercel
1. `git init && git add . && git commit -m "Initial HueMatch commit"`
2. Push to GitHub
3. Import repo at vercel.com — it auto-detects Vite
4. Add env vars in Vercel dashboard
5. Done — live URL in ~60 seconds

## Notes for Claude Code
- All prototype HTML files are in the same directory. Convert each one to React components.
- Keep the Tailwind class names consistent with the design tokens above.
- Use `framer-motion` for page transitions and animated elements.
- Use `@tanstack/react-query` for all Supabase data fetching.
- Use `zustand` (already configured) for client-side state.
- The AI color matching in `src/lib/aiMatch.ts` is production-ready — don't modify it.
- For the salon map, use `leaflet` or embed a Google Maps iframe (add to package.json if needed).
