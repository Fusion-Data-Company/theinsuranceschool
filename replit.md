# CRM & Voice Agent System for Educational Licensing

## Overview

This is a full-stack web application built for managing educational licensing leads and integrating with ElevenLabs voice agents. The system provides a comprehensive CRM interface for tracking potential students, managing call records, processing payments, and handling enrollments for various educational licenses (2-15, 2-40, 2-14).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **State Management**: TanStack Query for server state management
- **3D Graphics**: Spline integration for interactive 3D scenes
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with webhook support

### Database Schema
- **Core Entities**: Users, Leads, Call Records, Payments, Enrollments, Webhook Logs, Agent Metrics
- **Relationships**: One-to-many relationships between leads and their associated records
- **Indexing**: Strategic indexes on phone numbers, status fields, and timestamps
- **Data Types**: Support for JSON fields, decimals for financial data, and timestamp tracking

## Key Components

### Lead Management System
- **Lead Capture**: Multiple sources (voice agent, website, referral)
- **Status Tracking**: New → Contacted → Qualified → Enrolled → Opt Out
- **Contact Information**: Name, phone, email with validation
- **License Goals**: Support for 2-15, 2-40, 2-14 license types

### Workflow Automation Integration
- **n8n Integration**: MCP server for workflow automation and data queries
- **Real-time Analytics**: Business intelligence queries for automated workflows
- **Call Analytics**: Transcript analysis, sentiment detection, intent classification
- **Agent Metrics**: Confidence scoring and performance tracking
- **Real-time Updates**: Live call status and completion notifications

### Payment Processing
- **Multiple Plans**: Down payment tracking, installment management
- **Payment Status**: Pending, completed, failed, refunded states
- **Financial Tracking**: Integration with enrollment records
- **Transaction History**: Complete audit trail for all payments

### Enrollment Management
- **Course Assignment**: Link leads to specific educational programs
- **Cohort Management**: Group students into cohorts with start dates
- **Status Tracking**: Active, completed, dropped enrollment states
- **Progress Monitoring**: Track student advancement through programs

## Data Flow

### Lead Acquisition Flow
1. Voice agent captures lead information during call
2. Lead data sent via webhook to `/api/webhooks/elevenlabs-call`
3. System creates or updates lead record in database
4. Call transcript and analytics stored as call record
5. Lead status automatically updated based on call intent
6. Real-time dashboard updates via query invalidation

### Enrollment Process Flow
1. Qualified leads reviewed in CRM interface
2. Manual enrollment initiation by admin users
3. Payment plan selection and processing
4. Course and cohort assignment
5. Student notification and onboarding
6. Progress tracking throughout program

### Analytics Pipeline
1. Raw data collection from all system interactions
2. Aggregation of key metrics (conversion rates, revenue, etc.)
3. Real-time dashboard updates with performance indicators
4. Historical trend analysis and reporting

## External Dependencies

### Database & Infrastructure
- **Neon PostgreSQL**: Serverless database hosting
- **Drizzle ORM**: Type-safe database operations
- **WebSocket Support**: Real-time communication capabilities

### Workflow Automation & Communication
- **n8n**: Workflow automation platform integration
- **MCP Protocol**: Model Context Protocol for real-time data access
- **Webhook Processing**: Secure endpoint handling for external services

### UI & Visualization
- **Spline**: 3D scene rendering and interaction
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **TypeScript**: Type safety across entire stack
- **Vite**: Fast development and optimized builds
- **ESBuild**: Server-side bundling for production

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for seamless cloud development
- **Hot Module Replacement**: Instant feedback during development
- **Database Provisioning**: Automatic PostgreSQL setup

### Production Deployment
- **Autoscale Target**: Configured for automatic scaling
- **Build Process**: Optimized client and server bundles
- **Static Asset Serving**: Efficient delivery of frontend resources
- **Environment Variables**: Secure configuration management

### Database Management
- **Migration System**: Drizzle Kit for schema evolution
- **Connection Pooling**: Efficient database connection handling
- **Backup Strategy**: Automated backups via Neon platform

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 26, 2025. Fixed interactive robot in hero section - restored original Spline 3D scene implementation
- June 26, 2025. Added MCP (Model Context Protocol) server for ElevenLabs voice agent integration with real-time analytics capabilities
- June 26, 2025. Replaced hero section header text with particle text effect displaying "INSURANCE SCHOOL" and "RECRUITING ANNEX"
- June 26, 2025. Moved Enterprise-Grade CRM badge from hero to leads page, expanded particle text canvas to 1300x280px
- June 26, 2025. Reverted particle text canvas back to original 1300x280px size for balanced layout with robot element
- June 26, 2025. Updated particle colors to use only specified colors: blue, red, green, yellow, orange, cyan, violet (removed pink)
- June 26, 2025. Replaced hero description with personalized Data AI welcome message for Jason and Kelli
- June 26, 2025. Rebuilt MCP server with proper SSE transport protocol for ElevenLabs compatibility, implements JSON-RPC specification with authentication
- June 26, 2025. Fixed MCP server visibility by implementing discovery endpoint and correcting route registration order, all 10 analytics tools now properly accessible to ElevenLabs voice agents
- June 26, 2025. Resolved ElevenLabs HTTP 500 error by updating discovery endpoint to return complete tools array instead of tools_count, enabling proper tool extraction
- June 26, 2025. Implemented comprehensive MCP mega prompt fixes: standardized discovery endpoint with server_info format, enhanced logging, SSE compliance verification, proxy fallback endpoints, and comprehensive error handling
- June 26, 2025. Updated MCP discovery endpoint to exact ElevenLabs schema format: replaced server_info wrapper with schema_version root field and proper JSON Schema parameter structure
- June 26, 2025. Switched from ElevenLabs to n8n integration: updated MCP server configuration for workflow automation platform compatibility
- June 26, 2025. Fixed n8n spinning/timeout issue by creating dedicated GET endpoint at /api/mcp/execute for immediate JSON responses instead of SSE streaming
- June 26, 2025. Resolved bad gateway error by removing conflicting root URL route that blocked frontend access, n8n MCP integration fully operational
- June 26, 2025. Added comprehensive dashboard_data tool providing complete database access in single API call with all leads, enrollments, payments, call records, and analytics
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```