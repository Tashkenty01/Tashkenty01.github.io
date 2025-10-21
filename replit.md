# Digital Library Platform

## Overview

This is a full-stack digital library platform built with React, Express.js, and PostgreSQL. The application enables users to register, upload PDF documents, browse a catalog of literary works, and manage the digital library through an admin interface. The platform focuses on Spanish literature and provides a collaborative environment for sharing educational and cultural content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **File Handling**: Multer for PDF file uploads with local storage
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints for users, documents, and file operations

### Database Design
The schema includes two main entities:
- **Users**: Full name, email, phone, institution, area of interest
- **Documents**: Title, author, category, year, description, keywords, file metadata
- Uses UUID primary keys and foreign key relationships between users and uploaded documents

### File Management
- PDF files stored in local `/uploads` directory
- File validation restricts uploads to PDF format only
- 50MB file size limit
- Unique filename generation to prevent conflicts
- File download functionality with proper content headers

### Development Environment
- **Development Mode**: Vite dev server with HMR
- **Production Build**: Static assets served by Express
- **Database Migrations**: Drizzle Kit for schema changes
- **Type Safety**: Shared TypeScript types between client and server

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Database ORM and query builder
- **drizzle-zod**: Schema validation integration
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI and Styling
- **@radix-ui/**: Complete set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development and Build Tools
- **vite**: Frontend build tool and dev server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds

### File and Form Handling
- **multer**: Multipart form data and file uploads
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

### Session and Storage
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **date-fns**: Date manipulation utilities