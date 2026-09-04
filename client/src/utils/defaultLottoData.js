/**
 * ============================================================================
 * [동행복권 실제 최근 30회차 공식 당첨 데이터셋 (클라이언트 내장용)]
 * - GitHub Pages 등 백엔드가 없는 정적 호스팅 환경에서도 완벽히 동작하도록 보장
 * - 실제 로또 공식 추첨 번호 및 보너스 번호 데이터 (1111회 ~ 1140회)
 * ============================================================================
 */

export const defaultRecentDraws = [
  { drwNo: 1140, drwNoDate: '2024-10-05', numbers: [7, 10, 22, 29, 31, 38], bnusNo: 15 },
  { drwNo: 1139, drwNoDate: '2024-09-28', numbers: [5, 12, 15, 30, 37, 40], bnusNo: 18 },
  { drwNo: 1138, drwNoDate: '2024-09-21', numbers: [14, 16, 19, 20, 29, 34], bnusNo: 40 },
  { drwNo: 1137, drwNoDate: '2024-09-14', numbers: [4, 9, 12, 15, 33, 45], bnusNo: 26 },
  { drwNo: 1136, drwNoDate: '2024-09-07', numbers: [21, 24, 27, 29, 32, 43], bnusNo: 40 },
  { drwNo: 1135, drwNoDate: '2024-08-31', numbers: [1, 6, 13, 19, 21, 33], bnusNo: 4 },
  { drwNo: 1134, drwNoDate: '2024-08-24', numbers: [3, 7, 9, 13, 19, 24], bnusNo: 23 },
  { drwNo: 1133, drwNoDate: '2024-08-17', numbers: [13, 14, 20, 28, 29, 34], bnusNo: 23 },
  { drwNo: 1132, drwNoDate: '2024-08-10', numbers: [6, 7, 19, 28, 34, 41], bnusNo: 20 },
  { drwNo: 1131, drwNoDate: '2024-08-03', numbers: [1, 2, 6, 14, 27, 38], bnusNo: 33 },
  { drwNo: 1130, drwNoDate: '2024-07-27', numbers: [15, 19, 21, 25, 27, 28], bnusNo: 40 },
  { drwNo: 1129, drwNoDate: '2024-07-20', numbers: [5, 10, 11, 17, 28, 34], bnusNo: 22 },
  { drwNo: 1128, drwNoDate: '2024-07-13', numbers: [1, 5, 8, 16, 28, 33], bnusNo: 45 },
  { drwNo: 1127, drwNoDate: '2024-07-06', numbers: [10, 15, 24, 30, 31, 37], bnusNo: 44 },
  { drwNo: 1126, drwNoDate: '2024-06-29', numbers: [4, 5, 9, 11, 37, 40], bnusNo: 7 },
  { drwNo: 1125, drwNoDate: '2024-06-22', numbers: [6, 14, 25, 33, 40, 44], bnusNo: 30 },
  { drwNo: 1124, drwNoDate: '2024-06-15', numbers: [15, 19, 21, 28, 35, 44], bnusNo: 41 },
  { drwNo: 1123, drwNoDate: '2024-06-08', numbers: [13, 19, 21, 24, 34, 35], bnusNo: 26 },
  { drwNo: 1122, drwNoDate: '2024-06-01', numbers: [3, 6, 21, 30, 34, 35], bnusNo: 22 },
  { drwNo: 1121, drwNoDate: '2024-05-25', numbers: [6, 24, 31, 32, 38, 44], bnusNo: 8 },
  { drwNo: 1120, drwNoDate: '2024-05-18', numbers: [2, 19, 26, 31, 38, 41], bnusNo: 34 },
  { drwNo: 1119, drwNoDate: '2024-05-11', numbers: [1, 9, 12, 13, 20, 45], bnusNo: 3 },
  { drwNo: 1118, drwNoDate: '2024-05-04', numbers: [11, 13, 14, 15, 16, 45], bnusNo: 3 },
  { drwNo: 1117, drwNoDate: '2024-04-27', numbers: [3, 4, 9, 30, 33, 41], bnusNo: 35 },
  { drwNo: 1116, drwNoDate: '2024-04-20', numbers: [15, 16, 17, 25, 30, 31], bnusNo: 32 },
  { drwNo: 1115, drwNoDate: '2024-04-13', numbers: [7, 12, 23, 32, 34, 44], bnusNo: 8 },
  { drwNo: 1114, drwNoDate: '2024-04-06', numbers: [10, 16, 19, 32, 33, 38], bnusNo: 3 },
  { drwNo: 1113, drwNoDate: '2024-03-30', numbers: [11, 14, 28, 29, 31, 44], bnusNo: 31 },
  { drwNo: 1112, drwNoDate: '2024-03-23', numbers: [16, 20, 26, 36, 42, 44], bnusNo: 24 },
  { drwNo: 1111, drwNoDate: '2024-03-16', numbers: [3, 13, 30, 33, 43, 45], bnusNo: 4 },
];

/**
 * 30회차 당첨 번호로부터 1~45번 통계를 집계하는 클라이언트 함수
 */
export function calculateLocalLottoStats(draws = defaultRecentDraws) {
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

  const hotNumbers = [...statsArray]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => ({ number: item.number, count: item.count }));

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
