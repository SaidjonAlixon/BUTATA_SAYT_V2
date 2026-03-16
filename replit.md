# Butata LLC - Logistics Company Website

## Overview

A bilingual (English/Uzbek) logistics company website for Butata LLC built with React, Express, and PostgreSQL. The application features a modern, animated frontend for trucking/transportation services with pages for company drivers, owner operators, and job applications. The site uses a dark/light theme system and includes smooth animations powered by Framer Motion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **State Management**: TanStack React Query for server state, Zustand for client state (i18n)
- **Animations**: Framer Motion for page transitions and scroll animations
- **Theme System**: Custom theme provider supporting dark/light modes with CSS variables
- **Typography**: Chakra Petch (display) and Inter (body) font families

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Build Process**: Custom build script using esbuild for server, Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Tables**: jobs (job postings), applications (driver applications), contacts (contact form submissions)
- **Migrations**: Drizzle Kit with push command (`npm run db:push`)

### Key Design Patterns
- **Monorepo Structure**: Client code in `/client`, server in `/server`, shared types/schemas in `/shared`
- **Type Safety**: Full TypeScript with shared Zod schemas for runtime validation
- **API Contract**: Centralized API definitions in shared/routes.ts with typed inputs/outputs
- **Component Library**: shadcn/ui components in client/src/components/ui/

### Development vs Production
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Static files served from dist/public, bundled server in dist/index.cjs

## External Dependencies

### Database
- PostgreSQL database (connection via DATABASE_URL environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for session storage (if sessions are needed)

### UI Components
- Radix UI primitives (accordion, dialog, dropdown, etc.)
- Embla Carousel for carousels
- React Day Picker for calendar components
- Vaul for drawer components
- cmdk for command palette

### Form Handling
- React Hook Form with Zod resolver for form validation
- File upload support planned (resumeUrl field in applications)

### Build & Development Tools
- Vite with React plugin
- Replit-specific plugins (error overlay, cartographer, dev banner)
- esbuild for server bundling
- PostCSS with Tailwind and Autoprefixer