/* ============================================================
 * 评茶员考核系统 - 题库数据
 * 依据 GB/T 23776-2018《茶叶感官审评方法》
 * ============================================================ */

var TEA_LIB = {
  tgy: {
    name: '安溪铁观音',
    cat: '乌龙茶',
    type: '颗粒型',
    icon: '🍵',
    methods: ['cup', 'gaiwan'],
    cupTime: '6分钟',
    desc: '浓香型，颗粒型乌龙茶'
  },
  dhp: {
    name: '武夷大红袍',
    cat: '乌龙茶',
    type: '条形',
    icon: '🍂',
    methods: ['cup', 'gaiwan'],
    cupTime: '5分钟',
    desc: '岩茶，条形乌龙茶'
  },
  dianhong: {
    name: '滇红工夫',
    cat: '红茶',
    type: '条形',
    icon: '🫖',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '工夫红茶'
  },
  longjing: {
    name: '西湖龙井',
    cat: '绿茶',
    type: '扁形',
    icon: '🌿',
    methods: ['cup'],
    cupTime: '4分钟',
    desc: '扁形炒青绿茶'
  },
  baimudan: {
    name: '白牡丹',
    cat: '白茶',
    type: '芽叶型',
    icon: '❄️',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '芽叶连枝白茶'
  },
  biluochun: {
    name: '碧螺春',
    cat: '绿茶',
    type: '卷曲型',
    icon: '🍃',
    methods: ['cup'],
    cupTime: '4分钟',
    desc: '卷曲形炒青绿茶'
  },
  fenghuangdancong: {
    name: '凤凰单丛',
    cat: '乌龙茶',
    type: '条形',
    icon: '🌿',
    methods: ['cup', 'gaiwan'],
    cupTime: '5分钟',
    desc: '条形乌龙茶，高香型'
  },
  gongfuhongcha: {
    name: '工夫红茶',
    cat: '红茶',
    type: '条形',
    icon: '🫖',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '条形工夫红茶'
  },
  zhengshanxiaozhong: {
    name: '正山小种',
    cat: '红茶',
    type: '条形',
    icon: '🔴',
    methods: ['cup'],
    cupTime: '5分钟',
    desc: '世界红茶鼻祖，松烟香'
  }
};

/* 器具库：cup/gaiwan 标记在该方法下是否为正确器具 */
var TOOL_LIB = [
  { id: 'tp',  name: '审评盘', icon: '◻',  cup: true,  gaiwan: true,  desc: '盛放茶样，把盘干看外形' },
  { id: 'sb',  name: '审评杯', icon: '◯',  cup: true,  gaiwan: false, desc: '柱形杯150mL，带盖，冲泡用' },
  { id: 'sw',  name: '审评碗', icon: '◡',  cup: true,  gaiwan: true,  desc: '白瓷碗，看汤色与盛茶汤' },
  { id: 'yd',  name: '叶底盘', icon: '▢',  cup: true,  gaiwan: true,  desc: '黑/白色盘，评叶底用' },
  { id: 'js',  name: '计时器', icon: '⏱',  cup: true,  gaiwan: true,  desc: '控制冲泡时间' },
  { id: 'wd',  name: '温度计', icon: '🌡',  cup: false, gaiwan: false, desc: '沸水冲泡无需测温' },
  { id: 'ds',  name: '电水壶', icon: '♨',  cup: true,  gaiwan: true,  desc: '提供沸水冲泡用水' },
  { id: 'dz',  name: '电子秤', icon: '⚖',  cup: true,  gaiwan: true,  desc: '称取茶样' },
  { id: 'pm',  name: '品茗杯', icon: '☕',  cup: true,  gaiwan: true,  desc: '滋味评审时品饮茶汤' },
  { id: 'gw',  name: '盖碗',   icon: '🍶',  cup: false, gaiwan: true,  desc: '110mL盖碗，冲泡用' },
  { id: 'cc',  name: '茶宠',   icon: '🐉',  cup: false, gaiwan: false, desc: '茶艺摆件' },
  { id: 'gd',  name: '公道杯', icon: '⚗',  cup: false, gaiwan: false, desc: '非标准审评器具' },
  { id: 'cl',  name: '茶滤',   icon: '▦',  cup: false, gaiwan: false, desc: '审评杯/盖碗自带滤孔' }
];

