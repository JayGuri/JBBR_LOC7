import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Upload, FileText } from "lucide-react"
import { useAppData } from "../../contexts/AppDataContent"

export function CompanyPolicyUpload() {
  const { companyPolicies } = useAppData()
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      // Implement file upload logic here
      console.log("Uploading file:", file.name)
      // Reset file state after upload
      setFile(null)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">Company Policy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <div className="flex-grow">
                <Input type="file" accept=".pdf" onChange={handleFileChange} className="w-full" />
              </div>
            </div>
            {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
            <Button onClick={handleUpload} disabled={!file} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Policy
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {companyPolicies.map((policy) => (
              <li key={policy.id} className="flex justify-between items-center">
                <span>{policy.name}</span>
                <span className="text-sm text-gray-500">{policy.uploadDate}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

