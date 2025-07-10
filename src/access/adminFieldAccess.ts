import type { FieldAccess } from 'payload'

/**
 * @description Field-level access control for admin sensitive data
 * @dependencies None
 * @security Only admin and super admin users can access admin fields
 */
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user?.role ? ['superAdmin', 'admin'].includes(user.role) : false
}