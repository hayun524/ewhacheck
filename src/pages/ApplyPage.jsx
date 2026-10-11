import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Search, Calendar, Info, Phone, ListChecks } from 'lucide-react';
import OfficialCard from '../components/OfficialCard';
import { buildSource, CONTACTS, META, REF_YEAR, majorById } from '../lib/resolve';

/**
 * 다전공 신청 정보 화면 (Figma 1:352)
 * 신청 자격·일정은 '원문 위치 안내' 방식 — 자격 충족 여부 판정, 신청 처리는 하지 않는다.
 * 일정 표의 날짜는 공식 페이지에 적힌 표기만 옮긴다.
 */
export default function ApplyPage() {
  const [sp] = useSearchParams();
  const target = majorById(sp.get('second') ?? '');
  const now = REF_YEAR;
  const s = (id) => buildSource(id, now);

  // 복수전공 원문의 연도 표기(2012학년도~)는 학점중복인정에 대한 것이라, 신청 자격 카드에서는 미확인으로 둔다
  const eligibility = { ...s('ewha-double'), basis: { label: '기준 시점 미확인', known: false } };
  const limit = s('ewha-double-limit');
  const notice = s('notice-2026-2-apply');
  const calendar = s('ewha-calendar');
  const rules = ['ewha-minor', 'ewha-linked', 'ewha-fusion'].map(s);

  return (
    <>
      <div className="sub-header container">
        <nav className="crumb" aria-label="현재 위치"><Link to="/select">홈</Link><span>›</span><span className="cur">다전공 신청 정보</span></nav>
        <span className="badge">APPLY INFO</span>
        <h1>다전공 신청 정보</h1>
        <p>다전공 신청 자격 조건과 신청 일정을 안내합니다. 아래 정보는 공식 원문의 위치를 안내하며, 자격 충족 여부 판정이나 신청 처리는 제공하지 않습니다.</p>
      </div>

      <div className="sub-body container">
        <section className="sec">
          <div className="sec-head">
            <span className="pill">ELIGIBILITY</span>
            <h2>신청 자격 안내</h2>
            <p>다전공 신청에 필요한 자격 조건의 공식 원문 위치를 안내합니다.</p>
          </div>
          <OfficialCard src={eligibility} title="다전공 신청 자격" cta="신청 자격 공식 원문 보기"
            desc="복수전공·부전공·연계전공·융합전공 신청에 필요한 자격 조건을 공식 원문에서 확인하세요. 신청 가능 학기, 신청 제한 전공 등 세부 조건은 학번과 전공에 따라 다를 수 있습니다.">
            <table className="kv-table">
              <tbody>
                <tr><th>대상</th><td>이화여자대학교 학부 재학생 (복수전공·부전공·연계전공·융합전공 신청 예정자)</td></tr>
                <tr><th>원문에서 볼 곳</th><td>‘시기’, ‘신청 제한 전공(학과)’, ‘이수학점’ 항목</td></tr>
                <tr><th>유의사항</th><td>자격 충족 여부는 이 서비스에서 판정하지 않습니다. 본인의 이수 내역은 포털에서 직접 확인하세요.</td></tr>
              </tbody>
            </table>
          </OfficialCard>

          <OfficialCard src={limit} icon={ListChecks} title="학과별 복수전공 승인제한 조건" cta="승인제한 조건 원문 보기"
            desc="학과마다 누계평점, 지정 과목 이수, 오디션·포트폴리오 등 별도 승인 조건과 신청 가능 입학년도가 정해져 있습니다.">
            {target && (
              <p className="target-hint"><b>{target.name}</b> 지원 예정이라면 원문 표에서 ‘{target.collegeName} · {target.name}’ 행을 확인하세요.</p>
            )}
          </OfficialCard>

          <div className="mini-links">
            <p className="label-dot"><i />다전공 유형별 규정 원문</p>
            {rules.map((r) => (
              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer">
                <span>{r.title}<br /><small>{r.location.join(' › ')}</small></span>
              </a>
            ))}
          </div>
        </section>

        <section className="sec">
          <div className="sec-head">
            <span className="pill">SCHEDULE</span>
            <h2>신청 일정 안내</h2>
            <p>다전공 신청 일정의 공식 원문 위치를 안내합니다. 실제 일정은 반드시 공식 공지사항에서 확인하세요.</p>
          </div>
          <OfficialCard src={notice} title="2026학년도 제2학기 다전공 신청 일정" cta="신청 일정 공식 원문 보기">
            <div className="notice-amber with-icon"><AlertTriangle size={16} />아래 일정은 공식 원문에 적힌 표기를 옮긴 것입니다. 실제 신청 기간과 방법은 반드시 공식 공지사항에서 확인하세요.</div>
            <div className="grid-table" role="table" aria-label="다전공 신청 일정">
              <div role="row" className="gt-head"><span role="columnheader">구분</span><span role="columnheader">신청 기간 (원문 표기)</span><span role="columnheader">대상</span><span role="columnheader">출처</span></div>
              <div role="row"><span>부ㆍ복수전공 신청 및 취소 (2026-2학기)</span><span>학사일정 표기일 2026.10.01 · 정확한 기간은 공지 원문 확인</span><span>학부 재학생</span><span>학과 홈페이지 학사일정</span></div>
              <div role="row"><span>정기 신청·취소 시기</span><span>4월 경, 10월 경</span><span>전공결정 이후 1학년 2학기부터 재학 중인 학기 (휴학생 불가)</span><span>복수전공 규정 원문</span></div>
              <div role="row"><span>신청 불가 시점</span><span>학부수료(과정수료/졸업유예) 이후</span><span>—</span><span>복수전공 규정 원문</span></div>
            </div>
          </OfficialCard>
          <div className="mini-links">
            <p className="label-dot"><i />함께 확인할 공식 원문</p>
            <a href={calendar.url} target="_blank" rel="noopener noreferrer"><span>{calendar.title}<br /><small>{calendar.location.join(' › ')}</small></span></a>
          </div>
        </section>

        <section className="sec">
          <div className="sec-head">
            <span className="pill">OUR PROMISE</span>
            <h2>출처 및 기준 시점 안내</h2>
            <p>추측이나 요약 없이, 공식 채널의 원문 위치만을 정확하게 전달합니다.</p>
          </div>
          <div className="promise-row">
            <div className="promise-card"><span className="pc-ico"><Search size={20} /></span><b>출처</b><p>이화여자대학교 홈페이지 학사안내(전공선택) 및 공지사항, 각 학과 학사일정</p></div>
            <div className="promise-card"><span className="pc-ico"><Calendar size={20} /></span><b>기준 시점</b><p>신청 자격: 원문에 적용 연도 미표기 / 신청 일정: 2026학년도 제2학기 공지 · 이화첵 확인일 {META.lastChecked}</p></div>
            <div className="promise-card"><span className="pc-ico"><Info size={20} /></span><b>유의사항</b><p>기준 시점이 미확인인 정보는 반드시 공식 채널에서 최신 여부를 확인하세요.</p></div>
          </div>
        </section>

        <section className="sec">
          <div className="sec-head">
            <span className="pill">CONTACT</span>
            <h2>정보를 찾기 어렵다면</h2>
            <p>원문 위치가 변경되었거나 안내된 링크에서 정보를 찾기 어려운 경우, 해당 학과 사무실 또는 학교 대표번호로 문의하세요.</p>
          </div>
          <div className="contact-box">
            <div>
              <p className="cb-title"><span className="pc-ico sm"><Phone size={16} /></span>{CONTACTS.univ.label}</p>
              <p><a href={`tel:${CONTACTS.univ.phone}`}>{CONTACTS.univ.phone}</a></p>
            </div>
            <span className="cb-div" aria-hidden="true" />
            <div>
              <p className="cb-title"><span className="pc-ico sm"><Phone size={16} /></span>{target?.office ? target.office.label : '지원 학과 사무실'}</p>
              <p>{target?.office?.phone
                ? <a href={`tel:${target.office.phone}`}>{target.office.phone}</a>
                : '조합 선택에서 다전공 전공을 고르면 해당 연락처를 안내합니다.'}</p>
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div>
            <h2>지금 바로 내 전공 조합을 확인해 보세요</h2>
            <p>학번과 전공 조합을 선택하면 몇 초 안에 공식 원문 위치를 알려드립니다.</p>
          </div>
          <Link to="/select" className="btn btn-white">전공 조합 선택 시작하기</Link>
        </section>
      </div>
    </>
  );
}
