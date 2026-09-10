#!/usr/bin/env bash
cd "d:/work/Git/Gitee/colin/myth-web" || exit 1
git add -A
git commit \
  -m "feat: 物理测量规格（长/宽/直径/周长等）价格下方显眼展示" \
  -m "价格下方新增测量规格胶囊（标尺图标+名称+值）；尺寸行与测量行从 Technical Specifications 表剔除避免重复。中英文规格键均识别（length/width/diameter/circumference/长/宽/直径/周长等）。" \
  -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
git push origin master
git push github master
