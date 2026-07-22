import { get, post, del } from "@/lib/api";
import { DocumentType, PaginatedDocuments } from "@/types/Document";

export const documentService = (workspaceId: string) => ({
  getDocuments: () => get<PaginatedDocuments>(`/workspaces/${workspaceId}/documents/`),
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return post<DocumentType>(`/workspaces/${workspaceId}/documents/`, formData);
  },
  deleteDocument: (id: string) => del<void>(`/workspaces/${workspaceId}/documents/${id}/`),
});
