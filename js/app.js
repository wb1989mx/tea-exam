/* ============================================================
 * 评茶员考核系统 - 主应用逻辑
 * ============================================================ */

var state = {
  tea: null,
  method: null,
  stage: 0,
  tools: {},
  norms: {},
  order: [],
  orderStart: 0,
  orderTimer: null,
  scores: {}
};

/* ---------- 工具函数 ---------- */
function $(id) { return document.getElementById(id); }
function getTea() { return TEA_LIB[state.tea]; }
function getMethodName() { return state.method === 'cup' ? '柱形杯法' : '盖碗法'; }
function getVessel() { return state.method === 'cup' ? '150mL审评杯' : '110mL盖碗'; }
function getDosage() { return state.method === 'cup' ? '3g' : '5g'; }
function getCorrectTools() { return TOOL_LIB.filter(function(t) { return t[state.method]; }); }

function showToast(msg, dur) {
  var t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('show'); }, dur || 1800);
}

/* ---------- 环节切换 ---------- */
function goStage(n) {
  state.stage = n;
  document.querySelectorAll('.page').forEach(function(p, i) {
    p.classList.toggle('active', i === n);
  });
  document.querySelectorAll('.step').forEach(function(s, i) {
    s.classList.toggle('active', i === n);
    s.classList.toggle('done', i < n);
  });
  /* 底部按钮 */
  var back = $('btnBack'), next = $('btnNext');
  if (n === 0) {
    back.style.display = 'none';
    next.textContent = '开始考核';
    next.disabled = !(state.tea && state.method);
    next.className = 'btn btn-primary';
  } else if (n === 1) {
    back.style.display = 'flex';
    next.textContent = '确认选配';
    next.disabled = false;
    next.className = 'btn btn-primary';
  } else if (n === 2) {
    back.style.display = 'flex';
    next.textContent = '提交规范';
    next.disabled = false;
    next.className = 'btn btn-success';
  } else if (n === 3) {
    back.style.display = 'flex';
    next.textContent = '提交校验';
    next.disabled = false;
    next.className = 'btn btn-success';
  } else if (n === 4) {
    back.style.display = 'none';
    next.textContent = '重新考核';
    next.disabled = false;
    next.className = 'btn btn-primary';
  }
  /* 渲染对应环节 */
  if (n === 1) renderTools();
  if (n === 2) renderNorms();
  if (n === 3) renderOrder();
  if (n === 4) renderScore();
  $('content') && ($('content').scrollTop = 0);
  document.querySelector('.content').scrollTop = 0;
}

/* ---------- 环节0：选题 ---------- */
function renderTeaGrid() {
  var grid = $('teaGrid');
  grid.innerHTML = '';
  Object.keys(TEA_LIB).forEach(function(key) {
    var t = TEA_LIB[key];
    var d = document.createElement('div');
    d.className = 'tea-card' + (state.tea === key ? ' selected' : '');
    d.innerHTML = '<div class="tea-icon">' + t.icon + '</div><div class="tea-name">' + t.name + '</div><div class="tea-cat">' + t.cat + ' · ' + t.type + '</div>';
    d.onclick = function() {
      state.tea = key;
      state.method = null;
      renderTeaGrid();
      $('methodCard').style.display = 'block';
      renderMethodRow();
      $('btnNext').disabled = true;
    };
    grid.appendChild(d);
  });
}

function renderMethodRow() {
  var tea = getTea();
  var row = $('methodRow');
  row.innerHTML = '';
  var methods = [
    { key: 'cup', name: '柱形杯法', desc: '150mL审评杯 · 投茶3g\n沸水冲泡1次\n颗粒型6min / 条形5min' },
    { key: 'gaiwan', name: '盖碗法', desc: '110mL盖碗 · 投茶5g\n沸水冲泡3次\n出汤：2→3→5min' }
  ];
  methods.forEach(function(m) {
    var ok = tea.methods.indexOf(m.key) > -1;
    var d = document.createElement('div');
    d.className = 'method-card' + (state.method === m.key ? ' selected' : '') + (!ok ? ' disabled' : '');
    d.innerHTML = '<div class="m-name">' + m.name + '</div><div class="m-desc">' + m.desc.replace(/\n/g, '<br>') + '</div>';
    if (ok) {
      d.onclick = function() {
        state.method = m.key;
        renderMethodRow();
        $('btnNext').disabled = false;
      };
    }
    row.appendChild(d);
  });
}

