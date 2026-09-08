/* ============================================================
 * 评茶员考核系统 - 题库数据（修正版）
 * 严格依据 GB/T 23776-2018《茶叶感官审评方法》
 * 修正项：茶水比、盖碗嗅香、审评碗容量、回旋筛转法、
 *        器具精度、叶底盘规格、品茗杯定位、乌龙茶分类、
 *        标准审评顺序、第二泡为主、外形审评茶样量
 * ============================================================ */

var TEA_LIB = {
  tgy: {
    name: '安溪铁观音',
    cat: '乌龙茶',
    type: '颗粒型',
    stdType: '圆结型/颗粒型',
    icon: '🍵',
    methods: ['cup', 'gaiwan'],
    cupTime: '6分钟',
    desc: '颗粒型乌龙茶，标准分类属圆结型'
  },
  dhp: {
    name: '武夷大红袍',
    cat: '乌龙茶',
    type: '条型',
    stdType: '条型/卷曲型',
    icon: '🍂',
    methods: ['cup', 'gaiwan'],
    cupTime: '5分钟',
    desc: '岩茶，条型乌龙茶'
  },
  dianhong: {
    name: '滇红工夫',
    cat: '红茶',
    type: '条型',
    stdType: '条型',
    icon: '🫖',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '工夫红茶代表产品之一'
  },
  longjing: {
    name: '西湖龙井',
    cat: '绿茶',
    type: '扁形',
    stdType: '扁形',
    icon: '🌿',
    methods: ['cup'],
    cupTime: '4分钟',
    desc: '扁形炒青绿茶'
  },
  baimudan: {
    name: '白牡丹',
    cat: '白茶',
    type: '芽叶型',
    stdType: '芽叶型',
    icon: '❄️',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '芽叶连枝白茶'
  },
  biluochun: {
    name: '碧螺春',
    cat: '绿茶',
    type: '卷曲型',
    stdType: '卷曲型',
    icon: '🍃',
    methods: ['cup'],
    cupTime: '4分钟',
    desc: '卷曲形炒青绿茶'
  },
  fenghuangdancong: {
    name: '凤凰单丛',
    cat: '乌龙茶',
    type: '条型',
    stdType: '条型/卷曲型',
    icon: '🌿',
    methods: ['cup', 'gaiwan'],
    cupTime: '5分钟',
    desc: '条型乌龙茶，高香型'
  },
  gongfuhongcha: {
    name: '工夫红茶',
    cat: '红茶',
    type: '条型',
    stdType: '条型',
    icon: '🫖',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '条型工夫红茶，滇红为其代表品类'
  },
  zhengshanxiaozhong: {
    name: '正山小种',
    cat: '红茶',
    type: '条型',
    stdType: '条型',
    icon: '🔴',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '世界红茶鼻祖，松烟香'
  }
};

/* 器具库：cup/gaiwan 标记在该方法下是否为正确器具
 * 描述依据 GB/T 23776-2018 第4.2条审评设备 */
var TOOL_LIB = [
  { id: 'tp',  name: '审评盘', icon: '◻',  cup: true,  gaiwan: true,  desc: '白色正方形230mm，取100~200g茶样回旋筛转干看外形' },
  { id: 'sb',  name: '审评杯', icon: '◯',  cup: true,  gaiwan: false, desc: '精制茶用150mL柱形杯，带盖有锯齿形滤茶口' },
  { id: 'sw',  name: '审评碗', icon: '◡',  cup: true,  gaiwan: true,  desc: '白瓷碗，柱形杯法240mL/盖碗法160mL，看汤色盛茶汤' },
  { id: 'yd',  name: '叶底盘', icon: '▢',  cup: true,  gaiwan: true,  desc: '精制茶用黑色100mm正方形盘，评叶底用' },
  { id: 'js',  name: '计时器', icon: '⏱',  cup: true,  gaiwan: true,  desc: '精确到秒，控制冲泡时间' },
  { id: 'wd',  name: '温度计', icon: '🌡',  cup: false, gaiwan: false, desc: '标准统一沸水冲泡，无需测温' },
  { id: 'ds',  name: '电水壶', icon: '♨',  cup: true,  gaiwan: true,  desc: '食品级不锈钢，提供沸水' },
  { id: 'dz',  name: '电子秤/天平', icon: '⚖',  cup: true,  gaiwan: true,  desc: '感量0.1g，精确称取茶样' },
  { id: 'pm',  name: '品茗杯', icon: '☕',  cup: true,  gaiwan: true,  desc: '滋味评审分茶品饮用（辅助器具，非标准强制）' },
  { id: 'gw',  name: '盖碗',   icon: '🍶',  cup: false, gaiwan: true,  desc: '乌龙茶用110mL倒钟形盖碗，带盖' },
  { id: 'cc',  name: '茶宠',   icon: '🐉',  cup: false, gaiwan: false, desc: '茶艺摆件，无审评功能' },
  { id: 'gd',  name: '公道杯', icon: '⚗',  cup: false, gaiwan: false, desc: '日常泡茶用，审评直接沥入审评碗' },
  { id: 'cl',  name: '茶滤',   icon: '▦',  cup: false, gaiwan: false, desc: '审评杯/盖碗自带滤孔滤缝，无需额外过滤' }
];

