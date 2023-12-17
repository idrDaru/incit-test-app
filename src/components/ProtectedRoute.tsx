import { Cookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const cookies = new Cookies(null, { path: "/" });
  if (!cookies.get("access_token")) {
    return <Navigate to="/" />;
  }
  return children;
}
