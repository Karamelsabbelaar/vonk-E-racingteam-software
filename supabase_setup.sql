-- ═══════════════════════════════════════════════════════
-- KartPit — Supabase Database Setup
-- Plak dit in de Supabase SQL Editor en klik op "Run"
-- ═══════════════════════════════════════════════════════

-- ── Checklist items ──────────────────────────────────────
create table if not exists checklist_items (
  id         bigint generated always as identity primary key,
  item       text not null,
  category   text not null check (category in ('components', 'people')),
  done       boolean not null default false,
  created_at timestamptz default now()
);

-- ── Agenda ───────────────────────────────────────────────
create table if not exists agenda (
  id         bigint generated always as identity primary key,
  time       text not null,
  event      text not null,
  type       text not null default 'admin',
  created_at timestamptz default now()
);

-- ── Pitstops ─────────────────────────────────────────────
create table if not exists pitstops (
  id          bigint generated always as identity primary key,
  duration_ms bigint not null,
  label       text not null default 'Pitstop',
  notes       text default '',
  created_at  timestamptz default now()
);

-- ── Tracks ───────────────────────────────────────────────
create table if not exists tracks (
  id         bigint generated always as identity primary key,
  name       text not null,
  location   text default '',
  length_m   integer default 0,
  turns      integer default 0,
  best_lap   text default '–',
  type       text default 'outdoor',
  notes      text default '',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id          bigint generated always as identity primary key,
  description text not null,
  assigned_to text default '',
  category    text default 'Overig',
  done        boolean default false,
  created_at  timestamptz default now()
);

-- ── Realtime inschakelen ──────────────────────────────────
-- (zodat teamleden live updates zien)
alter publication supabase_realtime add table checklist_items;
alter publication supabase_realtime add table agenda;
alter publication supabase_realtime add table pitstops;
alter publication supabase_realtime add table tasks;

-- ── Row Level Security (publieke toegang voor het team) ───
-- Iedereen met de anon key kan lezen en schrijven.
-- Wil je later login toevoegen? Dan RLS policies aanpassen.
alter table checklist_items enable row level security;
alter table agenda           enable row level security;
alter table pitstops         enable row level security;
alter table tracks           enable row level security;
alter table tasks            enable row level security;

create policy "Publieke toegang checklist" on checklist_items for all using (true) with check (true);
create policy "Publieke toegang agenda"    on agenda           for all using (true) with check (true);
create policy "Publieke toegang pitstops"  on pitstops         for all using (true) with check (true);
create policy "Publieke toegang tracks"    on tracks           for all using (true) with check (true);
create policy "Publieke toegang tasks"     on tasks            for all using (true) with check (true);

-- ── Standaard checklist data ──────────────────────────────
insert into checklist_items (item, category) values
  ('Kart chassis inspectie',        'components'),
  ('Bandenspanning gecontroleerd',  'components'),
  ('Motoroliepeil',                 'components'),
  ('Ketting spanning & smering',   'components'),
  ('Remblokken & vloeistof',        'components'),
  ('Stuurspeelruimte check',        ('components'),
  ('Carrosserie bevestigd',         'components'),
  ('Transponder gemonteerd',        'components'),
  ('Rijder race licentie',          'people'),
  ('Helm & HANS goedgekeurd',       'people'),
  ('Race overall & handschoenen',   'people'),
  ('Ribprotector rijder',           'people'),
  ('Monteur gereedschapstas',       'people'),
  ('Brandstof & reserve jerrycan',  'people'),
  ('Paddock pas / polsband',        'people'),
  ('EHBO kit aanwezig',             'people');

-- ── Standaard agenda ──────────────────────────────────────
insert into agenda (time, event, type) values
  ('07:00', 'Paddock open – opbouw & keuring',       'admin'),
  ('08:30', 'Rijdersbriefing',                        'briefing'),
  ('09:00', 'Vrije training 1 (15 min)',              'session'),
  ('09:30', 'Vrije training 2 (15 min)',              'session'),
  ('10:30', 'Kwalificatie (10 min – getimede ronden)','qualifying'),
  ('11:15', 'Pitstop repetitie',                      'pitstop'),
  ('12:00', 'Race 1 – 20 ronden',                    'race'),
  ('13:30', 'Lunchpauze & kart service',             'break'),
  ('14:30', 'Race 2 – 25 ronden',                    'race'),
  ('16:00', 'Prijsuitreiking & debriefing',           'admin');
