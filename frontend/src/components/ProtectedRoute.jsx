import React from 'react';

/**
 * ProtectedRoute
 * 
 * TODO: Implement JWT verification and role-based checks (CUSTOMER/ADMIN) in the next milestone.
 * Currently allows all children to pass through as a placeholder for layout testing.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  return <>{children}</>;
}
