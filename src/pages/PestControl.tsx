import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bug, AlertTriangle, Shield, Search, Camera, Leaf } from "lucide-react";

const PestControl = () => {
  const commonPests = [
    {
      name: "Brown Plant Hopper",
      crop: "Rice",
      severity: "High",
      symptoms: "Yellow patches on leaves, stunted growth",
      treatment: "Use BPH resistant varieties, apply neem oil",
      prevention: "Maintain water level, avoid excess nitrogen",
      image: "🦗"
    },
    {
      name: "Aphids", 
      crop: "Wheat",
      severity: "Medium",
      symptoms: "Curled leaves, sticky honeydew, yellowing",
      treatment: "Spray insecticidal soap or neem oil",
      prevention: "Encourage beneficial insects, avoid over-fertilization",
      image: "🐛"
    },
    {
      name: "Bollworm",
      crop: "Cotton",
      severity: "High", 
      symptoms: "Holes in bolls, damaged flowers and buds",
      treatment: "Use pheromone traps, apply Bt spray",
      prevention: "Crop rotation, remove plant debris",
      image: "🐛"
    },
    {
      name: "Stem Borer",
      crop: "Sugarcane",
      severity: "Medium",
      symptoms: "Dead hearts, bore holes in stems",
      treatment: "Apply carbofuran, use resistant varieties",
      prevention: "Destroy stubble, proper field sanitation",
      image: "🪲"
    }
  ];

  const diseases = [
    {
      name: "Blast Disease",
      crop: "Rice",
      type: "Fungal",
      symptoms: "Spindle-shaped lesions on leaves",
      treatment: "Apply Tricyclazole fungicide",
      prevention: "Use resistant varieties, balanced fertilization"
    },
    {
      name: "Rust",
      crop: "Wheat", 
      type: "Fungal",
      symptoms: "Orange pustules on leaves and stems",
      treatment: "Apply Propiconazole spray",
      prevention: "Crop rotation, timely sowing"
    },
    {
      name: "Wilt",
      crop: "Cotton",
      type: "Fungal",
      symptoms: "Yellowing and wilting of plants",
      treatment: "Soil drenching with fungicide",
      prevention: "Use disease-free seeds, soil fumigation"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pest & Disease Control</h1>
          <p className="text-muted-foreground text-lg">
            Identify, treat, and prevent crop pests and diseases
          </p>
        </div>

        {/* Quick Identification */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Quick Pest Identification
            </CardTitle>
            <CardDescription>Upload a photo or describe symptoms for instant identification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Upload Photo</h4>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Drag & drop an image or click to browse</p>
                  <Button variant="outline">Choose File</Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Describe Symptoms</h4>
                <div className="space-y-4">
                  <Input placeholder="Select crop type" />
                  <Textarea 
                    placeholder="Describe what you observe: leaf color changes, spots, wilting, etc."
                    rows={4}
                  />
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Identify Pest/Disease
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Pests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Common Pests
            </CardTitle>
            <CardDescription>Frequently encountered pests and their management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {commonPests.map((pest, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pest.image}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{pest.name}</h3>
                        <p className="text-sm text-muted-foreground">Affects: {pest.crop}</p>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(pest.severity)}>
                      {pest.severity} Risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Symptoms
                      </h4>
                      <p className="text-sm text-muted-foreground">{pest.symptoms}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        Treatment
                      </h4>
                      <p className="text-sm text-muted-foreground">{pest.treatment}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Prevention
                      </h4>
                      <p className="text-sm text-muted-foreground">{pest.prevention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diseases */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Plant Diseases</CardTitle>
            <CardDescription>Fungal, bacterial, and viral diseases affecting crops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {diseases.map((disease, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{disease.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{disease.type}</Badge>
                        <span className="text-sm text-muted-foreground">• {disease.crop}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Symptoms</h4>
                      <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Treatment</h4>
                      <p className="text-sm text-muted-foreground">{disease.treatment}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Prevention</h4>
                      <p className="text-sm text-muted-foreground">{disease.prevention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrated Pest Management */}
        <Card>
          <CardHeader>
            <CardTitle>Integrated Pest Management (IPM)</CardTitle>
            <CardDescription>Sustainable approach to pest control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Biological Control</h4>
                <p className="text-sm text-green-700">Use beneficial insects, parasites, and natural predators</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cultural Control</h4>
                <p className="text-sm text-blue-700">Crop rotation, field sanitation, resistant varieties</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Mechanical Control</h4>
                <p className="text-sm text-yellow-700">Physical removal, traps, barriers</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Chemical Control</h4>
                <p className="text-sm text-purple-700">Selective pesticides as last resort</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PestControl;