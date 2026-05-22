-- ============================================================
-- MythToy 全站 SEO 关键词库
-- 覆盖 20 个核心词方向, 共 550+ 长尾关键词
-- 表: wholesale.seo_keyword_library
-- site_id = 'toy', status = 1 (已使用)
-- 使用 ON DUPLICATE KEY UPDATE 避免重复插入
-- ============================================================

-- ============================================================
-- Topic: PREMATURE (早泄) — 补充长尾
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'premature ejaculation', NULL, NULL, 'I', 'core', 'PREMATURE', 1),
('toy', 'what is premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'is premature ejaculation normal', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation vs erectile dysfunction', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'what causes premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'psychological causes of premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'performance anxiety premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'can premature ejaculation be cured', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to cure premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation treatment', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation medication', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'when to see a doctor for premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to treat premature ejaculation naturally', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'home remedies for premature ejaculation', 260, 50, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'natural remedies for premature ejaculation', 320, 39, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation pills', 1900, 47, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to last longer in bed naturally', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'Kegel exercises for premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'stop start technique premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'squeeze technique premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to control premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation causes and treatment', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to fix premature ejaculation', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation statistics', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how long should a man last in bed', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'premature ejaculation cure exercise', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1),
('toy', 'how to not cum fast', NULL, NULL, 'I', 'long_tail', 'PREMATURE', 1)
ON DUPLICATE KEY UPDATE topic = 'PREMATURE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: STAMINA (延时训练)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'stamina training for men', NULL, NULL, 'I', 'core', 'STAMINA', 1),
('toy', 'how to last longer in bed', NULL, NULL, 'I', 'core', 'STAMINA', 1),
('toy', 'sexual stamina training', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1),
('toy', 'male stamina training device', NULL, NULL, 'C', 'long_tail', 'STAMINA', 1),
('toy', 'best stamina trainer for men', NULL, NULL, 'C', 'long_tail', 'STAMINA', 1),
('toy', 'how to improve stamina in bed for men', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1),
('toy', 'edging technique for stamina', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1),
('toy', 'stamina training exercises for men', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1),
('toy', 'how to build sexual endurance', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1),
('toy', 'stamina training toy for him', NULL, NULL, 'C', 'long_tail', 'STAMINA', 1),
('toy', 'best edging toy for men', NULL, NULL, 'C', 'long_tail', 'STAMINA', 1),
('toy', 'how to train yourself to last longer in bed', NULL, NULL, 'I', 'long_tail', 'STAMINA', 1)
ON DUPLICATE KEY UPDATE topic = 'STAMINA', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: WAND (按摩棒)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'wand massager', NULL, NULL, 'C', 'core', 'WAND', 1),
('toy', 'wand vibrator', 6600, 49, 'C', 'core', 'WAND', 1),
('toy', 'best wand vibrator', NULL, NULL, 'C', 'core', 'WAND', 1),
('toy', 'magic wand massager', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'cordless wand vibrator', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'mini wand massager', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'how to use a wand massager', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'wand vibrator vs bullet vibrator', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'best wand vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best cordless wand massager', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'most quiet wand vibrator', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best mini wand massager for travel', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best waterproof wand vibrator', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best budget wand massager under 50', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best rechargeable wand massager', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'how to use a wand massager for the first time', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'how to clean a wand massager', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'how loud are wand massagers', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'wand massager for women', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'wand massager for couples', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'best wand massager for clitoral stimulation', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'silicone head wand vibrator', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'plug in vs rechargeable wand vibrator', NULL, NULL, 'I', 'long_tail', 'WAND', 1),
('toy', 'wand massager with variable speed', NULL, NULL, 'C', 'long_tail', 'WAND', 1),
('toy', 'buy wand massager online', NULL, NULL, 'T', 'long_tail', 'WAND', 1)
ON DUPLICATE KEY UPDATE topic = 'WAND', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: BULLET (跳蛋/迷你震动器)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'bullet vibrator', 14800, 32, 'C', 'core', 'BULLET', 1),
('toy', 'best bullet vibrator', 1600, 27, 'C', 'core', 'BULLET', 1),
('toy', 'mini bullet vibrator', 590, 30, 'C', 'long_tail', 'BULLET', 1),
('toy', 'egg vibrator', 3600, 30, 'I', 'long_tail', 'BULLET', 1),
('toy', 'remote bullet vibrator', 90, 17, 'I', 'long_tail', 'BULLET', 1),
('toy', 'discreet bullet vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'how to use a bullet vibrator', 1000, 22, 'I', 'long_tail', 'BULLET', 1),
('toy', 'bullet vibrator vs egg vibrator', NULL, NULL, 'I', 'long_tail', 'BULLET', 1),
('toy', 'best discreet bullet vibrator for travel', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'strongest mini bullet vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best remote control bullet vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best rechargeable bullet vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best budget bullet vibrator under 30', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best quiet bullet vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best bullet vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'bullet vibrator for clitoral stimulation', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'how to clean a bullet vibrator', NULL, NULL, 'I', 'long_tail', 'BULLET', 1),
('toy', 'bullet vibrator for women', 480, 29, 'C', 'long_tail', 'BULLET', 1),
('toy', 'bullet vibrator travel', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'mini vibrator for discreet use', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'buy bullet vibrator online', NULL, NULL, 'T', 'long_tail', 'BULLET', 1),
('toy', 'bullet egg vibrator', 140, 25, 'C', 'long_tail', 'BULLET', 1)
ON DUPLICATE KEY UPDATE topic = 'BULLET', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: RABBIT (兔型双震)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'rabbit vibrator', 1900, 46, 'C', 'core', 'RABBIT', 1),
('toy', 'best rabbit vibrator', 1300, 40, 'C', 'core', 'RABBIT', 1),
('toy', 'dual stimulator vibrator', NULL, NULL, 'C', 'core', 'RABBIT', 1),
('toy', 'what is a rabbit vibrator', 260, 36, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'how to use a rabbit vibrator', 720, 17, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'rabbit vibrator vs g spot vibrator', NULL, NULL, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'best rabbit vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'best dual stimulation vibrator', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'thrusting rabbit vibrator', 320, 10, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'rotating rabbit vibrator', 50, 1, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'best waterproof rabbit vibrator', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'best luxury rabbit vibrator', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'best budget rabbit vibrator under 60', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'best quiet rabbit vibrator', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'how to clean a rabbit vibrator', NULL, NULL, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'rabbit vibrator for g spot and clit', NULL, NULL, 'C', 'long_tail', 'RABBIT', 1),
('toy', 'rabbit vs dual stimulator difference', NULL, NULL, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'thrusting vs rotating rabbit vibrator', NULL, NULL, 'I', 'long_tail', 'RABBIT', 1),
('toy', 'buy rabbit vibrator online', NULL, NULL, 'T', 'long_tail', 'RABBIT', 1)
ON DUPLICATE KEY UPDATE topic = 'RABBIT', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: GSPOT (G点震动器)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'best g spot vibrator', 1000, 41, 'C', 'core', 'GSPOT', 1),
('toy', 'how to use a g spot vibrator', 170, 12, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'how to find your g spot', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'g spot vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'what is a g spot vibrator', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'g spot orgasm vs clitoral orgasm', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'how does a g spot vibrator work', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'what does a g spot orgasm feel like', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'curved vibrator for g spot', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'can anyone have a g spot orgasm', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'why cant i find my g spot', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'best curved vibrator for g spot', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'best g spot vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'best internal vibrator for g spot', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'best quiet g spot vibrator', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'best rechargeable g spot vibrator', NULL, NULL, 'C', 'long_tail', 'GSPOT', 1),
('toy', 'g spot stimulation techniques', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'do g spot vibrators really work', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'g spot vibrator vs rabbit', NULL, NULL, 'I', 'long_tail', 'GSPOT', 1),
('toy', 'buy g spot vibrator online', NULL, NULL, 'T', 'long_tail', 'GSPOT', 1)
ON DUPLICATE KEY UPDATE topic = 'GSPOT', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: CLIT (阴蒂震动器) — 补充长尾
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'clitoral sucking vibrator', NULL, NULL, 'C', 'core', 'CLIT', 1),
('toy', 'air pulse vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'rose vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'clit licking vibrator', 170, 32, 'C', 'long_tail', 'CLIT', 1),
('toy', 'how to use a clit vibrator', 90, 29, 'I', 'long_tail', 'CLIT', 1),
('toy', 'clit stimulator vs vibrator', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'how does a clitoral sucking vibrator work', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'how to use a rose vibrator', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'what is an air pulse vibrator', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'best clitoral sucking vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best rose vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best clit licking vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best pinpoint clit vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best air pulse vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best tongue vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best clit vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best clit toy for squirting', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best clitoral massager wand', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best clit stimulator for sensitive clitoris', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best quiet clit vibrator', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'rose vibrator vs womanizer', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'best budget clit vibrator under 50', NULL, NULL, 'C', 'long_tail', 'CLIT', 1),
('toy', 'tongue vibrator vs air pulse', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'clit sucking toy vs clit licking toy', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'how to clean a clitoral vibrator', NULL, NULL, 'I', 'long_tail', 'CLIT', 1),
('toy', 'buy clit vibrator online', NULL, NULL, 'T', 'long_tail', 'CLIT', 1),
('toy', 'buy rose vibrator', NULL, NULL, 'T', 'long_tail', 'CLIT', 1)
ON DUPLICATE KEY UPDATE topic = 'CLIT', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: DILDO (假阳具/仿真) — 扩充
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'realistic dildo', NULL, NULL, 'C', 'core', 'DILDO', 1),
('toy', 'suction cup dildo', NULL, NULL, 'C', 'core', 'DILDO', 1),
('toy', 'silicone dildo', NULL, NULL, 'C', 'core', 'DILDO', 1),
('toy', 'how to use a dildo for beginners', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'what size dildo should I get', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'silicone dildo vs glass dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'how to clean a silicone dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'how to use a suction cup dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'vibrating dildo vs regular dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'are realistic dildos body safe', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'best realistic dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best silicone dildo for beginners', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best suction cup dildo for hands free', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best dual density realistic dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best vibrating dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best budget silicone dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best dildo for g spot stimulation', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'best dildo for strap on use', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'what is dual density silicone dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'curved vs straight dildo', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'glass dildo vs silicone', NULL, NULL, 'I', 'long_tail', 'DILDO', 1),
('toy', 'buy realistic dildo online', NULL, NULL, 'T', 'long_tail', 'DILDO', 1),
('toy', 'heated thrusting dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1),
('toy', 'small vibrating dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1)
ON DUPLICATE KEY UPDATE topic = 'DILDO', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: MASTURBATOR (男用飞机杯/自慰器)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'male masturbator', NULL, NULL, 'C', 'core', 'MASTURBATOR', 1),
('toy', 'pocket pussy', NULL, NULL, 'C', 'core', 'MASTURBATOR', 1),
('toy', 'male stroker', NULL, NULL, 'C', 'core', 'MASTURBATOR', 1),
('toy', 'best male masturbator', NULL, NULL, 'C', 'core', 'MASTURBATOR', 1),
('toy', 'how to use a male masturbator', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'how to clean a male masturbator', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'pocket pussy vs stroker', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'automatic male masturbator vs manual', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best pocket pussy for beginners', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best automatic male masturbator', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best vibrating male stroker', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'most realistic pocket pussy', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best discreet male masturbator', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best budget male stroker under 40', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best male masturbator for stamina training', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best hands free male masturbator', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'best male masturbator easy to clean', NULL, NULL, 'C', 'long_tail', 'MASTURBATOR', 1),
('toy', 'how to dry a male masturbator after washing', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'how to store a pocket pussy', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'what lube is best for male stroker', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'how often should you replace male masturbator', NULL, NULL, 'I', 'long_tail', 'MASTURBATOR', 1),
('toy', 'buy pocket pussy online', NULL, NULL, 'T', 'long_tail', 'MASTURBATOR', 1)
ON DUPLICATE KEY UPDATE topic = 'MASTURBATOR', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: COCKRING (阴茎环/锁精环)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'cock ring', NULL, NULL, 'C', 'core', 'COCKRING', 1),
('toy', 'penis ring', NULL, NULL, 'C', 'core', 'COCKRING', 1),
('toy', 'vibrating cock ring', 12100, 24, 'C', 'core', 'COCKRING', 1),
('toy', 'what is a cock ring', NULL, NULL, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'how to use a cock ring', 6600, 32, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'how does a cock ring work', NULL, NULL, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'are cock rings safe', NULL, NULL, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'how long can you wear a cock ring', 260, 35, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'does cock ring help with erectile dysfunction', NULL, NULL, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'do cock rings make you last longer', 480, 28, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'cock ring size guide', NULL, NULL, 'I', 'long_tail', 'COCKRING', 1),
('toy', 'best cock ring for erectile dysfunction', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'best cock ring for beginners', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'best vibrating cock ring for couples', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'best silicone cock ring', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'best adjustable penis ring', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'best metal cock ring for stamina', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'cock ring with clitoral stimulator', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'cock ring for edging', NULL, NULL, 'C', 'long_tail', 'COCKRING', 1),
('toy', 'buy cock ring online', NULL, NULL, 'T', 'long_tail', 'COCKRING', 1)
ON DUPLICATE KEY UPDATE topic = 'COCKRING', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: PROSTATE (前列腺按摩器) — 扩充
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'best prostate massager', 4400, 35, 'C', 'core', 'PROSTATE', 1),
('toy', 'what is a prostate massager', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'how to use a prostate massager', 590, 29, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'how does prostate stimulation feel', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'prostate massager health benefits', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'is prostate massage safe', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'how to find your p spot', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'prostate orgasm vs penile orgasm', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'how to clean prostate massager', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'prostate massager for beginners', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best prostate massager for beginners', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best hands free prostate massager', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best prostate vibrator', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best remote prostate massager', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best curved prostate massager for p spot', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'best silicone prostate massager', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1),
('toy', 'how to achieve prostate orgasm', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'can prostate massage help with prostatitis', NULL, NULL, 'I', 'long_tail', 'PROSTATE', 1),
('toy', 'buy prostate massager online', NULL, NULL, 'T', 'long_tail', 'PROSTATE', 1),
('toy', 'vibrating prostate wand', NULL, NULL, 'C', 'long_tail', 'PROSTATE', 1)
ON DUPLICATE KEY UPDATE topic = 'PROSTATE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: ANAL (肛塞/肛珠/后庭)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'butt plug', 74000, 46, 'I', 'core', 'ANAL', 1),
('toy', 'anal beads', NULL, NULL, 'C', 'core', 'ANAL', 1),
('toy', 'vibrating butt plug', 9900, 20, 'C', 'core', 'ANAL', 1),
('toy', 'anal training kit', NULL, NULL, 'C', 'core', 'ANAL', 1),
('toy', 'what is a butt plug used for', 1600, 43, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how to use anal beads step by step', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how to use a butt plug for beginners', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how long can you wear a butt plug', 480, 31, 'I', 'long_tail', 'ANAL', 1),
('toy', 'anal training guide for beginners', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how to prepare for anal play', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'butt plug benefits during sex', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'glass butt plug vs silicone safety', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how to clean anal toys properly', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'what size butt plug should I start with', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'anal beads how to insert and remove', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'how to achieve anal orgasm', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'best butt plug for beginners', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best vibrating butt plug for men', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best silicone anal beads', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best anal training kit for beginners', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best glass butt plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best remote control butt plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'best anal toys for couples play', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'buy butt plug online', NULL, NULL, 'T', 'long_tail', 'ANAL', 1),
('toy', 'anal trainer kit graduated sizes', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'anal masturbator', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'how to use anal vibrator', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'best anal vibrator', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'vibrating anal beads', NULL, NULL, 'C', 'long_tail', 'ANAL', 1)
ON DUPLICATE KEY UPDATE topic = 'ANAL', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: COUPLES (情侣震动器)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'couples vibrator', 2900, 21, 'C', 'core', 'COUPLES', 1),
('toy', 'best couples vibrator', NULL, NULL, 'C', 'core', 'COUPLES', 1),
('toy', 'remote vibrator for couples', NULL, NULL, 'C', 'core', 'COUPLES', 1),
('toy', 'how to use a couples vibrator', NULL, NULL, 'I', 'long_tail', 'COUPLES', 1),
('toy', 'how to introduce sex toys with partner', NULL, NULL, 'I', 'long_tail', 'COUPLES', 1),
('toy', 'best positions with couples vibrator', NULL, NULL, 'I', 'long_tail', 'COUPLES', 1),
('toy', 'best wearable vibrator for public wear', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best app controlled vibrator for long distance', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best remote vibrator for couples', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best bluetooth vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best vibrator for couples to use together', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best couples sex toy for intercourse', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'wearable vibrator for public play', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'long distance vibrator how to use', NULL, NULL, 'I', 'long_tail', 'COUPLES', 1),
('toy', 'app controlled love egg vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'vibrating panty for couples', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'remote control vibrator app enabled', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'buy couples vibrator online', NULL, NULL, 'T', 'long_tail', 'COUPLES', 1),
('toy', 'partner controlled vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1)
ON DUPLICATE KEY UPDATE topic = 'COUPLES', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: DISCREET (隐蔽/静音震动器)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'discreet vibrator', 1600, 25, 'C', 'core', 'DISCREET', 1),
('toy', 'quiet vibrator', 1900, 30, 'C', 'core', 'DISCREET', 1),
('toy', 'silent vibrator', 1900, 18, 'C', 'core', 'DISCREET', 1),
('toy', 'what is a discreet vibrator', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'quietest vibrator noise comparison', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'how quiet are silent vibrators', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'how to travel with vibrator TSA rules', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'vibrator that looks like everyday object', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'quietest vibrator on the market', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best discreet vibrator for travel', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best silent vibrator for dorm room', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best small discreet vibrator', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best vibrator that looks like everyday object', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best quiet bullet vibrator', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'best quiet wand vibrator', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'how to use vibrator discreetly', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'vibrator noise level decibels', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'travel vibrator size guide', NULL, NULL, 'I', 'long_tail', 'DISCREET', 1),
('toy', 'discreet clitoral vibrator small', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'whisper quiet vibrator travel size', NULL, NULL, 'C', 'long_tail', 'DISCREET', 1),
('toy', 'buy discreet vibrator online', NULL, NULL, 'T', 'long_tail', 'DISCREET', 1)
ON DUPLICATE KEY UPDATE topic = 'DISCREET', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: LUBE (润滑液)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'best lube', NULL, NULL, 'C', 'core', 'LUBE', 1),
('toy', 'water based lube', NULL, NULL, 'C', 'core', 'LUBE', 1),
('toy', 'silicone lube', NULL, NULL, 'C', 'core', 'LUBE', 1),
('toy', 'water based lube vs silicone lube', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'what is the best type of lube', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'how to use lube properly', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'is silicone lube safe for silicone toys', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'does lube expire', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'best water based lube', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best silicone lube', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best organic lubricant', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best lube for sensitive skin', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best warming lubricant for couples', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best long lasting lube', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best ph balanced lube for women', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best natural lubricant without glycerin', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'best anal lube for beginners', NULL, NULL, 'C', 'long_tail', 'LUBE', 1),
('toy', 'what ingredients to avoid in lube', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'is coconut oil safe as lube', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'why use lube for sex', NULL, NULL, 'I', 'long_tail', 'LUBE', 1),
('toy', 'buy water based lube online', NULL, NULL, 'T', 'long_tail', 'LUBE', 1)
ON DUPLICATE KEY UPDATE topic = 'LUBE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: CLEANER (用品清洁)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'how to clean sex toys', NULL, NULL, 'I', 'core', 'CLEANER', 1),
('toy', 'best sex toy cleaner', NULL, NULL, 'C', 'core', 'CLEANER', 1),
('toy', 'can you use soap on silicone toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'how often should you clean sex toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'how to disinfect sex toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'can you boil silicone sex toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'is rubbing alcohol safe for sex toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'how to sanitize sex toys between partners', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'do you need special sex toy cleaner', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'how to clean porous vs non porous toys', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'best antibacterial toy spray', NULL, NULL, 'C', 'long_tail', 'CLEANER', 1),
('toy', 'best uv sex toy sanitizer', NULL, NULL, 'C', 'long_tail', 'CLEANER', 1),
('toy', 'best sex toy cleaning wipes travel', NULL, NULL, 'C', 'long_tail', 'CLEANER', 1),
('toy', 'best foam toy cleaner', NULL, NULL, 'C', 'long_tail', 'CLEANER', 1),
('toy', 'best unscented sex toy cleaner', NULL, NULL, 'C', 'long_tail', 'CLEANER', 1),
('toy', 'sex toy cleaner vs mild soap', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'how to store sex toys after cleaning', NULL, NULL, 'I', 'long_tail', 'CLEANER', 1),
('toy', 'buy sex toy cleaner online', NULL, NULL, 'T', 'long_tail', 'CLEANER', 1)
ON DUPLICATE KEY UPDATE topic = 'CLEANER', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: BODYSAFE (身体安全/材质)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'body safe sex toys', NULL, NULL, 'C', 'core', 'BODYSAFE', 1),
('toy', 'medical grade silicone vibrator', NULL, NULL, 'C', 'core', 'BODYSAFE', 1),
('toy', 'what are body safe sex toys', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'silicone vs plastic sex toys which is safer', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'what does phthalate free mean', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'how to tell if a sex toy is real silicone', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'what is medical grade silicone for toys', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'are cheap sex toys safe', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'porous vs non porous sex toy materials', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'what is hypoallergenic sex toy', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'what materials are body safe for sex toys', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'is jelly sex toy safe', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'are tpe and tpr sex toys body safe', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'what is the safest sex toy material', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'why is silicone the best sex toy material', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'how to test if sex toy is silicone', NULL, NULL, 'I', 'long_tail', 'BODYSAFE', 1),
('toy', 'best body safe sex toys 2026', NULL, NULL, 'C', 'long_tail', 'BODYSAFE', 1),
('toy', 'best medical grade silicone vibrator', NULL, NULL, 'C', 'long_tail', 'BODYSAFE', 1),
('toy', 'best phthalate free sex toys', NULL, NULL, 'C', 'long_tail', 'BODYSAFE', 1),
('toy', 'best hypoallergenic vibrator for sensitive skin', NULL, NULL, 'C', 'long_tail', 'BODYSAFE', 1),
('toy', 'best non toxic sex toy brands', NULL, NULL, 'C', 'long_tail', 'BODYSAFE', 1),
('toy', 'buy body safe silicone vibrator', NULL, NULL, 'T', 'long_tail', 'BODYSAFE', 1)
ON DUPLICATE KEY UPDATE topic = 'BODYSAFE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: BEGINNER (入门/新手)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'best vibrator for beginners', NULL, NULL, 'C', 'core', 'BEGINNER', 1),
('toy', 'first sex toy', NULL, NULL, 'C', 'core', 'BEGINNER', 1),
('toy', 'beginner sex toy', NULL, NULL, 'C', 'core', 'BEGINNER', 1),
('toy', 'how to choose your first vibrator', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'beginner sex toy guide for women', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'what kind of vibrator should i get first', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'how to use a vibrator for the first time', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'what to look for in a first vibrator', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'what size vibrator for first time', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'are vibrators safe for beginners', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'clitoral or internal vibrator first', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'easy to use vibrator for first time', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'how to overcome fear of using vibrator', NULL, NULL, 'I', 'long_tail', 'BEGINNER', 1),
('toy', 'best first vibrator for women', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best small vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best quiet vibrator for first time', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best cheap vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best bullet vibrator for first time', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best wand vibrator for beginners', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'best starter sex toy kit', NULL, NULL, 'C', 'long_tail', 'BEGINNER', 1),
('toy', 'buy beginner vibrator online', NULL, NULL, 'T', 'long_tail', 'BEGINNER', 1),
('toy', 'starter sex toy kit for sale', NULL, NULL, 'T', 'long_tail', 'BEGINNER', 1)
ON DUPLICATE KEY UPDATE topic = 'BEGINNER', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: PELVIC (盆底肌/Kegel)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'kegel exercises for women', NULL, NULL, 'I', 'core', 'PELVIC', 1),
('toy', 'pelvic floor trainer', NULL, NULL, 'C', 'core', 'PELVIC', 1),
('toy', 'how to do kegel exercises correctly', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'benefits of kegel exercises', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how to find your pelvic floor muscles', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'pelvic floor exercises after childbirth', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how to strengthen pelvic floor at home', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'what does a pelvic floor trainer do', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how often should you do kegel exercises', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'signs of weak pelvic floor in women', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how long does it take to see kegel results', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'can kegel exercises improve sex life', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how to use kegel weights properly', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'what is biofeedback pelvic floor therapy', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'how does a smart kegel device work', NULL, NULL, 'I', 'long_tail', 'PELVIC', 1),
('toy', 'best kegel exerciser for women', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best pelvic floor trainer device', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best smart kegel device', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best kegel weights for beginners', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best app controlled kegel trainer', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best biofeedback pelvic floor device', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'best kegel device for postpartum', NULL, NULL, 'C', 'long_tail', 'PELVIC', 1),
('toy', 'buy kegel exerciser online', NULL, NULL, 'T', 'long_tail', 'PELVIC', 1),
('toy', 'buy pelvic floor exerciser with app', NULL, NULL, 'T', 'long_tail', 'PELVIC', 1)
ON DUPLICATE KEY UPDATE topic = 'PELVIC', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: LIBIDO (女性性欲)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'how to increase female libido', NULL, NULL, 'I', 'core', 'LIBIDO', 1),
('toy', 'low sex drive in women', NULL, NULL, 'I', 'core', 'LIBIDO', 1),
('toy', 'what causes low sex drive in women', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'how to get your sex drive back after pregnancy', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'stress and libido connection in women', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'what foods increase female libido', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'best supplements for female libido', NULL, NULL, 'C', 'long_tail', 'LIBIDO', 1),
('toy', 'how to increase sex drive after 40', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'hormonal causes of low libido in women', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'can birth control affect libido', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'how does antidepressants affect female libido', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'libido after pregnancy how long to recover', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'how to increase libido during menopause', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'can exercise increase female sex drive', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'psychological causes of low libido', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'how to talk to partner about low libido', NULL, NULL, 'I', 'long_tail', 'LIBIDO', 1),
('toy', 'best natural libido boosters for women', NULL, NULL, 'C', 'long_tail', 'LIBIDO', 1),
('toy', 'best libido supplement for menopause', NULL, NULL, 'C', 'long_tail', 'LIBIDO', 1),
('toy', 'best arousal gel for women', NULL, NULL, 'C', 'long_tail', 'LIBIDO', 1),
('toy', 'natural libido boosters that actually work', NULL, NULL, 'C', 'long_tail', 'LIBIDO', 1),
('toy', 'buy female libido booster online', NULL, NULL, 'T', 'long_tail', 'LIBIDO', 1)
ON DUPLICATE KEY UPDATE topic = 'LIBIDO', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: ORGASM (女性高潮)
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'how to have an orgasm', NULL, NULL, 'I', 'core', 'ORGASM', 1),
('toy', 'how to orgasm', NULL, NULL, 'I', 'core', 'ORGASM', 1),
('toy', 'how to have an orgasm for the first time', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'why cant i orgasm during sex', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'clitoral orgasm vs vaginal orgasm', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to orgasm during intercourse', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to achieve multiple orgasms', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'what is squirting and how does it happen', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to squirt for beginners', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'g spot orgasm guide', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to have a vaginal orgasm', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'what is anorgasmia', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to orgasm with a partner', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'best positions to help women orgasm', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how long does it take the average woman to orgasm', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'can all women have orgasms', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'best toy to help women orgasm', NULL, NULL, 'C', 'long_tail', 'ORGASM', 1),
('toy', 'best vibrator for achieving orgasm', NULL, NULL, 'C', 'long_tail', 'ORGASM', 1),
('toy', 'best sex toy for women who cant orgasm', NULL, NULL, 'C', 'long_tail', 'ORGASM', 1),
('toy', 'best toy for squirting', NULL, NULL, 'C', 'long_tail', 'ORGASM', 1),
('toy', 'best toy for multiple orgasms', NULL, NULL, 'C', 'long_tail', 'ORGASM', 1),
('toy', 'female orgasm tips for women', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'how to orgasm from clitoral stimulation', NULL, NULL, 'I', 'long_tail', 'ORGASM', 1),
('toy', 'buy female orgasm toy online', NULL, NULL, 'T', 'long_tail', 'ORGASM', 1)
ON DUPLICATE KEY UPDATE topic = 'ORGASM', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: NIPPLE (乳头玩具) — 补充
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'nipple vibrator', 2400, 30, 'I', 'core', 'NIPPLE', 1),
('toy', 'how to use a nipple vibrator', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'what is a nipple suction toy', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'nipple play for beginners guide', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'can women have a nipple orgasm', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'how to achieve nipple orgasm', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'best vibrating nipple clamps', 40, 12, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'best nipple stimulator for women', NULL, NULL, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'best remote nipple vibrator', NULL, NULL, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'best nipple sucker toy', NULL, NULL, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'best nipple clamps for beginners', NULL, NULL, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'best silicone nipple suckers', NULL, NULL, 'C', 'long_tail', 'NIPPLE', 1),
('toy', 'how to use nipple clamps for beginners', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'are nipple toys safe', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'how to clean nipple toys', NULL, NULL, 'I', 'long_tail', 'NIPPLE', 1),
('toy', 'buy nipple vibrator online', NULL, NULL, 'T', 'long_tail', 'NIPPLE', 1)
ON DUPLICATE KEY UPDATE topic = 'NIPPLE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Topic: EDUCATION (性教育/使用指南) — 扩充
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'how to use a vibrator', 5400, 41, 'I', 'core', 'EDUCATION', 1),
('toy', 'how to use a sex toy', NULL, NULL, 'I', 'core', 'EDUCATION', 1),
('toy', 'sex toy safety tips', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'how to introduce sex toys in relationship', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'sex toys for long distance relationships', NULL, NULL, 'C', 'long_tail', 'EDUCATION', 1),
('toy', 'how to choose the right sex toy', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'sex toy myths debunked', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'benefits of using sex toys', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'can sex toys help with orgasm', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'how to store sex toys discreetly', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'sex toy buying guide first timer', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'what to know before buying first sex toy', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'solo play benefits for women', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1),
('toy', 'sex toys for couples beginners', NULL, NULL, 'C', 'long_tail', 'EDUCATION', 1),
('toy', 'how to talk about sex toys with partner', NULL, NULL, 'I', 'long_tail', 'EDUCATION', 1)
ON DUPLICATE KEY UPDATE topic = 'EDUCATION', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- 补充: 遗漏的大词 + Semrush 新发现关键词
-- 这些是 20 个大词中遗漏的 seed keywords
-- 以及 Semrush 分析中发现的高价值新词
-- ============================================================

-- 大词补充: GSPOT
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'g spot vibrator', 5400, 34, 'C', 'core', 'GSPOT', 1),
('toy', 'g spot toy', NULL, NULL, 'C', 'core', 'GSPOT', 1),
('toy', 'g spot toys for women', NULL, NULL, 'C', 'core', 'GSPOT', 1)
ON DUPLICATE KEY UPDATE topic = 'GSPOT', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: CLIT
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'clit vibrator', 5400, 37, 'C', 'core', 'CLIT', 1),
('toy', 'clitoral vibrator', 1900, 37, 'C', 'core', 'CLIT', 1),
('toy', 'clit toy', NULL, NULL, 'C', 'core', 'CLIT', 1)
ON DUPLICATE KEY UPDATE topic = 'CLIT', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: DILDO
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'dildo', NULL, NULL, 'C', 'core', 'DILDO', 1),
('toy', 'best dildo', NULL, NULL, 'C', 'core', 'DILDO', 1),
('toy', 'strap on dildo', NULL, NULL, 'C', 'long_tail', 'DILDO', 1)
ON DUPLICATE KEY UPDATE topic = 'DILDO', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: PROSTATE
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'prostate massager', 18100, 50, 'I', 'core', 'PROSTATE', 1),
('toy', 'prostate toy', NULL, NULL, 'C', 'core', 'PROSTATE', 1),
('toy', 'prostate vibrator', 4400, 46, 'C', 'long_tail', 'PROSTATE', 1)
ON DUPLICATE KEY UPDATE topic = 'PROSTATE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: ANAL
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'anal toys', 9900, 37, 'C', 'core', 'ANAL', 1),
('toy', 'anal toy', 9900, 37, 'C', 'core', 'ANAL', 1),
('toy', 'anal sex toys for beginners', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'anal plug', NULL, NULL, 'C', 'core', 'ANAL', 1)
ON DUPLICATE KEY UPDATE topic = 'ANAL', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: LUBE
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'personal lubricant', NULL, NULL, 'C', 'core', 'LUBE', 1),
('toy', 'lube', NULL, NULL, 'C', 'core', 'LUBE', 1),
('toy', 'lubricant', NULL, NULL, 'C', 'core', 'LUBE', 1)
ON DUPLICATE KEY UPDATE topic = 'LUBE', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: CLEANER
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'sex toy cleaner', NULL, NULL, 'C', 'core', 'CLEANER', 1),
('toy', 'toy cleaner', NULL, NULL, 'C', 'core', 'CLEANER', 1)
ON DUPLICATE KEY UPDATE topic = 'CLEANER', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: EDUCATION (通用大词)
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'vibrator', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'sex toy', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'adult toys', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'adult toy', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'sex toys for women', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'sex toys for men', NULL, NULL, 'C', 'core', 'EDUCATION', 1),
('toy', 'best sex toys', NULL, NULL, 'C', 'core', 'EDUCATION', 1)
ON DUPLICATE KEY UPDATE topic = 'EDUCATION', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: COUPLES
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'sex toys for couples', NULL, NULL, 'C', 'core', 'COUPLES', 1),
('toy', 'couples sex toys', NULL, NULL, 'C', 'core', 'COUPLES', 1),
('toy', 'couples toy', NULL, NULL, 'C', 'core', 'COUPLES', 1)
ON DUPLICATE KEY UPDATE topic = 'COUPLES', intent = VALUES(intent), category = VALUES(category), status = 1;