/* ---------- 环节1：器具选配 ---------- */
function renderTools() {
  var tea = getTea();
  $('teaTag1').textContent = tea.name + ' · ' + getMethodName();
  $('topbarTitle').textContent = '器具选配';
  $('topbarSub').textContent = tea.name + ' · ' + getMethodName();
  $('toolInfo').innerHTML = '<strong>器具联动：</strong>已选择 <strong>' + getVessel() + '</strong>（' + getMethodName() + '），请据此选配审评器具。';
  state.tools = {};
  var total = getCorrectTools().length;
  $('toolCnt').textContent = '0/' + total;
  $('toolProg').style.width = '0%';
  $('toolFb').className = 'feedback';
  $('toolFb').textContent = '';
  var grid = $('toolGrid');
  grid.innerHTML = '';
  TOOL_LIB.forEach(function(t) {
    var d = document.createElement('div');
    d.className = 'tool-item';
    d.innerHTML = '<div class="t-icon">' + t.icon + '</div><div class="t-name">' + t.name + '</div><div class="t-desc">' + t.desc + '</div>';
    d.onclick = function() {
      state.tools[t.id] = !state.tools[t.id];
      d.classList.toggle('selected', state.tools[t.id]);
      updateToolCnt();
    };
    grid.appendChild(d);
  });
}

function updateToolCnt() {
  var n = 0;
  for (var k in state.tools) if (state.tools[k]) n++;
  var total = getCorrectTools().length;
  $('toolCnt').textContent = n + '/' + total;
  $('toolProg').style.width = Math.min(n / total * 100, 100) + '%';
}

function submitTools() {
  var n = 0;
  for (var k in state.tools) if (state.tools[k]) n++;
  if (n === 0) { showToast('请至少选择一件器具'); return; }
  var tR = 0, tW = 0, tM = 0;
  TOOL_LIB.forEach(function(t) {
    var s = !!state.tools[t.id], c = t[state.method];
    if (c && s) tR++; else if (!c && s) tW++; else if (c && !s) tM++;
  });
  var total = getCorrectTools().length;
  var score = Math.max(0, tR - tW * 0.5);
  var fb = $('toolFb');
  fb.className = 'feedback show ' + (tW === 0 && tM === 0 ? 'fb-success' : 'fb-warn');
  fb.innerHTML = '器具选配：正确 <strong style="color:#52C41A;">' + tR + '</strong> 件，误选 <strong style="color:#EA6668;">' + tW + '</strong> 件，漏选 <strong style="color:#FAAD14;">' + tM + '</strong> 件，得分 <strong style="color:#C99A6B;">' + score.toFixed(1) + '/' + total + '</strong>';
  setTimeout(function() { goStage(2); }, 1400);
}

/* ---------- 环节2：操作规范 ---------- */
function renderNorms() {
  var tea = getTea();
  $('teaTag2').textContent = tea.name + ' · ' + getMethodName();
  $('topbarTitle').textContent = '操作规范';
  $('topbarSub').textContent = tea.name + ' · ' + getMethodName();
  $('normInfo').innerHTML = '<strong>标准依据：</strong>GB/T 23776 · ' + getMethodName() + '（' + getVessel() + '，投茶' + getDosage() + '）。请勾选正确的冲泡参数与操作规范。';
  state.norms = {};
  var qs = genNormQuestions(state.tea, state.method);
  var container = $('normContainer');
  container.innerHTML = '';
  var groups = [
    { key: 'A', title: 'A. 冲泡参数与审评方法', color: '#E1B98F', items: qs.A },
    { key: 'B', title: 'B. 操作动作规范', color: '#94D8C3', items: qs.B },
    { key: 'C', title: 'C. 审评细节规范', color: '#9BBBF4', items: qs.C }
  ];
  groups.forEach(function(g) {
    var gd = document.createElement('div');
    gd.className = 'norm-group';
    gd.innerHTML = '<div class="norm-group-title" style="border-color:' + g.color + ';">' + g.title + '</div><div class="norm-grid"></div>';
    var ng = gd.querySelector('.norm-grid');
    g.items.forEach(function(it) {
      var d = document.createElement('div');
      d.className = 'norm-item';
      d.innerHTML = '<div class="ck"></div><div class="n-body"><div class="n-text">' + it.text + '</div><div class="n-desc">' + it.desc + '</div></div>';
      d.onclick = function() {
        state.norms[it.id] = !state.norms[it.id];
        d.classList.toggle('selected', state.norms[it.id]);
      };
      ng.appendChild(d);
    });
    container.appendChild(gd);
  });
  $('normFb').className = 'feedback';
  $('normFb').textContent = '';
}

