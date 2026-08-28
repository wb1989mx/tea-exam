/* ============================================================
 * 纯 Canvas 雷达图 - 离线可用，零依赖
 * ============================================================ */

function drawRadar(canvas, options) {
  try {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var W = rect.width, H = rect.height || 240;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    var indicators = options.indicators || [];
    var series = options.series || [];
    var max = options.max || 100;
    var cx = W / 2;
    var cy = H / 2 + 6;
    var radius = Math.min(W, H) * 0.36;
    var n = indicators.length;
    if (n < 3) return;

    ctx.clearRect(0, 0, W, H);

    /* 绘制网格多边形 */
    var levels = 4;
    for (var lv = levels; lv >= 1; lv--) {
      var r = radius * (lv / levels);
      ctx.beginPath();
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + (Math.PI * 2 / n) * i;
        var x = cx + r * Math.cos(ang);
        var y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = lv % 2 === 0 ? 'rgba(0,0,0,0.015)' : 'rgba(0,0,0,0.035)';
      ctx.fill();
      ctx.strokeStyle = '#E4E3DD';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    /* 绘制轴线 */
    for (var i = 0; i < n; i++) {
      var ang = -Math.PI / 2 + (Math.PI * 2 / n) * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(ang), cy + radius * Math.sin(ang));
      ctx.strokeStyle = '#E4E3DD';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    /* 绘制数据系列 */
    series.forEach(function(s, si) {
      var color = s.color || '#E1B98F';
      var values = s.values || [];
      ctx.beginPath();
      for (var i = 0; i < n; i++) {
        var v = Math.min(values[i] || 0, max);
        var r = radius * (v / max);
        var ang = -Math.PI / 2 + (Math.PI * 2 / n) * i;
        var x = cx + r * Math.cos(ang);
        var y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = s.areaColor || (color + '33');
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = s.dashed ? 1.5 : 2;
      if (s.dashed) ctx.setLineDash([4, 3]); else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* 数据点 */
      for (var i = 0; i < n; i++) {
        var v = Math.min(values[i] || 0, max);
        var r = radius * (v / max);
        var ang = -Math.PI / 2 + (Math.PI * 2 / n) * i;
        var x = cx + r * Math.cos(ang);
        var y = cy + r * Math.sin(ang);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    /* 绘制标签 */
    ctx.font = '11px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < n; i++) {
      var ang = -Math.PI / 2 + (Math.PI * 2 / n) * i;
      var labelR = radius + 18;
      var x = cx + labelR * Math.cos(ang);
      var y = cy + labelR * Math.sin(ang);
      /* 防止标签溢出 */
      var label = indicators[i];
      if (x < 30) x = 30;
      if (x > W - 30) x = W - 30;
      if (y < 14) y = 14;
      if (y > H - 8) y = H - 8;
      ctx.fillText(label, x, y);
    }

    /* 图例 */
    var legendY = H - 6;
    var legendX = W / 2 - (series.length * 70) / 2;
    series.forEach(function(s, si) {
      var lx = legendX + si * 70;
      ctx.beginPath();
      ctx.arc(lx, legendY, 4, 0, Math.PI * 2);
      ctx.fillStyle = s.color || '#E1B98F';
      ctx.fill();
      ctx.font = '10px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'left';
      ctx.fillText(s.name || '', lx + 8, legendY);
    });

  } catch (e) {
    console.error('Radar draw error:', e);
  }
}
