"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AppData, User, Report, ExpenseCategory, CompanyPolicy } from "../types/data"

// Dummy data
const dummyData: AppData = {
  currentUser: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
  users: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "user" },
  ],
  reports: [
    {
      id: "1",
      userId: "2",
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
      userId: "2",
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
      userId: "3",
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
  }

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>
}

