"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface EmployeeReportDetailsProps {
  employeeId: string
  onBack: () => void
}

type ReportStatus = "pending" | "approved" | "rejected"
type AITag = "green" | "yellow" | "red"

interface Report {
  id: string
  title: string
  amount: number
  date: string
  status: ReportStatus
  aiTag: AITag
  description: string
}

const dummyReports: Report[] = [
  {
    id: "1",
    title: "Business Lunch",
    amount: 75.5,
    date: "2023-05-15",
    status: "pending",
    aiTag: "green",
    description: "Lunch meeting with potential client",
  },
  {
    id: "2",
    title: "Office Supplies",
    amount: 150.25,
    date: "2023-05-16",
    status: "pending",
    aiTag: "yellow",
    description: "Purchased new printer cartridges and paper",
  },
  {
    id: "3",
    title: "Travel Expenses",
    amount: 500.0,
    date: "2023-05-17",
    status: "pending",
    aiTag: "red",
    description: "Flight and hotel for conference",
  },
]

const aiTagConfig = {
  green: { color: "bg-green-100 text-green-800", Icon: CheckCircle, text: "Likely Approved" },
  yellow: { color: "bg-yellow-100 text-yellow-800", Icon: AlertTriangle, text: "Potential Issues" },
  red: { color: "bg-red-100 text-red-800", Icon: XCircle, text: "Over Budget" },
}

export function EmployeeReportDetails({ employeeId, onBack }: EmployeeReportDetailsProps) {
  const [reports, setReports] = useState<Report[]>(dummyReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [explanation, setExplanation] = useState("")

  const handleApprove = (reportId: string) => {
    setReports(
      reports.map((report) => (report.id === reportId ? { ...report, status: "approved" as ReportStatus } : report)),
    )
    setSelectedReport(null)
    setExplanation("")
  }

  const handleReject = (reportId: string) => {
    setReports(
      reports.map((report) => (report.id === reportId ? { ...report, status: "rejected" as ReportStatus } : report)),
    )
    setSelectedReport(null)
    setExplanation("")
  }

  return (
    <div className="space-y-6">
      <Button className="text-white" onClick={onBack} variant="outline">
        Back to All Employees
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Reports for Employee {employeeId}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {reports.map((report) => {
              const { Icon, color, text } = aiTagConfig[report.aiTag]
              return (
                <li key={report.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      ${report.amount.toFixed(2)} - {report.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={color}>
                      <Icon className="w-4 h-4 mr-1" />
                      {text}
                    </Badge>
                    {report.status === "pending" ? (
                      <Button className="text-white" variant="outline" onClick={() => setSelectedReport(report)}>
                        Review
                      </Button>
                    ) : (
                      <Badge variant={report.status === "approved" ? "default" : "destructive"}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle >Review Report: {selectedReport.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                <strong>Amount:</strong> ${selectedReport.amount.toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong> {selectedReport.date}
              </p>
              <p>
                <strong>Description:</strong> {selectedReport.description}
              </p>
              <div>
                <label htmlFor="explanation" className="block mb-2 font-semibold">
                  Explanation (required for rejection):
                </label>
                <Textarea
                  id="explanation"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Enter your explanation here..."
                  className="w-full text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => handleApprove(selectedReport.id)} variant="default">
                  Approve
                </Button>
                <Button onClick={() => handleReject(selectedReport.id)} variant="destructive" disabled={!explanation}>
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

