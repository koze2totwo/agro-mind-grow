import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  Search,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Sprout,
  Bug,
  ShieldCheck
} from "lucide-react";


interface Prediction {
  class: string;
  confidence: number;
}

interface DiseaseResult {
  class: string;
  confidence: number;
  message: string;
  symptoms: string[];
  causes: string[];
  treatments: {
    chemical?: string[];
    organic?: string[];
    prevention?: string[];
  };
  prevention: string[];
  top3_predictions: Prediction[];
}



const PestControl = () => {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WEBP).",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setResult(null);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeImage = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    // Use environment variable for API URL (production vs development)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to analyze image");
      }

      if (data.class === "invalid_image") {
        setError(data.message);
        setResult(null);
      } else {
        setResult(data);
        toast({
          title: "Analysis Complete",
          description: "Here are the results for your plant.",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "Could not connect to the analysis server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        {/* Modern Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 rounded-full mb-4">
            <Bug className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">AI-Powered Diagnosis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Plant Disease Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your plant to instantly identify diseases and get expert treatment recommendations powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  Analysis Setup
                </CardTitle>
                <CardDescription>Upload a clear photo of the affected plant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Upload Area with Enhanced Styling */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ease-in-out text-center cursor-pointer
                    ${dragActive ? "border-green-500 bg-green-50/50 dark:bg-green-900/20 scale-105" : "border-muted-foreground/25 hover:border-green-400 hover:bg-green-50/30"}
                    ${preview ? "border-solid border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" : ""}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />

                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-3 -right-3 h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSelection();
                        }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          Click or drag image here
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports JPG, PNG, WEBP (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-semibold shadow-lg"
                  disabled={!file || loading}
                  onClick={analyzeImage}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-5 h-5 mr-2" />
                      Diagnose Plant
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {error ? (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                    Invalid Image Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-600 dark:text-red-300">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:text-red-400"
                    onClick={clearSelection}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Diagnosis Card */}
                <Card className={`border-0 shadow-2xl ${result.class.toLowerCase().includes("healthy")
                  ? "bg-gradient-to-br from-white to-green-50 dark:from-green-950/20 dark:to-emerald-950/20"
                  : "bg-gradient-to-br from-white to-orange-50 dark:from-orange-950/20 dark:to-amber-950/20"
                  }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl flex items-center gap-3 mb-3">
                          {result.class.toLowerCase().includes("healthy") ? (
                            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <CheckCircle2 className="w-7 h-7 text-white" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <AlertTriangle className="w-7 h-7 text-white" />
                            </div>
                          )}
                          <span className={result.class.toLowerCase().includes("healthy")
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                            : "bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"}>
                            {result.class.replace(/_/g, " ").replace("___", " - ")}
                          </span>
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {result.message}
                        </CardDescription>
                        {result.confidence && (
                          <div className="flex items-center gap-2 mt-4">
                            <Badge className={`text-sm px-3 py-1 ${result.class.toLowerCase().includes("healthy")
                              ? "bg-gradient-to-r from-green-600 to-emerald-600"
                              : "bg-gradient-to-r from-orange-600 to-amber-600"} text-white border-0 shadow-md`}>
                              {result.confidence.toFixed(1)}% Confidence
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Top 3 Predictions (if confidence is low/medium) */}
                  {result.confidence < 0.85 && ( // Changed from 85 to 0.85 to match typical confidence values (0-1)
                    <CardContent className="pb-2">
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium mb-2 text-muted-foreground">Alternative Possibilities:</p>
                        <div className="space-y-1">
                          {result.top3_predictions.slice(1).map((pred, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span>{pred.class.replace(/_/g, " ")}</span>
                              <span className="font-mono text-muted-foreground">{pred.confidence.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Detailed Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Symptoms */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Info className="w-5 h-5 text-blue-500" />
                        Symptoms
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.symptoms.length > 0 ? (
                          result.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                              {symptom}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground text-sm">No specific symptoms listed.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Causes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Bug className="w-5 h-5 text-orange-500" />
                        Causes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.causes.length > 0 ? (
                          result.causes.map((cause, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                              {cause}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground text-sm">No specific causes listed.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Treatments */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Treatment & Prevention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Organic */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <Leaf className="w-4 h-4" /> Organic
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.organic?.map((t, i) => (
                              <li key={i} className="text-sm text-muted-foreground border-l-2 border-green-200 pl-2">
                                {t}
                              </li>
                            )) || <li className="text-sm text-muted-foreground">No organic treatments listed.</li>}
                          </ul>
                        </div>

                        {/* Chemical */}
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Chemical
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.chemical?.map((t, i) => (
                              <li key={i} className="text-sm text-muted-foreground border-l-2 border-purple-200 pl-2">
                                {t}
                              </li>
                            )) || <li className="text-sm text-muted-foreground">No chemical treatments listed.</li>}
                          </ul>
                        </div>

                        {/* Prevention */}
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Prevention
                          </h4>
                          <ul className="space-y-2">
                            {result.prevention?.map((p, i) => (
                              <li key={i} className="text-sm text-muted-foreground border-l-2 border-blue-200 pl-2">
                                {p}
                              </li>
                            )) || <li className="text-sm text-muted-foreground">No prevention tips listed.</li>}
                          </ul>
                        </div>

                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-xl border-muted-foreground/10 bg-muted/5">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                  <Sprout className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-md">
                  Upload a clear image of a plant leaf to detect diseases.
                  Our AI model analyzes patterns to provide accurate diagnoses and treatment plans.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PestControl;