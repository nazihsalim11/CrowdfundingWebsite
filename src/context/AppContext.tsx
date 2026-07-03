"use client";

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'visitor' | 'investor' | 'school' | 'admin' | 'cashier' | 'auditor';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  schoolName: string;
  schoolId: string;
  type: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  status: 'pending' | 'active' | 'completed' | 'suspended';
  mediaUrl: string;
  roiEstimate: string;
  milestones: { title: string; completed: boolean }[];
  updates: { date: string; title: string; content: string; image?: string }[];
  escrowLockedAmount: number;
  escrowDisbursedAmount: number;
  csrMatchingEnabled?: boolean;
  csrMatchedAmount?: number;
  csrSponsorName?: string;
}

export interface Investment {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  roiEarned: number;
}

export interface Expense {
  id: string;
  campaignId: string;
  campaignTitle: string;
  description: string;
  amount: number;
  date: string;
  invoiceUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  auditedBy?: string;
  auditNotes?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  role: string;
  status: 'open' | 'resolved';
  date: string;
  response?: string;
}

export interface AppNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WithdrawalRequest {
  id: string;
  investorEmail: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface ChatMessage {
  id: string;
  investorEmail: string;
  senderRole: 'investor' | 'admin';
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  campaignId: string;
  campaignTitle: string;
  title: string;
  content: string;
  date: string;
  broadcastEmail: boolean;
  schoolName: string;
  schoolId: string;
  investorsCount: number;
  totalContributions: number;
}

export interface RoiRates {
  labs: number;
  digital: number;
  buses: number;
}

export interface PasswordResetRequest {
  id: string;
  email: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface InvestorProfile {
  email: string;
  name: string;
  totalInvested: number;
  investmentCount: number;
  joinDate: string;
  campaigns: { id: string; title: string; amount: number; date: string }[];
  kycVerified: boolean;
}

export interface ImpactReport {
  id: string;
  campaignId: string;
  campaignTitle: string;
  schoolName: string;
  studentsImpacted: number;
  teachersTrained: number;
  classroomsUpgraded: number;
  reportDate: string;
  summary: string;
  photoUrl?: string;
}

export interface TierThresholds {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface TransparencyContent {
  bronze: string;
  silver: string;
  gold: string;
  platinum: string;
}

export interface InvestmentProgram {
  id: string;
  title: string;
  description: string;
  schoolName: string;
  schoolId: string;
  unitPrice: number;
  fundingGoal: number;
  unitsSold: number;
  status: 'active' | 'completed' | 'suspended';
  tierThresholds: TierThresholds;
  transparencyContent: TransparencyContent;
}

export interface ProgramInvestment {
  id: string;
  programId: string;
  programTitle: string;
  investorEmail: string;
  investorName: string;
  unitsPurchased: number;
  amountInvested: number;
  date: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

interface AppContextType {
  role: UserRole;
  isLoggedIn: boolean;
  userEmail: string;
  username: string;
  password: string;
  updateProfile: (username: string, email: string, password?: string) => void;
  passwordResetRequests: PasswordResetRequest[];
  requestPasswordReset: (email: string, username: string) => void;
  approvePasswordReset: (requestId: string) => void;
  rejectPasswordReset: (requestId: string) => void;
  kycStatus: 'not_submitted' | 'pending' | 'verified';
  schoolVerificationStatus: 'not_submitted' | 'pending' | 'verified';
  campaigns: Campaign[];
  investments: Investment[];
  expenses: Expense[];
  tickets: SupportTicket[];
  walletBalance: number;
  totalEarnings: number;
  notifications: AppNotification[];
  withdrawals: WithdrawalRequest[];
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  submitKyc: (data: any) => void;
  submitSchoolVerification: (data: any) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'raisedAmount' | 'status' | 'updates' | 'escrowLockedAmount' | 'escrowDisbursedAmount'>) => void;
  investInCampaign: (campaignId: string, amount: number, paymentMethod: string, proof?: any) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'status'>) => void;
  approveCampaign: (campaignId: string) => void;
  suspendCampaign: (campaignId: string) => void;
  approveSchool: (schoolId: string) => void;
  approveKyc: (userEmail: string) => void;
  approveExpense: (expenseId: string) => void;
  createTicket: (title: string, description: string) => void;
  respondTicket: (ticketId: string, response: string) => void;
  
  // Cashier Actions
  verifyOfflineInvestment: (investmentId: string) => void;
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  disburseExpense: (expenseId: string) => void;

  // Auditor Actions
  auditExpense: (expenseId: string, status: 'approved' | 'rejected', notes: string, auditorName: string) => void;

  // Notification Actions
  addNotification: (message: string) => void;
  markNotificationsAsRead: () => void;
  requestWithdrawal: (amount: number) => void;

  // Messaging System Actions
  chatMessages: ChatMessage[];
  sendChatMessage: (investorEmail: string, senderRole: 'investor' | 'admin', content: string) => void;

  // Announcement Actions
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'schoolName' | 'schoolId' | 'investorsCount' | 'totalContributions' | 'campaignTitle'>) => void;

  // ROI Calculator configuration
  roiRates: RoiRates;
  updateRoiRates: (rates: RoiRates) => void;
  // ROI Revenue Engine Actions
  distributeCampaignRoi: (campaignId: string, revenueAmount: number) => void;

  // Watchlist Actions
  watchlist: string[];
  addToWatchlist: (campaignId: string) => void;
  removeFromWatchlist: (campaignId: string) => void;

  // Impact Reports
  impactReports: ImpactReport[];
  addImpactReport: (report: Omit<ImpactReport, 'id'>) => void;

  // Investor Registry (for admin)
  investorRegistry: InvestorProfile[];
  rolePermissions: Record<UserRole, string[]>;
  updateRolePermissions: (role: UserRole, permissions: string[]) => void;
  hasPermission: (permission: string) => boolean;

