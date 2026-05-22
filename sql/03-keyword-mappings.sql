-- ============================================================
-- MythToy SEO 关键词 → 博客页面 映射
-- 表: wholesale.keyword_page_mapping
-- site_id = 'toy', page_type = 2 (博客文章)
-- 使用 INSERT IGNORE 防止重复关联
-- 包含: 复用现有博客 + 新建占坑
-- ============================================================

-- ============================================================
-- PREMATURE + STAMINA → 现有博客 + 新建
-- ============================================================
-- 映射到 stamina-training-edging-guide (现有 #190)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/stamina-training-edging-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'stamina training for men', 'how to last longer in bed', 'sexual stamina training',
  'edging technique for stamina', 'stamina training exercises for men', 'how to build sexual endurance',
  'how to train yourself to last longer in bed', 'how to last longer in bed naturally',
  'premature ejaculation cure exercise', 'how to not cum fast',
  'how to control premature ejaculation', 'stop start technique premature ejaculation',
  'squeeze technique premature ejaculation', 'Kegel exercises for premature ejaculation'
);

-- 映射到 science-of-stamina-training-for-men (现有, referenced in related-guides)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/science-of-stamina-training-for-men', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'premature ejaculation device', 'premature ejaculation ring', 'premature ejaculation stop start method',
  'stamina training unit', 'male stamina training device', 'best stamina trainer for men',
  'stamina training toy for him', 'best edging toy for men'
);

-- 映射到 premature-ejaculation-causes-and-solutions (新建)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/premature-ejaculation-causes-and-solutions', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'premature ejaculation', 'what causes premature ejaculation', 'psychological causes of premature ejaculation',
  'premature ejaculation causes and treatment', 'premature ejaculation statistics',
  'performance anxiety premature ejaculation', 'is premature ejaculation normal'
);

-- 映射到 natural-remedies-for-premature-ejaculation (新建)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/natural-remedies-for-premature-ejaculation', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to treat premature ejaculation naturally', 'home remedies for premature ejaculation',
  'natural remedies for premature ejaculation', 'can premature ejaculation be cured',
  'how to cure premature ejaculation', 'how to fix premature ejaculation'
);

-- 映射到 premature-ejaculation-vs-erectile-dysfunction (新建)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/premature-ejaculation-vs-erectile-dysfunction', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'premature ejaculation vs erectile dysfunction', 'what is premature ejaculation',
  'how long should a man last in bed'
);

-- 映射到 when-to-see-doctor-premature-ejaculation (新建)
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/when-to-see-doctor-premature-ejaculation', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'premature ejaculation treatment', 'premature ejaculation medication',
  'when to see a doctor for premature ejaculation', 'premature ejaculation pills'
);

-- ============================================================
-- WAND → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-wand-vibrators-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'wand massager', 'wand vibrator', 'best wand vibrator', 'magic wand massager',
  'wand massager for women', 'silicone head wand vibrator', 'wand massager with variable speed',
  'best wand massager for clitoral stimulation'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-wand-massager-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to use a wand massager', 'how to use a wand massager for the first time',
  'best wand vibrator for beginners', 'wand vibrator for beginners'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/cordless-vs-plug-in-wand-vibrator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'cordless wand vibrator', 'plug in vs rechargeable wand vibrator',
  'best cordless wand massager', 'best rechargeable wand massager'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-mini-wand-vibrator-travel', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'mini wand massager', 'best mini wand massager for travel'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-wand-massager-for-clitoral-stimulation', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best wand vibrator for clitoral stimulation', 'wand massager for couples',
  'wand vibrator for women', 'most powerful wand vibrator'
);

-- WAND 其余映射
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-wand-massager-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to clean a wand massager', 'how loud are wand massagers'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/cordless-vs-plug-in-wand-vibrator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best waterproof wand vibrator', 'best budget wand massager under 50',
  'wand vibrator vs bullet vibrator', 'most quiet wand vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-wand-vibrators-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'buy wand massager online'
);

