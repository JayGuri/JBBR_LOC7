export type ReportStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface Report {
  id: string
  userId: string
  title: string
  amount: number
  date: string
  status: ReportStatus
  aiTag: "green" | "yellow" | "red"
  description: string
  content: string
  flaggedItems?: string[]
}

export interface ExpenseCategory {
  category: string
  amount: number
}

export interface CompanyPolicy {
  id: string
  name: string
  uploadDate: string
  fileUrl: string
}

export interface AppData {
  currentUser: User
  users: User[]
  reports: Report[]
  expenseCategories: ExpenseCategory[]
  companyPolicies: CompanyPolicy[]
}

