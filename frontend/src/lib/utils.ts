import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatCoins = (coins: number | undefined | null): string => {
  const n = typeof coins === 'number' && !Number.isNaN(coins) ? coins : 0;
  return n.toFixed(2);
};

export const formatINR = (amount: number | undefined | null): string => {
  const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return `₹${n.toFixed(2)}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateDeviceId = (): string => {
  const nav = window.navigator;
  const screen = window.screen;

  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');

  return btoa(fingerprint).substring(0, 32);
};

export const validateUPI = (upiId: string): boolean => {
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(upiId);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const coinsToINR = (coins: number, rate: number = 0.1): number => {
  return coins * rate;
};

export const generateMathCaptcha = (): { question: string; answer: number } => {
  const operations = ['+', '-', '*'] as const;
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1: number, num2: number, answer: number;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 50) + 25;
      num2 = Math.floor(Math.random() * 25) + 1;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
  }

  return {
    question: `${num1} ${operation} ${num2}`,
    answer,
  };
};