-- 大词补充: BEGINNER
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'sex toys for beginners', NULL, NULL, 'C', 'core', 'BEGINNER', 1),
('toy', 'beginner sex toys', NULL, NULL, 'C', 'core', 'BEGINNER', 1)
ON DUPLICATE KEY UPDATE topic = 'BEGINNER', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Semrush 新发现: Vibrating Panties (18,100 vol — 最大遗漏词!)
-- → 新博客: vibrating-panties-wearable-guide
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'vibrating panties', 18100, 17, 'C', 'core', 'COUPLES', 1),
('toy', 'vibrating panty', 2900, 15, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'panty vibrator', 2900, 20, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'remote control panty vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'wearable panty vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'app controlled panty vibrator', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'best vibrating panties', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1),
('toy', 'how to use vibrating panties', NULL, NULL, 'I', 'long_tail', 'COUPLES', 1),
('toy', 'discreet wearable vibrator for public', NULL, NULL, 'C', 'long_tail', 'COUPLES', 1)
ON DUPLICATE KEY UPDATE topic = 'COUPLES', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Semrush 新发现: Tail Butt Plugs (高搜索量, 目前缺内容)
-- → 新博客: tail-butt-plugs-guide
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'tail butt plug', 6600, 22, 'C', 'core', 'ANAL', 1),
('toy', 'butt plug tail', 5400, 20, 'C', 'long_tail', 'ANAL', 1),
('toy', 'cat tail butt plug', 1600, 6, 'I', 'long_tail', 'ANAL', 1),
('toy', 'fox tail butt plug', 1900, 12, 'I', 'long_tail', 'ANAL', 1),
('toy', 'anal tail plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'how to use tail butt plug', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'best tail butt plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'tail plug for beginners', NULL, NULL, 'C', 'long_tail', 'ANAL', 1)
ON DUPLICATE KEY UPDATE topic = 'ANAL', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Semrush 新发现: Finger Vibrators (搜索量可观, 缺内容)
-- → 新博客: finger-vibrators-guide
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'finger vibrator', 4400, 30, 'C', 'core', 'BULLET', 1),
('toy', 'finger vibrator for couples', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'best finger vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'wearable finger vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'finger sleeve vibrator', NULL, NULL, 'C', 'long_tail', 'BULLET', 1),
('toy', 'how to use a finger vibrator', NULL, NULL, 'I', 'long_tail', 'BULLET', 1),
('toy', 'finger vibrator vs bullet', NULL, NULL, 'I', 'long_tail', 'BULLET', 1),
('toy', 'best finger vibrator for foreplay', NULL, NULL, 'C', 'long_tail', 'BULLET', 1)
ON DUPLICATE KEY UPDATE topic = 'BULLET', intent = VALUES(intent), category = VALUES(category), status = 1;

-- ============================================================
-- Semrush 新发现: Inflatable Butt Plugs (搜索量增长趋势)
-- → 新博客: inflatable-butt-plugs-guide
-- ============================================================
INSERT INTO wholesale.seo_keyword_library (site_id, keyword, volume, kd, intent, category, topic, status) VALUES
('toy', 'inflatable butt plug', 4400, 23, 'I', 'core', 'ANAL', 1),
('toy', 'inflatable anal plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'expanding butt plug', 480, 3, 'C', 'long_tail', 'ANAL', 1),
('toy', 'how to use inflatable butt plug', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'best inflatable butt plug', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'inflatable butt plug for beginners', NULL, NULL, 'C', 'long_tail', 'ANAL', 1),
('toy', 'inflatable vs regular butt plug', NULL, NULL, 'I', 'long_tail', 'ANAL', 1),
('toy', 'are inflatable butt plugs safe', NULL, NULL, 'I', 'long_tail', 'ANAL', 1)
ON DUPLICATE KEY UPDATE topic = 'ANAL', intent = VALUES(intent), category = VALUES(category), status = 1;