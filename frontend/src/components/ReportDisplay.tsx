"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import type { Report } from "../types/data"
import { useAppData } from "../contexts/AppDataContent"

interface ReportDisplayProps {
  report: Report
  onSubmit: (id: string, justification: string, action: "submit" | "cancel") => void
  onChatOpen: () => void
}

export function ReportDisplay({ report, onSubmit, onChatOpen }: ReportDisplayProps) {
  const { users } = useAppData()
  const [justification, setJustification] = useState("")

  const userName = users.find((user) => user.id === report.userId)?.name || "Unknown User"

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
        {statusIcon[report.aiTag]}
        <span className="ml-2 text-lg font-semibold text-[#000000]">{statusText[report.aiTag]}</span>
        <span className="ml-2 text-sm text-gray-500">Submitted by: {userName}</span>
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
      {report.status !== "approved" && (
        <div className="mb-4">
          <label htmlFor="justification" className="block mb-2 font-semibold text-[#000000]">
            Provide additional context:
          </label>
          <Textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="w-full p-2 border rounded text-[#000000]"
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

