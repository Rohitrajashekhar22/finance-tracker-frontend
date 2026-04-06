import { useMemo } from "react";

const getToken = () => localStorage.getItem("token");
const getRole = () => localStorage.getItem("role")?.toLowerCase() || "";

export function useAuth() {
  const token = useMemo(() => getToken(), []);
  const role = useMemo(() => getRole(), []);

  const isAuthenticated = Boolean(token);
  const isAdmin = role === "admin";
  const isAnalyst = role === "analyst";
  const isViewer = role === "viewer";

  const hasRole = (roles = []) => {
    return roles.map((r) => String(r).toLowerCase()).includes(role);
  };

  return {
    token,
    role,
    isAuthenticated,
    isAdmin,
    isAnalyst,
    isViewer,
    hasRole,
  };
}
