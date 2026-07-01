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

interface AppContextType {
  role: UserRole;
  isLoggedIn: boolean;
  userEmail: string;
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
  createCampaign: (campaign: Omit<Campaign, 'id' | 'raisedAmount' | 'status' | 'updates'>) => void;
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
    ]
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
    ]
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
    updates: []
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
    updates: []
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('visitor');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [kycStatus, setKycStatus] = useState<'not_submitted' | 'pending' | 'verified'>('verified');
  const [schoolVerificationStatus, setSchoolVerificationStatus] = useState<'not_submitted' | 'pending' | 'verified'>('verified');
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [walletBalance, setWalletBalance] = useState(1500000); // ₹15,00,000
  const [totalEarnings, setTotalEarnings] = useState(42000); // ₹42,000 ROI profits

  // Suggestions 5: Notification feed
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "n1", message: "Seed Global Computer Lab & Coding Center successfully completed!", timestamp: "2026-06-10 14:00", read: false },
    { id: "n2", message: "Welcome to Seed Global transparent management system.", timestamp: "2026-06-01 09:00", read: true }
  ]);

  // Suggestion 5: Withdrawal request tracking
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    { id: "wd1", investorEmail: "investor@seedglobal.com", amount: 25000, date: "2026-06-25", status: "completed" },
    { id: "wd2", investorEmail: "investor@seedglobal.com", amount: 12000, date: "2026-06-29", status: "pending" }
  ]);

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

  const createCampaign = (newCamp: Omit<Campaign, 'id' | 'raisedAmount' | 'status' | 'updates'>) => {
    const campaign: Campaign = {
      ...newCamp,
      id: `c${campaigns.length + 1}`,
      raisedAmount: 0,
      status: 'pending',
      updates: []
    };
    setCampaigns(prev => [campaign, ...prev]);
    addNotification(`New project launched: "${newCamp.title}". Pending Super Admin validation.`);
  };

  const investInCampaign = (campaignId: string, amount: number, paymentMethod: string, proof?: any) => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    const isUPI = paymentMethod === 'UPI (Razorpay)';

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
          const updatedRaised = c.raisedAmount + amount;
          return {
            ...c,
            raisedAmount: updatedRaised,
            status: updatedRaised >= c.goalAmount ? 'completed' : c.status
          };
        }
        return c;
      }));
      setWalletBalance(prev => prev - amount);
      addNotification(`Received contribution: ₹${amount.toLocaleString()} for ${target.title}.`);
    } else {
      addNotification(`Offline payment proof (₹${amount.toLocaleString()}) logged for ${target.title}. Pending cashier check.`);
    }
  };

  const addExpense = (newExp: Omit<Expense, 'id' | 'status'>) => {
    const expense: Expense = {
      ...newExp,
      id: `e${expenses.length + 1}`,
      status: 'pending'
    };
    setExpenses(prev => [expense, ...prev]);
    addNotification(`School logged new expenditure: ₹${newExp.amount.toLocaleString()} for "${newExp.description}".`);
  };

  const approveCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        addNotification(`Campaign approved and live: "${c.title}"`);
        return { ...c, status: 'active' };
      }
      return c;
    }));
  };

  const suspendCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        addNotification(`Campaign suspended by Board: "${c.title}"`);
        return { ...c, status: 'suspended' };
      }
      return c;
    }));
  };

  const approveSchool = (schoolId: string) => {
    setSchoolVerificationStatus('verified');
    addNotification("School verification status set to verified.");
  };

  const approveKyc = (userEmail: string) => {
    setKycStatus('verified');
    addNotification(`Investor KYC compliance verified for ${userEmail}.`);
  };

  const approveExpense = (expenseId: string) => {
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
    setInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        setCampaigns(camps => camps.map(c => {
          if (c.id === inv.campaignId) {
            const updatedRaised = c.raisedAmount + inv.amount;
            return {
              ...c,
              raisedAmount: updatedRaised,
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
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === id) {
        addNotification(`Cashier approved investor payout bank transfer: ₹${wd.amount.toLocaleString()} to ${wd.investorEmail}.`);
        return { ...wd, status: 'completed' };
      }
      return wd;
    }));
  };

  const rejectWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === id) {
        addNotification(`Cashier rejected investor payout bank transfer request of ₹${wd.amount.toLocaleString()}.`);
        return { ...wd, status: 'rejected' };
      }
      return wd;
    }));
  };

  const disburseExpense = (expenseId: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        addNotification(`Cashier completed disburse checkout of ₹${e.amount.toLocaleString()} to vendor for "${e.description}".`);
        return { ...e, status: 'disbursed' };
      }
      return e;
    }));
  };

  // Auditor Actions
  const auditExpense = (expenseId: string, status: 'approved' | 'rejected', notes: string, auditorName: string) => {
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
      createAnnouncement
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
