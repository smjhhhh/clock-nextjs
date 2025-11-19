-- ==================== 创建表结构 ====================
-- 按照这个顺序执行SQL脚本

-- 1. 题库表
create table question_bank (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  dimension varchar(20) not null check (dimension in ('EI', 'SN', 'TF', 'JP', 'AT')),
  difficulty int default 1 check (difficulty between 1 and 5),
  weight decimal(3,2) default 1.0,
  usage_count int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb
);

-- 索引
create index idx_question_bank_dimension on question_bank(dimension);
create index idx_question_bank_active on question_bank(is_active);
create index idx_question_bank_difficulty on question_bank(difficulty);

-- 2. 题目选项表
create table question_options (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references question_bank(id) on delete cascade not null,
  option_text text not null,
  option_order int not null check (option_order >= 0),
  score_value int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_options_question on question_options(question_id);

-- 3. 测试配置表
create table test_configs (
  id uuid default gen_random_uuid() primary key,
  config_name varchar(100) not null,
  questions_per_dimension jsonb not null,
  total_questions int not null,
  selection_strategy varchar(50) default 'balanced_random',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. 测试会话表
create table user_test_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  config_id uuid references test_configs(id),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  is_completed boolean default false,
  
  total_introvert int default 0,
  total_sensing int default 0,
  total_thinking int default 0,
  total_perceiving int default 0,
  total_turbulent int default 0,
  
  mbti_type varchar(5),
  selected_questions uuid[] not null,
  session_data jsonb
);

create index idx_sessions_user on user_test_sessions(user_id);
create index idx_sessions_completed on user_test_sessions(is_completed);

-- 5. 用户答题记录表
create table user_answers (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references user_test_sessions(id) on delete cascade not null,
  question_id uuid references question_bank(id) on delete restrict not null,
  selected_option_id uuid references question_options(id) on delete restrict not null,
  question_order int not null,
  answered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_answers_session on user_answers(session_id);
create index idx_answers_question on user_answers(question_id);

-- 6. 题目统计表（可选）
create table question_statistics (
  question_id uuid references question_bank(id) on delete cascade primary key,
  total_answers int default 0,
  option_a_count int default 0,
  option_b_count int default 0,
  last_used_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
