import { useOpenSource } from '../lib/useOpenSource';

/**
 * 신청 정보·장학금 화면에서 쓰는 공식 원문 카드 (Figma: 다전공 신청 자격 / 장학금 카드)
 * 원문 내용을 요약하지 않고, 위치·출처·기준 시점만 보여준다.
 */
export default function OfficialCard({ src, title, icon: Icon, desc, children, cta = '공식 원문 확인하기' }) {
  const open = useOpenSource();
  if (!src) return null;
  return (
    <article className="off-card">
      <div className="off-top">
        <div>
          <h3>{title ?? src.title}</h3>
          <div className="chips">
            <span className="chip">{src.org}</span>
            <span className={`chip ${src.basis.known ? '' : 'chip-warn-bg'}`}>{src.basis.known ? src.basis.label : '기준 시점 미확인'}</span>
          </div>
        </div>
        {Icon && <span className="off-ico" aria-hidden="true"><Icon size={24} /></span>}
      </div>
      {desc && <p className="off-desc">{desc}</p>}
      <hr className="off-divider" />
      {children}
      <dl className="off-rows">
        <div><dt>원문 위치</dt><dd>{src.location.join(' › ')}</dd></div>
        <div><dt>출처</dt><dd>{src.source}</dd></div>
        <div><dt>이화첵 확인일</dt><dd>{src.lastChecked}</dd></div>
      </dl>
      <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => open(src)}>{cta}</button>
    </article>
  );
}
