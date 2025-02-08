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
    { id: "5", name: "Jay M Guri", email: "jaymguri@gmail.com", role: "user" },
    { id: "6", name: "Sharan", email: "sharan@example.com", role: "user" },
  ],
  reports: [
    {
      id: "1",
      userId: "5",
      title: "Walmart Purchase",
      amount: 5.11,
      date: "2010-08-20",
      status: "pending",
      aiTag: "green",
      description: "General purchase at Walmart",
      content: "Receipt for WAL*MART purchase",
      category: "General",
      vendor: "WAL*MART",
      gstNumber: "",
      billNumber: "",
    },
    {
      id: "2",
      userId: "6",
      title: "Trader Joe's Grocery",
      amount: 40.0,
      date: "2014-06-28",
      status: "pending",
      aiTag: "green",
      description: "Grocery shopping at Trader Joe's",
      content: "Receipt for TRADER JOE'S purchase",
      category: "GROCERY",
      vendor: "TRADER JOE'S",
      gstNumber: "",
      billNumber: "",
    },
    {
      id: "3",
      userId: "5",
      title: "Walmart General Purchase",
      amount: 49.9,
      date: "2020-10-18",
      status: "pending",
      aiTag: "yellow",
      description: "General purchase at Walmart",
      content: "Receipt for Walmart purchase",
      category: "General",
      vendor: "Walmart",
      gstNumber: "",
      billNumber: "029200639128",
    },
    {
      id: "4",
      userId: "6",
      title: "Walmart Large Purchase",
      amount: 144.02,
      date: "2019-04-27",
      status: "pending",
      aiTag: "red",
      description: "Large general purchase at Walmart",
      content: "Receipt for Walmart purchase",
      category: "General",
      vendor: "Walmart'",
      gstNumber: "",
      billNumber: "",
    },
    {
      id: "5",
      userId: "5",
      title: "Walmart Small Purchase",
      amount: 7.43,
      date: "",
      status: "pending",
      aiTag: "green",
      description: "Small general purchase at Walmart",
      content: "Receipt for Walmart purchase",
      category: "General",
      vendor: "Walmart",
      gstNumber: "",
      billNumber: "",
    },
    {
      id: "6",
      userId: "6",
      title: "D-Mart Grocery Shopping",
      amount: 898.0,
      date: "",
      status: "pending",
      aiTag: "yellow",
      description: "Grocery shopping at D-Mart",
      content: "Receipt for Avenue Supermarts Ltd purchase",
      category: "Grocery",
      vendor: "Avenue Supermarts Ltd",
      gstNumber: "L51900MH2000PLC",
      billNumber: "",
    },
    {
      id: "7",
      userId: "5",
      title: "Movie Tickets",
      amount: 1062.0,
      date: "",
      status: "pending",
      aiTag: "yellow",
      description: "Entertainment expense for movie tickets",
      content: "Invoice for BigTree Entertainment Pvt Ltd",
      category: "Entertainment",
      vendor: "BigTree Entertainment Pvt Ltd",
      gstNumber: "27AABCB3428P1ZF",
      billNumber: "tin242569413911",
    },
    {
      id: "8",
      userId: "6",
      title: "Petrol Purchase",
      amount: 400.0,
      date: "2025-02-08",
      status: "pending",
      aiTag: "green",
      description: "Petrol purchase",
      content: "Receipt for Mr. Agrawal and Chaudhary Corporation",
      category: "Petrol",
      vendor: "Mr. Agrawal and Chaudhary Corporation",
      gstNumber: "27AALFA1141R1Z6",
      billNumber: "25020818277",
    },
    {
      id: "9",
      userId: "5",
      title: "Large Petrol Purchase",
      amount: 3849.4,
      date: "2025-01-26",
      status: "pending",
      aiTag: "red",
      description: "Large petrol purchase",
      content: "Receipt for Mr. Agrawa1 and Chaudhary Corporation",
      category: "Petrol",
      vendor: "Mr. Agrawa1 and Chaudhary Corporation",
      gstNumber: "27AALFA1141R126",
      billNumber: "25012610641",
    },
    {
      id: "10",
      userId: "6",
      title: "Upper Crust Foods Purchase",
      amount: 1176.0,
      date: "",
      status: "pending",
      aiTag: "yellow",
      description: "General purchase at Upper Crust Foods",
      content: "Receipt for UPPER CRUST FOUDS",
      category: "General",
      vendor: "UPPER CRUST FOUDS",
      gstNumber: "",
      billNumber: "num047631",
    },
    {
      id: "11",
      userId: "5",
      title: "Uber Ride",
      amount: 397.0,
      date: "2024-11-13",
      status: "pending",
      aiTag: "green",
      description: "Cab service expense for Uber ride",
      content: "Receipt for Uber ride",
      category: "Cab services",
      vendor: "Uber",
      gstNumber: "",
      billNumber: "",
    },
    {
      id: "12",
      userId: "6",
      title: "Petrol Purchase (Handwritten)",
      amount: 0, // Amount not provided in the text
      date: "",
      status: "pending",
      aiTag: "red",
      description: "Petrol purchase with handwritten receipt",
      content: "Handwritten receipt for Agarwal & Choudhari Corporation",
      category: "Petrol",
      vendor: "Agarwal & Choudhari Corporation",
      gstNumber: "27AALFA1141R1Z6",
      billNumber: "",
    },
  ],
  expenseCategories: [
    { category: "General", amount: 1382.46 },
    { category: "Grocery", amount: 938.0 },
    { category: "Petrol", amount: 4249.4 },
    { category: "Entertainment", amount: 1062.0 },
    { category: "Cab services", amount: 397.0 },
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

    // In a real application, you would save the password securely here
    console.log(`New user registered: ${name} (${email})`)

    return newUser
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = appData?.users.find((u) => u.email === email)
    if (user) {
      if (
        (user.role === "admin" && password === "pass@123") ||
        (user.email === "jaymguri@gmail.com" && password === "vrishti15") ||
        (user.role === "user" && password === "userpass") // Default password for new users
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

