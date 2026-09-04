import React from 'react';

/**
 * ============================================================================
 * [로또 공(Lotto Ball) 컴포넌트]
 * 
 * 동행복권 공식 색상 규격:
 * - 01 ~ 10: 노란색 (#FBC400)
 * - 11 ~ 20: 파란색 (#69C8F2)
 * - 21 ~ 30: 빨간색 (#FF7272)
 * - 31 ~ 40: 회색   (#AAAAAA)
 * - 41 ~ 45: 초록색 (#B0D840)
 * 
 * 입체감(3D Ball Shading)과 은은한 광택(Highlight)을 CSS Radial Gradient로 표현합니다.
 * ============================================================================
 */

/**
 * 번호에 따른 배경색과 텍스트 스타일을 반환하는 함수
 * @param {number} num - 로또 번호 (1~45)
 */
export function getLottoBallStyle(num) {
  if (num >= 1 && num <= 10) {
    return {
      bgGradient: 'from-[#FBC400] to-[#E5AC00]',
      shadowColor: 'shadow-yellow-500/30',
      textColor: 'text-white',
      border: 'border-amber-300',
    };
  } else if (num >= 11 && num <= 20) {
    return {
      bgGradient: 'from-[#69C8F2] to-[#3BA8DC]',
      shadowColor: 'shadow-blue-500/30',
      textColor: 'text-white',
      border: 'border-sky-300',
    };
  } else if (num >= 21 && num <= 30) {
    return {
      bgGradient: 'from-[#FF7272] to-[#E84E4E]',
      shadowColor: 'shadow-red-500/30',
      textColor: 'text-white',
      border: 'border-rose-300',
    };
  } else if (num >= 31 && num <= 40) {
    return {
      bgGradient: 'from-[#AAAAAA] to-[#888888]',
      shadowColor: 'shadow-gray-500/30',
      textColor: 'text-white',
      border: 'border-gray-300',
    };
  } else {
    // 41 ~ 45
    return {
      bgGradient: 'from-[#B0D840] to-[#91BA23]',
      shadowColor: 'shadow-lime-500/30',
      textColor: 'text-white',
      border: 'border-lime-300',
    };
  }
}

/**
 * LottoBall 컴포넌트
 * @param {Object} props
 * @param {number} props.number - 로또 번호 (1~45)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - 공 크기
 * @param {boolean} [props.isBonus=false] - 보너스 번호 여부
 * @param {string} [props.className=''] - 추가 클래스
 */
export default function LottoBall({ number, size = 'md', isBonus = false, className = '' }) {
  const style = getLottoBallStyle(number);

  // 사이즈 매핑
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs font-semibold',
    sm: 'w-8 h-8 text-sm font-bold',
    md: 'w-11 h-11 text-base font-extrabold',
    lg: 'w-14 h-14 text-xl font-extrabold',
    xl: 'w-16 h-16 text-2xl font-black',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${style.bgGradient} ${style.textColor} ${sizeClasses[size]} shadow-ball select-none transition-transform duration-200 hover:scale-105 ${className}`}
      title={`로또 번호 ${number}${isBonus ? ' (보너스)' : ''}`}
    >
      {/* 3D 광택 레이어 */}
      <span className="absolute inset-0 rounded-full ball-shine pointer-events-none" />

      {/* 로또 숫자 */}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        {number}
      </span>
    </div>
  );
}
