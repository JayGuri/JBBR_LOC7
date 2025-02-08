import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Upload } from "lucide-react"

export function CompanyPolicyUpload() {
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
    <Card>
      <CardHeader>
        <CardTitle>Upload Company Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
        <Button onClick={handleUpload} disabled={!file} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Policy
        </Button>
        {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
      </CardContent>
    </Card>
  )
}

