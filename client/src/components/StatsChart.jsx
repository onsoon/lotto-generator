import React, { useState } from 'react';
import { Flame, Snowflake, BarChart3, ChevronDown, ChevronUp, Sparkles, Trophy } from 'lucide-react';
import LottoBall from './LottoBall';

/**
 * ============================================================================
 * [로또 통계 및 Hot/Cold 시각화 컴포넌트 (StatsChart)]
 * 
 * - 기능:
 *   1. 동행복권 최신 회차 당첨 번호 및 보너스 번호 표시
 *   2. 최근 30회차 기준 가장 많이 출현한 Hot 번호 Top 5
 *   3. 최근 30회차 기준 가장 적게 출현한 Cold 번호 Top 5
 *   4. 1~45번 전체 출현 빈도수 히트맵/막대 차트 (접기/펼치기 가능)
 * ============================================================================
 */

export default function StatsChart({ statsData, isLoading, onSelectHot, onSelectCold }) {
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-100 rounded-xl mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-100 rounded-xl"></div>
          <div className="h-24 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!statsData) {
    return null;
  }

  const { latestDrwNo, analyzedCount, latestDraw, hotNumbers, coldNumbers, statsList } = statsData;

  // 최대 출현 횟수 (차트 상대 높이 계산용)
  const maxCount = Math.max(...statsList.map((item) => item.count), 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
      {/* 1. 최신 당첨 회차 안내 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              동행복권 공식 최신 결과
            </span>
            <span className="text-sm font-extrabold text-slate-800">
              제 {latestDrwNo}회 당첨 번호
            </span>
            {latestDraw?.drwNoDate && (
              <span className="text-xs text-slate-400">({latestDraw.drwNoDate} 추첨)</span>
            )}
          </div>
        </div>

        {/* 최신 당첨 공 6개 + 보너스 번호 */}
        {latestDraw && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {latestDraw.numbers.map((num) => (
              <LottoBall key={num} number={num} size="sm" />
            ))}
            <span className="text-slate-400 font-black text-xs mx-1">+</span>
            <LottoBall number={latestDraw.bnusNo} size="sm" isBonus={true} />
          </div>
        )}
      </div>

      {/* 2. Hot & Cold 번호 큐레이션 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hot 번호 (자주 나온 번호) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-sm">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>최근 {analyzedCount}회 최다 출현 (HOT Top 5)</span>
            </div>
            {onSelectHot && (
              <button
                onClick={onSelectHot}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-white/80 hover:bg-white px-2 py-0.5 rounded shadow-sm transition-all"
                title="HOT 번호 5개를 고정 번호로 자동 지정"
              >
                + 고정 번호로 담기
              </button>
            )}
          </div>
          <div className="flex items-center justify-around">
            {hotNumbers.map((item) => (
              <div key={item.number} className="text-center">
                <LottoBall number={item.number} size="sm" />
                <span className="block text-[11px] font-extrabold text-rose-600 mt-1">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold 번호 (적게 나온 번호) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-sky-700 font-extrabold text-sm">
              <Snowflake className="w-4 h-4 text-sky-500" />
              <span>최근 {analyzedCount}회 최소 출현 (COLD Top 5)</span>
            </div>
            {onSelectCold && (
              <button
                onClick={onSelectCold}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-white/80 hover:bg-white px-2 py-0.5 rounded shadow-sm transition-all"
                title="COLD 번호 5개를 제외 번호로 자동 지정"
              >
                + 제외 번호로 담기
              </button>
            )}
          </div>
          <div className="flex items-center justify-around">
            {coldNumbers.map((item) => (
              <div key={item.number} className="text-center">
                <LottoBall number={item.number} size="sm" />
                <span className="block text-[11px] font-extrabold text-sky-600 mt-1">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 1~45번 전체 빈도수 히트맵 차트 아코디언 */}
      <div className="pt-2">
        <button
          onClick={() => setIsChartExpanded(!isChartExpanded)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            1~45번 전체 번호별 출현 빈도수 상세 차트 ({analyzedCount}회차 분석)
          </span>
          <span className="flex items-center gap-1 text-indigo-600">
            {isChartExpanded ? '접기' : '자세히 보기'}
            {isChartExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </button>

        {isChartExpanded && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            <div className="min-w-[700px] flex items-end justify-between gap-1 h-36 pt-4 pb-2">
              {statsList.map((item) => {
                const heightPercent = Math.max(8, (item.count / maxCount) * 100);
                return (
                  <div
                    key={item.number}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* 툴팁 */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                      {item.number}번: {item.count}회
                    </div>

                    {/* 막대 그래프 */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all group-hover:brightness-90 ${
                        item.count >= maxCount * 0.75
                          ? 'bg-rose-500'
                          : item.count <= maxCount * 0.3
                          ? 'bg-slate-300'
                          : 'bg-indigo-400'
                      }`}
                    />

                    {/* 번호 라벨 */}
                    <span className="text-[10px] font-bold text-slate-500 mt-1">
                      {item.number}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1 border-t border-slate-200 pt-2">
              <span>* 붉은색 막대: 상위 출현 번호 (가중치 높음)</span>
              <span>* 회색 막대: 하위 출현 번호</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