function submitNorms() {
  var n = 0;
  for (var k in state.norms) if (state.norms[k]) n++;
  if (n === 0) { showToast('请至少勾选一项操作规范'); return; }
  var qs = genNormQuestions(state.tea, state.method);
  var all = qs.A.concat(qs.B).concat(qs.C);
  var nR = 0, nW = 0, nM = 0, nT = 0;
  all.forEach(function(it) {
    if (it.correct) nT++;
    var s = !!state.norms[it.id];
    if (it.correct && s) nR++; else if (!it.correct && s) nW++; else if (it.correct && !s) nM++;
  });
  var score = Math.max(0, nR - nW * 0.5);
  var fb = $('normFb');
  fb.className = 'feedback show ' + (nW === 0 && nM === 0 ? 'fb-success' : 'fb-warn');
  fb.innerHTML = '操作规范：正确 <strong style="color:#52C41A;">' + nR + '</strong> 项，误选 <strong style="color:#EA6668;">' + nW + '</strong> 项，漏选 <strong style="color:#FAAD14;">' + nM + '</strong> 项，得分 <strong style="color:#7FCAB2;">' + score.toFixed(1) + '/' + nT + '</strong>';
  setTimeout(function() { goStage(3); }, 1400);
}

/* ---------- 环节3：流程排序 ---------- */
var orderSteps = [];

