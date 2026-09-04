import React, { useState } from 'react';
import { Copy, Check, Sparkles, Share2 } from 'lucide-react';
import LottoBall from './LottoBall';

/**
 * ============================================================================
 * [로또 5게임 세트 결과 및 복사 컴포넌트 (GameList)]
 * 
 * - 기능:
 *   1. A, B, C, D, E 5개 게임을 카드 형태로 깔끔하게 렌더링
 *   2. 각 게임당 6개의 로또 공(공식 색상)을 오름차순으로 표시
 *   3. 사용자가 지정한 고정 번호는 은은한 핀 뱃지로 표시
 *   4. [전체 5게임 클립보드 복사] 버튼: 메신저나 메모장에 붙여넣기 좋은 깔끔한 형식으로 원클릭 복사
 *   5. 개별 게임 한 줄 복사 버튼
 * ============================================================================
 */

export default function GameList({ games, fixedNumbers = [] }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          아직 생성된 로또 번호가 없습니다
        </h3>
        <p className="text-xs text-slate-500">
          상단의 <strong>[로또 번호 5게임 생성하기]</strong> 버튼을 눌러 통계 가중치 추첨을 시작하세요!
        </p>
      </div>
    );
  }

  /**
   * 5개 게임 전체를 클립보드에 복사하는 함수
   */
  const handleCopyAll = async () => {
    try {
      const textLines = [
        '🎰 [AI 통계 가중치 추천 로또 5게임]',
        ...games.map((game) => {
          const formattedNums = game.numbers
            .map((n) => String(n).padStart(2, '0'))
            .join(', ');
          return `Game ${game.gameLabel} : ${formattedNums}`;
        }),
        '✨ 이번 주 1등 당첨을 진심으로 기원합니다! ✨',
      ].join('\n');

      await navigator.clipboard.writeText(textLines);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다. 브라우저 권한을 확인해주세요.');
    }
  };

  /**
   * 개별 1개 게임만 복사하는 함수
   */
  const handleCopySingle = async (game, index) => {
    try {
      const formattedNums = game.numbers
        .map((n) => String(n).padStart(2, '0'))
        .join(', ');
      const text = `Game ${game.gameLabel}: ${formattedNums}`;

      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('단일 복사 실패:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* 상단 액션 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            추출된 로또 5게임 (A ~ E)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            최근 당첨 통계 가중치가 반영된 5세트의 번호 조합입니다.
          </p>
        </div>

        {/* 전체 복사 버튼 */}
        <button
          onClick={handleCopyAll}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            copiedAll
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-200'
          }`}
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4" />
              <span>5게임 전체 복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>5게임 전체 복사하기</span>
            </>
          )}
        </button>
      </div>

      {/* 5개 게임 카드 리스트 */}
      <div className="space-y-3">
        {games.map((game, index) => (
          <div
            key={game.gameLabel}
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all group"
          >
            {/* 좌측: 게임 라벨 (A, B, C, D, E) */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                {game.gameLabel}
              </div>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Game {game.gameLabel}
              </span>
            </div>

            {/* 중앙: 6개 로또볼 번호 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              {game.numbers.map((num) => {
                const isFixed = fixedNumbers.includes(num);
                return (
                  <div key={num} className="relative group/num">
                    <LottoBall number={num} size="md" />
                    {isFixed && (
                      <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center shadow font-bold"
                        title="고정 지정 번호"
                      >
                        📌
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 우측: 개별 복사 버튼 */}
            <div className="flex items-center">
              <button
                onClick={() => handleCopySingle(game, index)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs font-medium flex items-center gap-1"
                title="이 게임만 복사"
              >
                {copiedIndex === index ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> 복사됨
                  </span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
