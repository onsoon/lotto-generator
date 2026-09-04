import React, { useState } from 'react';
import { Pin, Ban, RotateCcw, Info, Check } from 'lucide-react';
import LottoBall, { getLottoBallStyle } from './LottoBall';

/**
 * ============================================================================
 * [1~45 번호판 인터랙티브 선택기 (NumberSelector)]
 * 
 * - 기능:
 *   1. 📌 고정 번호(Inclusion): 모든 게임에 반드시 포함할 번호 (최대 5개)
 *   2. ❌ 제외 번호(Exclusion): 모든 게임에서 완전히 뺄 번호 (최대 10개)
 *   3. 모드 전환 탭(고정 모드 / 제외 모드)을 통해 1~45번 클릭 시 즉시 반영
 *   4. 이미 선택된 번호를 다시 누르면 해제
 *   5. 선택된 번호들을 태그 뱃지로 한눈에 보고 개별 삭제 가능
 * ============================================================================
 */

export default function NumberSelector({
  fixedNumbers,
  setFixedNumbers,
  excludedNumbers,
  setExcludedNumbers,
}) {
  // 현재 선택 모드: 'FIXED'(고정 번호 선택) 또는 'EXCLUDED'(제외 번호 선택)
  const [activeMode, setActiveMode] = useState('FIXED');

  /**
   * 번호 클릭 핸들러
   * @param {number} num - 클릭한 로또 번호 (1~45)
   */
  const handleNumberClick = (num) => {
    const isFixed = fixedNumbers.includes(num);
    const isExcluded = excludedNumbers.includes(num);

    if (activeMode === 'FIXED') {
      // 고정 모드일 때
      if (isFixed) {
        // 이미 고정되어 있으면 해제
        setFixedNumbers(fixedNumbers.filter((n) => n !== num));
      } else {
        // 새로 고정하려는 경우: 최대 5개 제한 확인
        if (fixedNumbers.length >= 5) {
          alert('고정 번호는 최대 5개까지만 지정할 수 있습니다.');
          return;
        }
        // 만약 이미 제외 번호에 들어있다면 제외에서 빼고 고정으로 이동
        if (isExcluded) {
          setExcludedNumbers(excludedNumbers.filter((n) => n !== num));
        }
        setFixedNumbers([...fixedNumbers, num].sort((a, b) => a - b));
      }
    } else {
      // 제외 모드일 때
      if (isExcluded) {
        // 이미 제외되어 있으면 해제
        setExcludedNumbers(excludedNumbers.filter((n) => n !== num));
      } else {
        // 새로 제외하려는 경우: 최대 10개 제한 확인
        if (excludedNumbers.length >= 10) {
          alert('제외 번호는 최대 10개까지만 지정할 수 있습니다.');
          return;
        }
        // 만약 이미 고정 번호에 들어있다면 고정에서 빼고 제외로 이동
        if (isFixed) {
          setFixedNumbers(fixedNumbers.filter((n) => n !== num));
        }
        setExcludedNumbers([...excludedNumbers, num].sort((a, b) => a - b));
      }
    }
  };

  // 고정 번호 개별 삭제
  const removeFixed = (num) => {
    setFixedNumbers(fixedNumbers.filter((n) => n !== num));
  };

  // 제외 번호 개별 삭제
  const removeExcluded = (num) => {
    setExcludedNumbers(excludedNumbers.filter((n) => n !== num));
  };

  // 전체 초기화
  const handleResetAll = () => {
    setFixedNumbers([]);
    setExcludedNumbers([]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* 상단 헤더 및 초기화 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            번호 맞춤 설정 (고정 / 제외)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            아래 모드를 선택하고 번호판(1~45)을 클릭하여 나만의 번호 조건을 설정하세요.
          </p>
        </div>

        <button
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"
          title="설정한 고정/제외 번호 모두 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          설정 초기화
        </button>
      </div>

      {/* 모드 선택 탭 (고정 번호 모드 vs 제외 번호 모드) */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl mb-5">
        <button
          onClick={() => setActiveMode('FIXED')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
            activeMode === 'FIXED'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pin className="w-4 h-4" />
          <span>고정 번호 설정</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              activeMode === 'FIXED'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {fixedNumbers.length}/5
          </span>
        </button>

        <button
          onClick={() => setActiveMode('EXCLUDED')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
            activeMode === 'EXCLUDED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>제외 번호 설정</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              activeMode === 'EXCLUDED'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {excludedNumbers.length}/10
          </span>
        </button>
      </div>

      {/* 1 ~ 45 번호판 그리드 */}
      <div className="grid grid-cols-9 sm:grid-cols-9 md:grid-cols-9 gap-1.5 sm:gap-2 mb-5">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
          const isFixed = fixedNumbers.includes(num);
          const isExcluded = excludedNumbers.includes(num);
          const style = getLottoBallStyle(num);

          let stateBorder = 'border-slate-200';
          let badgeIcon = null;

          if (isFixed) {
            stateBorder = 'ring-2 ring-indigo-500 ring-offset-2 scale-105 z-10';
            badgeIcon = (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow">
                📌
              </span>
            );
          } else if (isExcluded) {
            stateBorder = 'opacity-40 grayscale line-through';
            badgeIcon = (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shadow">
                ✕
              </span>
            );
          }

          return (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl border bg-white hover:bg-slate-50 transition-all duration-150 ${stateBorder}`}
            >
              {badgeIcon}
              <LottoBall number={num} size="sm" />
              <span className="text-[11px] font-semibold text-slate-500 mt-1">
                {num}
              </span>
            </button>
          );
        })}
      </div>

      {/* 현재 선택된 고정 / 제외 번호 요약 칩 */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        {/* 고정 번호 목록 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Pin className="w-3 h-3" />
            고정 번호 ({fixedNumbers.length}/5)
          </span>
          {fixedNumbers.length === 0 ? (
            <span className="text-xs text-slate-400">지정된 고정 번호가 없습니다.</span>
          ) : (
            fixedNumbers.map((num) => (
              <span
                key={num}
                onClick={() => removeFixed(num)}
                className="inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold cursor-pointer transition-colors"
                title="클릭하여 제거"
              >
                <LottoBall number={num} size="xs" />
                <span>{num}</span>
                <span className="text-indigo-400 hover:text-indigo-700 ml-0.5">✕</span>
              </span>
            ))
          )}
        </div>

        {/* 제외 번호 목록 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Ban className="w-3 h-3" />
            제외 번호 ({excludedNumbers.length}/10)
          </span>
          {excludedNumbers.length === 0 ? (
            <span className="text-xs text-slate-400">지정된 제외 번호가 없습니다.</span>
          ) : (
            excludedNumbers.map((num) => (
              <span
                key={num}
                onClick={() => removeExcluded(num)}
                className="inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold cursor-pointer transition-colors"
                title="클릭하여 제거"
              >
                <LottoBall number={num} size="xs" />
                <span className="line-through">{num}</span>
                <span className="text-rose-400 hover:text-rose-700 ml-0.5">✕</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
