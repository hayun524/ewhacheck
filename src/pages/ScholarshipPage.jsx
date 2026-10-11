import { Link, useSearchParams } from 'react-router-dom';
import { Award, Calendar, Bell, HelpCircle, BookOpen, Globe, Info } from 'lucide-react';
import OfficialCard from '../components/OfficialCard';
import { buildSource, majorById, META, REF_YEAR } from '../lib/resolve';

/** 학과 장학 페이지가 공식 사이트에서 확인된 전공 */
const DEPT_SCHOLAR = { cse: 'scholar-cse', biz: 'scholar-biz' };

/**
 * 장학금 정보 화면 (Figma 1:458)
 * 장학금 이름·금액·선발 기준은 원문에서 확인되지 않은 내용을 쓰지 않는다. 위치·출처·기준 시점만 안내.
 */
export default function ScholarshipPage() {
  const [sp] = useSearchParams();
  const now = REF_YEAR;
  const s = (id) => buildSource(id, now);
  const picked = [sp.get('main'), sp.get('second')].map((id) => majorById(id ?? '')).filter(Boolean);
  const pickedDept = picked.filter((m) => DEPT_SCHOLAR[m.id]);
  const deptList = pickedDept.length ? pickedDept : Object.keys(DEPT_SCHOLAR).map(majorById);

  return (
    <>
      <div className="hero-center container">
        <span className="badge-lg"><Award size={14} />장학금 안내</span>
        <h1>장학금 정보</h1>
        <p>다전공 학생에게 해당할 수 있는 장학금 정보를 안내합니다. 자격 충족 여부 판정이나 신청 처리는 제공하지 않으며, 공식 원문에서 직접 확인하시기 바랍니다.</p>
      </div>

      <div className="sub-body container">
        <section className="sec">
          <div className="sec-head">
            <span className="pill">UNIVERSITY SCHOLARSHIP</span>
            <h2>교내 장학금 공식 원문</h2>
            <p>이화여자대학교 장학 메뉴의 공식 원문 위치입니다. 다전공 이수 여부와 관련된 조건은 각 장학 공고에서 확인하세요.</p>
          </div>
          <div className="notice-amber with-icon">
            <Info size={16} />
            이화첵에는 아직 ‘다전공 이수자 전용’ 장학금 원문이 등록되어 있지 않습니다 ({META.lastChecked} 기준). 장학공지에서 최신 공고를 확인하세요.
          </div>
          <OfficialCard src={s('scholar-info')} icon={Award} desc="교내·교외 장학금의 종류와 신청 자격이 게시된 학교 공식 페이지입니다." />
          <OfficialCard src={s('scholar-notice')} icon={Bell} desc="학기별 장학 공고가 올라오는 게시판입니다. 공고마다 대상·기간이 다르므로 게시일을 확인하세요." />
          <OfficialCard src={s('scholar-sche')} icon={Calendar} desc="학기별 장학 신청 일정이 게시된 페이지입니다." />
          <OfficialCard src={s('scholar-faq')} icon={HelpCircle} desc="장학 관련 자주 묻는 질문 페이지입니다." />
        </section>

        <section className="sec">
          <div className="sec-head">
            <span className="pill">DEPARTMENT</span>
            <h2>학과(전공) 장학 안내</h2>
            <p>{pickedDept.length ? '선택한 조합의 학과 장학 페이지입니다.' : '학과 홈페이지에 장학 메뉴가 있는 것으로 확인된 전공입니다. 다른 전공은 학과 홈페이지 공지사항을 확인하세요.'}</p>
          </div>
          {deptList.map((m) => (
            <OfficialCard key={m.id} src={s(DEPT_SCHOLAR[m.id])} icon={BookOpen} desc={`${m.collegeName} ${m.name} 홈페이지의 장학 안내입니다.`} />
          ))}
        </section>

        <section className="sec">
          <div className="sec-head">
            <span className="pill">NATIONAL &amp; EXTERNAL</span>
            <h2>국가·외부 장학금</h2>
            <p>국가기관 또는 외부 재단의 장학금은 해당 기관의 공식 원문에서 확인하세요.</p>
          </div>
          <OfficialCard src={s('kosaf')} icon={Globe} desc="국가장학금 등 정부 장학금의 신청 자격과 일정이 게시된 공식 사이트입니다." />
        </section>

        <div className="info-left">
          <p className="il-title"><span className="pc-ico sm"><Info size={14} /></span>안내</p>
          <p>이 페이지에서 제공하는 장학금 정보는 공식 원문의 위치와 기준 시점을 안내하는 것으로, 자격 충족 여부를 판단하거나 신청을 대행하지 않습니다. 장학금 수혜 여부는 반드시 해당 원문과 담당 부서를 통해 직접 확인하시기 바랍니다.</p>
        </div>

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
