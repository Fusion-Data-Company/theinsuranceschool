# CRM & Voice Agent System for Educational Licensing

## Overview
This project is a full-stack web application designed for managing educational licensing leads. It integrates a comprehensive CRM interface with an ElevenLabs voice agent system, enabling tracking of potential students, managing call records, processing payments, and handling enrollments for various educational licenses (2-15, 2-40, 2-14). The business vision is to streamline the lead-to-enrollment pipeline for educational institutions, improving efficiency and conversion rates.

## User Preferences
Preferred communication style: Simple, everyday language.
Button styling preferences: Avoid dark shade effects on dark backgrounds. Keep buttons light and readable on hover. No dark overlays that make text hard to read.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI/UX**: Radix UI components with shadcn/ui styling, Tailwind CSS with a cyberpunk theme, Spline for interactive 3D scenes. The design emphasizes FANG-level enterprise styling, incorporating gradient backgrounds, glass morphism effects, and electric cyan/fuchsia color schemes for a professional yet futuristic aesthetic. Buttons feature ambient glows and smooth animations, with a unified glass morphism system.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.

### Backend
- **Runtime**: Node.js with Express.js (TypeScript, ESM modules).
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon (serverless).
- **Session Management**: Express sessions with PostgreSQL store.
- **API Design**: RESTful endpoints with webhook support.
- **Core Entities**: Users, Leads, Call Records, Payments, Enrollments, Webhook Logs, Agent Metrics. Strategic indexing is applied for performance.

### Key Features
- **Lead Management**: Capture leads from various sources (voice agent, website, referral), track status (New → Contacted → Qualified → Enrolled → Opt Out), and manage contact information and license goals.
- **Workflow Automation**: Integration with n8n for real-time analytics, call analysis (transcript, sentiment, intent), and agent performance metrics.
- **Payment Processing**: Management of multiple payment plans, tracking of payment statuses, and transaction history.
- **Enrollment Management**: Assignment of leads to specific educational programs, cohort management, and progress monitoring.
- **Real-time Analytics**: Live dashboard updates with performance indicators and historical trend analysis.
- **SMS Integration**: Comprehensive SMS notification system via Twilio, enhancing lead processing and communication.

## External Dependencies

- **Database**: Neon PostgreSQL (serverless database hosting).
- **ORM**: Drizzle ORM (type-safe database operations).
- **UI/Graphics**: Radix UI (accessible component primitives), Tailwind CSS (utility-first styling), Spline (3D scene rendering and interaction).
- **Workflow Automation**: n8n (workflow automation platform integration, utilizing MCP Protocol for real-time data access).
- **Voice Agent**: ElevenLabs (for voice agent capabilities, integrated via webhooks).
- **SMS**: Twilio (for SMS notification system).