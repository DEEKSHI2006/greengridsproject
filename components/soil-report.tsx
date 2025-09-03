"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, MapPin, Leaf } from "lucide-react"

interface SoilReportProps {
  analysisResults: any
  uploadedImage?: string
}

export function SoilReport({ analysisResults, uploadedImage }: SoilReportProps) {
  const generatePDFReport = () => {
    // Create a comprehensive report object
    const report = {
      title: "Green Grids Professional Soil Analysis Report",
      generatedDate: new Date().toLocaleDateString(),
      analysisDate: new Date(analysisResults.timestamp).toLocaleDateString(),
      location: "Farm Location", // This would come from GPS or user input
      ...analysisResults,
      summary: generateSummary(analysisResults),
      recommendations: generateDetailedRecommendations(analysisResults),
    }

    // Convert to downloadable format (JSON for demo, would be PDF in production)
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `soil-analysis-report-${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const generateSummary = (results: any) => {
    const npkTotal = results.npk.nitrogen + results.npk.phosphorus + results.npk.potassium
    const healthScore = Math.min(100, Math.floor((npkTotal / 150) * 100))

    return {
      healthScore,
      status: healthScore > 80 ? "Excellent" : healthScore > 60 ? "Good" : "Needs Improvement",
      primaryConcerns: results.npk.nitrogen < 30 ? ["Low Nitrogen"] : [],
      strengths: results.npk.potassium > 70 ? ["High Potassium"] : [],
    }
  }

  const generateDetailedRecommendations = (results: any) => {
    const recommendations = []

    if (results.npk.nitrogen < 40) {
      recommendations.push({
        category: "Nitrogen Management",
        priority: "High",
        action: "Apply nitrogen-rich organic fertilizer",
        timeline: "Within 2 weeks",
      })
    }

    if (Number.parseFloat(results.ph) < 6.0) {
      recommendations.push({
        category: "pH Adjustment",
        priority: "Medium",
        action: "Apply lime to increase soil pH",
        timeline: "Before next planting season",
      })
    }

    return recommendations
  }

  const summary = generateSummary(analysisResults)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Professional Soil Analysis Report
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-green-100">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Farm Location
              </span>
            </div>
          </div>
          <Button onClick={generatePDFReport} className="bg-white text-green-700 hover:bg-green-50">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Executive Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Executive Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">{summary.healthScore}</div>
              <div className="text-sm text-blue-600">Soil Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">{summary.status}</div>
              <div className="text-sm text-blue-600">Overall Status</div>
            </div>
            <div className="text-center">
              <Badge className="bg-green-600">{analysisResults.confidence}%</Badge>
              <div className="text-sm text-blue-600 mt-1">AI Confidence</div>
            </div>
          </div>
        </div>

        {/* Soil Composition Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-green-600" />
            Detailed Soil Composition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Primary Nutrients (NPK)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Nitrogen (N)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(analysisResults.npk.nitrogen / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{analysisResults.npk.nitrogen} ppm</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600">Phosphorus (P)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(analysisResults.npk.phosphorus / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{analysisResults.npk.phosphorus} ppm</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600">Potassium (K)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-orange-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(analysisResults.npk.potassium / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{analysisResults.npk.potassium} ppm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Soil Properties</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{analysisResults.ph}</div>
                    <div className="text-sm text-gray-600">pH Level</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{analysisResults.organicMatter}%</div>
                    <div className="text-sm text-gray-600">Organic Matter</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{analysisResults.soilType}</div>
                    <div className="text-sm text-gray-600">Soil Type</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{analysisResults.moisture}%</div>
                    <div className="text-sm text-gray-600">Moisture</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Recommendations */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Professional Recommendations</h3>
          <div className="space-y-3">
            {generateDetailedRecommendations(analysisResults).map((rec, index) => (
              <div key={index} className="bg-white p-3 rounded border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-800">{rec.category}</h4>
                  <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>{rec.priority} Priority</Badge>
                </div>
                <p className="text-gray-700 text-sm mb-1">{rec.action}</p>
                <p className="text-gray-500 text-xs">Timeline: {rec.timeline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          <p>This report was generated by Green Grids AI-powered soil analysis system.</p>
          <p>For technical support, contact: support@greengrids.com</p>
        </div>
      </CardContent>
    </Card>
  )
}
