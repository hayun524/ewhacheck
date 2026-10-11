import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { matchMajor } from '../lib/resolve';

/** 전공 검색 + 단과대학별 그룹 선택. 검색어로 목록을 좁히고, 선택은 select로 한다 */
export default function MajorPicker({ id, label, options, value, onChange, disabled }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => options.filter((m) => matchMajor(m, q) || m.id === value), [options, q, value]);
  const groups = useMemo(() => {
    const g = new Map();
    filtered.forEach((m) => { if (!g.has(m.collegeName)) g.set(m.collegeName, []); g.get(m.collegeName).push(m); });
    return [...g.entries()];
  }, [filtered]);

  return (
    <>
      <div className="picker-search">
        <Search size={14} aria-hidden="true" />
        <input
          type="search" placeholder="전공명 또는 단과대학으로 검색 (예: 통계, 사범)" value={q}
          onChange={(e) => setQ(e.target.value)} disabled={disabled} aria-label={`${label} 검색`}
          aria-controls={id}
        />
        {q && <span className="picker-count">{filtered.length}개</span>}
      </div>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={onChange} disabled={disabled}>
        <option value="">{filtered.length ? '선택해 주세요' : '검색 결과가 없습니다'}</option>
        {groups.map(([college, list]) => (
          <optgroup key={college} label={college}>
            {list.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </optgroup>
        ))}
      </select>
    </>
  );
}
