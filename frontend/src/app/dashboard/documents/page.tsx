"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UploadCloud, FileText, Search, Filter, Download, Trash2, File, Image as ImageIcon, FileArchive, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import Cookies from "js-cookie";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "general");
    
    setUploading(true);
    try {
      // Create a specific Axios instance call here to override Content-Type easily if needed
      const token = Cookies.get("mieuxflow_token");
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api") + "/documents/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      fetchDocuments();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes("image")) return <ImageIcon className="text-blue-500" size={20} />;
    if (mimeType?.includes("pdf")) return <FileText className="text-red-500" size={20} />;
    if (mimeType?.includes("zip") || mimeType?.includes("tar")) return <FileArchive className="text-amber-500" size={20} />;
    return <File className="text-gray-500" size={20} />;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="text-muted-foreground mt-1">Manage network designs, project sign-offs, and manuals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <div 
            className={`bg-card border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
            />
            
            <div className="mx-auto w-16 h-16 mb-4 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <UploadCloud size={32} />
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Drag and drop your file here, or click to browse from your computer.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-medium shadow-sm transition-all disabled:opacity-50"
            >
              Browse Files
            </button>
            <p className="text-xs text-muted-foreground mt-4">Supported formats: PDF, DOCX, PNG, JPG, ZIP (Max: 50MB)</p>
          </div>
        </div>

        {/* File List */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button className="p-2 border rounded-md hover:bg-background text-muted-foreground transition-colors">
                <Filter size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <FileText size={32} className="mb-2 opacity-20" />
                  <p>No documents found.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {documents.map((doc) => (
                    <li key={doc.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="p-3 bg-background border rounded-lg shrink-0">
                          {getFileIcon(doc.mimeType)}
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-sm truncate" title={doc.originalName}>{doc.originalName}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
                            <span>{formatSize(doc.size)}</span>
                            <span>•</span>
                            <span>{format(new Date(doc.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                            <span>•</span>
                            <span className="capitalize">{doc.category || 'General'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download">
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
