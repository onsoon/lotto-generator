/**
 * ============================================================================
 * [가중치 기반 로또 번호 추첨 알고리즘]
 * 
 * 1. Weight Calculation (가중치 계산):
 *    Weight(n) = Count(n) + Base Weight
 *    - Count(n): 최근 당첨 데이터에서 해당 번호(n)가 출현한 횟수
 *    - Base Weight: 기본 가중치(기본값: 1). 최근에 한 번도 안 나온 번호도 
 *      최소한의 당첨 확률(0이 되지 않도록)을 보장합니다.
 * 
 * 2. Selection Steps (추첨 단계):
 *    - Step 1: 고정 번호(Inclusion)를 추출 세트에 우선 배치
 *    - Step 2: 고정 번호 및 제외 번호(Exclusion)를 제외한 후보 번호 목록과 
 *              해당 번호들의 가중치 배열 작성
 *    - Step 3: 누적 가중치(Cumulative Weight) 구간을 이용한 룰렛 휠(Roulette Wheel)
 *              원리로 6개가 채워질 때까지 비복원 랜덤 추출
 *    - Step 4: 6개 번호를 오름차순 정렬
 *    - Step 5: 위 과정을 5회 반복하여 A, B, C, D, E 총 5게임 완성
 * ============================================================================
 */

/**
 * 단일 게임(6개 번호)을 가중치 기반으로 생성하는 함수
 * @param {Object} frequencyMap - { [번호]: 출현횟수 } 매핑 객체 (1~45)
 * @param {number[]} fixedNumbers - 고정 포함할 번호 목록 (최대 5개)
 * @param {number[]} excludedNumbers - 제외할 번호 목록 (최대 10개)
 * @param {number} baseWeight - 최소 기본 가중치 (기본값: 1)
 * @returns {number[]} - 6개의 오름차순 정렬된 로또 번호 배열
 */
export function generateSingleLottoGame(
  frequencyMap = {},
  fixedNumbers = [],
  excludedNumbers = [],
  baseWeight = 1
) {
  // 결과 번호를 저장할 Set (중복 자동 방지)
  const selectedSet = new Set();

  // 1. 고정 번호를 우선 배치 (최대 5개 유효 번호만)
  fixedNumbers.forEach((num) => {
    if (num >= 1 && num <= 45 && !excludedNumbers.includes(num)) {
      if (selectedSet.size < 6) {
        selectedSet.add(num);
      }
    }
  });

  // 2. 이미 6개가 다 찼다면 바로 오름차순 정렬 후 반환
  if (selectedSet.size >= 6) {
    return Array.from(selectedSet).sort((a, b) => a - b);
  }

  // 3. 남은 번호들 중 제외 번호와 이미 선택된 번호를 뺀 추첨 후보 풀(Pool) 생성
  const candidatePool = [];
  for (let num = 1; num <= 45; num++) {
    // 제외 번호이거나 이미 고정 번호로 선택된 번호는 건너뜁니다
    if (excludedNumbers.includes(num) || selectedSet.has(num)) {
      continue;
    }

    // 가중치 계산: 출현 빈도수 + 기본 가중치
    const count = frequencyMap[num] !== undefined ? frequencyMap[num] : 0;
    const weight = Math.max(1, count + baseWeight);

    candidatePool.push({
      number: num,
      weight: weight,
    });
  }

  // 예외 상황: 만약 제외 번호가 너무 많아서 후보군이 부족할 경우 방어 로직
  if (candidatePool.length < (6 - selectedSet.size)) {
    throw new Error('선택 가능한 번호의 수가 부족합니다. 제외 번호를 줄여주세요.');
  }

  // 4. 6개가 채워질 때까지 가중치 룰렛 휠 방식으로 비복원 추출
  while (selectedSet.size < 6 && candidatePool.length > 0) {
    // 현재 후보 풀의 총 가중치 합산
    const totalWeight = candidatePool.reduce((sum, item) => sum + item.weight, 0);

    // 0 ~ totalWeight 사이의 무작위 난수 생성
    let randomVal = Math.random() * totalWeight;

    // 누적 가중치 구간에 걸리는 번호 선택
    let chosenIndex = 0;
    for (let i = 0; i < candidatePool.length; i++) {
      randomVal -= candidatePool[i].weight;
      if (randomVal <= 0) {
        chosenIndex = i;
        break;
      }
    }

    // 당첨 번호 추출 및 결과 셋에 추가
    const pickedNumber = candidatePool[chosenIndex].number;
    selectedSet.add(pickedNumber);

    // 비복원 추출이므로 뽑힌 번호는 후보 풀에서 제거
    candidatePool.splice(chosenIndex, 1);
  }

  // 5. 6개 번호를 오름차순 정렬하여 반환
  return Array.from(selectedSet).sort((a, b) => a - b);
}

/**
 * A부터 E까지 5개 세트의 로또 게임을 생성하는 함수
 * @param {Object} frequencyMap - 번호별 출현 빈도 데이터
 * @param {number[]} fixedNumbers - 고정 번호 (최대 5개)
 * @param {number[]} excludedNumbers - 제외 번호 (최대 10개)
 * @param {number} baseWeight - 기본 가중치
 * @returns {Array<{ gameLabel: string, numbers: number[] }>} - 5개 게임 목록
 */
export function generateFiveLottoGames(
  frequencyMap = {},
  fixedNumbers = [],
  excludedNumbers = [],
  baseWeight = 1
) {
  const gameLabels = ['A', 'B', 'C', 'D', 'E'];
  const games = [];

  for (let i = 0; i < 5; i++) {
    const numbers = generateSingleLottoGame(
      frequencyMap,
      fixedNumbers,
      excludedNumbers,
      baseWeight
    );
    games.push({
      gameLabel: gameLabels[i],
      numbers: numbers,
    });
  }

  return games;
}