-- ============================================================
-- BULLET → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-bullet-vibrators-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'bullet vibrator', 'best bullet vibrator', 'mini bullet vibrator', 'bullet vibrator for women',
  'best budget bullet vibrator under 30', 'bullet vibrator for clitoral stimulation',
  'mini vibrator for discreet use', 'buy bullet vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-remote-control-bullet-vibrator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'remote bullet vibrator', 'best remote control bullet vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/bullet-vs-egg-vibrator-comparison', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'bullet vibrator vs egg vibrator', 'egg vibrator', 'how to use a bullet vibrator',
  'bullet vibrator for beginners', 'how to clean a bullet vibrator',
  'bullet egg vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/most-discreet-bullet-vibrator-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'discreet bullet vibrator', 'best discreet bullet vibrator for travel',
  'best quiet bullet vibrator', 'bullet vibrator travel',
  'strongest mini bullet vibrator', 'best rechargeable bullet vibrator'
);

-- ============================================================
-- RABBIT → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-rabbit-vibrators-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'rabbit vibrator', 'best rabbit vibrator', 'dual stimulator vibrator',
  'best dual stimulation vibrator', 'rabbit vibrator for g spot and clit',
  'best quiet rabbit vibrator', 'best waterproof rabbit vibrator', 'best luxury rabbit vibrator',
  'best budget rabbit vibrator under 60', 'buy rabbit vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/rabbit-vibrator-for-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'what is a rabbit vibrator', 'how to use a rabbit vibrator',
  'best rabbit vibrator for beginners', 'how to clean a rabbit vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/thrusting-vs-rotating-rabbit-vibrator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'thrusting rabbit vibrator', 'rotating rabbit vibrator',
  'thrusting vs rotating rabbit vibrator', 'rabbit vs dual stimulator difference'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/rabbit-vs-g-spot-vibrator-comparison', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'rabbit vibrator vs g spot vibrator'
);

-- ============================================================
-- GSPOT → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-g-spot-vibrator-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best g spot vibrator', 'how to use a g spot vibrator', 'g spot vibrator for beginners',
  'what is a g spot vibrator', 'how does a g spot vibrator work',
  'best g spot vibrator for beginners', 'best internal vibrator for g spot',
  'best quiet g spot vibrator', 'best rechargeable g spot vibrator',
  'do g spot vibrators really work', 'g spot vibrator vs rabbit',
  'curved vibrator for g spot', 'best curved vibrator for g spot',
  'buy g spot vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-find-g-spot', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to find your g spot', 'why cant i find my g spot',
  'g spot stimulation techniques', 'g spot orgasm vs clitoral orgasm',
  'what does a g spot orgasm feel like', 'can anyone have a g spot orgasm'
);

-- ============================================================
-- CLIT → 现有博客 + 补充
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sonic-waves-vs-vibration', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'clitoral sucking vibrator', 'air pulse vibrator', 'how does a clitoral sucking vibrator work',
  'best clitoral sucking vibrator', 'best air pulse vibrator', 'clit stimulator vs vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sonic-waves-vs-vibration', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'rose vibrator', 'best rose vibrator', 'how to use a rose vibrator',
  'rose vibrator vs womanizer', 'buy rose vibrator',
  'clit sucking toy vs clit licking toy', 'tongue vibrator vs air pulse'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sonic-waves-vs-vibration', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'clit licking vibrator', 'best clit licking vibrator', 'best tongue vibrator',
  'what is an air pulse vibrator', 'best pinpoint clit vibrator',
  'best clit toy for squirting', 'best clitoral massager wand',
  'best clit stimulator for sensitive clitoris', 'best quiet clit vibrator',
  'best budget clit vibrator under 50', 'how to clean a clitoral vibrator',
  'how to use a clit vibrator', 'best clit vibrator for beginners',
  'buy clit vibrator online'
);

-- ============================================================
-- DILDO → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-realistic-dildos-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'realistic dildo', 'best realistic dildo', 'silicone dildo', 'best vibrating dildo',
  'best silicone dildo for beginners', 'best dual density realistic dildo',
  'best dildo for g spot stimulation', 'best dildo for strap on use',
  'best budget silicone dildo', 'what is dual density silicone dildo',
  'buy realistic dildo online', 'are realistic dildos body safe',
  'heated thrusting dildo', 'small vibrating dildo'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-choose-your-first-dildo', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to use a dildo for beginners', 'what size dildo should I get',
  'how to clean a silicone dildo', 'curved vs straight dildo'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/silicone-vs-glass-vs-metal-dildo', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'silicone dildo vs glass dildo', 'glass dildo vs silicone',
  'vibrating dildo vs regular dildo'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-suction-cup-dildo-hands-free-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'suction cup dildo', 'how to use a suction cup dildo',
  'best suction cup dildo for hands free'
);

