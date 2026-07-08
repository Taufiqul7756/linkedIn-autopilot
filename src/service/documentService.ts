import { get, post } from "@/lib/api";
import { DocumentType, PaginatedDocuments } from "@/types/Document";

export const documentService = () => ({
  getDocuments: () => get<PaginatedDocuments>("/documents/"),
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return post<DocumentType>("/documents/", formData);
  },
});
