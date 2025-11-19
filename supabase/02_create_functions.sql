-- ==================== 创建数据库函数 ====================

-- 1. 抽题函数
create or replace function select_questions_for_test(
  p_config_id uuid
) returns uuid[] as $$
declare
  v_config record;
  v_dimension text;
  v_count int;
  v_selected_questions uuid[] := '{}';
  v_temp_questions uuid[];
begin
  -- 获取配置
  select * into v_config 
  from test_configs 
  where id = p_config_id;
  
  -- 遍历每个维度
  for v_dimension, v_count in 
    select key, value::int 
    from jsonb_each_text(v_config.questions_per_dimension)
  loop
    -- 跳过数量为0的维度
    continue when v_count = 0;
    
    -- 从该维度随机抽取指定数量的题目
    select array_agg(id) into v_temp_questions
    from (
      select id 
      from question_bank 
      where dimension = v_dimension 
        and is_active = true
      order by random()
      limit v_count
    ) subquery;
    
    -- 合并到结果数组
    v_selected_questions := v_selected_questions || v_temp_questions;
    
    -- 更新使用次数
    update question_bank 
    set usage_count = usage_count + 1,
        updated_at = now()
    where id = any(v_temp_questions);
  end loop;
  
  return v_selected_questions;
end;
$$ language plpgsql;

-- 2. 创建测试会话
create or replace function create_test_session(
  p_user_id uuid default null,
  p_config_id uuid default null
) returns uuid as $$
declare
  v_session_id uuid;
  v_config_id uuid;
  v_questions uuid[];
begin
  -- 如果没指定配置，使用默认配置
  if p_config_id is null then
    select id into v_config_id 
    from test_configs 
    where is_default = true 
    limit 1;
  else
    v_config_id := p_config_id;
  end if;
  
  -- 抽取题目
  v_questions := select_questions_for_test(v_config_id);
  
  -- 创建会话
  insert into user_test_sessions (
    user_id, 
    config_id, 
    selected_questions
  ) values (
    p_user_id,
    v_config_id,
    v_questions
  ) returning id into v_session_id;
  
  return v_session_id;
end;
$$ language plpgsql;

-- 3. 获取测试题目
create or replace function get_test_questions(
  p_session_id uuid
) returns jsonb as $$
  select jsonb_agg(
    jsonb_build_object(
      'id', q.id,
      'question', q.question_text,
      'dimension', q.dimension,
      'questionNumber', array_position(s.selected_questions, q.id),
      'answerOptions', (
        select jsonb_agg(
          jsonb_build_object(
            'id', opt.id,
            'answer', opt.option_text,
            'scoreValue', opt.score_value
          ) order by opt.option_order
        )
        from question_options opt
        where opt.question_id = q.id
      )
    ) order by array_position(s.selected_questions, q.id)
  )
  from user_test_sessions s
  cross join lateral unnest(s.selected_questions) as question_id
  join question_bank q on q.id = question_id
  where s.id = p_session_id;
$$ language sql stable;

-- 4. 计算MBTI类型
create or replace function calculate_mbti_type(
  p_session_id uuid
) returns varchar(5) as $$
declare
  v_session record;
  v_mbti_type varchar(5) := '';
begin
  select * into v_session from user_test_sessions where id = p_session_id;
  
  -- E vs I
  if v_session.total_introvert > 50 then
    v_mbti_type := v_mbti_type || 'I';
  else
    v_mbti_type := v_mbti_type || 'E';
  end if;
  
  -- S vs N
  if v_session.total_sensing > 50 then
    v_mbti_type := v_mbti_type || 'S';
  else
    v_mbti_type := v_mbti_type || 'N';
  end if;
  
  -- T vs F
  if v_session.total_thinking > 50 then
    v_mbti_type := v_mbti_type || 'T';
  else
    v_mbti_type := v_mbti_type || 'F';
  end if;
  
  -- J vs P
  if v_session.total_perceiving > 50 then
    v_mbti_type := v_mbti_type || 'P';
  else
    v_mbti_type := v_mbti_type || 'J';
  end if;
  
  -- A vs T
  if v_session.total_turbulent > 50 then
    v_mbti_type := v_mbti_type || '-T';
  else
    v_mbti_type := v_mbti_type || '-A';
  end if;
  
  return v_mbti_type;
end;
$$ language plpgsql;
