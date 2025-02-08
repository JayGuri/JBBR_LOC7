"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useAppData } from "../../contexts/AppDataContent"
import type { Report } from "../../types/data"

interface EmployeeReportDetailsProps {
  employeeId: string
  onBack: () => void
}

const aiTagConfig = {
  green: { color: "bg-green-100 text-green-800", Icon: CheckCircle, text: "Likely Approved" },
  yellow: { color: "bg-yellow-100 text-yellow-800", Icon: AlertTriangle, text: "Potential Issues" },
  red: { color: "bg-red-100 text-red-800", Icon: XCircle, text: "Over Budget" },
}

export function EmployeeReportDetails({ employeeId, onBack }: EmployeeReportDetailsProps) {
  const { reports: allReports, users } = useAppData()
  const [reports, setReports] = useState<Report[]>(allReports.filter((report) => report.userId === employeeId))
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [explanation, setExplanation] = useState("")

  const employee = users.find((user) => user.id === employeeId)

  const handleApprove = (reportId: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "approved" } : report)))
    setSelectedReport(null)
    setExplanation("")
  }

  const handleReject = (reportId: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "rejected" } : report)))
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
          <CardTitle>Reports for {employee?.name || `Employee ${employeeId}`}</CardTitle>
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
            <CardTitle>Review Report: {selectedReport.title}</CardTitle>
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