-- ============================================================
-- MASTURBATOR → 现有博客 + 新建
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-male-masturbators-2026', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'male masturbator', 'pocket pussy', 'male stroker', 'best male masturbator',
  'most realistic pocket pussy', 'best discreet male masturbator',
  'best budget male stroker under 40', 'best hands free male masturbator',
  'best male masturbator for stamina training', 'best male masturbator easy to clean',
  'buy pocket pussy online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/death-grip-syndrome-desensitization-fix', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'male masturbator vs hand comparison', 'pocket pussy vs stroker'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-male-masturbator-for-beginners', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best pocket pussy for beginners', 'how to use a male masturbator',
  'vibrating male masturbator', 'best vibrating male stroker'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/automatic-vs-manual-male-masturbator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'automatic male masturbator vs manual', 'best automatic male masturbator',
  'how often should you replace male masturbator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-clean-male-masturbator', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to clean a male masturbator', 'how to dry a male masturbator after washing',
  'how to store a pocket pussy', 'what lube is best for male stroker'
);

-- ============================================================
-- COCKRING → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-cock-rings-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'cock ring', 'penis ring', 'vibrating cock ring', 'best cock ring for erectile dysfunction',
  'best cock ring for beginners', 'best silicone cock ring', 'best metal cock ring for stamina',
  'cock ring with clitoral stimulator', 'buy cock ring online', 'best adjustable penis ring'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-a-cock-ring-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'what is a cock ring', 'how to use a cock ring', 'how does a cock ring work',
  'are cock rings safe', 'how long can you wear a cock ring', 'cock ring size guide',
  'how to put on a cock ring', 'does cock ring help with erectile dysfunction'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/vibrating-cock-ring-for-couples-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best vibrating cock ring for couples'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/cock-ring-for-stamina-and-edging', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'cock ring for edging', 'do cock rings make you last longer'
);

-- ============================================================
-- PROSTATE → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/prostate-health-massage-benefits', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best prostate massager', 'prostate massager health benefits', 'how does prostate stimulation feel',
  'is prostate massage safe', 'prostate orgasm vs penile orgasm',
  'best prostate vibrator', 'how to achieve prostate orgasm',
  'can prostate massage help with prostatitis', 'buy prostate massager online',
  'vibrating prostate wand'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-exploring-male-p-spot', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'what is a prostate massager', 'how to use a prostate massager', 'how to find your p spot',
  'how to clean prostate massager', 'prostate massager for beginners',
  'best prostate massager for beginners', 'best hands free prostate massager',
  'best remote prostate massager', 'best curved prostate massager for p spot',
  'best silicone prostate massager'
);

-- ============================================================
-- ANAL → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-to-sensory-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'butt plug', 'anal beads', 'what is a butt plug used for', 'how to use anal beads step by step',
  'how to use a butt plug for beginners', 'anal training guide for beginners',
  'how to prepare for anal play', 'what size butt plug should I start with',
  'anal beads how to insert and remove', 'how to achieve anal orgasm',
  'best butt plug for beginners', 'best anal training kit for beginners',
  'how long can you wear a butt plug', 'butt plug benefits during sex',
  'best anal toys for couples play',
  'buy butt plug online', 'anal trainer kit graduated sizes',
  'anal masturbator', 'how to use anal vibrator', 'best anal vibrator', 'vibrating anal beads'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/temperature-play-glass-metal-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'glass butt plug vs silicone safety', 'best glass butt plug', 'best silicone anal beads',
  'vibrating butt plug', 'best vibrating butt plug for men',
  'best remote control butt plug', 'how to clean anal toys properly'
);

-- ============================================================
-- COUPLES → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/couples-play-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'couples vibrator', 'best couples vibrator', 'how to use a couples vibrator',
  'how to introduce sex toys with partner', 'best positions with couples vibrator',
  'best vibrator for couples to use together', 'best couples sex toy for intercourse',
  'couples sex toy for beginners', 'buy couples vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/digital-intimacy-app-controlled-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'remote vibrator for couples', 'best app controlled vibrator for long distance',
  'best remote vibrator for couples', 'best bluetooth vibrator',
  'long distance vibrator how to use', 'app controlled love egg vibrator',
  'remote control vibrator app enabled', 'best wearable vibrator for public wear',
  'wearable vibrator for public play', 'vibrating panty for couples',
  'partner controlled vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/date-night-ideas-staying-in', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'vibrator for couples to use together', 'couples sex toy for beginners'
);

