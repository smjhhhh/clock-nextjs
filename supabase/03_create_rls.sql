-- ==================== Row Level Security (RLS) ====================

-- 启用 RLS
alter table question_bank enable row level security;
alter table question_options enable row level security;
alter table test_configs enable row level security;
alter table user_test_sessions enable row level security;
alter table user_answers enable row level security;
alter table question_statistics enable row level security;

-- 1. question_bank 策略
create policy "Anyone can view active questions"
  on question_bank for select
  using (is_active = true);

-- 2. question_options 策略
create policy "Anyone can view options"
  on question_options for select
  using (true);

-- 3. test_configs 策略
create policy "Anyone can view configs"
  on test_configs for select
  using (true);

-- 4. user_test_sessions 策略
create policy "Users can view own sessions or anonymous sessions"
  on user_test_sessions for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert own sessions or anonymous sessions"
  on user_test_sessions for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own sessions or anonymous sessions"
  on user_test_sessions for update
  using (auth.uid() = user_id or user_id is null);

-- 5. user_answers 策略
create policy "Users can view own answers or anonymous answers"
  on user_answers for select
  using (
    session_id in (
      select id from user_test_sessions 
      where user_id = auth.uid() or user_id is null
    )
  );

create policy "Users can insert own answers or anonymous answers"
  on user_answers for insert
  with check (
    session_id in (
      select id from user_test_sessions 
      where user_id = auth.uid() or user_id is null
    )
  );

-- 6. question_statistics 策略
create policy "Anyone can view statistics"
  on question_statistics for select
  using (true);
