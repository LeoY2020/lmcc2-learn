function fmt(x){ return x.toLocaleString('en-US'); }
function computeQ1(){
  const pt = +document.getElementById('pt').value || 0;
  const gt = +document.getElementById('gt').value || 0;
  const runs = +document.getElementById('runs').value || 0;
  const box = document.getElementById('q1');
  const perRun = (pt * 5) + (gt * 5);            // 每次调试跑 5 个公开点
  const used = perRun * runs;
  const left = 100000 - used;
  const parts = [];
  parts.push('Prompt 长度：<b>' + fmt(pt) + '</b> token（上限 300）' + (pt > 300 ? ' ❌ 超限，调用前会被拒绝' : ' ✅'));
  parts.push('每次调试（5 点）预计消耗：<b>' + fmt(perRun) + '</b> token');
  parts.push('按当前设置已消耗：<b>' + fmt(used) + '</b> token，剩余 <b>' + fmt(left) + '</b> token');
  parts.push('调试次数：' + runs + ' / 20');
  const expect = perRun > 0 ? Math.floor(left / perRun) : '∞';
  parts.push('剩余额度大约还能调试：<b>' + expect + '</b> 次');
  box.className = 'out ' + (pt > 300 || left < 0 || runs >= 18 ? 'warn' : 'ok');
  box.innerHTML = parts.join('<br>');
}
function computeQ3(){
  const T = +document.getElementById('T').value || 0;
  const S = +document.getElementById('S').value || 0;
  const A = 100000, B = 160000;
  let k = 1, note = '不打折（T ≤ A）';
  if (T > B){ k = 0.5; note = '到达 B：停止模型调用，保留当前作品'; }
  else if (T > A){ k = 1 - 0.5 * (T - A) / (B - A); note = '线性衰减区间'; }
  const final = S * k;
  const box = document.getElementById('q3');
  box.className = 'out ' + (k < 1 ? 'warn' : 'ok');
  box.innerHTML = '系数 K = <b>' + (k * 100).toFixed(1) + '%</b>（' + note + '）<br>' +
    '最终得分 = ' + S + ' × ' + k.toFixed(3) + ' = <b>' + final.toFixed(2) + '</b> 分' +
    (k === 1 ? '' : '<br>提示：每多用 6,000 token 约掉 ' + (S * 0.5 / 10).toFixed(1) + ' 分（按当前 S 估算）');
}
document.querySelectorAll('input').forEach(el => el.addEventListener('input', () => { computeQ1(); computeQ3(); }));
computeQ1(); computeQ3();