-- ============================================================
-- DISCREET → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/quietest-vibrators-sound-engineering', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'discreet vibrator', 'quiet vibrator', 'silent vibrator', 'quietest vibrator noise comparison',
  'how quiet are silent vibrators', 'quietest vibrator on the market', 'best quiet bullet vibrator',
  'best quiet wand vibrator', 'vibrator noise level decibels', 'whisper quiet vibrator travel size',
  'best silent vibrator for dorm room', 'buy discreet vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/art-of-discreet-pleasure', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'what is a discreet vibrator', 'vibrator that looks like everyday object',
  'best vibrator that looks like everyday object', 'how to use vibrator discreetly',
  'discreet clitoral vibrator small', 'best small discreet vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/discreet-storage-solutions-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to store sex toys discreetly', 'discreet sex toy packaging'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/packing-for-pleasure', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to travel with vibrator TSA rules', 'travel vibrator size guide',
  'best discreet vibrator for travel'
);

-- ============================================================
-- LUBE → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/guide-to-luxury-lubrication', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best lube', 'water based lube', 'silicone lube', 'water based lube vs silicone lube',
  'what is the best type of lube', 'how to use lube properly',
  'is silicone lube safe for silicone toys', 'does lube expire',
  'best water based lube', 'best silicone lube', 'best organic lubricant',
  'best lube for sensitive skin', 'best warming lubricant for couples',
  'best long lasting lube', 'best ph balanced lube for women',
  'best natural lubricant without glycerin',
  'best anal lube for beginners', 'what ingredients to avoid in lube',
  'is coconut oil safe as lube', 'why use lube for sex', 'buy water based lube online'
);

-- ============================================================
-- CLEANER → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/ultimate-toy-care-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to clean sex toys', 'best sex toy cleaner', 'can you use soap on silicone toys',
  'how often should you clean sex toys', 'how to disinfect sex toys',
  'can you boil silicone sex toys', 'is rubbing alcohol safe for sex toys',
  'how to sanitize sex toys between partners', 'do you need special sex toy cleaner',
  'how to clean porous vs non porous toys',
  'best antibacterial toy spray', 'best sex toy cleaning wipes travel',
  'best foam toy cleaner', 'best unscented sex toy cleaner',
  'sex toy cleaner vs mild soap', 'how to store sex toys after cleaning',
  'buy sex toy cleaner online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/ultimate-cleaning-routine', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best uv sex toy sanitizer'
);

-- ============================================================
-- BODYSAFE → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/body-safe-materials-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'body safe sex toys', 'what are body safe sex toys', 'what does phthalate free mean',
  'how to tell if a sex toy is real silicone', 'are cheap sex toys safe',
  'porous vs non porous sex toy materials', 'what is hypoallergenic sex toy',
  'what materials are body safe for sex toys', 'is jelly sex toy safe',
  'are tpe and tpr sex toys body safe', 'what is the safest sex toy material',
  'how to test if sex toy is silicone', 'best body safe sex toys 2026',
  'best phthalate free sex toys', 'best non toxic sex toy brands',
  'best body safe silicone vibrator', 'buy body safe silicone vibrator'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/material-matters-silicone-vs-glass', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'silicone vs plastic sex toys which is safer', 'what is medical grade silicone for toys',
  'medical grade silicone vibrator', 'why is silicone the best sex toy material',
  'best medical grade silicone vibrator', 'best hypoallergenic vibrator for sensitive skin'
);

-- ============================================================
-- BEGINNER → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-beginner-vibrators-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best vibrator for beginners', 'first sex toy', 'beginner sex toy',
  'how to choose your first vibrator', 'beginner sex toy guide for women',
  'what kind of vibrator should i get first', 'how to use a vibrator for the first time',
  'what to look for in a first vibrator', 'what size vibrator for first time',
  'are vibrators safe for beginners', 'clitoral or internal vibrator first',
  'easy to use vibrator for first time', 'how to overcome fear of using vibrator',
  'best first vibrator for women', 'best small vibrator for beginners',
  'best quiet vibrator for first time', 'best cheap vibrator for beginners',
  'best bullet vibrator for first time', 'best wand vibrator for beginners',
  'best starter sex toy kit',
  'buy beginner vibrator online', 'starter sex toy kit for sale'
);