/* 根据茶类和方法动态生成操作规范题目 */
function genNormQuestions(teaKey, method) {
  var tea = TEA_LIB[teaKey];
  var vessel = method === 'cup' ? '150mL审评杯' : '110mL盖碗';
  var dosage = method === 'cup' ? '3g' : '5g';

  var A = [];
  if (method === 'cup') {
    A = [
      { id: 'a1', text: '审评方法：柱形杯法（' + vessel + '）', correct: true,  desc: '与所选器具匹配，GB/T 23776方法一' },
      { id: 'a2', text: '投茶量：' + dosage,                          correct: true,  desc: '柱形杯法标准投茶量' },
      { id: 'a3', text: '沸水冲泡',                                    correct: true,  desc: '审评统一要求沸水' },
      { id: 'a4', text: '冲泡时间：' + tea.cupTime,                    correct: true,  desc: tea.type + '标准浸泡时间' },
      { id: 'a5', text: '审评方法：盖碗法（110mL盖碗）',              correct: false, desc: '与所选器具不匹配' },
      { id: 'a6', text: '投茶量：5g',                                  correct: false, desc: '5g为盖碗法投茶量' },
      { id: 'a7', text: '冲泡时间：3分钟',                             correct: false, desc: '时间偏短' },
      { id: 'a8', text: '水温：85℃冲泡',                               correct: false, desc: '需沸水' }
    ];
  } else {
    A = [
      { id: 'a1', text: '审评方法：盖碗法（110mL盖碗）',              correct: true,  desc: '与所选器具匹配，GB/T 23776方法二' },
      { id: 'a2', text: '投茶量：5g',                                  correct: true,  desc: '盖碗法标准投茶量' },
      { id: 'a3', text: '沸水冲泡',                                    correct: true,  desc: '审评统一要求沸水' },
      { id: 'a4', text: '冲泡3次：2min→3min→5min出汤',                correct: true,  desc: '盖碗法标准三泡时间' },
      { id: 'a5', text: '审评方法：柱形杯法（150mL审评杯）',          correct: false, desc: '与所选盖碗不匹配' },
      { id: 'a6', text: '投茶量：3g',                                  correct: false, desc: '3g为柱形杯法投茶量' },
      { id: 'a7', text: '只冲泡1次',                                   correct: false, desc: '盖碗法需冲泡3次' },
      { id: 'a8', text: '水温：85℃冲泡',                               correct: false, desc: '需沸水' }
    ];
  }

  var B = [
    { id: 'b1', text: '把盘',                                          correct: true,  desc: '双手握审评盘旋转，茶样分层干看外形' },
    { id: 'b2', text: method === 'cup' ? '杯盖留缝出汤' : '盖碗盖倾斜5°留小口出汤', correct: true, desc: '标准出汤动作' },
    { id: 'b3', text: '茶汤沥尽不残留',                                correct: true,  desc: '避免余汤影响浓度' },
    { id: 'b4', text: '称取干茶茶样',                                  correct: false, desc: '应用茶匙取茶，避免手温污染' },
    { id: 'b5', text: '出汤留底约1/3',                                 correct: false, desc: '留底导致浓度失真' },
    { id: 'b6', text: '冲泡时不计时',                                  correct: false, desc: '必须严格计时' }
  ];

  var C = [
    { id: 'c1', text: '热嗅杯盖/碗盖香',                              correct: true,  desc: '出汤后趁热嗅香气' },
    { id: 'c2', text: '温嗅杯底/碗底香',                              correct: true,  desc: '降温后再嗅辨别香型' },
    { id: 'c3', text: '叶底倒入叶底盘展开',                            correct: true,  desc: '观察嫩度匀度色泽' },
    { id: 'c4', text: '用审评杯/盖碗直接喝茶',                         correct: false, desc: '应倒入品茗杯品饮' },
    { id: 'c5', text: '只嗅一次香气',                                  correct: false, desc: '需热嗅+温嗅' },
    { id: 'c6', text: '叶底留在杯中不查看',                            correct: false, desc: '必须倒出评叶底' }
  ];

  return { A: A, B: B, C: C };
}

/* 根据茶类和方法动态生成流程排序步骤 */
function genSteps(teaKey, method) {
  var tea = TEA_LIB[teaKey];
  if (method === 'cup') {
    return [
      { id: 's1', name: '把盘',       desc: '审评盘中旋转茶样，干看外形' },
      { id: 's2', name: '称取茶样',   desc: '电子秤称取3g入150mL审评杯' },
      { id: 's3', name: '沸水冲泡',   desc: '注入沸水至杯满，启动计时器' },
      { id: 's4', name: '定时出汤',   desc: '冲泡' + tea.cupTime + '后茶汤滤入审评碗' },
      { id: 's5', name: '看汤色',     desc: '审评碗中观察茶汤颜色亮度' },
      { id: 's6', name: '嗅香气',     desc: '热嗅杯盖香，温嗅杯底香' },
      { id: 's7', name: '尝滋味',     desc: '品饮茶汤感受浓强度协调性' },
      { id: 's8', name: '评叶底',     desc: '茶渣倒入叶底盘观察嫩度匀度' }
    ];
  } else {
    return [
      { id: 's1', name: '把盘',         desc: '审评盘中旋转茶样，干看外形' },
      { id: 's2', name: '称取茶样',     desc: '电子秤称取5g入110mL盖碗' },
      { id: 's3', name: '第一泡冲泡',   desc: '沸水冲泡，计时2分钟' },
      { id: 's4', name: '第一泡出汤',   desc: '2分钟后出汤，看汤色嗅香尝味' },
      { id: 's5', name: '第二泡冲泡',   desc: '沸水冲泡，计时3分钟' },
      { id: 's6', name: '第二泡出汤',   desc: '3分钟后出汤，看汤色嗅香尝味' },
      { id: 's7', name: '第三泡冲泡',   desc: '沸水冲泡，计时5分钟' },
      { id: 's8', name: '第三泡出汤',   desc: '5分钟后出汤，看汤色嗅香尝味' },
      { id: 's9', name: '评叶底',       desc: '茶渣倒入叶底盘观察嫩度匀度' }
    ];
  }
}
