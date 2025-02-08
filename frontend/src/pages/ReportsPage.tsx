"use client"

import React from "react"
import { Navbar } from "../components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

type ReportStatus = "approved" | "rejected" | "under_evaluation"
type AITag = "green" | "yellow" | "red"

interface Report {
  id: string
  title: string
  date: string
  amount: number
  status: ReportStatus
  aiTag?: AITag
}

const dummyReports: Report[] = [
  { id: "1", title: "Office Supplies", date: "2023-05-01", amount: 150.75, status: "approved" },
  { id: "2", title: "Client Dinner", date: "2023-05-05", amount: 89.99, status: "under_evaluation", aiTag: "green" },
  { id: "3", title: "Travel Expenses", date: "2023-05-10", amount: 523.5, status: "under_evaluation", aiTag: "yellow" },
  { id: "4", title: "Software Subscription", date: "2023-05-15", amount: 299.99, status: "rejected" },
  {
    id: "5",
    title: "Team Building Event",
    date: "2023-05-20",
    amount: 750.0,
    status: "under_evaluation",
    aiTag: "red",
  },
  { id: "6", title: "Office Rent", date: "2023-05-25", amount: 2000.0, status: "approved" },
]

const statusConfig = {
  approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
  under_evaluation: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
}

const aiTagConfig = {
  green: { color: "bg-green-100 text-green-800", text: "Likely Approved" },
  yellow: { color: "bg-yellow-100 text-yellow-800", text: "Potential Issues" },
  red: { color: "bg-red-100 text-red-800", text: "Over Budget" },
}

export function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#000000]">Expense Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyReports.map((report) => (
            <Card key={report.id} className="bg-[#fcfeff] shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold text-[#000000]">{report.title}</CardTitle>
                <Badge className={statusConfig[report.status].color}>
                  {React.createElement(statusConfig[report.status].icon, { className: "w-4 h-4 mr-1" })}
                  {report.status.replace("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2">Date: {report.date}</div>
                <div className="text-lg font-semibold text-[#000000] mb-2">Amount: ${report.amount.toFixed(2)}</div>
                {report.aiTag && (
                  <Badge className={aiTagConfig[report.aiTag].color}>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {aiTagConfig[report.aiTag].text}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

