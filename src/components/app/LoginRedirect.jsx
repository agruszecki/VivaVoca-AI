import { Navigate, useLocation } from "react-router-dom";

// Sends a signed-out visitor to the login page, keeping the page they asked for.
export default function LoginRedirect() {
  const location = useLocation();
  const target = `${location.pathname}${location.search}`;
  return <Navigate to={`/login?returnTo=${encodeURIComponent(target)}`} replace />;
}
