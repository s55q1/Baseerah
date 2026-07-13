export interface FinancialInputs {
  currentCash: number;
  monthlyRevenue: number;
  burnRate: number;
  operationalExpenses: number;
  salaryTrend: number;
  collectionDelay: number;
  inventoryStagnation: number;
}

export interface CompanyData {
  name: string;
  sector: string;
  size: string;
  inputs: FinancialInputs;
  savedAt: string;
}

const KEY = 'baseerah_company';

export function saveCompany(data: CompanyData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadCompany(): CompanyData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CompanyData) : null;
  } catch {
    return null;
  }
}

export function clearCompany(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function hasCompany(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(KEY);
}
