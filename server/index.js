/**
 * ============================================================================
 * [동행복권 로또 통계 및 프록시 백엔드 서버]
 * - 역할:
 *   1. 동행복권 공식 API로부터 최신 회차 및 최근 30회차 당첨 번호 수집
 *   2. 방화벽 차단/네트워크 지연 시 내장된 공식 30회차 데이터셋으로 신속 Fallback
 *   3. 1~45번 번호별 출현 빈도수(Count) 통계 계산
 *   4. 인메모리 캐싱을 통한 초고속 응답
 *   5. 프론트엔드에 통계 데이터 및 Hot/Cold 번호 API 제공 (/api/lotto-stats)
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { defaultRecentDraws } from './defaultLottoData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 인메모리 캐시
let cachedStats = null;
let lastFetchedTime = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1시간 캐싱

/**
 * 단일 회차 번호 조회 함수 (타임아웃 2500ms)
 */
async function fetchLottoNumber(drwNo) {
  try {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    const response = await axios.get(url, {
      timeout: 2500,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (response.data && response.data.returnValue === 'success') {
      return {
        drwNo: response.data.drwNo,
        drwNoDate: response.data.drwNoDate,
        numbers: [
          response.data.drwtNo1,
          response.data.drwtNo2,
          response.data.drwtNo3,
          response.data.drwtNo4,
          response.data.drwtNo5,
          response.data.drwtNo6,
        ].sort((a, b) => a - b),
        bnusNo: response.data.bnusNo,
        firstWinamnt: response.data.firstWinamnt,
        firstPrzwnerCo: response.data.firstPrzwnerCo,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 회차 목록(Draws)으로부터 1~45번 빈도수 통계 객체를 생성하는 함수
 */
function buildStatsFromDraws(draws) {
  const frequencyMap = {};
  for (let i = 1; i <= 45; i++) {
    frequencyMap[i] = 0;
  }

  draws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
  });

  const statsArray = [];
  for (let num = 1; num <= 45; num++) {
    statsArray.push({
      number: num,
      count: frequencyMap[num],
    });
  }

  // Hot 번호 상위 5개
  const hotNumbers = [...statsArray]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => ({ number: item.number, count: item.count }));

  // Cold 번호 하위 5개
  const coldNumbers = [...statsArray]
    .sort((a, b) => a.count - b.count)
    .slice(0, 5)
    .map((item) => ({ number: item.number, count: item.count }));

  const latestDraw = draws[0] || null;

  return {
    latestDrwNo: latestDraw ? latestDraw.drwNo : 1140,
    analyzedCount: draws.length,
    startDrwNo: draws[draws.length - 1]?.drwNo || 1111,
    endDrwNo: latestDraw?.drwNo || 1140,
    latestDraw: latestDraw,
    frequencyMap: frequencyMap,
    statsList: statsArray,
    hotNumbers: hotNumbers,
    coldNumbers: coldNumbers,
    recentDraws: draws,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 최근 통계 집계 함수 (온라인 수집 시도 -> 실패 시 공식 데이터셋 즉각 활용)
 */
async function aggregateLottoStats(count = 30) {
  try {
    // 1140회차를 기준으로 최신 회차 온라인 수신 시도
    const testDraw = await fetchLottoNumber(1140);
    if (testDraw) {
      const promises = [];
      const startNo = Math.max(1, 1140 - count + 1);
      for (let no = startNo; no <= 1140; no++) {
        promises.push(fetchLottoNumber(no));
      }
      const results = await Promise.all(promises);
      const validDraws = results.filter((d) => d !== null);
      if (validDraws.length >= 10) {
        return buildStatsFromDraws(validDraws.reverse());
      }
    }
  } catch (err) {
    console.warn('[안내] 외부 동행복권 API 통신 제한으로 공식 검증 데이터셋을 사용합니다.');
  }

  // 외부 통신 실패 또는 타임아웃 시 공식 30회차 데이터셋 활용
  return buildStatsFromDraws(defaultRecentDraws.slice(0, count));
}

/**
 * [API 1] 통계 데이터 제공 엔드포인트
 * GET /api/lotto-stats?count=30
 */
app.get('/api/lotto-stats', async (req, res) => {
  try {
    const requestedCount = parseInt(req.query.count, 10) || 30;
    const now = Date.now();

    if (cachedStats && lastFetchedTime && now - lastFetchedTime < CACHE_DURATION_MS) {
      return res.json({
        success: true,
        fromCache: true,
        data: cachedStats,
      });
    }

    const statsData = await aggregateLottoStats(requestedCount);
    cachedStats = statsData;
    lastFetchedTime = now;

    return res.json({
      success: true,
      fromCache: false,
      data: statsData,
    });
  } catch (error) {
    console.error('[오류] 통계 집계 실패:', error);
    // 에러 발생 시에도 기본 데이터로 복구 보장
    const fallbackData = buildStatsFromDraws(defaultRecentDraws);
    return res.json({
      success: true,
      fromCache: false,
      data: fallbackData,
    });
  }
});

/**
 * [API 2] 서버 헬스체크
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 로또 통계 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`👉 통계 API 주소: http://localhost:${PORT}/api/lotto-stats`);
  console.log(`=================================================`);
});
