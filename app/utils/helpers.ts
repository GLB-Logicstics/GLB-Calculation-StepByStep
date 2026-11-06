export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function money(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '$'
}

export function azn(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' AZN'
}

export function readNumber(event: Event): number {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 9)
  input.value = digits
  return Number(digits)
}