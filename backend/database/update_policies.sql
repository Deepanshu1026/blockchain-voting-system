-- Enable DELETE and UPDATE for Candidates
create policy "Enable delete for all users" on public.candidates for delete using (true);
create policy "Enable update for all users" on public.candidates for update using (true);

-- Enable DELETE and UPDATE for Polls
create policy "Enable delete for all users" on public.polls for delete using (true);
create policy "Enable update for all users" on public.polls for update using (true);

-- Enable DELETE for Allowed Voters (optional)
create policy "Enable delete for all users" on public.allowed_voters for delete using (true);
