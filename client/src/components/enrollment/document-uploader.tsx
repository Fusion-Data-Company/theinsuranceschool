import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2,
  File,
  Calendar,
  User,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import type { EnrollmentDocument } from "@shared/schema";

interface DocumentUploaderProps {
  enrollmentId: number;
  documents: EnrollmentDocument[];
  onDocumentUploaded?: () => void;
}

const DOCUMENT_TYPES = [
  { value: "syllabus", label: "Course Syllabus", color: "bg-blue-500/20 text-blue-400" },
  { value: "schedule", label: "Class Schedule", color: "bg-green-500/20 text-green-400" },
  { value: "materials", label: "Course Materials", color: "bg-purple-500/20 text-purple-400" },
  { value: "forms", label: "Enrollment Forms", color: "bg-orange-500/20 text-orange-400" },
  { value: "certificate", label: "Certificate", color: "bg-yellow-500/20 text-yellow-400" },
];

export function DocumentUploader({ enrollmentId, documents, onDocumentUploaded }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("materials");
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      // Step 1: Get presigned upload URL
      const uploadResponse = await apiRequest("/api/enrollment-documents/upload", "POST");
      const { uploadURL } = uploadResponse;

      // Step 2: Upload file to object storage
      const uploadFileResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadFileResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Step 3: Create document record
      return await apiRequest("/api/enrollment-documents", "POST", {
        enrollmentId,
        filename: file.name,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        documentPath: uploadURL.split('?')[0], // Remove query params
        documentType,
        uploadedBy: "admin", // TODO: Get from user context
      });
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded",
        description: "The enrollment document has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollment-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      onDocumentUploaded?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await apiRequest(`/api/enrollment-documents/${documentId}`, "DELETE");
    },
    onSuccess: () => {
      toast({
        title: "Document deleted",
        description: "The document has been removed from the enrollment package.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollment-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync({ file, documentType: selectedDocumentType });
    } finally {
      setIsUploading(false);
    }

    // Reset the input
    event.target.value = "";
  };

  const handleDownload = (document: EnrollmentDocument) => {
    // Create download URL
    window.open(`/api/enrollment-documents/${document.id}/download`, '_blank');
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getDocumentTypeColor = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.color || "bg-slate-500/20 text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add Documents to Enrollment Package
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Type
              </label>
              <select 
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-electric-cyan focus:border-electric-cyan"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                  id={`file-upload-${enrollmentId}`}
                />
                <label 
                  htmlFor={`file-upload-${enrollmentId}`}
                  className="flex items-center justify-center w-full px-4 py-2 bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Supported: PDF, DOC, DOCX, JPG, PNG, TXT (Max: 10MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Enrollment Package Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload documents to create the enrollment package</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-4 flex-1">
                    <FileText className="h-8 w-8 text-electric-cyan flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-white truncate">
                          {document.originalName}
                        </h4>
                        <Badge className={getDocumentTypeColor(document.documentType)}>
                          {getDocumentTypeLabel(document.documentType)}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div className="flex items-center gap-4">
                          <span>{(document.fileSize / 1024).toFixed(1)} KB</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(document.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {document.uploadedBy}
                          </span>
                        </div>
                        {document.status === 'active' && (
                          <div className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span className="text-xs">Active in package</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(document.id)}
                      disabled={deleteMutation.isPending}
                      className="bg-red-900/20 border-red-600/30 text-red-400 hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}