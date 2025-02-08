"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface EmployeeReportsProps {
  employeeId: string
  onBack: () => void
}

const dummyReports = [
  { id: "1", title: "Business Lunch", amount: 75.5, status: "pending", aiTag: "green" },
  { id: "2", title: "Office Supplies", amount: 150.25, status: "pending", aiTag: "yellow" },
  { id: "3", title: "Travel Expenses", amount: 500.0, status: "pending", aiTag: "red" },
]

const pieChartData = [
  { name: "Approved", value: 70 },
  { name: "Rejected", value: 30 },
]

const COLORS = ["#0088FE", "#FF8042"]

export function EmployeeReports({ employeeId, onBack }: EmployeeReportsProps) {
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [explanation, setExplanation] = useState("")

  const handleApprove = () => {
    // Implement approval logic here
    console.log("Report approved:", selectedReport.id)
    setSelectedReport(null)
  }

  const handleReject = () => {
    // Implement rejection logic here
    console.log("Report rejected:", selectedReport.id, "Explanation:", explanation)
    setSelectedReport(null)
    setExplanation("")
  }

  return (
    <div className="space-y-8">
      <Button onClick={onBack}>Back to Dashboard</Button>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reports for Employee {employeeId}</CardTitle>
        </CardHeader>
        <CardContent>
          {dummyReports.length > 0 ? (
            <ul className="space-y-4">
              {dummyReports.map((report) => (
                <li key={report.id} className="flex items-center justify-between">
                  <span>
                    {report.title} (${report.amount.toFixed(2)})
                  </span>
                  <div>
                    <Badge
                      className={`mr-2 ${report.aiTag === "green" ? "bg-green-100 text-green-800" : report.aiTag === "yellow" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                    >
                      {report.aiTag === "green"
                        ? "Likely Approved"
                        : report.aiTag === "yellow"
                          ? "Potential Issues"
                          : "Over Budget"}
                    </Badge>
                    <Button onClick={() => setSelectedReport(report)}>Review</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending reports to validate.</p>
          )}
        </CardContent>
      </Card>

      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Review Report: {selectedReport.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Amount: ${selectedReport.amount.toFixed(2)}</p>
            <p>AI Tag: {selectedReport.aiTag}</p>
            <Textarea
              className="mt-4"
              placeholder="Enter explanation (required for rejection)"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
            <div className="mt-4 space-x-4">
              <Button onClick={handleApprove}>Approve</Button>
              <Button onClick={handleReject} disabled={!explanation}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee Report Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <span className="inline-block w-4 h-4 bg-[#0088FE] mr-2"></span>
            <span className="mr-4">Approved</span>
            <span className="inline-block w-4 h-4 bg-[#FF8042] mr-2"></span>
            <span>Rejected</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

