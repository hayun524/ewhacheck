import { Link, useSearchParams } from 'react-router-dom';
import { FileX, Info, RefreshCw, MessageCircle, Phone, ChevronRight } from 'lucide-react';
import { CONTACTS, majorById, queryToCombo, comboToQuery } from '../lib/resolve';

export default function NonePage() {
  const [sp] = useSearchParams();
  const combo = queryToCombo(sp);
  const back = `/select?${comboToQuery(combo)}`;
  // 선택한 전공의 학과(없으면 단과대학) 사무실만 보여준다. 공식 사이트에서 확인되지 않은 연락처는 표시하지 않음
  const picked = [majorById(combo.main), majorById(combo.second)].filter(Boolean);
  const offices = [...new Map(picked.filter((m) => m.office).map((m) => [m.office.label, m.office])).values()];
  const homes = picked.filter((m) => !m.office && (m.home || m.collegeHome));

  return (
    <div className="none-body container">
      <div className="none-hero">
        <div className="none-icon"><FileX size={36} /></div>
        <span className="pill pill-red">원문 미등록</span>
        <h1>졸업요건 원문을 찾을 수 없습니다</h1>
        <div className="none-info">
          <Info size={16} style={{ flexShrink: 0 }} />
          <p>선택하신 전공 조합에 대한 졸업요건 공식 원문이 현재 등록되어 있지 않습니다.</p>
        </div>
      </div>

      <section className="none-ways">
        <h2>다음 방법을 시도해보세요</h2>
        <p>아래 방법을 통해 필요한 정보를 확인하실 수 있습니다.</p>
        <div className="ways">
          <div className="way">
            <span className="ico"><RefreshCw size={22} /></span>
            <div>
              <h3><span className="n">1</span>다른 조합 재선택</h3>
              <p>학번, 다전공 유형, 전공을 다시 확인한 후 선택해주세요.</p>
            </div>
            <Link to={back} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>전공 조합 다시 선택하기</Link>
          </div>
          <div className="way">
            <span className="ico"><MessageCircle size={22} /></span>
            <div>
              <h3><span className="n">2</span>학과 사무실 문의</h3>
              <p>정확한 졸업요건 정보는 해당 학과 사무실에 직접 문의하시는 것을 권장합니다.</p>
              <div className="box">
                {offices.map((o) => (
                  <div key={o.label}><ChevronRight size={12} />{o.label}:{' '}
                    {o.phone ? <a href={`tel:${o.phone}`}>{o.phone}</a> : <a href={`mailto:${o.email}`}>{o.email}</a>}
                  </div>
                ))}
                {homes.map((m) => (
                  <div key={m.id}><ChevronRight size={12} />{m.name}:{' '}
                    <a href={m.home ?? m.collegeHome} target="_blank" rel="noopener noreferrer">홈페이지에서 연락처 확인</a>
                  </div>
                ))}
                {!picked.length && <div><ChevronRight size={12} />전공을 선택하면 해당 학과(단과대학) 연락처를 안내합니다.</div>}
              </div>
            </div>
          </div>
          <div className="way">
            <span className="ico"><Phone size={22} /></span>
            <div>
              <h3><span className="n">3</span>학교 대표 연락처</h3>
              <p>담당 부서를 모를 때는 대표번호로 안내받을 수 있습니다.</p>
              <div className="box">
                <div><Phone size={14} />{CONTACTS.univ.label}: <a href={`tel:${CONTACTS.univ.phone}`}>{CONTACTS.univ.phone}</a></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>다른 전공 조합으로 다시 검색해 보세요</h2>
          <p>학번과 전공 조합을 선택하면 몇 초 안에 공식 원문 위치를 알려드립니다.</p>
        </div>
        <Link to={back} className="btn btn-white">전공 조합 다시 선택하기</Link>
      </section>
    </div>
  );
}
