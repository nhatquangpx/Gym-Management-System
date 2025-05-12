# Role-Based User Management System

## Overview

The system has been updated to use a role-based approach for managing users instead of separate models for Members and Trainers. All users are now stored in the User model with role-specific fields.

## Available Roles

- **member**: Gym members with membership details
- **trainer**: Fitness trainers with specializations
- **employee**: Gym staff with position and salary information
- **admin**: Administrative users with full system access

## Migration Status

The migration to a role-based system has been completed. The previous models (Member, Trainer, Employee) have been replaced with a unified User model with role differentiation.

All user data is now stored in the User model with the appropriate role values:
- members: role="member"
- trainers: role="trainer"
- employees: role="employee"
- administrators: role="admin"

The old models have been removed from the codebase, and all functionality has been updated to work with the new role-based approach.

## Creating an Admin

To create the initial admin user, run:

```bash
node server/scripts/createAdmin.js
```

This will create an admin user with:
- Email: admin@gym.com
- Password: admin123

## API Endpoints

### Member Management

- `POST /api/members` - Create a new member
- `POST /api/members/from-user` - Convert existing user to member
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Trainer Management

- `POST /api/trainers` - Create a new trainer
- `POST /api/trainers/from-user` - Convert existing user to trainer
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Employee Management

- `POST /api/employees` - Create a new employee
- `POST /api/employees/from-user` - Convert existing user to employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Admin Management

- `POST /api/admins` - Create a new admin (admin only)
- `GET /api/admins` - Get all admins (admin only)
- `GET /api/admins/:id` - Get admin by ID (admin only)
- `PUT /api/admins/:id` - Update admin (admin only)
- `DELETE /api/admins/:id` - Delete admin (admin only)

## User Model Structure

The User model now includes fields for all roles:

```javascript
{
  // Basic user fields
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String, // "member", "trainer", "employee", or "admin"
  
  // Member fields
  gender: String,
  dateOfBirth: Date,
  job: String,
  address: String,
  membershipStart: Date,
  membershipEnd: Date,
  
  // Trainer fields
  specialization: String,
  
  // Employee fields
  position: String,
  salary: Number,
  shiftSchedule: String,
  performanceRating: Number
}
```
