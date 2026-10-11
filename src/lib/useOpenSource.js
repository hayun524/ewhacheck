import { useLocation, useNavigate } from 'react-router-dom';

/** 원문 바로가기: 사용자 클릭 시점에 새 탭을 열고(팝업 차단 회피), 현재 탭은 이동 안내 화면으로 */
export function useOpenSource() {
  const navigate = useNavigate();
  const location = useLocation();
  return (src) => {
    window.open(src.url, '_blank', 'noopener,noreferrer');
    const params = new URLSearchParams({ src: src.id, url: src.url, back: location.pathname + location.search });
    navigate(`/go?${params}`);
  };
}
