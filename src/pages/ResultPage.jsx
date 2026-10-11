import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useOpenSource } from '../lib/useOpenSource';
import { BookOpen, FileText, Info, ExternalLink } from 'lucide-react';
import { resolve, queryToCombo, comboToQuery, typeName, YEARS } from '../lib/resolve';

function SourceCard({ kind, kicker, title, card }) {
  const open = useOpenSource();
  const { primary: s, related, major } = card;
  const Icon = kind === 'main' ? BookOpen : FileText;
  return (
    <article className={`src-card ${kind}`}>
      <header className={`src-head ${kind}`}>
        <div>
          <small>{kicker} · {major.name}</small>
          <h2>{title}</h2>
        </div>
        <span className="ico" aria-hidden="true"><Icon size={20} /></span>
      </header>
      <div className="src-body">
        <div className="chips">
          <span className="chip">{s.org}</span>
          <span className={`chip ${s.basis.known ? '' : 'chip-warn'}`}>{s.basis.known ? s.basis.label : '기준 시점 미확인'}</span>
        </div>
        <hr className="divider" />
        <div>
          <p className={`label-dot ${kind}`}><i />원문 위치</p>
          <p className="loc">{s.location.join(' › ')}</p>
        </div>
        <div>
          <p className={`label-dot ${kind}`}><i />이동 경로</p>
          <ol className={`steps ${kind}`}>
            {s.steps.map((t, i) => <li key={i}><span className="n">{i + 1}</span><span>{t}</span></li>)}
          </ol>
        </div>
        <hr className="divider" />
        <dl className="meta-rows">
          <div><dt>출처</dt><dd>{s.source}</dd></div>
          {s.basis.known && <div><dt>기준 시점</dt><dd>{s.basis.label} (원문 표기)</dd></div>}
          <div><dt>이화첵 확인일</dt><dd>{s.lastChecked}</dd></div>
        </dl>
        {!s.basis.known && (
          <div className="warn-box" role="note">
            <span aria-hidden="true">⚠</span>
            <div>
              <b>기준 시점 미확인</b>
              <p>현재 게시된 원문의 적용 기준 시점이 명시되어 있지 않습니다. 원문 확인 후 {major.office?.phone ? `${major.office.label}(${major.office.phone})` : '학과 사무실'}에 문의하시기 바랍니다.</p>
            </div>
          </div>
        )}
        <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => open(s)}>
          {kind === 'main' ? '주전공' : '다전공'} 원문 바로가기
        </button>
        {related.length > 0 && (
          <div className="related">
            <p className={`label-dot ${kind}`}><i />함께 확인할 공식 원문</p>
            {related.map((r) => (
              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer">
                <span>{r.title}<br /><small>{r.org} · {r.basis.label}</small></span>
                <ExternalLink size={14} aria-label="새 탭에서 열림" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ResultPage() {
  const [sp] = useSearchParams();
  const combo = queryToCombo(sp);
  const result = resolve(combo);
  if (!result) return <Navigate to={`/none?${comboToQuery(combo)}`} replace />;
  const tName = typeName(combo.type);
  const yearOk = YEARS.includes(Number(combo.year));

  return (
    <>
      <div className="crumb-bar container">
        <nav className="crumb" aria-label="현재 위치">
          <Link to="/select">홈</Link><span>/</span>
          <Link to={`/select?${comboToQuery(combo)}`}>졸업요건 안내</Link><span>/</span>
          <span className="cur">안내 결과</span>
        </nav>
        <span className="pill">결과 확인 완료</span>
      </div>

      <div className="result-body container">
        <div className="result-title">
          <h1>졸업요건 안내 결과</h1>
          <p>선택하신 전공 조합에 해당하는 공식 졸업요건 원문 위치를 안내드립니다.</p>
        </div>

        <section className="combo-box" aria-label="선택한 조합">
          <div className="combo-top">
            <span className="pill">선택한 조합</span>
            <Link to={`/select?${comboToQuery(combo)}`} className="btn btn-secondary">조합 다시 선택</Link>
          </div>
          <hr className="divider" />
          <div className="combo-grid">
            <div><small>학번</small><b>{combo.year}학번{!yearOk && ' (목록 외)'}</b></div>
            <div><small>다전공 유형</small><b>{tName}</b></div>
            <div><small>주전공</small><b>{result.main.major.name}</b></div>
            <div><small>다전공 전공</small><b>{result.second.major.name}</b></div>
          </div>
        </section>

        <div className="cards">
          <SourceCard kind="main" kicker="주전공" title="주전공 졸업요건 원문" card={result.main} />
          <SourceCard kind="second" kicker={tName} title="다전공 졸업요건 원문" card={result.second} />
        </div>

        <section className="next-block">
          <span className="pill">이어서 확인하기</span>
          <h2>이어서 확인할 수 있는 정보</h2>
          <p>졸업요건 원문 확인 후, 다전공 신청 자격과 장학금 정보도 함께 확인해 보세요.</p>
          <div className="row">
            <Link to={`/apply?second=${encodeURIComponent(combo.second)}`} className="btn btn-secondary">다전공 신청 자격 및 일정 확인</Link>
            <Link to={`/scholarship?main=${encodeURIComponent(combo.main)}&second=${encodeURIComponent(combo.second)}`} className="btn btn-secondary">다전공 관련 장학금 안내</Link>
          </div>
        </section>

        <div className="disclaimer">
          <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <p>본 서비스는 졸업요건 원문의 위치만을 안내하며, 학점 계산·이수 요건 충족 여부 판정·다전공 신청 처리는 하지 않습니다. 최종 확인은 반드시 공식 원문 및 담당 부서를 통해 진행해 주세요.</p>
        </div>
      </div>
    </>
  );
}
