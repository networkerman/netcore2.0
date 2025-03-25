-- Enable RLS
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  full_name text,
  company_name text,
  role text not null check (role in ('admin', 'user')) default 'user',
  status text not null check (status in ('active', 'suspended', 'pending')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create credit_balances table
create table public.credit_balances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  balance bigint not null default 0, -- Amount in paise
  currency text not null default 'INR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, currency)
);

-- Create credit_transactions table
create table public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount bigint not null, -- Amount in paise
  type text not null check (type in ('credit', 'debit')),
  description text not null,
  service text not null check (service in ('whatsapp', 'email', 'sms')),
  reference_id text,
  status text not null check (status in ('pending', 'completed', 'failed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create service_rates table
create table public.service_rates (
  id uuid default gen_random_uuid() primary key,
  service text not null check (service in ('whatsapp', 'email', 'sms')),
  rate bigint not null, -- Rate in paise
  bulk_rates jsonb, -- Array of {threshold: number, rate: number}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(service)
);

-- Create sessions table for tracking concurrent usage
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  user_agent text,
  is_active boolean default true
);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_credit_balances_updated_at
  before update on public.credit_balances
  for each row
  execute function public.handle_updated_at();

create trigger handle_service_rates_updated_at
  before update on public.service_rates
  for each row
  execute function public.handle_updated_at();

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Credit balances policies
create policy "Users can view own credit balance"
  on public.credit_balances for select
  using ( auth.uid() = user_id );

create policy "Only system can insert credit balance"
  on public.credit_balances for insert
  with check ( false ); -- Managed through functions

create policy "Only system can update credit balance"
  on public.credit_balances for update
  using ( false ); -- Managed through functions

-- Credit transactions policies
create policy "Users can view own transactions"
  on public.credit_transactions for select
  using ( auth.uid() = user_id );

create policy "Only system can insert transactions"
  on public.credit_transactions for insert
  with check ( false ); -- Managed through functions

-- Service rates policies
create policy "Service rates are viewable by everyone"
  on public.service_rates for select
  using ( true );

create policy "Only admins can modify service rates"
  on public.service_rates for all
  using ( exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  ));

-- Sessions policies
create policy "Users can view own sessions"
  on public.sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own sessions"
  on public.sessions for update
  using ( auth.uid() = user_id );

-- Functions for credit management
create or replace function public.create_initial_credit(
  user_id uuid,
  initial_amount bigint default 100000 -- 1000 INR in paise
)
returns void as $$
begin
  insert into public.credit_balances (user_id, balance)
  values (user_id, initial_amount);
  
  insert into public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    service,
    status
  )
  values (
    user_id,
    initial_amount,
    'credit',
    'Initial credit balance',
    'whatsapp',
    'completed'
  );
end;
$$ language plpgsql security definer;

-- Function to handle credit deduction
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount bigint,
  p_service text,
  p_reference_id text default null
)
returns boolean as $$
declare
  v_current_balance bigint;
begin
  -- Get current balance with lock
  select balance into v_current_balance
  from public.credit_balances
  where user_id = p_user_id
  and currency = 'INR'
  for update;

  -- Check if enough balance
  if v_current_balance >= p_amount then
    -- Update balance
    update public.credit_balances
    set balance = balance - p_amount
    where user_id = p_user_id
    and currency = 'INR';

    -- Record transaction
    insert into public.credit_transactions (
      user_id,
      amount,
      type,
      description,
      service,
      reference_id,
      status
    )
    values (
      p_user_id,
      p_amount,
      'debit',
      'Service usage: ' || p_service,
      p_service,
      p_reference_id,
      'completed'
    );

    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer; 