function renderOrder() {
  var tea = getTea();
  $('teaTag3') && ($('teaTag3').textContent = tea.name + ' · ' + getMethodName());
  $('topbarTitle').textContent = '流程排序';
  $('topbarSub').textContent = tea.name + ' · ' + getMethodName();
  orderSteps = genSteps(state.tea, state.method);
  state.order = [];
  state.orderStart = Date.now();
  if (state.orderTimer) clearInterval(state.orderTimer);
  state.orderTimer = setInterval(function() {
    var s = Math.floor((Date.now() - state.orderStart) / 1000);
    $('orderTimer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }, 1000);
  $('orderFb').className = 'feedback';
  $('orderFb').textContent = '';
  renderOrderZones();
}

function renderOrderZones() {
  var oz = $('orderZone'), pz = $('poolZone');
  oz.innerHTML = '';
  pz.innerHTML = '';
  if (state.order.length === 0) {
    oz.innerHTML = '<div class="empty-hint">点击下方步骤卡片，按操作顺序添加到这里…</div>';
  }
  state.order.forEach(function(s, i) {
    var d = document.createElement('div');
    d.className = 'step-card ordered';
    d.innerHTML = '<div class="s-name">' + (i + 1) + '. ' + s.name + '</div><div class="s-desc">' + s.desc + '</div>';
    d.onclick = function() { state.order.splice(i, 1); renderOrderZones(); };
    oz.appendChild(d);
  });
  orderSteps.forEach(function(s) {
    if (state.order.indexOf(s) === -1) {
      var d = document.createElement('div');
      d.className = 'step-card';
      d.innerHTML = '<div class="s-name">' + s.name + '</div><div class="s-desc">' + s.desc + '</div>';
      d.onclick = function() { state.order.push(s); renderOrderZones(); };
      pz.appendChild(d);
    }
  });
}

function submitOrder() {
  if (state.order.length < orderSteps.length) {
    $('orderFb').className = 'feedback show fb-warn';
    $('orderFb').innerHTML = '还有 ' + (orderSteps.length - state.order.length) + ' 步未排列，请完成后再提交。';
    return;
  }
  if (state.orderTimer) clearInterval(state.orderTimer);
  var correct = 0, details = [];
  for (var i = 0; i < orderSteps.length; i++) {
    if (state.order[i].id === orderSteps[i].id) correct++;
    else details.push('第' + (i + 1) + '步应为「' + orderSteps[i].name + '」');
  }
  var pct = Math.round(correct / orderSteps.length * 100);
  var used = Math.floor((Date.now() - state.orderStart) / 1000);
  var timeStr = String(Math.floor(used / 60)).padStart(2, '0') + ':' + String(used % 60).padStart(2, '0');
  $('orderFb').className = 'feedback show ' + (pct >= 90 ? 'fb-success' : 'fb-warn');
  $('orderFb').innerHTML = '<div style="font-weight:700;margin-bottom:4px;">流程匹配度：' + correct + '/' + orderSteps.length + '（' + pct + '%）· 用时 ' + timeStr + '</div>' + (details.length ? '<div style="color:#EA6668;">错位：' + details.join('；') + '</div>' : '<div>全部步骤顺序正确！</div>');
  setTimeout(function() { goStage(4); }, 1600);
}

/* ---------- 环节4：评分结果 ---------- */
function calcScores() {
  /* 器具分 */
  var tR = 0, tW = 0, tM = 0;
  TOOL_LIB.forEach(function(t) {
    var s = !!state.tools[t.id], c = t[state.method];
    if (c && s) tR++; else if (!c && s) tW++; else if (c && !s) tM++;
  });
  var tTotal = getCorrectTools().length;
  var tScore = Math.max(0, tR - tW * 0.5);
  state.scores.tools = { score: tScore, total: tTotal, pct: Math.round(tScore / tTotal * 100), right: tR, wrong: tW, miss: tM };

  /* 规范分 */
  var qs = genNormQuestions(state.tea, state.method);
  var all = qs.A.concat(qs.B).concat(qs.C);
  var nR = 0, nW = 0, nM = 0, nT = 0;
  all.forEach(function(it) {
    if (it.correct) nT++;
    var s = !!state.norms[it.id];
    if (it.correct && s) nR++; else if (!it.correct && s) nW++; else if (it.correct && !s) nM++;
  });
  var nScore = Math.max(0, nR - nW * 0.5);
  state.scores.norms = { score: nScore, total: nT, pct: Math.round(nScore / nT * 100), right: nR, wrong: nW, miss: nM };

  /* 流程分 */
  var oCorrect = 0;
  for (var i = 0; i < orderSteps.length; i++) {
    if (state.order[i] && state.order[i].id === orderSteps[i].id) oCorrect++;
  }
  var oTotal = orderSteps.length;
  var oPct = Math.round(oCorrect / oTotal * 100);
  var used = Math.floor((Date.now() - state.orderStart) / 1000);
  state.scores.order = { correct: oCorrect, total: oTotal, pct: oPct, time: used };

  /* 时间效率分 */
  var stdTime = 360;
  var timeScore = Math.max(60, Math.min(100, 100 - (used - stdTime) * 0.1));
  state.scores.time = { score: Math.round(timeScore) };

  /* 综合得分 */
  var finalScore = state.scores.tools.pct * 0.25 + state.scores.norms.pct * 0.25 + state.scores.order.pct * 0.35 + timeScore * 0.15;
  state.scores.final = Math.round(finalScore * 10) / 10;
  state.scores.level = finalScore >= 90 ? '熟练（A级）' : finalScore >= 75 ? '基本掌握（B级）' : finalScore >= 60 ? '有待加强（C级）' : '需重训（D级）';
}

function renderScore() {
  if (state.orderTimer) clearInterval(state.orderTimer);
  calcScores();
  var tea = getTea();
  $('teaTag4').textContent = tea.name + ' · ' + getMethodName();
  $('topbarTitle').textContent = '考核结果';
  $('topbarSub').textContent = tea.name + ' · ' + getMethodName();
  var s = state.scores;
  var used = s.order.time;
  var timeStr = String(Math.floor(used / 60)).padStart(2, '0') + ':' + String(used % 60).padStart(2, '0');

  $('scoreHero').innerHTML =
    '<div class="score-box tea"><div class="sb-label">综合得分</div><div class="sb-value">' + s.final + '</div><div class="sb-unit">满分 100</div></div>' +
    '<div class="score-box green"><div class="sb-label">熟练度</div><div class="sb-value">' + s.level + '</div><div class="sb-unit">操作流程评估</div></div>' +
    '<div class="score-box blue"><div class="sb-label">流程用时</div><div class="sb-value">' + timeStr + '</div><div class="sb-unit">标准 ≤ 06:00</div></div>' +
    '<div class="score-box orange"><div class="sb-label">考核茶样</div><div class="sb-value">' + tea.name + '</div><div class="sb-unit">' + getMethodName() + '</div></div>';

  var details = [
    { label: '器具选配', score: s.tools.pct, color: '#E1B98F', text: s.tools.right + '/' + s.tools.total + ' 正确，误选' + s.tools.wrong + ' 漏选' + s.tools.miss },
    { label: '操作规范', score: s.norms.pct, color: '#94D8C3', text: s.norms.right + '/' + s.norms.total + ' 正确，误选' + s.norms.wrong + ' 漏选' + s.norms.miss },
    { label: '流程顺序', score: s.order.pct, color: '#9BBBF4', text: s.order.correct + '/' + s.order.total + ' 步正确' },
    { label: '时间效率', score: s.time.score, color: '#F4B393', text: '用时 ' + timeStr },
    { label: '操作整洁', score: Math.round((s.tools.pct + s.norms.pct) / 2), color: '#A2DDAA', text: '器具复位与操作规范综合' }
  ];
  $('scoreDetail').innerHTML = details.map(function(d) {
    return '<div class="detail-row"><div class="dr-label">' + d.label + '</div><div class="dr-bar"><div class="dr-fill" style="width:' + d.score + '%;background:' + d.color + ';"></div><span class="dr-score">' + d.score + '分 · ' + d.text + '</span></div></div>';
  }).join('');

  /* 雷达图 */
  setTimeout(function() {
    drawRadar($('radarCanvas'), {
      indicators: ['器具认知', '参数规范', '流程顺序', '时间效率', '细节把控', '操作整洁'],
      max: 100,
      series: [
        { name: '本次考核', color: '#E1B98F', areaColor: 'rgba(225,185,143,0.2)', values: [s.tools.pct, s.norms.pct, s.order.pct, s.time.score, Math.round((s.norms.pct + s.order.pct) / 2), Math.round((s.tools.pct + s.norms.pct) / 2)] },
        { name: '高级标准线', color: '#94D8C3', areaColor: 'rgba(148,216,195,0.08)', dashed: true, values: [75, 75, 75, 75, 75, 75] }
      ]
    });
  }, 100);

  /* 评语 */
  var comment = '';
  if (s.final >= 90) {
    comment = '该考生在' + tea.name + '（' + getMethodName() + '）感官审评操作流程中表现<strong>优秀</strong>，器具选配准确，冲泡参数符合GB/T 23776标准，操作步骤顺序正确，整体熟练度达到<strong>高级评茶员 A 级</strong>标准。';
  } else if (s.final >= 75) {
    var weak = [];
    if (s.tools.pct < 80) weak.push('器具甄别');
    if (s.norms.pct < 80) weak.push('冲泡参数记忆');
    if (s.order.pct < 80) weak.push('操作顺序熟练度');
    comment = '该考生表现<strong>良好</strong>，大部分操作规范正确，建议加强' + (weak.length ? weak.join('、') : '综合熟练度') + '训练。';
  } else if (s.final >= 60) {
    comment = '该考生操作流程<strong>基本合格但有待加强</strong>，建议系统复习GB/T 23776标准后重新考核。';
  } else {
    comment = '该考生操作流程<strong>未达合格标准</strong>，需重新学习审评器具使用、冲泡参数设置与标准操作流程。';
  }
  $('finalComment').innerHTML = '<strong>考核评语：</strong>' + comment;
}

/* ---------- 事件绑定 ---------- */
$('btnBack').onclick = function() {
  if (state.stage > 0) goStage(state.stage - 1);
};

$('btnNext').onclick = function() {
  if (state.stage === 0) {
    if (state.tea && state.method) goStage(1);
  } else if (state.stage === 1) {
    submitTools();
  } else if (state.stage === 2) {
    submitNorms();
  } else if (state.stage === 3) {
    submitOrder();
  } else if (state.stage === 4) {
    location.reload();
  }
};

/* 窗口变化时重绘雷达图 */
var resizeTimer;
window.addEventListener('resize', function() {
  if (state.stage === 4) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var s = state.scores;
      if (s.final !== undefined) {
        drawRadar($('radarCanvas'), {
          indicators: ['器具认知', '参数规范', '流程顺序', '时间效率', '细节把控', '操作整洁'],
          max: 100,
          series: [
            { name: '本次考核', color: '#E1B98F', areaColor: 'rgba(225,185,143,0.2)', values: [s.tools.pct, s.norms.pct, s.order.pct, s.time.score, Math.round((s.norms.pct + s.order.pct) / 2), Math.round((s.tools.pct + s.norms.pct) / 2)] },
            { name: '高级标准线', color: '#94D8C3', areaColor: 'rgba(148,216,195,0.08)', dashed: true, values: [75, 75, 75, 75, 75, 75] }
          ]
        });
      }
    }, 200);
  }
});

/* ---------- 初始化 ---------- */
renderTeaGrid();
goStage(0);