  // Investment Program Actions
  investmentPrograms: InvestmentProgram[];
  programInvestments: ProgramInvestment[];
  createInvestmentProgram: (program: Omit<InvestmentProgram, 'id' | 'unitsSold'>) => void;
  updateInvestmentProgram: (id: string, program: Partial<InvestmentProgram>) => void;
  deleteInvestmentProgram: (id: string) => void;
  investInProgram: (programId: string, unitsCount: number, paymentMethod: string, proof?: any) => void;
  verifyOfflineProgramInvestment: (investmentId: string) => void;
}

const initialCampaigns: Campaign[] = [
  {
    id: "c1",
    title: "Smart Digital Classrooms for Excellence",
    description: "Upgrading 10 high school classrooms with digital smart boards, projector systems, and high-speed internet to create an interactive learning environment.",
    schoolName: "Seed Global",
    schoolId: "s1",
    type: "Digital education",
    goalAmount: 1000000, // ₹10,00,000
    raisedAmount: 800000,  // ₹8,00,000
    deadline: "2026-08-15",
    status: "active",
    mediaUrl: "/images/smart-classroom.jpg",
    roiEstimate: "8% annually (via community digital lab rentals)",
    milestones: [
      { title: "Infrastructure & Wiring Setup", completed: true },
      { title: "Hardware Procurement", completed: true },
      { title: "Smartboard Installation", completed: false },
      { title: "Teacher Training Workshops", completed: false }
    ],
    updates: [
      { date: "2026-06-20", title: "Wiring Setup Completed", content: "Electrical rewiring and internet setup have been completed for all 10 classrooms. Hardware shipment is expected next week." }
    ],
    escrowLockedAmount: 800000,
    escrowDisbursedAmount: 0,
    csrMatchingEnabled: true,
    csrMatchedAmount: 400000,
    csrSponsorName: "Tata CSR Trust"
  },
  {
    id: "c2",
    title: "Modern Computer Lab & Coding Center",
    description: "Equipping a school coding center with 30 modern workstations, software licenses, and programming materials to prepare kids for digital careers.",
    schoolName: "Seed Global",
    schoolId: "s1",
    type: "Computer labs",
    goalAmount: 2000000, // ₹20,00,000
    raisedAmount: 2000000, // ₹20,00,000
    deadline: "2026-06-01",
    status: "completed",
    mediaUrl: "/images/computer-lab.jpg",
    roiEstimate: "10% annually (via weekend adult programming courses)",
    milestones: [
      { title: "Space Preparation & AC Installation", completed: true },
      { title: "Workstation Assembly", completed: true },
      { title: "Network Configuration", completed: true },
      { title: "Coding Bootcamp Launch", completed: true }
    ],
    updates: [
      { date: "2026-06-10", title: "Lab Fully Operational!", content: "The computers have been set up and students have begun taking Python and Javascript programming classes. Thank you to all investors!" }
    ],
    escrowLockedAmount: 800000,
    escrowDisbursedAmount: 1200000,
    csrMatchingEnabled: false
  },
  {
    id: "c3",
    title: "Eco-Friendly Electric School Bus",
    description: "Procuring an electric school bus to provide safe, sustainable, and free transportation for students from distant rural communities.",
    schoolName: "Seed Global",
    schoolId: "s1",
    type: "School buses",
    goalAmount: 3500000, // ₹35,00,000
    raisedAmount: 1400000, // ₹14,00,000
    deadline: "2026-10-30",
    status: "active",
    mediaUrl: "/images/school-bus.jpg",
    roiEstimate: "5% annually (saved operational fuel costs)",
    milestones: [
      { title: "Down-payment to Dealer", completed: true },
      { title: "EV Charging Infrastructure Setup", completed: false },
      { title: "Vehicle Delivery", completed: false }
    ],
    updates: [],
    escrowLockedAmount: 1400000,
    escrowDisbursedAmount: 0,
    csrMatchingEnabled: true,
    csrMatchedAmount: 700000,
    csrSponsorName: "Infosys Foundation"
  },
  {
    id: "c4",
    title: "STEM Merit Scholarship Fund 2026",
    description: "Providing 50 bright under-privileged students with complete academic scholarships, uniforms, study materials, and food allowances.",
    schoolName: "Seed Global",
    schoolId: "s1",
    type: "Scholarships",
    goalAmount: 1200000, // ₹12,00,000
    raisedAmount: 400000,  // ₹4,00,000
    deadline: "2026-09-01",
    status: "active",
    mediaUrl: "/images/scholarship.jpg",
    roiEstimate: "Social Impact (Tax Exemption 80G Certified)",
    milestones: [
      { title: "Student Selection Screenings", completed: true },
      { title: "First Semester Disbursement", completed: false },
      { title: "Second Semester Disbursement", completed: false }
    ],
    updates: [],
    escrowLockedAmount: 400000,
    escrowDisbursedAmount: 0,
    csrMatchingEnabled: false
  }
];

const initialInvestments: Investment[] = [
  {
    id: "inv1",
    campaignId: "c1",
    campaignTitle: "Smart Digital Classrooms for Excellence",
    amount: 150000, // ₹1,50,000
    date: "2026-06-15",
    status: "completed",
    paymentMethod: "UPI (Razorpay)",
    roiEarned: 12000
  },
  {
    id: "inv2",
    campaignId: "c2",
    campaignTitle: "Modern Computer Lab & Coding Center",
    amount: 300000, // ₹3,00,000
    date: "2026-05-10",
    status: "completed",
    paymentMethod: "UPI (Razorpay)",
    roiEarned: 30000
  },
  {
    id: "inv3",
    campaignId: "c3",
    campaignTitle: "Eco-Friendly Electric School Bus",
    amount: 100000, // ₹1,00,000
    date: "2026-06-20",
    status: "pending", // Offline review required
    paymentMethod: "Offline Payout / Wire",
    roiEarned: 0
  }
];

const initialExpenses: Expense[] = [
  {
    id: "e1",
    campaignId: "c2",
    campaignTitle: "Modern Computer Lab & Coding Center",
    description: "Purchase of 30 Dell Wyse thin client workstations and networking switch",
    amount: 1200000, // ₹12,00,000
    date: "2026-05-18",
    invoiceUrl: "/docs/receipt_computer_lab.pdf",
    status: "disbursed",
    auditedBy: "Auditor Smith",
    auditNotes: "Invoices reconcile exactly with bank merchant records. Certified compliant."
  },
  {
    id: "e2",
    campaignId: "c1",
    campaignTitle: "Smart Digital Classrooms for Excellence",
    description: "Projector mounting brackets and HDMI cables infrastructure prep",
    amount: 35000, // ₹35,00,000 -> ₹35,000
    date: "2026-06-22",
    invoiceUrl: "/docs/receipt_35000.pdf",
    status: "pending"
  }
];

const initialTickets: SupportTicket[] = [
  {
    id: "t1",
    title: "Failed UPI payment status check",
    description: "My UPI transaction of ₹50,000 shows successful in bank but shows failed in system.",
    role: "investor",
    status: "resolved",
    date: "2026-06-28",
    response: "We have reconciled the payment. It has now been credited to the Seed Global Smart Classrooms campaign. Thank you."
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg1",
    investorEmail: "investor@seedglobal.com",
    senderRole: "investor",
    content: "Hello, I am interested in investing in the school bus campaign but wanted to ask how the ROI is calculated.",
    timestamp: "2026-06-28 10:00"
  },
  {
    id: "msg2",
    investorEmail: "investor@seedglobal.com",
    senderRole: "admin",
    content: "Hello! The EV school bus ROI is calculated based on the operational savings in fuel costs that the school achieves. We track these savings transparently and distribute 5% annually.",
    timestamp: "2026-06-28 10:15"
  },
  {
    id: "msg3",
    investorEmail: "investor@seedglobal.com",
    senderRole: "investor",
    content: "That makes sense, thank you! I will proceed with the investment.",
    timestamp: "2026-06-28 10:20"
  },
  {
    id: "msg4",
    investorEmail: "john@example.com",
    senderRole: "investor",
    content: "Hi support team, I submitted my KYC document Aadhaar card yesterday. Could you please approve it?",
    timestamp: "2026-06-30 14:02"
  }
];

const initialAnnouncements: Announcement[] = [
  {
    id: "ann1",
    campaignId: "c2",
    campaignTitle: "Modern Computer Lab & Coding Center",
    title: "Computer Lab Construction Completed & Coding Center Launched!",
    content: "We are thrilled to announce that the Computer Lab is fully operational. Python and Javascript classes have commenced for 60 students. A big thank you to all 48 investors for making this possible!",
    date: "2026-06-12",
    broadcastEmail: true,
    schoolName: "Seed Global",
    schoolId: "s1",
    investorsCount: 48,
    totalContributions: 2000000
  },
  {
    id: "ann2",
    campaignId: "c1",
    campaignTitle: "Smart Digital Classrooms for Excellence",
    title: "Wiring and Infrastructure Phase Completed",
    content: "The electrical wiring and high-speed fiber internet setup for all 10 classrooms are done. Next week, we begin hardware mounting for smart screens.",
    date: "2026-06-21",
    broadcastEmail: false,
    schoolName: "Seed Global",
    schoolId: "s1",
    investorsCount: 24,
    totalContributions: 800000
  }
];

const initialInvestorRegistry: InvestorProfile[] = [
  {
    email: "investor@seedglobal.com",
    name: "Investor User",
    totalInvested: 550000,
    investmentCount: 3,
    joinDate: "2026-05-01",
    kycVerified: true,
    campaigns: [
      { id: "c1", title: "Smart Digital Classrooms for Excellence", amount: 150000, date: "2026-06-15" },
      { id: "c2", title: "Modern Computer Lab & Coding Center", amount: 300000, date: "2026-05-10" },
      { id: "c3", title: "Eco-Friendly Electric School Bus", amount: 100000, date: "2026-06-20" }
    ]
  },
  {
    email: "john@example.com",
    name: "John Mathew",
    totalInvested: 250000,
    investmentCount: 2,
    joinDate: "2026-05-15",
    kycVerified: true,
    campaigns: [
      { id: "c2", title: "Modern Computer Lab & Coding Center", amount: 200000, date: "2026-05-20" },
      { id: "c4", title: "STEM Merit Scholarship Fund 2026", amount: 50000, date: "2026-06-01" }
    ]
  },
  {
    email: "priya@invest.com",
    name: "Priya Sharma",
    totalInvested: 180000,
    investmentCount: 2,
    joinDate: "2026-06-01",
    kycVerified: true,
    campaigns: [
      { id: "c1", title: "Smart Digital Classrooms for Excellence", amount: 120000, date: "2026-06-10" },
      { id: "c3", title: "Eco-Friendly Electric School Bus", amount: 60000, date: "2026-06-18" }
    ]
  },
  {
    email: "rahul.invest@gmail.com",
    name: "Rahul Nair",
    totalInvested: 300000,
    investmentCount: 1,
    joinDate: "2026-04-20",
    kycVerified: false,
    campaigns: [
      { id: "c2", title: "Modern Computer Lab & Coding Center", amount: 300000, date: "2026-04-25" }
    ]
  },
  {
    email: "meera@corp.co",
    name: "Meera Pillai",
    totalInvested: 75000,
    investmentCount: 3,
    joinDate: "2026-06-10",
    kycVerified: true,
    campaigns: [
      { id: "c3", title: "Eco-Friendly Electric School Bus", amount: 30000, date: "2026-06-12" },
      { id: "c4", title: "STEM Merit Scholarship Fund 2026", amount: 25000, date: "2026-06-14" },
      { id: "c1", title: "Smart Digital Classrooms for Excellence", amount: 20000, date: "2026-06-16" }
    ]
  }
];

const initialImpactReports: ImpactReport[] = [
  {
    id: "ir1",
    campaignId: "c2",
    campaignTitle: "Modern Computer Lab & Coding Center",
    schoolName: "Seed Global",
    studentsImpacted: 240,
    teachersTrained: 12,
    classroomsUpgraded: 1,
    reportDate: "2026-06-15",
    summary: "The computer lab is now fully operational. 240 students are enrolled in weekly coding sessions. 12 teachers completed certification training. First batch of students built their own websites!",
    photoUrl: "/images/computer-lab.jpg"
  },
  {
    id: "ir2",
    campaignId: "c1",
    campaignTitle: "Smart Digital Classrooms for Excellence",
    schoolName: "Seed Global",
    studentsImpacted: 380,
    teachersTrained: 20,
    classroomsUpgraded: 7,
    reportDate: "2026-06-25",
    summary: "7 out of 10 classrooms are now equipped with smartboards. 380 students are experiencing interactive digital lessons. Teacher engagement scores rose by 42%.",
    photoUrl: "/images/smart-classroom.jpg"
  }
];

const initialInvestmentPrograms: InvestmentProgram[] = [
  {
    id: "ip1",
    title: "Seed Global School Expansion & Infrastructure Program",
    description: "A comprehensive initiative to upgrade laboratories, classrooms, and cafeteria infrastructure across three main campuses. High safety and performance records.",
    schoolName: "Seed Global",
    schoolId: "s1",
    unitPrice: 10000,
    fundingGoal: 5000000,
    unitsSold: 120,
    status: 'active',
    tierThresholds: {
      bronze: 1,
      silver: 10,
      gold: 25,
      platinum: 50
    },
    transparencyContent: {
      bronze: "Investment summary dashboard & monthly building development reports.",
      silver: "Detailed balance sheets & quarterly construction milestone assessments.",
      gold: "Itemized project budget reports & contractor fee schedules.",
      platinum: "Unrestricted invoice audit ledger, weekly executive updates, and direct QA with administrators."
    }
  },
  {
    id: "ip2",
    title: "Green Energy & Solar Microgrid Program",
    description: "Installing hybrid rooftop solar configurations and backup battery systems to secure sustainable, cost-efficient, and off-grid electricity for 48 class wings.",
    schoolName: "Seed Global",
    schoolId: "s1",
    unitPrice: 5000,
    fundingGoal: 3000000,
    unitsSold: 450,
    status: 'active',
    tierThresholds: {
      bronze: 1,
      silver: 15,
      gold: 30,
      platinum: 60
    },
    transparencyContent: {
      bronze: "Monthly clean energy yield charts & carbon mitigation summaries.",
      silver: "Comprehensive engineering inspection audits & component efficiency data.",
      gold: "Capital deployment ledgers & battery capacity test reports.",
      platinum: "Complete hardware supplier receipts, quarterly ROI audit panels, and direct technical briefings."
    }
  }
];

const initialProgramInvestments: ProgramInvestment[] = [
  {
    id: "pinv1",
    programId: "ip1",
    programTitle: "Seed Global School Expansion & Infrastructure Program",
    investorEmail: "investor@seedglobal.com",
    investorName: "Investor User",
    unitsPurchased: 15,
    amountInvested: 150000,
    date: "2026-06-15",
    paymentStatus: "completed",
    paymentMethod: "UPI (Razorpay)"
  },
  {
    id: "pinv2",
    programId: "ip2",
    programTitle: "Green Energy & Solar Microgrid Program",
    investorEmail: "investor@seedglobal.com",
    investorName: "Investor User",
    unitsPurchased: 40,
    amountInvested: 200000,
    date: "2026-06-18",
    paymentStatus: "completed",
    paymentMethod: "UPI (Razorpay)"
  },
  {
    id: "pinv3",
    programId: "ip1",
    programTitle: "Seed Global School Expansion & Infrastructure Program",
    investorEmail: "john@example.com",
    investorName: "John Mathew",
    unitsPurchased: 5,
    amountInvested: 50000,
    date: "2026-06-10",
    paymentStatus: "completed",
    paymentMethod: "UPI (Razorpay)"
  },
  {
    id: "pinv4",
    programId: "ip2",
    programTitle: "Green Energy & Solar Microgrid Program",
    investorEmail: "john@example.com",
    investorName: "John Mathew",
    unitsPurchased: 50,
    amountInvested: 250000,
    date: "2026-06-20",
    paymentStatus: "pending",
    paymentMethod: "Offline Payout / Wire"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('visitor');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('Investor User');
  const [password, setPassword] = useState('password123');
  const [kycStatus, setKycStatus] = useState<'not_submitted' | 'pending' | 'verified'>('verified');
  const [schoolVerificationStatus, setSchoolVerificationStatus] = useState<'not_submitted' | 'pending' | 'verified'>('verified');
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [walletBalance, setWalletBalance] = useState(1500000); // ₹15,00,000
  const [totalEarnings, setTotalEarnings] = useState(42000); // ₹42,000 ROI profits

  // Notification feed
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "n1", message: "Seed Global Computer Lab & Coding Center successfully completed!", timestamp: "2026-06-10 14:00", read: false },
    { id: "n2", message: "Welcome to Seed Global transparent management system.", timestamp: "2026-06-01 09:00", read: true }
  ]);

  // Withdrawal request tracking
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    { id: "wd1", investorEmail: "investor@seedglobal.com", amount: 25000, date: "2026-06-25", status: "completed" },
    { id: "wd2", investorEmail: "investor@seedglobal.com", amount: 12000, date: "2026-06-29", status: "pending" }
  ]);

  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(["c3", "c4"]);

  // Impact Reports state
  const [impactReports, setImpactReports] = useState<ImpactReport[]>(initialImpactReports);

  // Investor Registry state
  const [investorRegistry] = useState<InvestorProfile[]>(initialInvestorRegistry);

  // Investment Program State
  const [investmentPrograms, setInvestmentPrograms] = useState<InvestmentProgram[]>(initialInvestmentPrograms);
  const [programInvestments, setProgramInvestments] = useState<ProgramInvestment[]>(initialProgramInvestments);

  // Permissions State
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, string[]>>({
    visitor: ['view_campaigns'],
    investor: ['view_campaigns', 'invest', 'request_payout', 'view_portfolio', 'view_impact', 'manage_watchlist'],
    school: ['view_campaigns', 'create_campaigns', 'upload_expenses', 'post_announcements', 'view_school_dashboard'],
    admin: ['view_campaigns', 'create_campaigns', 'approve_campaigns', 'suspend_campaigns', 'invest', 'request_payout', 'upload_expenses', 'audit_expenses', 'disburse_funds', 'manage_users', 'manage_permissions', 'manage_tickets', 'configure_roi'],
    cashier: ['view_campaigns', 'disburse_funds', 'approve_withdrawals', 'verify_payments'],
    auditor: ['view_campaigns', 'audit_expenses', 'view_reports']
  });

  const updateRolePermissions = (targetRole: UserRole, newPermissions: string[]) => {
    setRolePermissions(prev => ({
      ...prev,
      [targetRole]: newPermissions
    }));
    addNotification(`Super Admin updated permissions for role: ${targetRole}`);
  };

  const hasPermission = (permission: string) => {
    return rolePermissions[role]?.includes(permission) || false;
  };

  const addToWatchlist = (campaignId: string) => {
    setWatchlist(prev => prev.includes(campaignId) ? prev : [...prev, campaignId]);
    addNotification(`Campaign added to your watchlist.`);
  };

  const removeFromWatchlist = (campaignId: string) => {
    setWatchlist(prev => prev.filter(id => id !== campaignId));
  };

  const addImpactReport = (report: Omit<ImpactReport, 'id'>) => {
    const newReport: ImpactReport = {
      ...report,
      id: `ir_${Date.now()}`
    };
    setImpactReports(prev => [newReport, ...prev]);
    addNotification(`School published a new Impact Report for "${report.campaignTitle}".`);
  };

  // Messaging System state & action
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  const sendChatMessage = (investorEmail: string, senderRole: 'investor' | 'admin', content: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      investorEmail,
      senderRole,
      content,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().substring(0, 5)
    };
    setChatMessages(prev => [...prev, newMsg]);

    if (senderRole === 'investor') {
      addNotification(`New message from investor: ${investorEmail}`);
    } else {
      addNotification(`Admin replied to investor: ${investorEmail}`);
    }
  };

  // Announcement state & action
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const createAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date' | 'schoolName' | 'schoolId' | 'investorsCount' | 'totalContributions' | 'campaignTitle'>) => {
    if (!hasPermission('post_announcements')) {
      alert("Permission Denied: You do not have 'post_announcements' permission.");
      return;
    }
    const targetCamp = campaigns.find(c => c.id === newAnn.campaignId);
    
    let baseInvestors = 0;
    if (newAnn.campaignId === 'c1') baseInvestors = 24;
    else if (newAnn.campaignId === 'c2') baseInvestors = 48;
    else if (newAnn.campaignId === 'c3') baseInvestors = 15;
    else if (newAnn.campaignId === 'c4') baseInvestors = 8;
    else {
      baseInvestors = Math.max(1, Math.floor((targetCamp?.raisedAmount || 0) / 50000));
    }

    const announcement: Announcement = {
      ...newAnn,
      id: `ann_${Date.now()}`,
      campaignTitle: targetCamp?.title || "General Update",
      date: new Date().toISOString().split('T')[0],
      schoolName: "Seed Global",
      schoolId: "s1",
      investorsCount: baseInvestors,
      totalContributions: targetCamp?.raisedAmount || 0
    };

    setAnnouncements(prev => [announcement, ...prev]);
    addNotification(`School posted announcement: "${newAnn.title}"`);
  };

  // ROI Calculator state & action
  const [roiRates, setRoiRates] = useState<RoiRates>({
    labs: 0.10,
    digital: 0.08,
    buses: 0.05
  });

  const updateRoiRates = (newRates: RoiRates) => {
    if (!hasPermission('configure_roi')) {
      alert("Permission Denied: You do not have 'configure_roi' permission.");
      return;
    }
    setRoiRates(newRates);
    addNotification(`Super Admin updated ROI Calculator rates: Labs: ${Math.round(newRates.labs * 100)}%, Digital: ${Math.round(newRates.digital * 100)}%, Buses: ${Math.round(newRates.buses * 100)}%`);
  };

  const updateProfile = (newUsername: string, newEmail: string, newPassword?: string) => {
    setUsername(newUsername);
    setUserEmail(newEmail);
    if (newPassword) {
      setPassword(newPassword);
    }
    addNotification(`User updated profile settings: Username: ${newUsername}, Email: ${newEmail}`);
  };

  const requestPasswordReset = (email: string, username: string) => {
    const newRequest: PasswordResetRequest = {
      id: `pr_${passwordResetRequests.length + 1}`,
      email,
      username,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setPasswordResetRequests(prev => [newRequest, ...prev]);
    addNotification(`Password reset request submitted by ${username} (${email}).`);
  };

  const approvePasswordReset = (requestId: string) => {
    setPasswordResetRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Reset password to 'reset123'
        setPassword('reset123');
        addNotification(`Super Admin approved password reset for ${req.email}. Temporary password set to 'reset123'.`);
        return { ...req, status: 'approved' };
      }
      return req;
    }));
  };

  const rejectPasswordReset = (requestId: string) => {
    setPasswordResetRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        addNotification(`Super Admin rejected password reset request for ${req.email}.`);
        return { ...req, status: 'rejected' };
      }
      return req;
    }));
  };

  const addNotification = (message: string) => {
    const newNotif: AppNotification = {
      id: `n_${Date.now()}`,
      message,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().substring(0, 5),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsLoggedIn(newRole !== 'visitor');
    if (newRole !== 'visitor') {
      setUserEmail(`${newRole}@seedglobal.com`);
    } else {
      setUserEmail('');
    }
  };

  const login = (email: string, targetRole: UserRole) => {
    setUserEmail(email);
    setRoleState(targetRole);
    setIsLoggedIn(true);
    addNotification(`User logged in as ${targetRole}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setRoleState('visitor');
  };

  const submitKyc = (data: any) => {
    setKycStatus('pending');
    addNotification("Investor submitted KYC verification documents.");
  };

  const submitSchoolVerification = (data: any) => {
    setSchoolVerificationStatus('pending');
    addNotification("School Board submitted official registry credentials.");
  };

  const createCampaign = (newCamp: Omit<Campaign, 'id' | 'raisedAmount' | 'status' | 'updates' | 'escrowLockedAmount' | 'escrowDisbursedAmount'>) => {
    if (!hasPermission('create_campaigns')) {
      alert("Permission Denied: You do not have 'create_campaigns' permission.");
      return;
    }
    const campaign: Campaign = {
      ...newCamp,
      id: `c${campaigns.length + 1}`,
      raisedAmount: 0,
      escrowLockedAmount: 0,
      escrowDisbursedAmount: 0,
      csrMatchingEnabled: false,
      status: 'pending',
      updates: []
    };
    setCampaigns(prev => [campaign, ...prev]);
    addNotification(`New project launched: "${newCamp.title}". Pending Super Admin validation.`);
  };

  const investInCampaign = (campaignId: string, amount: number, paymentMethod: string, proof?: any) => {
    if (!hasPermission('invest')) {
      alert("Permission Denied: You do not have 'invest' permission.");
      return;
    }
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    const isUPI = paymentMethod === 'UPI (Razorpay)' || paymentMethod === 'Card (Razorpay)';
    const isMatched = target.csrMatchingEnabled && !!target.csrSponsorName;
    const finalRaisedAdded = isMatched ? amount * 2 : amount;

    const newInvestment: Investment = {
      id: `inv${investments.length + 1}`,
      campaignId,
      campaignTitle: target.title,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: isUPI ? 'completed' : 'pending',
      paymentMethod,
      roiEarned: 0
    };

    setInvestments(prev => [newInvestment, ...prev]);
    
    if (isUPI) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          const updatedRaised = c.raisedAmount + finalRaisedAdded;
          const currentLocked = c.escrowLockedAmount || 0;
          const matchedAmt = c.csrMatchedAmount || 0;
          return {
            ...c,
            raisedAmount: updatedRaised,
            escrowLockedAmount: currentLocked + finalRaisedAdded,
            csrMatchedAmount: isMatched ? matchedAmt + amount : matchedAmt,
            status: updatedRaised >= c.goalAmount ? 'completed' : c.status
          };
        }
        return c;
      }));
      setWalletBalance(prev => prev - amount);
      if (isMatched) {
        addNotification(`Received contribution: ₹${amount.toLocaleString()} (Matched 1:1 by ${target.csrSponsorName} - Total ₹${(amount * 2).toLocaleString()}) for ${target.title}.`);
      } else {
        addNotification(`Received contribution: ₹${amount.toLocaleString()} for ${target.title}.`);
      }
    } else {
      addNotification(`Offline payment proof (₹${amount.toLocaleString()}) logged for ${target.title}. Pending cashier check.`);
    }
  };

  const addExpense = (newExp: Omit<Expense, 'id' | 'status'>) => {
    if (!hasPermission('upload_expenses')) {
      alert("Permission Denied: You do not have 'upload_expenses' permission.");
      return;
    }
    const expense: Expense = {
      ...newExp,
      id: `e${expenses.length + 1}`,
      status: 'pending'
    };
    setExpenses(prev => [expense, ...prev]);
    addNotification(`School logged new expenditure: ₹${newExp.amount.toLocaleString()} for "${newExp.description}".`);
  };

  const approveCampaign = (campaignId: string) => {
    if (!hasPermission('approve_campaigns')) {
      alert("Permission Denied: You do not have 'approve_campaigns' permission.");
      return;
    }
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        addNotification(`Campaign approved and live: "${c.title}"`);
        return { ...c, status: 'active' };
      }
      return c;
    }));
  };

  const suspendCampaign = (campaignId: string) => {
    if (!hasPermission('suspend_campaigns')) {
      alert("Permission Denied: You do not have 'suspend_campaigns' permission.");
      return;
    }
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        addNotification(`Campaign suspended by Board: "${c.title}"`);
        return { ...c, status: 'suspended' };
      }
      return c;
    }));
  };

  const approveSchool = (schoolId: string) => {
    if (!hasPermission('manage_users')) {
      alert("Permission Denied: You do not have 'manage_users' permission.");
      return;
    }
    setSchoolVerificationStatus('verified');
    addNotification("School verification status set to verified.");
  };

  const approveKyc = (userEmail: string) => {
    if (!hasPermission('manage_users')) {
      alert("Permission Denied: You do not have 'manage_users' permission.");
      return;
    }
    setKycStatus('verified');
    addNotification(`Investor KYC compliance verified for ${userEmail}.`);
  };

  const approveExpense = (expenseId: string) => {
    if (!hasPermission('audit_expenses')) {
      alert("Permission Denied: You do not have 'audit_expenses' permission.");
      return;
    }
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        addNotification(`Auditor approved expenditure: ₹${e.amount.toLocaleString()} for "${e.description}".`);
        return { ...e, status: 'approved' };
      }
      return e;
    }));
  };

  const createTicket = (title: string, description: string) => {
    const ticket: SupportTicket = {
      id: `t${tickets.length + 1}`,
      title,
      description,
      role,
      status: 'open',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets(prev => [ticket, ...prev]);
    addNotification(`Support ticket logged: "${title}".`);
  };

  const respondTicket = (ticketId: string, response: string) => {
    if (!hasPermission('manage_tickets')) {
      alert("Permission Denied: You do not have 'manage_tickets' permission.");
      return;
    }
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        addNotification(`Support ticket resolved: "${t.title}".`);
        return { ...t, status: 'resolved', response };
      }
      return t;
    }));
  };

  // Cashier Actions
  const verifyOfflineInvestment = (investmentId: string) => {
    if (!hasPermission('verify_payments')) {
      alert("Permission Denied: You do not have 'verify_payments' permission.");
      return;
    }
    setInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        setCampaigns(camps => camps.map(c => {
          if (c.id === inv.campaignId) {
            const isMatched = c.csrMatchingEnabled && !!c.csrSponsorName;
            const finalRaisedAdded = isMatched ? inv.amount * 2 : inv.amount;
            const updatedRaised = c.raisedAmount + finalRaisedAdded;
            const currentLocked = c.escrowLockedAmount || 0;
            const matchedAmt = c.csrMatchedAmount || 0;
            return {
              ...c,
              raisedAmount: updatedRaised,
              escrowLockedAmount: currentLocked + finalRaisedAdded,
              csrMatchedAmount: isMatched ? matchedAmt + inv.amount : matchedAmt,
              status: updatedRaised >= c.goalAmount ? 'completed' : c.status
            };
          }
          return c;
        }));
        addNotification(`Cashier verified offline deposit check: ₹${inv.amount.toLocaleString()} for "${inv.campaignTitle}".`);
        return { ...inv, status: 'completed' };
      }
      return inv;
    }));
  };

  const approveWithdrawal = (id: string) => {
    if (!hasPermission('approve_withdrawals')) {
      alert("Permission Denied: You do not have 'approve_withdrawals' permission.");
      return;
    }
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === id) {
        addNotification(`Cashier approved investor payout bank transfer: ₹${wd.amount.toLocaleString()} to ${wd.investorEmail}.`);
        return { ...wd, status: 'completed' };
      }
      return wd;
    }));
  };

  const rejectWithdrawal = (id: string) => {
    if (!hasPermission('approve_withdrawals')) {
      alert("Permission Denied: You do not have 'approve_withdrawals' permission.");
      return;
    }
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === id) {
        addNotification(`Cashier rejected investor payout bank transfer request of ₹${wd.amount.toLocaleString()}.`);
        return { ...wd, status: 'rejected' };
      }
      return wd;
    }));
  };

  const disburseExpense = (expenseId: string) => {
    if (!hasPermission('disburse_funds')) {
      alert("Permission Denied: You do not have 'disburse_funds' permission.");
      return;
    }
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        setCampaigns(camps => camps.map(c => {
          if (c.id === e.campaignId) {
            const currentLocked = c.escrowLockedAmount || 0;
            const currentDisbursed = c.escrowDisbursedAmount || 0;
            return {
              ...c,
              escrowLockedAmount: Math.max(0, currentLocked - e.amount),
              escrowDisbursedAmount: currentDisbursed + e.amount
            };
          }
          return c;
        }));
        addNotification(`Cashier completed disburse checkout of ₹${e.amount.toLocaleString()} to vendor for "${e.description}".`);
        return { ...e, status: 'disbursed' };
      }
      return e;
    }));
  };

  // Auditor Actions
  const auditExpense = (expenseId: string, status: 'approved' | 'rejected', notes: string, auditorName: string) => {
    if (!hasPermission('audit_expenses')) {
      alert("Permission Denied: You do not have 'audit_expenses' permission.");
      return;
    }
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        addNotification(`Auditor (${auditorName}) reviewed expense "${e.description}": set status to ${status}.`);
        return { 
          ...e, 
          status: status === 'approved' ? 'approved' : 'rejected',
          auditedBy: auditorName,
          auditNotes: notes
        };
      }
      return e;
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const requestWithdrawal = (amount: number) => {
    if (!hasPermission('request_payout')) {
      alert("Permission Denied: You do not have 'request_payout' permission.");
      return;
    }
    if (amount > totalEarnings) {
      alert("Insufficient withdrawable earnings balance.");
      return;
    }
    const newWd: WithdrawalRequest = {
      id: `wd${withdrawals.length + 1}`,
      investorEmail: userEmail || "investor@seedglobal.com",
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setWithdrawals(prev => [newWd, ...prev]);
    setTotalEarnings(prev => prev - amount);
    addNotification(`Investor requested ROI withdrawal of ₹${amount.toLocaleString()}. Payout is pending Cashier check.`);
  };

  const distributeCampaignRoi = (campaignId: string, revenueAmount: number) => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    const campaignInvestments = investments.filter(inv => inv.campaignId === campaignId && inv.status === 'completed');
    const totalInvestedByAll = campaignInvestments.reduce((acc, inv) => acc + inv.amount, 0);

    if (totalInvestedByAll === 0) {
      addNotification(`School logged ₹${revenueAmount.toLocaleString()} revenue for "${target.title}". No completed investments in the system.`);
      return;
    }

    let rate = 0.08;
    if (target.type.toLowerCase().includes('lab')) rate = roiRates.labs;
    else if (target.type.toLowerCase().includes('digital')) rate = roiRates.digital;
    else if (target.type.toLowerCase().includes('bus')) rate = roiRates.buses;

    let distributedCount = 0;
    let distributedSum = 0;

    // Distribute dividends to all matching investments
    setInvestments(prev => prev.map(inv => {
      if (inv.campaignId === campaignId && inv.status === 'completed') {
        const dividend = Math.round((inv.amount / target.raisedAmount) * revenueAmount * rate * 3);
        if (dividend > 0) {
          distributedCount++;
          distributedSum += dividend;

          setWalletBalance(curr => curr + dividend);
          setTotalEarnings(curr => curr + dividend);
        }
        return {
          ...inv,
          roiEarned: (inv.roiEarned || 0) + dividend
        };
      }
      return inv;
    }));

    addNotification(`💰 ROI Payout Distributed: School logged ₹${revenueAmount.toLocaleString()} revenue for "${target.title}". Paid ₹${distributedSum.toLocaleString()} total dividends across ${distributedCount} active investments.`);
  };

  const createInvestmentProgram = (newProg: Omit<InvestmentProgram, 'id' | 'unitsSold'>) => {
    const program: InvestmentProgram = {
      ...newProg,
      id: `ip${investmentPrograms.length + 1}`,
      unitsSold: 0
    };
    setInvestmentPrograms(prev => [program, ...prev]);
    addNotification(`New Investment Program launched: "${newProg.title}".`);
  };

  const updateInvestmentProgram = (id: string, updatedFields: Partial<InvestmentProgram>) => {
    setInvestmentPrograms(prev => prev.map(p => {
      if (p.id === id) {
        addNotification(`Investment Program updated: "${p.title}".`);
        return { ...p, ...updatedFields };
      }
      return p;
    }));
  };

  const deleteInvestmentProgram = (id: string) => {
    const target = investmentPrograms.find(p => p.id === id);
    setInvestmentPrograms(prev => prev.filter(p => p.id !== id));
    addNotification(`Investment Program deleted: "${target?.title || id}".`);
  };

  const investInProgram = (programId: string, unitsCount: number, paymentMethod: string, proof?: any) => {
    const target = investmentPrograms.find(p => p.id === programId);
    if (!target) return;

    const amount = unitsCount * target.unitPrice;
    const isUPI = paymentMethod === 'UPI (Razorpay)' || paymentMethod === 'Card (Razorpay)';

    const newInvestment: ProgramInvestment = {
      id: `pinv_${Date.now()}`,
      programId,
      programTitle: target.title,
      investorEmail: userEmail || "investor@seedglobal.com",
      investorName: username || "Investor User",
      unitsPurchased: unitsCount,
      amountInvested: amount,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: isUPI ? 'completed' : 'pending',
      paymentMethod
    };

    setProgramInvestments(prev => [newInvestment, ...prev]);

    if (isUPI) {
      setInvestmentPrograms(prev => prev.map(p => {
        if (p.id === programId) {
          return {
            ...p,
            unitsSold: p.unitsSold + unitsCount
          };
        }
        return p;
      }));
      setWalletBalance(prev => prev - amount);
      addNotification(`Purchased ${unitsCount} units (₹${amount.toLocaleString()}) for "${target.title}".`);
    } else {
      addNotification(`Offline unit purchase request (${unitsCount} units, ₹${amount.toLocaleString()}) logged for "${target.title}". Pending cashier check.`);
    }
  };

  const verifyOfflineProgramInvestment = (investmentId: string) => {
    setProgramInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        setInvestmentPrograms(progs => progs.map(p => {
          if (p.id === inv.programId) {
            return {
              ...p,
              unitsSold: p.unitsSold + inv.unitsPurchased
            };
          }
          return p;
        }));
        addNotification(`Cashier verified offline units purchase: ${inv.unitsPurchased} units (₹${inv.amountInvested.toLocaleString()}) for "${inv.programTitle}".`);
        return { ...inv, paymentStatus: 'completed' };
      }
      return inv;
    }));
  };

  return (
    <AppContext.Provider value={{
      role,
      isLoggedIn,
      userEmail,
      kycStatus,
      schoolVerificationStatus,
      campaigns,
      investments,
      expenses,
      tickets,
      walletBalance,
      totalEarnings,
      notifications,
      withdrawals,
      setRole,
      login,
      logout,
      submitKyc,
      submitSchoolVerification,
      createCampaign,
      investInCampaign,
      addExpense,
      approveCampaign,
      suspendCampaign,
      approveSchool,
      approveKyc,
      approveExpense,
      createTicket,
      respondTicket,
      
      verifyOfflineInvestment,
      approveWithdrawal,
      rejectWithdrawal,
      disburseExpense,
      auditExpense,
      addNotification,
      markNotificationsAsRead,
      requestWithdrawal,
      chatMessages,
      sendChatMessage,
      announcements,
      createAnnouncement,
      roiRates,
      updateRoiRates,
      username,
      password,
      updateProfile,
      passwordResetRequests,
      requestPasswordReset,
      approvePasswordReset,
      rejectPasswordReset,
      distributeCampaignRoi,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      impactReports,
      addImpactReport,
      investorRegistry,
      rolePermissions,
      updateRolePermissions,
      hasPermission,

      investmentPrograms,
      programInvestments,
      createInvestmentProgram,
      updateInvestmentProgram,
      deleteInvestmentProgram,
      investInProgram,
      verifyOfflineProgramInvestment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
