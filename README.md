# 🎰 AI 통계 기반 가중치 로또 5게임 생성기

동행복권 공식 최신 당첨 데이터와 최근 30회차 출현 빈도 통계를 기반으로 한 **가중치 랜덤 추첨(Weighted Random Sampling)** 로또 번호 생성기입니다.

---

## 🌟 주요 기능

1. **통계 기반 5게임 가중치 랜덤 추첨**:
   - $Weight(n) = Count(n) + \text{Base Weight}$ 공식을 적용하여 최근 자주 나온 번호의 출현 확률을 높임
   - 한 번의 클릭으로 A, B, C, D, E 5개 게임을 일괄 생성 (오름차순 정렬)
2. **맞춤형 번호 설정 (고정 / 제외)**:
   - **고정 번호 (📌)**: 모든 게임에 반드시 포함할 번호 지정 (최대 5개)
   - **제외 번호 (❌)**: 모든 게임에서 완전히 뺄 번호 지정 (최대 10개)
3. **동행복권 최신 결과 및 통계 시각화**:
   - 최신 공식 회차 당첨 번호 + 보너스 번호 실시간 표시
   - 최근 30회차 최다 출현 번호 (HOT Top 5) & 최소 출현 번호 (COLD Top 5)
   - 1~45번 전체 출현 빈도수 상세 막대 차트
4. **공식 색상 및 편의 기능**:
   - 동행복권 5개 색상 규격(노랑, 파랑, 빨강, 회색, 초록) 및 3D 입체 볼 쉐이딩
   - 5게임 결과 전체 클립보드 원클릭 복사

---

## 🚀 로컬 실행 방법

### 1. 레포지토리 클론
```bash
git clone https://github.com/본인아이디/lotto-generator.git
cd lotto-generator
```

### 2. 백엔드 실행 (Express Server - Port 5000)
```bash
cd server
npm install
npm start
```

### 3. 프론트엔드 실행 (React Vite - Port 5173)
새 터미널 창을 열고:
```bash
cd client
npm install
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

---

## 🛠️ 기술 스택
- **프론트엔드**: React, Tailwind CSS, Lucide React, Canvas Confetti, Vite
- **백엔드**: Node.js, Express, Axios, CORS
