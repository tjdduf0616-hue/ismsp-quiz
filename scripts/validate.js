// 문제은행 무결성 검증 스크립트
// 실행: npm run validate  (또는 node scripts/validate.js)
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'questions.js');
let src = fs.readFileSync(file, 'utf8');

// questions.js는 브라우저용(const QUESTION_BANK=...)이므로 평가용으로 전역에 노출
src = src.replace('const QUESTION_BANK', 'globalThis.QUESTION_BANK');
try {
  // eslint-disable-next-line no-eval
  eval(src);
} catch (e) {
  console.error('❌ questions.js 파싱 실패(문법 오류):', e.message);
  process.exit(1);
}

const bank = globalThis.QUESTION_BANK;
const errors = [];
const ids = new Set();
const byCat = {};
const VALID_CATS = ['고난도','암기','AI','가명','직책','제도','관리','보호','개인정보','개인정보기준','법령','안전성','클라우드','보안기술','보안기사','결함사례'];

bank.forEach((q, i) => {
  const where = `#${i + 1} (id=${q.id || '없음'})`;
  if (!q.id) errors.push(`${where}: id 없음`);
  else if (ids.has(q.id)) errors.push(`${where}: 중복 id`);
  ids.add(q.id);

  if (!VALID_CATS.includes(q.cat)) errors.push(`${where}: 알 수 없는 cat "${q.cat}"`);
  byCat[q.cat] = (byCat[q.cat] || 0) + 1;

  if (!Array.isArray(q.opts) || q.opts.length < 2) errors.push(`${where}: 보기(opts) 부족`);
  if (typeof q.a !== 'number' || q.a < 0 || (q.opts && q.a >= q.opts.length)) errors.push(`${where}: 정답 인덱스(a) 오류 a=${q.a}`);
  if (!q.q) errors.push(`${where}: 문항(q) 없음`);
  if (!q.exp) errors.push(`${where}: 해설(exp) 없음`);
  if (!q.src) errors.push(`${where}: 출처(src) 없음`);
});

console.log(`총 문항: ${bank.length}`);
console.log('카테고리별:', JSON.stringify(byCat, null, 0));
if (errors.length) {
  console.error(`\n❌ 오류 ${errors.length}건:`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('\n✅ 검증 통과 — 오류 없음');
}
