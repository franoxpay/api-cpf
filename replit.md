# Replit.md - CPF Lookup API Proxy

## Overview

This is an API proxy service for CPF (Brazilian Individual Taxpayer Registry) lookup. The application provides an HTTPS-enabled endpoint that proxies requests to an external CPF data API, making it accessible through a secure connection. It includes a developer-focused documentation frontend inspired by Stripe's API docs design philosophy.

**Core Purpose:** Provide a secure HTTPS wrapper around an HTTP-only CPF lookup API, with interactive documentation and testing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight React router)
- **State Management:** TanStack React Query for server state
- **Styling:** Tailwind CSS with CSS variables for theming
- **Component Library:** shadcn/ui components (Radix UI primitives)
- **Build Tool:** Vite with HMR support

**Design Pattern:** Single-page application with a documentation-focused layout. The home page serves as both API documentation and an interactive testing interface.

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **Runtime:** Node.js with tsx for development
- **API Pattern:** RESTful proxy endpoint at `/cpf/:cpf`
- **Build:** esbuild for production bundling

**Key Decision:** The server acts as a transparent proxy, forwarding CPF lookup requests to the external API (`http://185.228.72.8:8080/pessoas`) and returning responses with proper status codes.

### Data Storage
- **ORM:** Drizzle ORM configured for PostgreSQL
- **Schema Location:** `shared/schema.ts`
- **Current State:** Basic user schema exists but the main functionality (CPF proxy) doesn't require database storage
- **In-Memory Fallback:** `MemStorage` class provides in-memory storage when database isn't needed

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── pages/          # Route components
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Data storage abstraction
├── shared/           # Shared code between frontend/backend
│   └── schema.ts     # Database schema and types
└── script/           # Build scripts
```

### API Design
- **Endpoint:** `GET /cpf/:cpf`
- **Input Validation:** CPF must be 11 numeric digits (formatting characters are stripped)
- **Timeout:** 30 seconds for upstream API calls
- **Response Format:** `{ statusCode: number, data: object }` or `{ statusCode: number, error: string }`

## External Dependencies

### Third-Party Services
- **External CPF API:** `http://185.228.72.8:8080/pessoas` - The upstream data source for CPF information

### Database
- **PostgreSQL:** Required when `DATABASE_URL` environment variable is set
- **Drizzle Kit:** Used for database migrations (`db:push` script)

### Key NPM Packages
- **UI:** Radix UI primitives, Lucide React icons, class-variance-authority
- **Forms:** React Hook Form with Zod validation
- **HTTP:** Native fetch API for proxy requests
- **Session:** connect-pg-simple for PostgreSQL session storage (when DB is available)

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (optional for core functionality)
- `NODE_ENV` - Controls development vs production behavior