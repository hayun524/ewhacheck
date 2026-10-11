import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SelectPage from './pages/SelectPage';
import ResultPage from './pages/ResultPage';
import NonePage from './pages/NonePage';
import GoPage from './pages/GoPage';
import ApplyPage from './pages/ApplyPage';
import ScholarshipPage from './pages/ScholarshipPage';
import './pages.css';

// 첫 버전 핵심 플로우: 조합 선택 → 결과 → 원문 이동 / 원문 없음
// + 다전공 신청 정보(/apply), 장학금 정보(/scholarship). 홈·저장된 조합 화면은 다음 단위에서 추가
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/select" replace />} />
          <Route path="/select" element={<SelectPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/none" element={<NonePage />} />
          <Route path="/go" element={<GoPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/scholarship" element={<ScholarshipPage />} />
          <Route path="*" element={<Navigate to="/select" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
