# User Management & Authentication

## Overview

The Cowtown Showdown tournament system uses a role-based authentication system with three primary user types. This guide explains how to create and manage user accounts through the admin interface.

## User Roles

### Super Admin
- **Purpose**: System administration and emergency management
- **Access**: Full system access including user management and configuration
- **Session**: No automatic expiry (24 hours default)
- **Created by**: Only other super admins can create super admin accounts

### Admin
- **Purpose**: Tournament administration and daily operations
- **Access**: Team management, schedules, game management, scorekeeper accounts
- **Session**: No automatic expiry (24 hours default)
- **Created by**: Super admins and other admins

### Scorekeeper
- **Purpose**: Live game scoring and event recording
- **Access**: Assigned games only, scoring interface
- **Session**: 4-hour automatic expiry with extension capability
- **Created by**: Admins and super admins

## Creating User Accounts

### Access the Users Collection

1. Log in to the admin panel at `/admin`
2. Navigate to **Tournament Management > Users**
3. Click **Add New** to create a new user account

### Required Fields

#### Basic Information
- **Email**: User's email address (used for login)
- **Password**: Secure password based on role requirements
- **First Name**: User's first name
- **Last Name**: User's last name
- **Role**: Select appropriate role (scorekeeper, admin, superAdmin)

#### Role-Specific Settings

**For Scorekeepers:**
- **Assigned Games**: Select which games this scorekeeper can manage
- **Session Expiry**: Automatically set to 4 hours from creation

**For Admins:**
- No additional fields required
- Full tournament management access granted automatically

**For Super Admins:**
- **Permissions**: Advanced system permissions (auto-enabled)
- Only visible and editable by other super admins

### Password Requirements

**Super Admin:**
- Minimum 16 characters
- Must include uppercase, lowercase, numbers, and special characters
- Enhanced security due to elevated privileges

**Admin:**
- Minimum 12 characters
- Must include uppercase, lowercase, and numbers
- Strong passwords required for tournament management

**Scorekeeper:**
- Minimum 8 characters
- Must include uppercase, lowercase, and numbers
- Adequate security for scoring functions

## Managing Existing Users

### Viewing User Information

In the Users collection, you can see:
- **Email**: User's login email
- **Name**: First and last name
- **Role**: Current role assignment
- **Last Activity**: When user was last active
- **Status**: Active/inactive status

### Editing User Accounts

**Admins can edit:**
- Scorekeeper account details
- Game assignments for scorekeepers
- Activate/deactivate scorekeeper accounts

**Super Admins can edit:**
- All user account details
- Role assignments (with restrictions)
- System permissions for super admin accounts

### Role Changes

**Important Restrictions:**
- Cannot remove the last super admin from the system
- Admins cannot promote users to super admin
- Role changes are logged in the audit trail

### Account Status

**Active Users:**
- Can log in and access assigned functions
- Sessions managed according to role

**Inactive Users:**
- Cannot log in to the system
- Existing sessions are invalidated
- Useful for temporary suspension

## Game Assignment for Scorekeepers

### Assigning Games

1. Edit a scorekeeper user account
2. In **Assigned Games** field, select games from dropdown
3. Scorekeepers can only claim and score assigned games

### Assignment Strategy

**Recommended Approach:**
- Assign 2-3 games per scorekeeper maximum
- Consider game timing to avoid conflicts
- Assign backup scorekeepers for critical games

**Game Types:**
- Pool play games can be assigned to any scorekeeper
- Medal games (finals) should go to experienced scorekeepers

## Session Management

### Scorekeeper Sessions

**Automatic Expiry:**
- Sessions expire after 4 hours of inactivity
- Users receive warnings at 15 minutes and 5 minutes remaining
- Extension available through UI or automatic with activity

**Manual Extension:**
- Scorekeepers can manually extend sessions
- Extensions add 4 hours from current time
- All extensions are logged for audit

### Admin/Super Admin Sessions

**Longer Duration:**
- No automatic expiry (24-hour default)
- Manual logout recommended for security
- Activity tracking for audit purposes

## Security Features

### Audit Logging

All user management actions are logged:
- User creation and deletion
- Role changes and promotions
- Login attempts (successful and failed)
- Session extensions and expirations

### Account Security

**Failed Login Protection:**
- Accounts locked after 5 failed attempts
- 10-minute lockout period
- Manual unlock by admins if needed

**Session Security:**
- Secure token-based authentication
- IP address tracking for suspicious activity
- Automatic logout on security violations

## Troubleshooting

### Common Issues

**Scorekeeper Can't Access Game:**
1. Check if user is assigned to the specific game
2. Verify account is active
3. Confirm session hasn't expired
4. Check if game is already claimed by another user

**User Can't Log In:**
1. Verify account is active
2. Check for account lockout (failed attempts)
3. Confirm correct role permissions
4. Reset password if necessary

**Session Expired Frequently:**
1. Explain 4-hour limit for scorekeepers
2. Show how to extend sessions
3. Consider admin role if user needs longer access

### Emergency Procedures

**Locked Out Admin:**
- Super admin can unlock any account
- Database direct access for super admin lockout

**Lost Password:**
- Admins can reset scorekeeper passwords
- Super admins can reset any password
- Emergency recovery procedures documented

## Best Practices

### User Creation
- Create accounts just before they're needed
- Use strong, unique passwords
- Assign minimal necessary permissions
- Document user assignments for tracking

### Account Maintenance
- Regular review of active accounts
- Remove unused accounts after tournament
- Monitor audit logs for suspicious activity
- Update role assignments as needed

### Security Guidelines
- Never share admin credentials
- Log out when finished with session
- Report suspicious activity immediately
- Use unique passwords for each account

This user management system ensures secure and efficient tournament operations while maintaining proper access controls for all user types.