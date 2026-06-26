export type SplitInput = {
  totalBill: number;
  numPeople: number;
  payForCount: number;
};

export type SplitResult = {
  perPersonShare: number;
  yourShare: number;
  totalBill: number;
  numPeople: number;
  payForCount: number;
};

export function calculateSplit(input: SplitInput): SplitResult {
  const { totalBill, numPeople, payForCount } = input;
  const perPersonShare = totalBill / numPeople;
  const yourShare = perPersonShare * payForCount;

  return {
    perPersonShare,
    yourShare,
    totalBill,
    numPeople,
    payForCount,
  };
}

export function formatXlm(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}

export function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function parsePeopleCount(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 2) return null;
  return parsed;
}

export function parsePayForCount(value: string, maxPeople: number): number | null {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > maxPeople) return null;
  return parsed;
}
