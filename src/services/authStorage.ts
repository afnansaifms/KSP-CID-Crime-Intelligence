import type { UserRegistration } from '../types';

const REGS_KEY  = 'ksp_registrations';
const USERS_KEY = 'ksp_approved_users';

// ── Seed a default CID Chief admin ─────────────────────────
const seedAdmin = () => {
  const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!existing.find((u: any) => u.email === 'chief@ksp.gov.in')) {
    existing.push({
      id: 'admin_001',
      name: 'CID Chief',
      email: 'chief@ksp.gov.in',
      password: 'KSP@Chief2024',
      role: 'supervisor',
      district: 'Bengaluru Urban',
      badgeNumber: 'KSP-00001',
      department: 'CID Headquarters',
      phone: '9900000001',
      status: 'APPROVED',
      submittedAt: new Date().toISOString(),
      isCIDChief: true,
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(existing));
  }
};

seedAdmin();

// ── Registration storage ────────────────────────────────────
export const submitRegistration = (reg: Omit<UserRegistration, 'id' | 'status' | 'submittedAt'>): UserRegistration => {
  const regs: UserRegistration[] = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
  const newReg: UserRegistration = {
    ...reg,
    id: `reg_${Date.now()}`,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };
  regs.push(newReg);
  localStorage.setItem(REGS_KEY, JSON.stringify(regs));
  return newReg;
};

export const getAllRegistrations = (): UserRegistration[] => {
  return JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
};

export const getPendingRegistrations = (): UserRegistration[] => {
  return getAllRegistrations().filter(r => r.status === 'PENDING');
};

export const approveRegistration = (id: string, note?: string) => {
  const regs: UserRegistration[] = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const reg = regs.find(r => r.id === id);
  if (!reg) return;
  reg.status = 'APPROVED';
  reg.reviewedAt = new Date().toISOString();
  reg.reviewNote = note || 'Approved by CID Chief';
  localStorage.setItem(REGS_KEY, JSON.stringify(regs));
  // Add to approved users
  users.push({ ...reg, badgeNumber: `KSP-${Math.floor(Math.random() * 90000) + 10000}` });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const rejectRegistration = (id: string, note: string) => {
  const regs: UserRegistration[] = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
  const reg = regs.find(r => r.id === id);
  if (!reg) return;
  reg.status = 'REJECTED';
  reg.reviewedAt = new Date().toISOString();
  reg.reviewNote = note;
  localStorage.setItem(REGS_KEY, JSON.stringify(regs));
};

// ── Login ───────────────────────────────────────────────────
export const loginUser = (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) return { error: 'Invalid email or password' };
  if (user.status !== 'APPROVED') return { error: 'Account pending CID Chief approval' };
  return { user };
};

// ── Check email exists ──────────────────────────────────────
export const emailExists = (email: string): boolean => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const regs  = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
  return users.some((u: any) => u.email === email) ||
         regs.some((r: any) => r.email === email && r.status !== 'REJECTED');
};