"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AppData } from "../types/data"

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

const AppDataContext = createContext<AppData | null>(null)

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

  if (!appData) {
    return <div>Loading...</div>
  }

  return <AppDataContext.Provider value={appData}>{children}</AppDataContext.Provider>
}

