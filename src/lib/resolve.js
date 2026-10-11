import data from '../data/sources.json';
import catalog from '../data/majors.json';

export const YEARS = data.years;
export const TYPES = data.types;
export const META = data.meta;
export const CONTACTS = data.contacts;
export const SOURCES = data.sources;
/** 연도 표기가 필요 없는 안내 화면용 기준 연도 (데이터 확인일 기준) */
export const REF_YEAR = Number(data.meta.lastChecked.slice(0, 4));

export const COLLEGES = catalog.colleges;
const collegeById = Object.fromEntries(COLLEGES.map((c) => [c.id, c]));

/** 전공 레코드에 단과대학 이름·문의처를 붙인다 (학과 문의처가 없으면 단과대학 행정실) */
const enrich = (m, kind) => {
  const col = collegeById[m.college];
  return { ...m, kind, collegeName: col?.name ?? '', office: m.office ?? col?.office ?? null, collegeHome: col?.home ?? null };
};
export const MAJORS = catalog.majors.map((m) => enrich(m, 'major'));
const LINKED = catalog.linked.map((m) => enrich(m, 'linked'));
const FUSION = catalog.fusion.map((m) => enrich(m, 'fusion'));
const ALL = [...MAJORS, ...LINKED, ...FUSION];

export const typeName = (id) => TYPES.find((t) => t.id === id)?.name ?? '';
export const majorById = (id) => ALL.find((m) => m.id === id);

/** 주전공 선택지: 학부 전공 전체 */
export const mainOptions = () => MAJORS;

/** 다전공 전공 선택지 (유형별). 복수전공 불가로 원문에 명시된 전공은 제외 */
export function secondOptions(type, mainId) {
  if (type === 'linked') return LINKED;
  if (type === 'fusion') return FUSION;
  if (type === 'double') return MAJORS.filter((m) => m.id !== mainId && !m.noDouble);
  if (type === 'minor') return MAJORS.filter((m) => m.id !== mainId);
  return [];
}
/** 선택에서 빠진 전공과 그 이유(원문 근거) */
export const excludedFor = (type) => (type === 'double' ? MAJORS.filter((m) => m.noDouble) : []);

/** 문자열 검색 (전공명·단과대학명, 공백/가운뎃점 무시) */
const norm = (s) => s.replace(/[\s·ㆍ.]/g, '').toLowerCase();
export const matchMajor = (m, q) => !q || norm(`${m.name}${m.collegeName}`).includes(norm(q));

/** 원문에 적힌 적용 연도만 기준 시점으로 쓴다. 적혀 있지 않으면 미확인 (추측 금지) */
function basisFor(src, year) {
  if (src.basisFixed) return { label: src.basisFixed, known: true };
  if (src.basisYearSelectable) return { label: `${year}학년도 입학생 교과과정 (조회 시 선택)`, known: true };
  const list = src.variants ?? src.basis ?? [];
  const hit = list.find((b) => year >= b.from && year <= b.to);
  if (hit) return { label: `${hit.label} 적용 기준`, group: hit.label, known: true, url: hit.url };
  return { label: '기준 시점 미확인', known: false };
}

export function buildSource(id, year) {
  const src = SOURCES[id];
  if (!src) return null;
  const basis = basisFor(src, year);
  const fill = (s) => s.replace('{year}', `${year}학년도`).replace('{group}', basis.group ?? '본인 학번 해당');
  return { id, ...src, url: basis.url ?? src.url, steps: src.steps.map(fill), basis, lastChecked: META.lastChecked };
}

/** 학과 홈페이지는 원문이 아니라 '찾아갈 곳'이므로 별도 링크로만 붙인다 */
function homeLink(m) {
  const url = m.home ?? m.collegeHome;
  if (!url) return null;
  return {
    id: `home-${m.id}`, title: m.home ? `${m.name} 홈페이지` : `${m.collegeName} 홈페이지`,
    org: m.home ? '학과(전공) 홈페이지' : '단과대학 홈페이지', url,
    basis: { label: '공지·교과과정 메뉴에서 확인', known: true },
  };
}

function idsFor(m, type, role) {
  if (role === 'main') return [...(m.deptMain ?? []), 'ewha-degree', 'ewha-curriculum-year'];
  if (type === 'double') return [...(m.deptDouble ?? []), 'ewha-double', 'ewha-double-limit', 'ewha-curriculum-year'];
  if (type === 'minor') return [...(m.deptMinor ?? []), 'ewha-minor', 'ewha-curriculum-year'];
  if (type === 'linked') return ['liberal-linked', 'ewha-linked'];
  if (type === 'fusion') return [...(m.deptSecond ?? []), 'ewha-fusion', 'ewha-curriculum-year'];
  return [];
}

/** 조합 → 결과. 유효하지 않은 조합이면 null (원문 없음 화면) */
export function resolve({ year, type, main, second }) {
  const y = Number(year);
  const m = MAJORS.find((x) => x.id === main);
  if (!y || !m || !typeName(type)) return null;
  const s = secondOptions(type, m.id).find((x) => x.id === second);
  if (!s) return null;
  const toCard = (major, role) => {
    const uniq = [...new Set(idsFor(major, type, role))];
    const [primary, ...related] = uniq.map((id) => buildSource(id, y)).filter(Boolean);
    const home = homeLink(major);
    return { major, primary, related: home ? [...related, home] : related };
  };
  return { main: toCard(m, 'main'), second: toCard(s, 'second') };
}

const KEY = 'ewhacheck:lastCombo';
export function saveCombo(combo) {
  try { localStorage.setItem(KEY, JSON.stringify(combo)); } catch { /* 저장 불가 환경은 무시 */ }
}
export function loadCombo() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
}

export const comboToQuery = (c) => new URLSearchParams(c).toString();
export const queryToCombo = (sp) => ({
  year: sp.get('year') ?? '',
  type: sp.get('type') ?? '',
  main: sp.get('main') ?? '',
  second: sp.get('second') ?? '',
});