/* 根据茶类和方法动态生成操作规范题目
 * 依据 GB/T 23776-2018 第5.3.2条茶汤制备方法 */
function genNormQuestions(teaKey, method) {
  var tea = TEA_LIB[teaKey];
  var vessel = method === 'cup' ? '150mL审评杯+240mL审评碗' : '110mL盖碗+160mL审评碗';
  var dosage = method === 'cup' ? '3.0g（茶水比1:50）' : '5.0g';

  var A = [];
  if (method === 'cup') {
    A = [
      { id: 'a1', text: '审评方法：柱形杯法（' + vessel + '）', correct: true,  desc: 'GB/T 23776第5.3.2.1条，与所选器具匹配' },
      { id: 'a2', text: '投茶量：' + dosage,                          correct: true,  desc: '150mL杯按茶水比1:50对应3.0g' },
      { id: 'a3', text: '沸水冲泡',                                    correct: true,  desc: '审评统一要求沸水，无需测温' },
      { id: 'a4', text: '冲泡时间：' + tea.cupTime + '，单次冲泡',     correct: true,  desc: tea.stdType + '标准浸泡时间' },
      { id: 'a5', text: '审评方法：盖碗法（110mL盖碗）',              correct: false, desc: '与所选柱形杯器具不匹配' },
      { id: 'a6', text: '投茶量：5g',                                  correct: false, desc: '5g为盖碗法投茶量' },
      { id: 'a7', text: '冲泡时间：3分钟',                             correct: false, desc: '时间偏短，内含物质浸出不足' },
      { id: 'a8', text: '水温：85℃冲泡',                               correct: false, desc: '需沸水，85℃温度不够' }
    ];
  } else {
    A = [
      { id: 'a1', text: '审评方法：盖碗法（' + vessel + '）',          correct: true,  desc: 'GB/T 23776第5.3.2.2条，与所选器具匹配' },
      { id: 'a2', text: '投茶量：' + dosage,                          correct: true,  desc: '盖碗法标准投茶量' },
      { id: 'a3', text: '沸水冲泡（先烫热杯碗）',                      correct: true,  desc: '冲泡前沸水烫热杯碗，再注满沸水' },
      { id: 'a4', text: '冲泡3次，沥汤2min→3min→5min，以第二泡为主',  correct: true,  desc: '每泡出汤前嗅盖香，结果以第二泡为主要依据' },
      { id: 'a5', text: '审评方法：柱形杯法（150mL审评杯）',          correct: false, desc: '与所选盖碗器具不匹配' },
      { id: 'a6', text: '投茶量：3g',                                  correct: false, desc: '3g为柱形杯法投茶量' },
      { id: 'a7', text: '只冲泡1次',                                   correct: false, desc: '盖碗法需冲泡3次综合评判' },
      { id: 'a8', text: '水温：85℃冲泡',                               correct: false, desc: '需沸水，85℃温度不够' }
    ];
  }

  var B = [
    { id: 'b1', text: '回旋筛转法把盘',                                          correct: true,  desc: '双手握盘对角回旋筛转，茶样分层干看外形（5.3.1.1）' },
    { id: 'b2', text: method === 'cup' ? '杯盖留缝等速滤出茶汤' : '盖碗盖倾斜留小口出汤', correct: true, desc: '标准出汤动作，茶汤等速沥入审评碗' },
    { id: 'b3', text: '茶汤沥尽不残留',                                          correct: true,  desc: '等速沥尽，留叶底于杯中，避免余汤影响浓度' },
    { id: 'b4', text: '用手直接抓取茶样',                                        correct: false, desc: '应用茶匙取茶、天平称量，避免手温汗渍污染' },
    { id: 'b5', text: '出汤留底约1/3',                                           correct: false, desc: '留底导致余汤继续浸泡，浓度失真' },
    { id: 'b6', text: '冲泡时不计时',                                            correct: false, desc: '计时器精确到秒，必须严格计时到点出汤' }
  ];

  var C = [
    { id: 'c1', text: '按汤色→香气→滋味→叶底顺序审评',                          correct: true,  desc: 'GB/T 23776规定的标准内质审评顺序' },
    { id: 'c2', text: '热嗅',                                                      correct: true,  desc: '出汤后趁热嗅杯盖/碗盖香气' },
    { id: 'c3', text: '温嗅',                                                      correct: true,  desc: '降温后嗅杯底/碗底香气，辨别香型' },
    { id: 'c4', text: '冷嗅',                                                      correct: true,  desc: '完全冷却后嗅香气，评价香气持久性' },
    { id: 'c5', text: '叶底倒入叶底盘展开查看',                                  correct: true,  desc: '加清水展开，观察嫩度匀度色泽' },
    { id: 'c6', text: '用审评杯/盖碗直接喝茶',                                   correct: false, desc: '茶汤应沥入审评碗或分入品茗杯后品饮' },
    { id: 'c7', text: '只嗅一次香气',                                            correct: false, desc: '需热嗅+温嗅+冷嗅，全面评价香气' },
    { id: 'c8', text: '叶底留在杯中不查看',                                      correct: false, desc: '叶底是五因子之一，必须倒出查看不得省略' }
  ];

  return { A: A, B: B, C: C };
}

