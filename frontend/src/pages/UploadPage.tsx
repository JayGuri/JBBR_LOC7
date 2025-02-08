"use client"

import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { UploadModal } from "../components/UploadModal"
import { ReportDisplay } from "../components/ReportDisplay"
import { Chatbot } from "../components/Chatbot"

type ReportStatus = "green" | "yellow" | "red"

interface Report {
  id: string
  status: ReportStatus
  content: string
  flaggedItems?: string[]
}

// Mock function to simulate report generation
const generateReport = (file: File) => {
  // In a real application, this would be an API call to process the file and generate a report
  return new Promise<Report>((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        status: ["green", "yellow", "red"][Math.floor(Math.random() * 3)] as ReportStatus,
        content: `This is an automated report for the file "${file.name}". The total expense amount is $${Math.floor(Math.random() * 1000)}.`,
        flaggedItems: Math.random() > 0.5 ? ["Item 1 is over budget", "Item 2 is missing receipt"] : undefined,
      })
    }, 2000)
  })
}

export function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isReportCancelled, setIsReportCancelled] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsModalOpen(false)
    setIsReportCancelled(false)
    const generatedReport = await generateReport(file)
    setReport(generatedReport)
  }

  const handleReportSubmit = (id: string, justification: string, action: "submit" | "cancel") => {
    if (action === "submit") {
      console.log(`Submitting report ${id} with justification: ${justification}`)
      // Here you would typically send this data to your backend
      alert("Report submitted for approval!")
    } else {
      console.log(`Cancelling report ${id}`)
      setReport(null)
      setIsReportCancelled(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Decorative images */}
        <img
          src="./Left.png"
          alt=""
          className="absolute top-[10%] left-[5%] w-[15%] max-w-[100px] opacity-70 transform -rotate-12 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-md"
          aria-hidden="true"
        />
        <img
          src="./Bottom.png"
          alt=""
          className="absolute bottom-[15%] left-[10%] w-[25%] max-w-[200px] opacity-80 transform rotate-6 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-lg"
          aria-hidden="true"
        />
        <img
          src="./Expanded.png"
          alt=""
          className="absolute bottom-[20%] right-[5%] w-[20%] max-w-[150px] opacity-70 transform rotate-12 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-md"
          aria-hidden="true"
        />

        {/* Main Content */}
        <div className="max-w-3xl w-full text-center space-y-6 relative z-10 px-4">
          {!report ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-[#000000]">
                {isReportCancelled ? "Report Cancelled" : "Upload your receipts"}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
                {isReportCancelled
                  ? "Your report has been cancelled. You can upload a new receipt to generate a new report."
                  : "Load your receipt by selecting a file—our system will instantly process and analyse it for accuracy and fraud detection. You will be provided with a report soon."}
              </p>
              <div className="mt-8">
                <Button
                  className="bg-[#161a34] hover:bg-[#161a34]/90 text-[#ffffff] px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Select your receipts
                </Button>
              </div>
            </>
          ) : (
            <ReportDisplay report={report} onSubmit={handleReportSubmit} onChatOpen={() => setIsChatOpen(true)} />
          )}
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleFileUpload} />

      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Chatbot onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  )
}

