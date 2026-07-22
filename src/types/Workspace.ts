export interface WorkspaceType {
  id: string;
  name: string;
  type: "corporate" | "personal";
  is_active: boolean;
  created_at: string;
}
