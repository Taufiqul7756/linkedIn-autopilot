import { get, post, del } from "@/lib/api";
import { DocumentType, PaginatedDocuments } from "@/types/Document";

export const documentService = () => ({
  getDocuments: () => get<PaginatedDocuments>("/documents/"),
  uploadDocument: (file: File, scope: "corporate" | "personal") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scope", scope);
    return post<DocumentType>("/documents/", formData);
  },
  deleteDocument: (id: string) => del<void>(`/documents/${id}/`),
});
