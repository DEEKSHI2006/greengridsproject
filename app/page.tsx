"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Home,
  Activity,
  Camera,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Download,
  Zap,
  Thermometer,
  Droplets,
  FlaskConical,
  TrendingUp,
  Leaf,
  Cloud,
  CloudRain,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data
const generateSensorData = () => ({
  nitrogen: Math.floor(Math.random() * 100) + 20,
  phosphorus: Math.floor(Math.random() * 80) + 15,
  potassium: Math.floor(Math.random() * 120) + 30,
  temperature: Math.floor(Math.random() * 15) + 20,
  humidity: Math.floor(Math.random() * 40) + 40,
  ph: (Math.random() * 3 + 5.5).toFixed(1),
  timestamp: new Date().toLocaleTimeString(),
})

const historicalData = [
  { time: "6AM", nitrogen: 45, phosphorus: 32, potassium: 78, temperature: 22, humidity: 65 },
  { time: "9AM", nitrogen: 52, phosphorus: 38, potassium: 82, temperature: 25, humidity: 62 },
  { time: "12PM", nitrogen: 48, phosphorus: 35, potassium: 75, temperature: 28, humidity: 58 },
  { time: "3PM", nitrogen: 55, phosphorus: 42, potassium: 88, temperature: 30, humidity: 55 },
  { time: "6PM", nitrogen: 50, phosphorus: 40, potassium: 80, temperature: 26, humidity: 60 },
  { time: "9PM", nitrogen: 47, phosphorus: 36, potassium: 76, temperature: 23, humidity: 68 },
]

const fertilizers = [
  { name: "Organic Compost", type: "Organic", npk: "3-2-1", price: "$25/bag", eco: "High" },
  { name: "Bio-NPK Blend", type: "Bio-organic", npk: "10-8-6", price: "$35/bag", eco: "High" },
  { name: "Vermicompost", type: "Organic", npk: "2-1-1", price: "$20/bag", eco: "Very High" },
  { name: "Seaweed Extract", type: "Natural", npk: "1-0-4", price: "$30/bottle", eco: "High" },
]

