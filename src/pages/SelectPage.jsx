import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import MajorPicker from '../components/MajorPicker';
import {
  YEARS, TYPES, mainOptions, secondOptions, excludedFor, resolve, saveCombo, loadCombo,
  comboToQuery, queryToCombo, typeName,
} from '../lib/resolve';

function StepCard({ n, title, desc, state, children, hint }) {
  return (
    <section className={`step-card ${state}`} aria-disabled={state === 'locked'}>
      <div className="step-head">
        <div className="step-num">{n}</div>
        <div>
          <div className="step-kicker">{n}단계</div>
          <h2 className="step-title">{title}</h2>
        </div>
      </div>
      <div className="field">
        <p className="step-desc">{desc}</p>
        {children}
      </div>
      {hint}
    </section>
  );
}

const lockedHint = (
  <p className="hint"><span className="bang">!</span>이전 단계를 먼저 선택해야 활성화됩니다.</p>
);

export default function SelectPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  // URL(조합 다시 선택) → 지난 방문 조합 → 빈 값 순으로 초기화
  const initial = useMemo(() => {
    const fromUrl = queryToCombo(sp);
    if (fromUrl.year) return fromUrl;
    return loadCombo() ?? { year: '', type: '', main: '', second: '' };
  }, [sp]);
  const [combo, setCombo] = useState(initial);
  const { year, type, main, second } = combo;

  const set = (key) => (e) => {
    const v = e.target.value;
    setCombo((c) => {
      const next = { ...c, [key]: v };
      // 앞 단계가 바뀌면 뒤 단계 선택값이 유효한지 다시 본다
      if (key === 'type' || key === 'main') {
        if (!secondOptions(next.type, next.main).some((m) => m.id === next.second)) next.second = '';
      }
      return next;
    });
  };

  const seconds = secondOptions(type, main);
  const excluded = excludedFor(type);
  const filled = [!!year, !!type, !!main, !!second];
  const current = filled.indexOf(false); // -1이면 모두 선택됨
  const stateOf = (i) => (filled[i] ? 'done' : i === current ? 'active' : 'locked');
  const canSubmit = current === -1;

  const submit = () => {
    if (!canSubmit) return;
    saveCombo(combo);
    const q = comboToQuery(combo);
    navigate(resolve(combo) ? `/result?${q}` : `/none?${q}`);
  };

  return (
    <>
      <div className="page-header container">
        <span className="pill">전공 조합 선택</span>
        <h1>내 전공 조합으로 졸업요건 원문 찾기</h1>
        <p>학번과 다전공 조합을 선택하면 해당 졸업요건 공식 원문 위치를 안내합니다.</p>
      </div>

      <div className="select-body container">
        <div className="select-main">
          <div className="stepper" aria-label={`진행 단계 ${current === -1 ? 4 : current + 1} / 4`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ display: 'contents' }}>
                {i > 0 && <span className={`bar ${filled[i - 1] ? 'on' : ''}`} />}
                <span className={`dot ${filled[i] || i === current ? 'on' : ''}`}>{i + 1}</span>
              </span>
            ))}
          </div>

          <StepCard n={1} title="학번(입학년도)" state={stateOf(0)}
            desc="입학년도(학번)를 선택합니다. 적용받는 교육과정 기준이 달라집니다.">
            <label htmlFor="year">학번(입학년도) 선택</label>
            <select id="year" className="select" value={year} onChange={set('year')}>
              <option value="">선택해 주세요</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}학번 ({y}학년도 입학)</option>)}
            </select>
          </StepCard>

          <StepCard n={2} title="다전공 유형" state={stateOf(1)}
            desc="복수전공·부전공·연계전공·융합전공 중 해당하는 유형을 선택합니다."
            hint={!year && lockedHint}>
            <label htmlFor="type">다전공 유형 선택</label>
            <select id="type" className="select" value={type} onChange={set('type')} disabled={!year}>
              <option value="">선택해 주세요</option>
              {TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </StepCard>

          <StepCard n={3} title="주전공" state={stateOf(2)}
            desc="주전공과 다전공 전공을 각각 선택합니다."
            hint={!type && lockedHint}>
            <MajorPicker id="main" label="주전공 선택" options={mainOptions()} value={main}
              onChange={set('main')} disabled={!type} />
          </StepCard>

          <StepCard n={4} title="다전공 전공" state={stateOf(3)}
            desc="다전공으로 이수하려는 전공을 선택합니다."
            hint={!main ? lockedHint : seconds.length === 0 && (
              <p className="hint warn"><span className="bang">!</span>
                아직 등록된 {typeName(type)} 원문이 없습니다. 아래 ‘원문 없음 안내 보기’에서 문의처를 확인하세요.
              </p>
            )}>
            <MajorPicker id="second" label="다전공 전공 선택" options={seconds} value={second}
              onChange={set('second')} disabled={!main || seconds.length === 0} />
            {main && excluded.length > 0 && (
              <p className="hint">
                <span className="bang">i</span>
                복수전공 규정 원문에 따라 {excluded.map((m) => m.name).join('·')}은(는) 목록에서 제외했습니다.
              </p>
            )}
          </StepCard>

          <div className="notice-amber">
            선택한 조합에 해당하는 원문이 없을 경우 원문 없음 안내 화면으로 이동합니다.
          </div>
          <div className="select-actions">
            <button type="button" className="btn btn-link"
              onClick={() => navigate(`/none?${comboToQuery(combo)}`)}>원문 없음 안내 보기</button>
            <button type="button" className="btn btn-primary" disabled={!canSubmit} onClick={submit}>
              졸업요건 원문 안내 보기
            </button>
          </div>
        </div>

        <aside className="select-aside">
          <div className="aside-guide">
            <div>
              <h3>이용 방법 안내</h3>
              <p>4단계 순서대로 선택하면 자동으로 원문 위치를 찾아드립니다.</p>
            </div>
            <hr />
            <ol>
              {['학번(입학년도) 선택', '다전공 유형 선택', '주전공 선택', '다전공 전공 선택 → 원문 확인'].map((t, i) => (
                <li key={t}><span className="n">{i + 1}</span>{t}</li>
              ))}
            </ol>
          </div>
          <div className="aside-card">
            <h3>이화첵의 약속</h3>
            {[
              ['공식 원문만 안내', '추측이나 요약 없이 원문 위치만 전달합니다.'],
              ['출처 및 기준 시점 표시', '모든 원문에 출처와 기준 시점이 함께 제공됩니다.'],
              ['편입·복학 학생 안내', '학번 선택으로 해당 기준 원문을 바로 확인할 수 있습니다.'],
            ].map(([b, s]) => (
              <div className="promise" key={b}>
                <span className="ck"><Check size={12} strokeWidth={3} /></span>
                <div><b>{b}</b><span>{s}</span></div>
              </div>
            ))}
          </div>
          <div className="aside-note">
            <b>안내 사항</b>
            <p>본 서비스는 졸업요건 원문 위치만을 안내하며, 학점 계산이나 자격 판정을 하지 않습니다. 이화여자대학교 공식 서비스가 아닙니다.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
