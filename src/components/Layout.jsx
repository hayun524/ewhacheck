import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Info } from 'lucide-react';

// TODO: Figma 로고 이미지(logo-icon/logo-text)로 교체 — 현재는 임시 워드마크
function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <BookOpen size={18} strokeWidth={2.25} />
    </span>
  );
}

export function Navbar() {
  return (
    <header className="navbar container">
      <Link to="/select" className="logo" aria-label="이화첵 홈">
        <LogoMark />
        <span className="logo-text">이화첵</span>
      </Link>
      <nav className="nav-links" aria-label="주요 메뉴">
        {/* 이용 방법·주요 기능은 홈 화면 구현 후 연결 */}
        {['이용 방법', '주요 기능'].map((t) => (
          <span key={t} className="soon" title="홈 화면 구현 후 연결 예정">{t}</span>
        ))}
        <NavLink to="/apply" className="nav-link">다전공 신청</NavLink>
        <NavLink to="/scholarship" className="nav-link">장학금</NavLink>
        <Link to="/select" className="btn btn-primary">시작하기</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <div className="footer-logo"><LogoMark />이화첵</div>
        <div className="footer-links">
          <span>이용 방법</span><span>주요 기능</span>
          <Link to="/apply" style={{ textDecoration: 'none' }}>다전공 신청</Link>
          <Link to="/scholarship" style={{ textDecoration: 'none' }}>장학금</Link>
        </div>
      </div>
      <hr className="divider" />
      <div className="footer-bottom">
        <p>© 2026 이화첵. 이화여자대학교 공식 서비스가 아닙니다.</p>
        <p className="with-icon"><Info size={12} />본 서비스는 졸업요건 원문 위치만을 안내하며, 학점 계산이나 자격 판정을 하지 않습니다.</p>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  );
}