-- ============================================================
-- PELVIC → 新建博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/kegel-exercises-for-women-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'kegel exercises for women', 'how to do kegel exercises correctly',
  'benefits of kegel exercises', 'how to find your pelvic floor muscles',
  'pelvic floor exercises after childbirth', 'how to strengthen pelvic floor at home',
  'how often should you do kegel exercises', 'signs of weak pelvic floor in women',
  'how long does it take to see kegel results', 'can kegel exercises improve sex life',
  'how to use kegel weights properly', 'what is biofeedback pelvic floor therapy',
  'what does a pelvic floor trainer do', 'how does a smart kegel device work',
  'kegel exercises for beginners mistakes to avoid'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-pelvic-floor-trainer-devices', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'pelvic floor trainer', 'best kegel exerciser for women', 'best pelvic floor trainer device',
  'best smart kegel device', 'best kegel weights for beginners',
  'best app controlled kegel trainer', 'best biofeedback pelvic floor device',
  'best kegel device for postpartum',
  'buy kegel exerciser online', 'buy pelvic floor exerciser with app'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-smart-kegel-trainer', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to know if you are doing kegels correctly'
);

-- ============================================================
-- LIBIDO → 现有博客
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/stress-and-libido-connection', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to increase female libido', 'low sex drive in women', 'what causes low sex drive in women',
  'how to get your sex drive back after pregnancy', 'stress and libido connection in women',
  'what foods increase female libido', 'best supplements for female libido',
  'how to increase sex drive after 40', 'hormonal causes of low libido in women',
  'can birth control affect libido', 'how does antidepressants affect female libido',
  'libido after pregnancy how long to recover', 'how to increase libido during menopause',
  'can exercise increase female sex drive', 'psychological causes of low libido',
  'how to talk to partner about low libido', 'best natural libido boosters for women',
  'best libido supplement for menopause', 'best arousal gel for women',
  'natural libido boosters that actually work', 'buy female libido booster online'
);

-- ============================================================
-- ORGASM → 现有博客 + 新建
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/health-benefits-of-solo-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to have an orgasm', 'how to orgasm', 'can all women have orgasms',
  'female orgasm tips for women', 'how to tell if youve had an orgasm',
  'what does a female orgasm feel like'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-achieve-female-orgasm-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to have an orgasm for the first time', 'why cant i orgasm during sex',
  'how to orgasm during intercourse', 'how to orgasm with a partner',
  'what is anorgasmia', 'how to orgasm from clitoral stimulation'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-toys-to-help-women-orgasm', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best toy to help women orgasm', 'best vibrator for achieving orgasm',
  'best sex toy for women who cant orgasm', 'best toy for squirting',
  'best toy for multiple orgasms', 'best toy for clitoral orgasm',
  'most powerful vibrator for orgasm', 'buy female orgasm toy online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/g-spot-orgasm-techniques-and-toys', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'clitoral orgasm vs vaginal orgasm', 'how to achieve multiple orgasms',
  'what is squirting and how does it happen', 'how to squirt for beginners',
  'g spot orgasm guide', 'how to have a vaginal orgasm',
  'best positions to help women orgasm', 'how long does it take the average woman to orgasm'
);

-- ============================================================
-- NIPPLE → 现有博客 + 新建
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-to-sensory-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'nipple vibrator', 'what is a nipple suction toy', 'nipple play for beginners guide',
  'can women have a nipple orgasm', 'how to achieve nipple orgasm',
  'best nipple clamps for beginners', 'how to use nipple clamps for beginners',
  'are nipple toys safe', 'how to clean nipple toys'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-nipple-toys-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to use a nipple vibrator', 'best vibrating nipple clamps',
  'best nipple stimulator for women', 'best remote nipple vibrator',
  'best nipple sucker toy', 'best silicone nipple suckers',
  'buy nipple vibrator online'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-nipple-toys-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'nipple sensitivity how to increase', 'can men use nipple vibrators'
);

