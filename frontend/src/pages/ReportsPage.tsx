"use client"

import React, { useState } from "react"
import { Navbar } from "../components/Navbar"
import { Badge } from "../components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, XCircle, ChevronRight, Calendar, User, DollarSign } from "lucide-react"
import SpotlightCard from "../components/SpotlightCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog"
import { useAppData } from "../contexts/AppDataContent"

const statusConfig = {
  approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
}

const aiTagConfig = {
  green: { color: "bg-green-100 text-green-800", text: "Likely Approved" },
  yellow: { color: "bg-yellow-100 text-yellow-800", text: "Potential Issues" },
  red: { color: "bg-red-100 text-red-800", text: "Over Budget" },
}

export function ReportsPage() {
  const { reports, users } = useAppData()
  const [selectedReport, setSelectedReport] = useState<(typeof reports)[0] | null>(null)

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-normal mb-8 text-[#000000] font-['Space_Grotesk']">Expense Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <SpotlightCard
              key={report.id}
              className="cursor-pointer group"
              onClick={() => setSelectedReport(report)}
              spotlightColor="rgba(22, 26, 52, 0.1)"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-normal text-[#000000] group-hover:text-[#161a34] font-['Space_Grotesk']">
                    {report.title}
                  </h3>
                  <Badge className={`${statusConfig[report.status].color} transition-transform group-hover:scale-105`}>
                    {React.createElement(statusConfig[report.status].icon, { className: "w-4 h-4 mr-1" })}
                    {report.status}
                  </Badge>
                </div>
                <div className="flex-grow space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{report.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {users.find((user) => user.id === report.userId)?.name || "Unknown User"}
                    </span>
                  </div>
                  <div className="flex items-center text-[#000000] font-semibold">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${report.amount.toFixed(2)}</span>
                  </div>
                  <Badge className={`${aiTagConfig[report.aiTag].color} transition-transform group-hover:scale-105`}>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {aiTagConfig[report.aiTag].text}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center text-[#161a34] group-hover:text-[#161a34]/80">
                  <span className="text-sm font-medium">View Details</span>
                  <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-[#ffffff] text-[#000000] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal flex items-center justify-between font-['Space_Grotesk']">
              {selectedReport?.title}
              {selectedReport && (
                <Badge className={statusConfig[selectedReport.status].color}>
                  {React.createElement(statusConfig[selectedReport.status].icon, { className: "w-4 h-4 mr-1" })}
                  {selectedReport.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date Submitted</p>
                      <p className="font-medium">{selectedReport?.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted By</p>
                      <p className="font-medium">
                        {users.find((user) => user.id === selectedReport?.userId)?.name || "Unknown User"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">${selectedReport?.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  {selectedReport?.aiTag && (
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">AI Evaluation</p>
                        <Badge className={aiTagConfig[selectedReport.aiTag].color}>
                          {aiTagConfig[selectedReport.aiTag].text}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h4 className="font-normal mb-2 font-['Space_Grotesk']">Details</h4>
                  <p className="text-gray-600">{selectedReport?.description}</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

