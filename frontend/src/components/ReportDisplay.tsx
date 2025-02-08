"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, XCircle, MessageSquare } from "lucide-react"

type ReportStatus = "green" | "yellow" | "red"

interface Report {
  id: string
  status: ReportStatus
  content: string
  flaggedItems?: string[]
}

interface ReportDisplayProps {
  report: Report
  onSubmit: (id: string, justification: string, action: "submit" | "cancel") => void
  onChatOpen: () => void
}

export function ReportDisplay({ report, onSubmit, onChatOpen }: ReportDisplayProps) {
  const [justification, setJustification] = useState("")

  const statusIcon = {
    green: <CheckCircle className="w-6 h-6 text-green-500" />,
    yellow: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    red: <XCircle className="w-6 h-6 text-red-500" />,
  }

  const statusText = {
    green: "Likely to be approved",
    yellow: "Potential fraud issues",
    red: "Over budget",
  }

  return (
    <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        {statusIcon[report.status]}
        <span className="ml-2 text-lg font-semibold text-[#000000]">{statusText[report.status]}</span>
      </div>
      <div className="mb-4 text-[#000000]">{report.content}</div>
      {report.flaggedItems && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-[#000000]">Flagged Items:</h3>
          <ul className="list-disc pl-5">
            {report.flaggedItems.map((item, index) => (
              <li key={index} className="text-[#161a34]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.status !== "green" && (
        <div className="mb-4">
          <label htmlFor="justification" className="block mb-2 font-semibold text-[#000000]">
            Provide additional context:
          </label>
          <Textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="w-full p-2 border rounded text-[#ffffff]"
            placeholder="Enter your justification here..."
          />
        </div>
      )}
      <div className="flex justify-between">
        <div>
          <Button
            onClick={() => onSubmit(report.id, justification, "submit")}
            className="bg-[#161a34] text-[#ffffff] hover:bg-[#161a34]/90 mr-2"
          >
            Submit for Approval
          </Button>
          <Button
            onClick={() => onSubmit(report.id, justification, "cancel")}
            className="bg-[#ffdbdb] text-[#161a34] hover:bg-[#ffdbdb]/90"
          >
            Cancel
          </Button>
        </div>
        <Button onClick={onChatOpen} className="bg-[#ffdbdb] text-[#161a34] hover:bg-[#ffdbdb]/90">
          <MessageSquare className="w-4 h-4 mr-2" />
          Open Chat
        </Button>
      </div>
    </div>
  )
}

