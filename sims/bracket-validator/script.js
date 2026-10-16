const input = document.getElementById('seq');
const stepsEl = document.getElementById('steps');
const verdictEl = document.getElementById('verdict');

function evaluate(text){
  const s = (text || '').replace(/\s+/g, '');
  const out = { seq: s, steps: [], valid: false, reason: '' };
  let bal = 0, firstNeg = -1;
  for (let i = 0; i < s.length; i++){
    const ch = s[i];
    if (ch === '(') bal += 1; else if (ch === ')') bal -= 1; else { out.reason = '含非括号字符：' + ch; return out; }
    out.steps.push({ ch, bal });
    if (bal < 0 && firstNeg < 0) firstNeg = i;
  }
  if (s.length < 2 || s.length > 12) out.reason = '长度必须在 2～12 之间（当前 ' + s.length + '）';
  else if (firstNeg >= 0) out.reason = '第 ' + (firstNeg + 1) + ' 个字符后余额为负：前缀条件不满足';
  else if (bal !== 0) out.reason = '末尾余额为 ' + bal + '：左右括号数量不相等';
  else { out.valid = true; out.reason = '两条条件都满足'; }
  return out;
}

function render(){
  const r = evaluate(input.value);
  stepsEl.innerHTML = '';
  r.steps.forEach((st, i) => {
    const d = document.createElement('div');
    d.className = 'cell ' + (st.bal < 0 ? 'neg' : 'ok');
    d.innerHTML = '<b>' + (st.ch === '(' ? '(' : ')') + '</b>余额 ' + st.bal;
    d.title = '第 ' + (i + 1) + ' 个字符';
    stepsEl.appendChild(d);
  });
  verdictEl.className = 'verdict ' + (r.valid ? 'ok' : 'bad');
  verdictEl.textContent = (r.valid ? '[Valid]: YES —— ' : '[Valid]: NO —— ') + r.reason;
}

input.addEventListener('input', render);
document.getElementById('rand').addEventListener('click', () => {
  const len = [2,4,6,8,10,12][Math.floor(Math.random()*6)];
  let s = '';
  for (let i = 0; i < len; i++) s += Math.random() < 0.5 ? '(' : ')';
  input.value = s; render();
});
document.getElementById('clear').addEventListener('click', () => { input.value = ''; render(); });
document.querySelectorAll('.presets button').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.s; render(); }));
render();
