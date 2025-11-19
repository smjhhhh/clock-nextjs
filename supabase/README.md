# Supabase 数据库设置指南

本指南将帮助你设置 MBTI 测试应用的 Supabase 数据库。

## 第一步：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 **New Project**
4. 填写项目信息：
   - **Name**: `clock-nextjs-mbti`
   - **Database Password**: 设置一个强密码（请记住！）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或离你最近的区域
   - **Pricing Plan**: 选择 **Free**（免费版）
5. 点击 **Create new project**
6. 等待 1-2 分钟，项目创建完成

## 第二步：执行 SQL 脚本

项目创建完成后，在 Supabase 控制台：

### 1. 创建表结构

1. 点击左侧菜单 **SQL Editor**
2. 点击 **New Query**
3. 复制 `01_create_tables.sql` 的全部内容
4. 粘贴到编辑器
5. 点击右下角 **Run** 按钮
6. 看到 "Success" 提示即成功

### 2. 创建函数

1. 再次点击 **New Query**
2. 复制 `02_create_functions.sql` 的全部内容
3. 粘贴并运行

### 3. 设置权限

1. 再次点击 **New Query**
2. 复制 `03_create_rls.sql` 的全部内容
3. 粘贴并运行

### 4. 导入示例数据

1. 再次点击 **New Query**
2. 复制 `04_insert_sample_data.sql` 的全部内容
3. 粘贴并运行
4. 你应该能看到最后的验证结果显示每个维度至少有 7 道题

## 第三步：获取 API 密钥

1. 点击左侧菜单 **Settings** → **API**
2. 找到以下两个值：
   - **Project URL**（类似 `https://xxxxx.supabase.co`）
   - **anon public** key（一串很长的字符串）
3. 复制这两个值

## 第四步：配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_public_key
```

**示例**：
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 第五步：重启开发服务器

```bash
# 如果开发服务器正在运行，请先停止（Ctrl+C）
# 然后重新启动
npm run dev
```

## 验证设置

访问 `http://localhost:3000/api/mbti/create-session`，如果看到 JSON 响应（包含 sessionId 和 questions），说明设置成功！

## 数据库结构说明

- **question_bank**: 题库（100+ 道题）
- **question_options**: 题目选项
- **test_configs**: 测试配置（标准版 20 题、快速版 12 题、完整版 50 题）
- **user_test_sessions**: 测试会话记录
- **user_answers**: 用户答题记录

## 常见问题

### Q: 为什么要用 Supabase？
A: Supabase 是免费的云端数据库，无需在本地安装 PostgreSQL，开箱即用。

### Q: 免费版有什么限制？
A: 免费版提供 500MB 数据库空间，对于 MBTI 测试应用完全足够。

### Q: 数据安全吗？
A: 我们设置了 RLS（Row Level Security）策略，确保用户只能访问自己的数据。

### Q: 如何添加更多题目？
A: 在 SQL Editor 中执行：
```sql
insert into question_bank (question_text, dimension, difficulty) 
values ('你的新问题？', 'EI', 1);

-- 然后为这道题添加选项...
```

## 下一步

设置完成后，你可以：
1. 修改 MBTI 测试页面，调用新的 API
2. 在 Supabase 控制台查看实时数据
3. 使用 Supabase 的 Table Editor 直接编辑题目

祝你使用愉快！🎉
