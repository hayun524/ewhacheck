import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, CircleCheck } from 'lucide-react';
import data from '../data/sources.json';

export default function GoPage() {
  const [sp] = useSearchParams();
  const known = data.sources[sp.get('src') ?? ''];
  // 학번별로 URL이 달라지는 원문이 있어 실제 연 URL(url 파라미터)을 우선 쓴다. 단, 등록된 원문 도메인일 때만
  const passed = sp.get('url');
  const isOfficial = (u) => /^https?:\/\/([\w-]+\.)*ewha\.ac\.kr(\/|$)|^https:\/\/www\.kosaf\.go\.kr/.test(u ?? '');
  const src = known && { ...known, url: isOfficial(passed) ? passed : known.url };
  const back = sp.get('back');
  const safeBack = back && back.startsWith('/') ? back : '/select';

  return (
    <div className="go-body">
      <div className="go-inner">
        <div className="go-ring"><span><BookOpen size={22} /></span></div>
        <div className="go-text">
          <span className="pill">OFFICIAL DOCUMENT</span>
          <h1>공식 원문으로 이동 중입니다</h1>
          <p className="lead">새 탭에서 졸업요건 원문이 열립니다.</p>
          <p className="sub">이화여자대학교 공식 채널의 원문 위치로 연결됩니다. 잠시만 기다려 주세요.</p>
        </div>
        <div className="progress" aria-hidden="true">
          <div className="track"><div className="fill" /></div>
          공식 채널로 연결 중...
        </div>
        {src ? (
          <p className="sub" style={{ fontSize: 13, color: 'var(--ink-500)' }}>
            새 탭이 열리지 않았다면{' '}
            <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-900)', fontWeight: 600 }}>
              {src.title} 바로 열기
            </a>
          </p>
        ) : (
          <p className="sub" style={{ fontSize: 13, color: 'var(--red-ink)' }}>연결할 원문 정보를 찾지 못했습니다. 이전 화면에서 다시 선택해 주세요.</p>
        )}
        <div className="trust-note">
          <CircleCheck size={14} style={{ flexShrink: 0 }} />
          공식 원문만 안내합니다 — 요약이나 수정 없이 원문 위치 그대로 연결됩니다.
        </div>
        <div className="go-back">
          돌아가기
          <Link to={safeBack} className="btn btn-primary">이전 화면으로</Link>
        </div>
      </div>
    </div>
  );
}