-- ============================================================
-- EDUCATION → 现有博客 + 新建
-- ============================================================
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-beginner-vibrators-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to choose the right sex toy', 'what to know before buying first sex toy',
  'sex toy buying guide first timer', 'what to know before buying first sex toy'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sex-toy-buying-guide-first-timer', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to use a vibrator', 'how to use a sex toy', 'sex toy safety tips',
  'benefits of using sex toys', 'can sex toys help with orgasm',
  'solo play benefits for women'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-talk-about-sex-toys-with-partner', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to introduce sex toys in relationship', 'how to talk about sex toys with partner',
  'how to talk to partner about sex toys'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sex-toy-buying-guide-first-timer', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'sex toys for long distance relationships', 'sex toy myths debunked'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/digital-intimacy-app-controlled-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'sex toys for long distance relationships'
);


-- ============================================================
-- 补充映射: 遗漏大词 → 现有博客
-- ============================================================

-- GSPOT: 大词 → how-to-use-g-spot-vibrator-beginners-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-g-spot-vibrator-beginners-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'g spot vibrator', 'g spot toy', 'g spot toys for women'
);

-- CLIT: 大词 → sonic-waves-vs-vibration
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sonic-waves-vs-vibration', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'clit vibrator', 'clitoral vibrator', 'clit toy'
);

-- DILDO: 大词 → best-realistic-dildos-complete-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-realistic-dildos-complete-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'dildo', 'best dildo', 'strap on dildo'
);

-- PROSTATE: 大词 → prostate-health-massage-benefits
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/prostate-health-massage-benefits', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'prostate massager', 'prostate toy', 'prostate vibrator'
);

-- ANAL: 大词 → beginners-guide-to-sensory-play
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-to-sensory-play', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'anal toys', 'anal toy', 'anal sex toys for beginners', 'anal plug'
);

-- LUBE: 大词 → guide-to-luxury-lubrication
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/guide-to-luxury-lubrication', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'personal lubricant', 'lube', 'lubricant'
);

-- CLEANER: 大词 → ultimate-toy-care-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/ultimate-toy-care-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'sex toy cleaner', 'toy cleaner'
);

-- EDUCATION: 通用大词 → best-beginner-vibrators-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-beginner-vibrators-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'vibrator', 'sex toy', 'adult toys', 'adult toy',
  'sex toys for women', 'sex toys for men', 'best sex toys'
);

-- COUPLES: 大词 → couples-play-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/couples-play-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'sex toys for couples', 'couples sex toys', 'couples toy'
);

-- BEGINNER: 大词 → best-beginner-vibrators-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-beginner-vibrators-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'sex toys for beginners', 'beginner sex toys'
);

-- PREMATURE: 补充 → 现有博客
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/stamina-training-edging-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'how to delay ejaculation'
);

INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/science-of-stamina-training-for-men', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'best delay spray for men', 'climax control condoms', 'what is a delay ring'
);

-- ============================================================
-- 新博客映射: Semrush 发现的 4 个新方向
-- ============================================================

-- vibrating-panties-wearable-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/vibrating-panties-wearable-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'vibrating panties', 'vibrating panty', 'panty vibrator',
  'remote control panty vibrator', 'wearable panty vibrator',
  'app controlled panty vibrator', 'best vibrating panties',
  'how to use vibrating panties', 'discreet wearable vibrator for public'
);

-- tail-butt-plugs-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/tail-butt-plugs-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'tail butt plug', 'butt plug tail', 'cat tail butt plug',
  'fox tail butt plug', 'anal tail plug', 'how to use tail butt plug',
  'best tail butt plug', 'tail plug for beginners'
);

-- finger-vibrators-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/finger-vibrators-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'finger vibrator', 'finger vibrator for couples', 'best finger vibrator',
  'wearable finger vibrator', 'finger sleeve vibrator',
  'how to use a finger vibrator', 'finger vibrator vs bullet',
  'best finger vibrator for foreplay'
);

-- inflatable-butt-plugs-guide
INSERT IGNORE INTO wholesale.keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/inflatable-butt-plugs-guide', 2
FROM wholesale.seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN (
  'inflatable butt plug', 'inflatable anal plug', 'expanding butt plug',
  'how to use inflatable butt plug', 'best inflatable butt plug',
  'inflatable butt plug for beginners', 'inflatable vs regular butt plug',
  'are inflatable butt plugs safe'
);
