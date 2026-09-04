import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Dices, 
  RefreshCw, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

import LottoBall from './components/LottoBall';
import NumberSelector from './components/NumberSelector';
import StatsChart from './components/StatsChart';
import GameList from './components/GameList';
import { generateFiveLottoGames } from './utils/lottoGenerator';

/**
 * ============================================================================
 * [로또 5게임 생성기 메인 앱 컴포넌트 (App)]
 * 
 * - 기능:
 *   1. 백엔드 통계 API(/api/lotto-stats) 연동 및 최근 30회차 당첨 빈도수 수신
 *   2. 사용자가 선택한 고정 번호(최대 5개)와 제외 번호(최대 10개) 상태 관리
 *   3. 가중치 랜덤 추첨 알고리즘 기반 5게임(A~E) 동시 생성
 *   4. 생성 시 재미와 생동감을 더하는 색종이 폭죽(confetti) 애니메이션
 *   5. Hot 번호 일괄 고정 / Cold 번호 일괄 제외 바로가기 기능
 * ============================================================================
 */

export default function App() {
  // 백엔드 통계 데이터 상태
  const [statsData, setStatsData] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // 사용자 선택 조건
  const [fixedNumbers, setFixedNumbers] = useState([]);      // 고정 번호 (최대 5개)
  const [excludedNumbers, setExcludedNumbers] = useState([]);  // 제외 번호 (최대 10개)

  // 생성된 5게임 결과 상태
  const [generatedGames, setGeneratedGames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 기본 가중치 (Base Weight)
  const baseWeight = 1;

  /**
   * 컴포넌트 마운트 시 백엔드 로또 통계 데이터 호출
   */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch('/api/lotto-stats?count=30');
      const json = await response.json();

      if (json.success && json.data) {
        setStatsData(json.data);
      } else {
        throw new Error(json.message || '통계 데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('통계 로딩 에러:', err);
      setStatsError('동행복권 최신 통계를 불러오는 중 일시적인 지연이 발생했습니다. 기본 가중치로 생성할 수 있습니다.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  /**
   * 로또 5게임 생성 핸들러
   */
  const handleGenerateGames = () => {
    try {
      setIsGenerating(true);

      const frequencyMap = statsData ? statsData.frequencyMap : {};
      const newGames = generateFiveLottoGames(
        frequencyMap,
        fixedNumbers,
        excludedNumbers,
        baseWeight
      );

      setGeneratedGames(newGames);

      // 기분 좋은 당첨 기원 콘페티(폭죽) 효과 실행
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FBC400', '#69C8F2', '#FF7272', '#AAAAAA', '#B0D840'],
        });
      } catch (e) {
        // 무시
      }

      // 생성 결과 영역으로 스무스 스크롤
      setTimeout(() => {
        const resultElem = document.getElementById('results-section');
        if (resultElem) {
          resultElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * HOT 번호 5개를 고정 번호로 자동 담기
   */
  const handleSelectHot = () => {
    if (!statsData?.hotNumbers) return;
    const hotList = statsData.hotNumbers.map((item) => item.number);
    setFixedNumbers(hotList.slice(0, 5));
    // 혹시 제외 번호에 포함되어 있었다면 제외에서 제거
    setExcludedNumbers(excludedNumbers.filter((n) => !hotList.includes(n)));
  };

  /**
   * COLD 번호 5개를 제외 번호로 자동 담기
   */
  const handleSelectCold = () => {
    if (!statsData?.coldNumbers) return;
    const coldList = statsData.coldNumbers.map((item) => item.number);
    const updatedExcluded = Array.from(new Set([...excludedNumbers, ...coldList])).slice(0, 10);
    setExcludedNumbers(updatedExcluded);
    // 혹시 고정 번호에 포함되어 있었다면 고정에서 제거
    setFixedNumbers(fixedNumbers.filter((n) => !coldList.includes(n)));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. 상단 내비게이션 / 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                AI 통계 가중치 로또 5게임 생성기
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                동행복권 공식 데이터 기반 가중치 랜덤 추첨 시스템
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={isLoadingStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              title="최신 회차 통계 다시 불러오기"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">통계 새로고침</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 통계 로딩 지연 알림 (필요 시) */}
        {statsError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{statsError}</span>
          </div>
        )}

        {/* 1) 최신 당첨 번호 및 통계 시각화 카드 */}
        <StatsChart
          statsData={statsData}
          isLoading={isLoadingStats}
          onSelectHot={handleSelectHot}
          onSelectCold={handleSelectCold}
        />

        {/* 2) 1~45 번호판 선택기 (고정/제외 번호 설정) */}
        <NumberSelector
          fixedNumbers={fixedNumbers}
          setFixedNumbers={setFixedNumbers}
          excludedNumbers={excludedNumbers}
          setExcludedNumbers={setExcludedNumbers}
        />

        {/* 3) 대형 로또 5게임 생성 버튼 */}
        <div className="pt-2 pb-2">
          <button
            onClick={handleGenerateGames}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span>통계 가중치 기반 로또 5게임(A~E) 즉시 생성</span>
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              고정 번호 우선 배치
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              제외 번호 100% 배제
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              최근 빈도수 확률 가중치 반영
            </span>
          </div>
        </div>

        {/* 4) 생성된 로또 5게임 결과 목록 (A ~ E) */}
        <section id="results-section">
          <GameList games={generatedGames} fixedNumbers={fixedNumbers} />
        </section>
      </main>
    </div>
  );
}
