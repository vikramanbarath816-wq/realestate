create table if not exists transactions (
  id bigserial primary key,
  community text not null,
  area_sqft numeric not null,
  transaction_price numeric not null,
  transaction_date date not null,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_community on transactions (community);
create index if not exists idx_transactions_date on transactions (transaction_date);

create table if not exists saved_portfolios (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  allocation jsonb not null,
  investment_amount numeric not null,
  created_at timestamptz default now()
);

alter table saved_portfolios enable row level security;

create policy "Users can manage their own portfolios"
  on saved_portfolios for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