export default function SmartAgriPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [darkMode, setDarkMode] = useState(false)
  const [sensorData, setSensorData] = useState(generateSensorData())
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(generateSensorData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      analyzeImage()
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockResults = {
      soilType: ["Loamy", "Clay", "Sandy"][Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 15) + 85,
      npk: {
        nitrogen: Math.floor(Math.random() * 40) + 30,
        phosphorus: Math.floor(Math.random() * 30) + 20,
        potassium: Math.floor(Math.random() * 50) + 40,
      },
      ph: (Math.random() * 2 + 6).toFixed(1),
      organicMatter: (Math.random() * 3 + 2).toFixed(1),
      moisture: Math.floor(Math.random() * 30) + 40,
      recommendations: [
        "Add organic compost to improve soil structure",
        "Consider lime application to adjust pH levels",
        "Implement crop rotation for better nutrient cycling",
      ],
      timestamp: new Date().toISOString(),
    }

    setAnalysisResults(mockResults)
    setIsAnalyzing(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const downloadPDFReport = () => {
    if (!analysisResults) return

    // Create a new window with the report content
    const reportWindow = window.open("", "_blank")
    if (!reportWindow) return

    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Soil Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #f9f9f9; }
            .metric { text-align: center; padding: 10px; margin: 5px; border-radius: 6px; }
            .nitrogen { background: #3b82f6; color: white; }
            .phosphorus { background: #8b5cf6; color: white; }
            .potassium { background: #f59e0b; color: white; }
            .recommendations { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌱 Green Grids Soil Analysis Platform </h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Analysis Confidence: ${analysisResults.confidence}%</p>
          </div>
          
          <div class="card">
            <h2>Soil Classification</h2>
            <p><strong>Soil Type:</strong> ${analysisResults.soilType}</p>
            <p><strong>pH Level:</strong> ${analysisResults.ph}</p>
            <p><strong>Organic Matter:</strong> ${analysisResults.organicMatter}%</p>
            <p><strong>Moisture Content:</strong> ${analysisResults.moisture}%</p>
          </div>

          <div class="grid">
            <div class="metric nitrogen">
              <h3>Nitrogen (N)</h3>
              <p style="font-size: 24px; margin: 10px 0;">${analysisResults.npk.nitrogen} ppm</p>
            </div>
            <div class="metric phosphorus">
              <h3>Phosphorus (P)</h3>
              <p style="font-size: 24px; margin: 10px 0;">${analysisResults.npk.phosphorus} ppm</p>
            </div>
            <div class="metric potassium">
              <h3>Potassium (K)</h3>
              <p style="font-size: 24px; margin: 10px 0;">${analysisResults.npk.potassium} ppm</p>
            </div>
          </div>

          <div class="recommendations">
            <h2>AI Recommendations</h2>
            <ul>
              ${analysisResults.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
            </ul>
          </div>

          <div class="footer">
            <p>This report was generated by Smart Agriculture AI Platform</p>
            <p>For technical support, contact: support@smartagri.com</p>
          </div>
        </body>
      </html>
    `

    reportWindow.document.write(reportHTML)
    reportWindow.document.close()

    // Trigger print dialog
    setTimeout(() => {
      reportWindow.print()
    }, 500)
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "sensors", label: "Live Sensors", icon: Activity },
    { id: "analysis", label: "Soil Analysis", icon: Camera },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}
    >
      {/* Header */}
      <header
        className={`shadow-lg transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} border-b`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>GreenGrids</h1>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>AI-Powered Farming </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="sm"
                className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300"}`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`w-80 min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} border-r`}
        >
          {/* Navigation Tabs */}
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Upload Section in Sidebar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>Quick Upload</h3>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragActive
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : darkMode
                    ? "border-gray-600 hover:border-purple-400"
                    : "border-gray-300 hover:border-purple-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="space-y-2">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded soil"
                    className="max-h-24 mx-auto rounded"
                  />
                  <Button
                    onClick={() => {
                      setUploadedImage(null)
                      setAnalysisResults(null)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className={`h-8 w-8 mx-auto ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Drop soil image</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Browse
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0])
                  }
                }}
                className="hidden"
              />
            </div>

            {isAnalyzing && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Analyzing...</span>
                </div>
                <div className={`mt-2 w-full rounded-full h-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Farm Dashboard
                </h2>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Monitor your farm's health and productivity in real-time
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} transform hover:scale-105 transition-transform`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Active Sensors
                        </p>
                        <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>12</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} transform hover:scale-105 transition-transform`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Soil Health
                        </p>
                        <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>87%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} transform hover:scale-105 transition-transform`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Crop Yield
                        </p>
                        <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>+15%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} transform hover:scale-105 transition-transform`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Alerts</p>
                        <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>3</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <FlaskConical className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weather Widget */}
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                    <Cloud className="h-5 w-5 mr-2 text-blue-500" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { day: "Today", temp: "28°C", condition: "Sunny", icon: Sun, color: "text-yellow-500" },
                      { day: "Tomorrow", temp: "26°C", condition: "Cloudy", icon: Cloud, color: "text-gray-500" },
                      { day: "Day 3", temp: "24°C", condition: "Rainy", icon: CloudRain, color: "text-blue-500" },
                      { day: "Day 4", temp: "27°C", condition: "Sunny", icon: Sun, color: "text-yellow-500" },
                    ].map((weather, index) => (
                      <div
                        key={index}
                        className={`text-center p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                      >
                        <p className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {weather.day}
                        </p>
                        <weather.icon className={`h-8 w-8 mx-auto mb-2 ${weather.color}`} />
                        <p className={`text-xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {weather.temp}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{weather.condition}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Sensors Tab */}
          {activeTab === "sensors" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Live Sensor Data
                </h2>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Real-time monitoring of your farm's environmental conditions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nitrogen (N)</CardTitle>
                    <FlaskConical className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.nitrogen} ppm</div>
                    <p className="text-xs text-blue-100">
                      {sensorData.nitrogen > 60 ? "Optimal" : sensorData.nitrogen > 30 ? "Moderate" : "Low"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Phosphorus (P)</CardTitle>
                    <FlaskConical className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.phosphorus} ppm</div>
                    <p className="text-xs text-purple-100">
                      {sensorData.phosphorus > 50 ? "Optimal" : sensorData.phosphorus > 25 ? "Moderate" : "Low"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potassium (K)</CardTitle>
                    <FlaskConical className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.potassium} ppm</div>
                    <p className="text-xs text-orange-100">
                      {sensorData.potassium > 80 ? "Optimal" : sensorData.potassium > 50 ? "Moderate" : "Low"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <Thermometer className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.temperature}°C</div>
                    <p className="text-xs text-red-100">
                      {sensorData.temperature > 25 ? "Warm" : sensorData.temperature > 20 ? "Moderate" : "Cool"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                    <Droplets className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.humidity}%</div>
                    <p className="text-xs text-cyan-100">
                      {sensorData.humidity > 70 ? "High" : sensorData.humidity > 50 ? "Moderate" : "Low"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                    <FlaskConical className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.ph}</div>
                    <p className="text-xs text-emerald-100">
                      {Number.parseFloat(sensorData.ph) > 7
                        ? "Alkaline"
                        : Number.parseFloat(sensorData.ph) > 6
                          ? "Neutral"
                          : "Acidic"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Chart */}
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>
                    Real-time Sensor Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                      <XAxis dataKey="time" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                      <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                          color: darkMode ? "#ffffff" : "#000000",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="nitrogen" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="phosphorus" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="potassium" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Soil Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  AI Soil Analysis
                </h2>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Advanced CNN-based soil composition analysis
                </p>
              </div>

              {analysisResults ? (
                <div className="space-y-6">
                  {/* Analysis Results */}
                  <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                          <FileText className="h-5 w-5 mr-2" />
                          Analysis Results
                        </CardTitle>
                        <Button
                          onClick={downloadPDFReport}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF Report
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Soil Type & Confidence */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Soil Classification
                          </h4>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {analysisResults.confidence}% Confidence
                          </Badge>
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {analysisResults.soilType} Soil
                        </p>
                        <div className={`mt-3 w-full rounded-full h-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${analysisResults.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* NPK Values */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg text-center">
                          <FlaskConical className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                          <p className="text-sm text-blue-600 font-medium mb-1">Nitrogen</p>
                          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-blue-700"}`}>
                            {analysisResults.npk.nitrogen}
                          </p>
                          <p className="text-xs text-blue-500">ppm</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg text-center">
                          <FlaskConical className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                          <p className="text-sm text-purple-600 font-medium mb-1">Phosphorus</p>
                          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-purple-700"}`}>
                            {analysisResults.npk.phosphorus}
                          </p>
                          <p className="text-xs text-purple-500">ppm</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg text-center">
                          <FlaskConical className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                          <p className="text-sm text-orange-600 font-medium mb-1">Potassium</p>
                          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-orange-700"}`}>
                            {analysisResults.npk.potassium}
                          </p>
                          <p className="text-xs text-orange-500">ppm</p>
                        </div>
                      </div>

                      {/* Additional Parameters */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            pH Level
                          </p>
                          <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {analysisResults.ph}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Organic Matter
                          </p>
                          <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {analysisResults.organicMatter}%
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Moisture
                          </p>
                          <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {analysisResults.moisture}%
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Analysis Date
                          </p>
                          <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {new Date(analysisResults.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-lg">
                        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-amber-800"}`}>
                          AI Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {analysisResults.recommendations.map((rec: string, index: number) => (
                            <li
                              key={index}
                              className={`flex items-start ${darkMode ? "text-gray-300" : "text-amber-700"}`}
                            >
                              <span className="text-amber-500 mr-2 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fertilizer Recommendations */}
                  <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                    <CardHeader>
                      <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>
                        Recommended Fertilizers
                      </CardTitle>
                      <CardDescription className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Based on your soil analysis results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fertilizers.map((fertilizer, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200"}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                                {fertilizer.name}
                              </h4>
                              <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                                {fertilizer.eco} Eco
                              </Badge>
                            </div>
                            <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              Type: {fertilizer.type}
                            </p>
                            <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              NPK Ratio: {fertilizer.npk}
                            </p>
                            <p
                              className={`text-sm font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                            >
                              {fertilizer.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <CardContent className="py-12 text-center">
                    <Camera className={`h-16 w-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      No Analysis Available
                    </h3>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Upload a soil image using the sidebar to get started with AI analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Farm Analytics
                </h2>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Historical data trends and insights
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <CardHeader>
                    <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>
                      NPK Levels Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="time" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                            color: darkMode ? "#ffffff" : "#000000",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="nitrogen" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="phosphorus" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="potassium" stroke="#F59E0B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <CardHeader>
                    <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>
                      Environmental Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="time" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                            color: darkMode ? "#ffffff" : "#000000",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="temperature" fill="#EF4444" />
                        <Bar dataKey="humidity" fill="#06B6D4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Settings</h2>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Configure your platform preferences
                </p>
              </div>

              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>Appearance</CardTitle>
                  <CardDescription className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Customize how the platform looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Dark Mode</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Button
                      onClick={() => setDarkMode(!darkMode)}
                      variant="outline"
                      size="sm"
                      className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300"}`}
                    >
                      {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                      {darkMode ? "Light Mode" : "Dark Mode"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-white" : "text-gray-800"}`}>Notifications</CardTitle>
                  <CardDescription className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Sensor Alerts</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Get notified when sensor values are out of range
                      </p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Weather Updates</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Receive daily weather forecasts
                      </p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