/* 根据茶类和方法动态生成流程排序步骤
 * 依据 GB/T 23776-2018 第5.3条审评方法
 * 标准顺序：外形→汤色→香气→滋味→叶底 */
function genSteps(teaKey, method) {
  var tea = TEA_LIB[teaKey];
  if (method === 'cup') {
    return [
      { id: 's1', name: '回旋筛转法把盘', desc: '取100~200g茶样置评茶盘，回旋筛转分层，干看外形' },
      { id: 's2', name: '称取茶样',       desc: '感量0.1g天平称取3.0g（茶水比1:50）入150mL审评杯' },
      { id: 's3', name: '沸水冲泡',       desc: '注满沸水加盖，计时器精确到秒开始计时' },
      { id: 's4', name: '定时出汤',       desc: '冲泡' + tea.cupTime + '后杯盖留缝，等速滤入240mL审评碗' },
      { id: 's5', name: '看汤色',         desc: '审评碗中观察茶汤颜色、明暗度、清浊度' },
      { id: 's6', name: '嗅香气',         desc: '热嗅、温嗅、冷嗅，辨别香型和持久性' },
      { id: 's7', name: '尝滋味',         desc: '茶汤分入品茗杯或用审评碗品饮，感受浓强度协调性' },
      { id: 's8', name: '评叶底',         desc: '茶渣倒入黑色叶底盘，加清水展开观察嫩度匀度色泽' }
    ];
  } else {
    return [
      { id: 's1', name: '回旋筛转法把盘', desc: '取100~200g茶样置评茶盘，回旋筛转分层，干看外形' },
      { id: 's2', name: '称取茶样',       desc: '感量0.1g天平称取5.0g入110mL倒钟形盖碗' },
      { id: 's3', name: '第一泡冲泡',     desc: '沸水烫热杯碗后注满沸水，1min揭盖嗅盖香' },
      { id: 's4', name: '第一泡出汤',     desc: '2min后盖碗倾斜留小口出汤至160mL审评碗，看汤色尝滋味' },
      { id: 's5', name: '第二泡冲泡',     desc: '再次注满沸水，1~2min揭盖嗅盖香' },
      { id: 's6', name: '第二泡出汤',     desc: '3min后出汤，看汤色尝滋味（第二泡为主要评判依据）' },
      { id: 's7', name: '第三泡冲泡',     desc: '第三次注满沸水，2~3min嗅香' },
      { id: 's8', name: '第三泡出汤',     desc: '5min后出汤，看汤色尝滋味' },
      { id: 's9', name: '评叶底',         desc: '闻嗅叶底香，茶渣倒入叶底盘展开观察嫩度匀度色泽' }
    ];
  }
}
