-- ==================== 插入示例数据 ====================

-- 1. 插入默认测试配置
insert into test_configs (config_name, questions_per_dimension, total_questions, is_default)
values 
  ('标准测试', '{"EI": 5, "SN": 5, "TF": 5, "JP": 5, "AT": 0}'::jsonb, 20, true),
  ('快速测试', '{"EI": 3, "SN": 3, "TF": 3, "JP": 3, "AT": 0}'::jsonb, 12, false),
  ('完整测试', '{"EI": 10, "SN": 10, "TF": 10, "JP": 10, "AT": 10}'::jsonb, 50, false);

-- 2. 插入示例题目（每个维度至少5题）

-- EI 维度题目（外向 vs 内向）
insert into question_bank (question_text, dimension, difficulty) values
  ('在社交场合中，你更倾向于？', 'EI', 1),
  ('周末你更喜欢？', 'EI', 1),
  ('遇到陌生人时，你通常？', 'EI', 2),
  ('你觉得独处是？', 'EI', 2),
  ('参加聚会后，你感觉？', 'EI', 1),
  ('你更喜欢的工作环境是？', 'EI', 2),
  ('和朋友相处时，你更倾向于？', 'EI', 1);

-- SN 维度题目（实感 vs 直觉）
insert into question_bank (question_text, dimension, difficulty) values
  ('处理问题时，你更倾向于？', 'SN', 2),
  ('学习新事物时，你更喜欢？', 'SN', 1),
  ('你更关注？', 'SN', 2),
  ('阅读时，你更喜欢？', 'SN', 1),
  ('你更擅长？', 'SN', 2),
  ('面对未来，你更倾向于？', 'SN', 2),
  ('解决问题时，你更依赖？', 'SN', 1);

-- TF 维度题目（思考 vs 情感）
insert into question_bank (question_text, dimension, difficulty) values
  ('做决定时，你更看重？', 'TF', 1),
  ('评价一件事时，你更关注？', 'TF', 2),
  ('处理冲突时，你更倾向于？', 'TF', 2),
  ('别人向你倾诉时，你更倾向于？', 'TF', 1),
  ('批评他人时，你更在意？', 'TF', 2),
  ('你认为更重要的是？', 'TF', 1),
  ('面对不公时，你更倾向于？', 'TF', 2);

-- JP 维度题目（判断 vs 感知）
insert into question_bank (question_text, dimension, difficulty) values
  ('处理任务时，你更喜欢？', 'JP', 1),
  ('旅行时，你更倾向于？', 'JP', 2),
  ('工作方式上，你更喜欢？', 'JP', 1),
  ('面对截止日期，你通常？', 'JP', 2),
  ('日常生活中，你更喜欢？', 'JP', 1),
  ('处理计划时，你更倾向于？', 'JP', 2),
  ('你的房间通常是？', 'JP', 1);

-- 3. 为每道题添加选项
-- 这里我们需要为每道题添加对应的两个选项

-- 辅助函数：为指定维度的题目批量添加选项
do $$
declare
  q record;
begin
  -- EI 维度
  for q in select id from question_bank where dimension = 'EI' loop
    insert into question_options (question_id, option_text, option_order, score_value) values
      (q.id, '主动与人交流，在人群中获得能量', 0, -5),
      (q.id, '享受独处时光，在安静中恢复精力', 1, 5);
  end loop;

  -- SN 维度
  for q in select id from question_bank where dimension = 'SN' loop
    insert into question_options (question_id, option_text, option_order, score_value) values
      (q.id, '关注具体事实和细节', 0, 5),
      (q.id, '关注可能性和整体概念', 1, -5);
  end loop;

  -- TF 维度
  for q in select id from question_bank where dimension = 'TF' loop
    insert into question_options (question_id, option_text, option_order, score_value) values
      (q.id, '基于逻辑和客观分析', 0, 5),
      (q.id, '基于价值观和人际关系', 1, -5);
  end loop;

  -- JP 维度
  for q in select id from question_bank where dimension = 'JP' loop
    insert into question_options (question_id, option_text, option_order, score_value) values
      (q.id, '按计划行事，喜欢确定性', 0, -5),
      (q.id, '保持灵活，喜欢自发性', 1, 5);
  end loop;
end $$;

-- 4. 验证数据
select 
  dimension,
  count(*) as question_count,
  min(difficulty) as min_difficulty,
  max(difficulty) as max_difficulty
from question_bank
where is_active = true
group by dimension
order by dimension;
