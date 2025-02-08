"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AppData, User, Report, ExpenseCategory, CompanyPolicy } from "../types/data"

// Dummy data
const dummyData: AppData = {
  currentUser: null,
  users: [
    { id: "1", name: "Jay", email: "jay@example.com", role: "admin" },
    { id: "2", name: "Aish", email: "aish@example.com", role: "admin" },
    { id: "3", name: "Harshil", email: "harshil@example.com", role: "admin" },
    { id: "4", name: "Akshat", email: "akshat@example.com", role: "admin" },
    { id: "5", name: "Jay Mguri", email: "jaymguri@gmail.com", role: "user" },
  ],
  reports: [
    {
      id: "1",
      userId: "5",
      title: "Business Lunch",
      amount: 75.5,
      date: "2023-05-15",
      status: "pending",
      aiTag: "green",
      description: "Lunch meeting with potential client",
      content: "Detailed content for Business Lunch report",
    },
    {
      id: "2",
      userId: "5",
      title: "Office Supplies",
      amount: 150.25,
      date: "2023-05-16",
      status: "pending",
      aiTag: "yellow",
      description: "Purchased new printer cartridges and paper",
      content: "Detailed content for Office Supplies report",
    },
    {
      id: "3",
      userId: "5",
      title: "Travel Expenses",
      amount: 500.0,
      date: "2023-05-17",
      status: "pending",
      aiTag: "red",
      description: "Flight and hotel for conference",
      content: "Detailed content for Travel Expenses report",
    },
  ],
  expenseCategories: [
    { category: "Food & Beverages", amount: 5000 },
    { category: "Travel", amount: 8000 },
    { category: "Office Supplies", amount: 3000 },
    { category: "Equipment", amount: 6000 },
    { category: "Miscellaneous", amount: 2000 },
  ],
  companyPolicies: [
    {
      id: "1",
      name: "General Expense Policy",
      uploadDate: "2023-01-01",
      fileUrl: "/policies/general-expense-policy.pdf",
    },
  ],
}

interface AppDataContextType extends AppData {
  updateUser: (user: User) => void
  addReport: (report: Report) => void
  updateReport: (report: Report) => void
  addExpenseCategory: (category: ExpenseCategory) => void
  updateExpenseCategory: (category: ExpenseCategory) => void
  addCompanyPolicy: (policy: CompanyPolicy) => void
  updateCompanyPolicy: (policy: CompanyPolicy) => void
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<User | null>
}

const AppDataContext = createContext<AppDataContextType | null>(null)

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData | null>(null)

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      // In a real application, you would fetch the data from your MongoDB API here
      // For now, we'll use the dummy data
      setAppData(dummyData)
    }

    fetchData()
  }, [])

  const updateUser = (updatedUser: User) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        users: prevData.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      }
    })
  }

  const addReport = (newReport: Report) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        reports: [...prevData.reports, newReport],
      }
    })
  }

  const updateReport = (updatedReport: Report) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        reports: prevData.reports.map((report) => (report.id === updatedReport.id ? updatedReport : report)),
      }
    })
  }

  const addExpenseCategory = (newCategory: ExpenseCategory) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        expenseCategories: [...prevData.expenseCategories, newCategory],
      }
    })
  }

  const updateExpenseCategory = (updatedCategory: ExpenseCategory) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        expenseCategories: prevData.expenseCategories.map((category) =>
          category.category === updatedCategory.category ? updatedCategory : category,
        ),
      }
    })
  }

  const addCompanyPolicy = (newPolicy: CompanyPolicy) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        companyPolicies: [...prevData.companyPolicies, newPolicy],
      }
    })
  }

  const updateCompanyPolicy = (updatedPolicy: CompanyPolicy) => {
    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        companyPolicies: prevData.companyPolicies.map((policy) =>
          policy.id === updatedPolicy.id ? updatedPolicy : policy,
        ),
      }
    })
  }

  const signup = async (name: string, email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = appData?.users.find((u) => u.email === email)
    if (existingUser) {
      return null // User already exists
    }

    // Create new user
    const newUser: User = {
      id: (appData?.users.length + 1).toString(),
      name,
      email,
      role: "user",
    }

    setAppData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        users: [...prevData.users, newUser],
        currentUser: newUser,
      }
    })

    return newUser
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = appData?.users.find((u) => u.email === email)
    if (user) {
      if (
        (user.role === "admin" && password === "pass@123") ||
        (user.email === "jaymguri@gmail.com" && password === "vrishti15")
      ) {
        setAppData((prevData) => (prevData ? { ...prevData, currentUser: user } : null))
        return user
      }
    }
    return null
  }

  const logout = () => {
    setAppData((prevData) => {
      if (!prevData) return null
      const { currentUser, ...rest } = prevData
      return { ...rest, currentUser: null }
    })
  }

  if (!appData) {
    return <div>Loading...</div>
  }

  const contextValue: AppDataContextType = {
    ...appData,
    updateUser,
    addReport,
    updateReport,
    addExpenseCategory,
    updateExpenseCategory,
    addCompanyPolicy,
    updateCompanyPolicy,
    login,
    logout,
    signup,
  }

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>
}

