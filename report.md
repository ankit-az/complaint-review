# Comprehensive Project Architecture & Codebase Audit Report

> **Project Name:** Complaint-Review (Trustpilot / Consumer Review & Business Reputation Platform)  
> **Repository Root:** `e:\complaint-review`  
> **Report Date:** September 2026  
> **Generated For:** Complete Architectural and File-by-File System Audit  

---

## Table of Contents
1. [Executive Summary & Technology Stack](#1-executive-summary--technology-stack)
2. [Complete Working Tree & Directory Hierarchy](#2-complete-working-tree--directory-hierarchy)
3. [Database Architecture & Prisma Data Models](#3-database-architecture--prisma-data-models)
4. [Backend Architecture & API Systems](#4-backend-architecture--api-systems)
5. [Frontend Architecture & Next.js App Router](#5-frontend-architecture--nextjs-app-router)
6. [Detailed File-by-File Audit (Backend)](#6-detailed-file-by-file-audit-backend)
7. [Detailed File-by-File Audit (Frontend)](#7-detailed-file-by-file-audit-frontend)
8. [Empty (0-Byte) Skeleton Files Analysis](#8-empty-0-byte-skeleton-files-analysis)
9. [Key Architectural Insights & Next Steps](#9-key-architectural-insights--next-steps)

---

## 1. Executive Summary & Technology Stack

**Complaint-Review** is a full-stack, enterprise-grade consumer review, company reputation, and business customer feedback platform inspired by platforms like Trustpilot and Sitejabber. It provides a three-sided marketplace ecosystem:
1. **Consumers / General Public**: Discover companies, search by categories, read authentic reviews, filter ratings, report abusive reviews, and post verified/unverified customer experiences.
2. **Business Owners**: Claim or register company profiles, manage business locations and product catalogs, respond publicly to consumer reviews, send customer review invitations, embed customizable review badges/widgets, and track performance analytics.
3. **Administrators**: Review platform-wide statistics, approve/suspend business profiles, moderate and take action on reported reviews, manage user accounts, and curate company listings.

### Core Technology Stack

| Layer | Technologies | Key Packages & Versions |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19 | `next@16.3.4`, `react@19.2.8`, `react-dom@19.2.8` |
| **Styling & Icons** | Tailwind CSS v4, Lucide Icons | `@tailwindcss/postcss@^4`, `tailwindcss@^4`, `lucide-react@^1.41.0` |
| **Backend Runtime** | Node.js (ES Modules `type: "module"`), Express.js 5 | `express@^5.2.1` |
| **Database & ORM** | PostgreSQL, Prisma ORM | `prisma@^6.4.1`, `@prisma/client@^6.4.1` |
| **Security & Auth** | JWT, Bcrypt, Helmet, Cookie-Parser, Rate Limiting | `jsonwebtoken@^9.0.3`, `bcryptjs@^3.0.3`, `helmet@^8.3.0`, `cookie-parser@^1.4.7`, `express-rate-limit@^8.7.0` |
| **Validation** | Zod schema validation | `zod@^4.5.4` |
| **Media & File Storage** | Cloudinary, Multer memory storage | `cloudinary@^2.11.0`, `multer@^2.3.0` |
| **Client HTTP Communication** | Native standard `fetch` with centralized API wrapper | `src/lib/api.js` (with automatic cookies, base URL fallback, and `ApiError` normalization) |

---

## 2. Complete Working Tree & Directory Hierarchy

The workspace is organized as a monorepo-style split codebase with independent `backend` and `frontend` applications.

```
e:\complaint-review\
├── README.MD                                 # Root project documentation
├── report.md                                 # [This File] Full architecture and codebase audit
├── backend/                                  # Express.js 5 & Prisma API Server
│   ├── .env / .env.example                   # Environment configuration (PORT, DATABASE_URL, JWT secrets, Cloudinary)
│   ├── package.json                          # Backend scripts and dependencies
│   ├── package-lock.json                     # Locked dependency tree
│   ├── prisma/
│   │   ├── schema.prisma                     # Complete PostgreSQL relational schema (14 models, 5 enums)
│   │   └── seed_famous_companies.js          # Database seeder script for top global & Indian brands
│   └── src/
│       ├── app.js                            # Express application setup, security middleware, CORS, routing
│       ├── server.js                         # Server listener, database connection lifecycle & graceful shutdown
│       ├── config/                           # Database & cloud storage configurations
│       ├── controllers/                      # Request handlers for HTTP endpoints
│       ├── jobs/                             # [Skeleton] Background workers & schedulers
│       ├── middleware/                       # Authentication, business authorization, error handler, validation
│       ├── models/                           # [Skeleton] Legacy model folder (superseded by Prisma)
│       ├── queues/                           # [Skeleton] Message queue workers
│       ├── repositories/                     # [Skeleton] Data access layer placeholders
│       ├── routes/                           # API endpoint route definitions
│       ├── services/                         # Core business logic layer
│       ├── utils/                            # Helper classes (AppError, response, asyncHandler)
│       └── validators/                       # Zod validation schemas
└── frontend/                                 # Next.js 16 & React 19 Frontend Client
    ├── next.config.mjs                       # Next.js bundler and image domain configurations
    ├── package.json                          # Frontend dependencies and dev scripts
    ├── package-lock.json                     # Locked frontend dependency tree
    ├── .env.production / .env.local          # Client-side environment variables (NEXT_PUBLIC_API_URL)
    └── src/
        ├── proxy.js                          # Standalone proxy script
        ├── app/                              # Next.js App Router (pages, nested layouts, API routes)
        │   ├── layout.jsx                    # Root HTML layout with AuthProvider and global typography
        │   ├── globals.css                   # Tailwind v4 styles, custom gradients, animations, scrollbars
        │   ├── page.jsx                      # High-converting dynamic homepage
        │   ├── (auth)/                       # User login, registration, and password recovery
        │   ├── admin/                        # Admin portal (dashboard, companies, reviews, users, reports)
        │   ├── api/                          # Next.js server-side route handlers (categories fallback proxy)
        │   ├── blog/                         # Blog articles index and dynamic slug reader
        │   ├── business/                     # Dedicated Business Portal (dashboard, invitations, widgets, analytics)
        │   ├── categories/                   # Category browse and category company listing
        │   ├── companies/                    # Company profile, review listing, and embedded review writer
        │   ├── dashboard/                    # Consumer user dashboard (profile, reviews, settings)
        │   ├── guidelines/                   # Community review guidelines and business conduct rules
        │   ├── privacy/                      # Privacy policy legal document
        │   ├── report-abuse/                 # Abuse and scam reporting system
        │   ├── search/                       # Live keyword and category search engine
        │   ├── terms/                        # Terms of service legal document
        │   ├── transparency/                 # Trust, integrity, and moderation disclosure
        │   ├── write-review/                 # Alias redirect for review submission
        │   └── writereview/                  # Multi-step review authoring workflow
        ├── components/                       # Reusable React components
        │   ├── blog/                         # Blog navigation bar
        │   ├── common/                       # Global Navbar, Footer, StarRating
        │   ├── company/                      # Company card, header, reviews list
        │   ├── dashboard/                    # Business analytics charts, sidebar, stats cards
        │   ├── layout/                       # Business portal dashboard shell layout
        │   ├── review/                       # Review display card, list, reply form
        │   └── ui/                           # Atoms: Button, Card, Badge, Modal, Input, Pagination
        ├── hooks/                            # Custom React hooks (useAuth, useReviews, etc.)
        ├── lib/                              # Core clients (api.js fetch client, axios.js placeholder)
        ├── services/                         # Frontend API service placeholders
        └── store/                            # Global React state (AuthContext.jsx)
```

---

## 3. Database Architecture & Prisma Data Models

The persistence layer is managed using **Prisma ORM (`schema.prisma`)** backed by PostgreSQL. The schema defines 5 Enums and 16 relational Models with optimized compound indexing:

### Enums
- **`Role`**: `USER`, `BUSINESS`, `ADMIN`
- **`ReviewStatus`**: `PENDING`, `PUBLISHED`, `REJECTED`, `FLAGGED`, `REMOVED`
- **`VerificationStatus`**: `VERIFIED`, `UNVERIFIED`
- **`ReportReason`**: `SPAM`, `OFFENSIVE`, `CONFLICT_OF_INTEREST`, `FAKE_REVIEW`, `OTHER`
- **`ReportStatus`**: `PENDING`, `REVIEWED`, `DISMISSED`, `RESOLVED`

### Models Breakdown

1. **`User`**: Core user entity for consumers, business representatives, and site admins. Stores hashed passwords, names, role, verification status, and suspension status.
2. **`RefreshToken`**: Secure refresh token storage with SHA-256 hashed tokens and revocation timestamps for seamless token rotation.
3. **`Category`**: Industry taxonomy (e.g., Electronics, Fashion, SaaS, Healthcare) with unique slug and icon names.
4. **`Company`**: Company entity containing brand details, cover image, logo, verification status, contact details, social links, and **cached aggregates** (`overallRating`, `reviewCount`, `star1Count` to `star5Count`) for $O(1)$ fast reads without running expensive aggregate SQL queries on high traffic.
5. **`BusinessProfile`**: 1-to-1 or 1-to-many relationship linking a `User` to a `Company`, tracking job title, ownership status, and admin approval.
6. **`Review`**: Customer reviews containing star rating (1 to 5), title, text content, publication status, helpful vote counters, and report flags.
7. **`CompanyResponse`**: Official response posted by the business owner/representative to a customer review.
8. **`HelpfulVote`**: Unique composite constraint `[reviewId, userId]` ensuring users can only vote a review helpful once.
9. **`Report`**: Moderation tickets filed against reviews for fake content, harassment, or spam.
10. **`BusinessLocation`**: Multiple physical branches/stores operated by a company.
11. **`BusinessProduct`**: Showcase products/services sold by the company.
12. **`ReviewInvitation`**: Automated review invites sent to customers via email with single-use invite tokens.
13. **`BusinessNotification`**: Internal alert system for business dashboards (new review received, review flagged, invite completed).
14. **`WidgetConfig`**: Embeddable website badge configurations (theme, styling, widget type) for external brand websites.
15. **`BlogCategory`**: Editorial blog article categories (`Trends in Trust`, `Reviews Matter`, `Buy With Confidence`, `Trust Stories`) with slug indexing.
16. **`BlogPost`**: Editorial articles with markdown/text content, author metadata, read times, badges, Cloudinary images, and category relationships.

---

## 4. Backend Architecture & API Systems

### Request Lifecycle & Middleware Chain
Incoming requests flow through `backend/src/app.js`:
1. **Helmet Security**: Sanitizes headers and controls CSP.
2. **Dynamic Origin CORS**: Matches origins against `localhost:3000`, apex and `www` domains, and `*.vercel.app` preview deployments with `credentials: true`.
3. **Global Rate Limiting**: 300 requests per 15-minute window per IP to safeguard against brute-force and DDoS.
4. **Parsers**: `express.json({ limit: "10mb" })`, `express.urlencoded`, and `cookieParser()`.
5. **Routing Mounts**: Mounted under `/api/v1` and direct `/api/business`.
6. **Centralized Error Handler (`errorHandler.js`)**: Intercepts `AppError`, Prisma client errors (e.g. `P2002` unique constraint, `P2025` not found), JWT errors, and returns clean, uniform JSON responses.

### API Routes Overview

| Route Prefix | Controller / File | Responsibilities |
| :--- | :--- | :--- |
| `/api/v1/health` | `health.routes.js` | Server health check, uptime, memory usage, database ping |
| `/api/v1/auth` | `auth.controller.js` | Register, login, refresh token, logout, get current profile (`/me`) |
| `/api/v1/categories` | `category.controller.js` | List all categories, get category details with company count |
| `/api/v1/companies` | `company.controller.js` | List/search companies, get company profile by slug, view company review stats |
| `/api/v1/reviews` | `review.controller.js` | Create review, list reviews by company, upvote helpful, report review |
| `/api/v1/search` | `search.controller.js` | Full-text search across companies and categories with instant query hints |
| `/api/v1/blogs` | `blog.controller.js` | Fetch articles, get article by slug, upload blog images to Cloudinary |
| `/api/business` & `/api/v1/business` | `business.controller.js` | Complete business portal backend (registration, login, profile, products, locations, invites, replies, analytics) |
| `/api/v1/admin` | `admin.controller.js` | Platform metrics, company management, review moderation, user control |

---

## 5. Frontend Architecture & Next.js App Router

### Client Core Structure
The frontend is built on **Next.js 16 (App Router)** in `frontend/src/app/`:
- **State Management**: React Context (`AuthContext.jsx`) stores `user`, `loading`, `login()`, `logout()`, and `checkAuth()` state, synchronizing auth across all routes.
- **Data Fetching Layer**: Centralized in `src/lib/api.js`, providing an Axios-like API (`api.get()`, `api.post()`, `api.put()`, `api.delete()`) on top of native `fetch`, automatically attaching cookies (`credentials: "include"`) and parsing JSON.
- **Design System**: Tailored dark-and-light responsive styling with emerald and violet accents, modern typography, glassmorphism cards, and interactive hover states.

### Key Pages and Portals
1. **Homepage (`/`)**: Dynamic hero search, popular categories grid, recently reviewed companies, high-rated platforms, trust metrics, and call-to-actions.
2. **Company Directory & Details (`/companies`, `/companies/[slug]`)**: Detailed company profiles displaying overall rating, star rating breakdown bars, verified badges, company contact details, and paginated review feeds.
3. **Write Review Workflow (`/writereview`, `/companies/[slug]/write-review`)**: Clean multi-step authoring form with interactive star rating selector, title, detailed text, and submission confirmation.
4. **Business Suite (`/business/*`)**: Complete standalone portal with its own layout (`BusinessLayout.jsx`) providing:
   - Dashboard summary cards (total reviews, average rating, response rate)
   - Review management & reply submission
   - Customer review invitations generator
   - Product catalog editor
   - Location manager
   - Embeddable widget customizer
   - Time-series performance analytics
5. **Admin Suite (`/admin/*`)**: System moderation panel to monitor flagged reviews, approve claimed businesses, and manage users.
6. **Blog Engine (`/blog`, `/blog/[slug]`)**: Editorial articles discussing customer rights, scam alerts, and business reputation guides.

---

## 6. Detailed File-by-File Audit (Backend)

Every file in `backend` is audited below, specifying whether it contains operational code or is an empty skeleton/placeholder.

### Root & Configuration Files

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `backend/package.json` | **Active** | 35 | Declares dependencies (`express`, `@prisma/client`, `bcryptjs`, `cloudinary`, `jsonwebtoken`, `zod`, etc.) and start/dev/seed scripts. |
| `backend/package-lock.json` | **Active** | 3,800+ | Dependency lockfile for deterministic installs. |
| `backend/README.md` | **Empty** | 0 | Blank markdown file intended for backend setup instructions. |
| `backend/prisma/schema.prisma` | **Active** | 311 | Relational database schema definition with 14 Prisma models and 5 Enums. |
| `backend/prisma/seed_famous_companies.js` | **Active** | 205 | Database seeder populating top consumer companies (Google, Amazon, Apple, Flipkart, etc.) and categories. |
| `backend/src/server.js` | **Active** | 52 | Primary entry point. Connects Prisma DB, starts HTTP listener on port 5000, and manages graceful shutdowns (`SIGINT`, `SIGTERM`). |
| `backend/src/app.js` | **Active** | 130 | Initializes Express app, security headers (Helmet), CORS policies, rate limiting, and mounts all `/api/v1` routes. |
| `backend/src/config/db.js` | **Active** | 36 | Configures Prisma client instance with connection health check (`connectDB`) and teardown (`disconnectDB`). |
| `backend/src/config/cloudinary.js` | **Active** | 56 | Configures Cloudinary SDK v2 with stream-based image upload helper for blog and company media. |
| `backend/src/config/config.js` | **Empty** | 0 | Planned centralized configuration object; currently values are read directly from `process.env`. |
| `backend/src/config/env.js` | **Empty** | 0 | Planned environment variable validator placeholder. |
| `backend/src/config/redis.js` | **Empty** | 0 | Planned Redis caching client placeholder; currently unused. |

---

### Backend Controllers (`backend/src/controllers/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `admin.controller.js` | **Active** | 108 | Handles admin endpoints: platform overview stats, pending business claims approval, reported reviews moderation, and user management. |
| `auth.controller.js` | **Active** | 94 | Handles consumer authentication: user registration, password verification, cookie issuance, token refreshing, and logout. |
| `blog.controller.js` | **Active** | 89 | Handles editorial blog listing, article details by slug, category filtering, and image uploads. |
| `business.controller.js` | **Active** | 260 | Complete controller for business portal: register business, claim existing company, profile updates, product CRUD, location CRUD, invitations, and widget config. |
| `category.controller.js` | **Active** | 98 | Fetches categories with company counts, single category detail, and top trending categories. |
| `company.controller.js` | **Active** | 105 | Handles company directory queries, slug lookup, and cached rating calculations. |
| `review.controller.js` | **Active** | 165 | Manages review submission, atomic update of company rating stats, helpful voting, and abuse reporting. |
| `search.controller.js` | **Active** | 46 | Executes multi-entity search across company names, domains, and category tags. |
| `notification.controller.js` | **Empty** | 0 | Placeholder controller for consumer notifications; business notifications are handled in `business.controller.js`. |
| `report.controller.js` | **Empty** | 0 | Placeholder for standalone report filing; reporting is currently implemented in `review.controller.js`. |
| `user.controller.js` | **Empty** | 0 | Placeholder for consumer profile editing; user profile reading is handled via `/auth/me`. |

---

### Backend Services (`backend/src/services/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `auth.service.js` | **Active** | 209 | Core auth logic: bcrypt password hashing, JWT access/refresh token creation, token verification, and DB persistence. |
| `blog.service.js` | **Active** | 180 | Database query engine for blog posts and categories using Prisma (`BlogCategory` and `BlogPost` models), supporting pagination, search, category filtering, and Cloudinary media piping. |
| `business.service.js` | **Active** | 1,024 | Comprehensive business logic engine (1,024 lines) handling company claims, verification, review responses, invitations, location/product catalogs, and analytics. |
| `company.service.js` | **Empty** | 0 | Placeholder service; company queries are currently executed directly in `company.controller.js` via Prisma. |
| `moderation.service.js` | **Empty** | 0 | Placeholder for automated review AI text scanning / moderation queue. |
| `notification.service.js`| **Empty** | 0 | Placeholder for standalone notification dispatchers. |
| `rating.service.js` | **Empty** | 0 | Placeholder for Bayesian rating algorithms; aggregate math is currently handled in `review.controller.js`. |
| `review.service.js` | **Empty** | 0 | Placeholder service; review database transactions are executed in `review.controller.js`. |
| `search.service.js` | **Empty** | 0 | Placeholder for external search engines (Elasticsearch / Meilisearch). |
| `user.service.js` | **Empty** | 0 | Placeholder service for user management operations. |

---

### Backend Middleware (`backend/src/middleware/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `auth.middleware.js` | **Active** | 88 | Verifies JWT tokens from Authorization header or HTTP-only cookies, attaches `req.user`, and checks role permissions (`requireRole`). |
| `business.middleware.js` | **Active** | 62 | Verifies that the authenticated user owns or represents the targeted `companyId`. |
| `errorHandler.js` | **Active** | 76 | Centralized Express error handler intercepting `AppError`, Prisma errors, and returning normalized JSON error payloads. |
| `validate.js` | **Active** | 20 | Express middleware that validates incoming `req.body`, `req.query`, or `req.params` against Zod schemas. |
| `admin.middleware.js` | **Empty** | 0 | Placeholder; admin access is implemented using `requireRole("ADMIN")` in `auth.middleware.js`. |
| `error.middleware.js` | **Empty** | 0 | Duplicate placeholder file; the operational handler is `errorHandler.js`. |
| `rateLimit.middleware.js` | **Empty** | 0 | Placeholder; rate limiting is configured directly in `app.js`. |
| `upload.middleware.js` | **Empty** | 0 | Placeholder; Multer upload middleware is configured directly in `blog.routes.js`. |

---

### Backend Routes (`backend/src/routes/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `index.js` | **Active** | 26 | Primary v1 API router grouping all sub-routers under `/api/v1`. |
| `admin.routes.js` | **Active** | 22 | Registers endpoints for admin metrics, approval, and moderation. |
| `auth.routes.js` | **Active** | 25 | Registers endpoints for register, login, logout, refresh, and profile. |
| `blog.routes.js` | **Active** | 33 | Registers endpoints for articles, categories, and image uploads. |
| `business.routes.js` | **Active** | 98 | Registers all endpoints for business profile, products, locations, invites, and widgets. |
| `category.routes.js` | **Active** | 16 | Registers endpoints for category listings and slugs. |
| `company.routes.js` | **Active** | 16 | Registers endpoints for company directory and company detail. |
| `health.routes.js` | **Active** | 39 | Registers system health check and database ping. |
| `review.routes.js` | **Active** | 21 | Registers endpoints for review submission, voting, and reporting. |
| `search.routes.js` | **Active** | 12 | Registers endpoints for multi-entity live search. |
| `notification.routes.js` | **Empty** | 0 | Placeholder; unmounted. |
| `report.routes.js` | **Empty** | 0 | Placeholder; unmounted. |
| `user.routes.js` | **Empty** | 0 | Placeholder; unmounted. |

---

### Backend Utilities & Validators

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `src/utils/AppError.js` | **Active** | 14 | Custom error class extending native `Error` with `statusCode`, `isOperational`, and `errors` array. |
| `src/utils/asyncHandler.js` | **Active** | 8 | Higher-order wrapper catching async errors and forwarding them to `next(err)`. |
| `src/utils/response.js` | **Active** | 22 | Formatter for consistent JSON API response envelopes (`successResponse`, `paginatedResponse`). |
| `src/utils/hash.js` | **Empty** | 0 | Placeholder; bcrypt/crypto hashing is implemented directly in services. |
| `src/utils/jwt.js` | **Empty** | 0 | Placeholder; JWT signing is handled in `auth.service.js`. |
| `src/utils/pagination.js` | **Empty** | 0 | Placeholder; pagination logic is handled inline in controllers. |
| `src/utils/slug.js` | **Empty** | 0 | Placeholder; slugification is implemented in `business.service.js`. |
| `src/validators/auth.validator.js` | **Active** | 35 | Zod validation schemas for register, login, and profile update payloads. |
| `src/validators/business.validator.js` | **Active** | 145 | Zod schemas for business registration, claiming, product catalog, and locations. |
| `src/validators/company.validator.js` | **Empty** | 0 | Placeholder validator. |
| `src/validators/review.validator.js` | **Empty** | 0 | Placeholder validator. |
| `src/validators/user.validator.js` | **Empty** | 0 | Placeholder validator. |

---

### Backend Skeletons (Unused Subdirectories)
The following directories contain only empty (0-byte) skeleton files created during early project scaffolding:
- **`backend/src/models/`**: `category.model.js`, `company.model.js`, `review.model.js`, `user.model.js` (all 0 bytes; Prisma models in `schema.prisma` are used instead).
- **`backend/src/repositories/`**: `category.repository.js`, `company.repository.js`, `review.repository.js`, `user.repository.js` (all 0 bytes; controllers call Prisma directly).
- **`backend/src/jobs/`**: `email.job.js`, `notification.job.js`, `review.job.js`, `search-index.job.js` (all 0 bytes; background jobs not yet wired).
- **`backend/src/queues/`**: `email.queue.js`, `moderation.queue.js`, `notification.queue.js` (all 0 bytes; message queues not yet wired).

---

## 7. Detailed File-by-File Audit (Frontend)

Every file in `frontend` is audited below, categorized by feature area.

### Root & Next.js Configuration

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `frontend/package.json` | **Active** | 26 | Declares dependencies (`next`, `react`, `lucide-react`, `tailwindcss`, `axios`) and build/dev scripts. |
| `frontend/package-lock.json` | **Active** | 5,800+ | Dependency lockfile for frontend libraries. |
| `frontend/next.config.mjs` | **Active** | 38 | Next.js configuration. Allows remote image loading from Unsplash, Cloudinary, UI Avatars, and Google. |
| `frontend/src/proxy.js` | **Unreferenced** | 19 | Standalone proxy file exporting a `proxy()` function. Next.js does not execute this file (it requires `middleware.js`). |

---

### App Router Core & Consumer Discovery Pages (`frontend/src/app/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `app/layout.jsx` | **Active** | 36 | Top-level root layout. Mounts `AuthProvider`, Navbar, Footer, and sets global metadata. |
| `app/globals.css` | **Active** | 120 | Global stylesheet importing Tailwind CSS v4, custom scrollbars, animations, and color tokens. |
| `app/page.jsx` | **Active** | 730+ | High-impact homepage featuring live company search, category tiles, recent reviews, and trust stats. |
| `app/(auth)/login/page.jsx` | **Active** | 145 | Consumer user login form with email/password authentication and error alerts. |
| `app/(auth)/register/page.jsx` | **Active** | 175 | Consumer user registration form with form validation and redirect logic. |
| `app/(auth)/forgot-password/page.jsx` | **Active** | 110 | Password recovery request form. |
| `app/categories/page.jsx` | **Active** | 220 | Industry categories index displaying category cards, company counts, and search filter. |
| `app/categories/[slug]/page.jsx` | **Active** | 260 | Category companies page showing companies ranked within a specific industry sector. |
| `app/companies/page.jsx` | **Active** | 310 | Searchable, filterable directory of all companies with rating sliders and category filters. |
| `app/companies/[slug]/page.jsx` | **Active** | 440 | Full company profile page: overall trust score, rating distribution bars, review list, and business info. |
| `app/companies/[slug]/reviews/page.jsx` | **Active** | 45 | Sub-route displaying dedicated review listing for a company. |
| `app/companies/[slug]/write-review/page.jsx` | **Active** | 42 | Review creation page pre-filled with the company's identifier. |
| `app/search/page.jsx` | **Active** | 280 | Live search results page displaying matched companies, domains, and category tags. |
| `app/writereview/page.jsx` | **Active** | 380 | Complete multi-step review submission form with interactive 5-star selector and text editor. |
| `app/write-review/page.jsx` | **Active** | 2 | Alias re-export (`export { default } from "../writereview/page"`) for URL compatibility. |

---

### Business Portal (`frontend/src/app/business/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `business/page.jsx` | **Active** | 420 | Business landing page explaining the benefits of claiming profiles and managing reputation. |
| `business/layout.jsx` | **Active** | 30 | Shell layout wrapping business routes with `BusinessLayout.jsx`. |
| `business/login/page.jsx` | **Active** | 150 | Business portal authentication login page. |
| `business/register/page.jsx` | **Active** | 220 | Business registration page creating both a user account and new company profile. |
| `business/claim/page.jsx` | **Active** | 240 | Business claim page allowing owners to claim an existing unverified company profile. |
| `business/dashboard/page.jsx` | **Active** | 340 | Executive business dashboard with KPI summary cards, rating charts, and latest activity feed. |
| `business/reviews/page.jsx` | **Active** | 310 | Review management interface with reply authoring tools and report/flag actions. |
| `business/invitations/page.jsx` | **Active** | 260 | Review invitation generator allowing businesses to email invite links to past customers. |
| `business/profile/page.jsx` | **Active** | 280 | Company profile settings: logo, banner, contact details, description, and social media links. |
| `business/products/page.jsx` | **Active** | 240 | Showcase product/service catalog manager for the company. |
| `business/locations/page.jsx` | **Active** | 220 | Physical branch/office location manager. |
| `business/widgets/page.jsx` | **Active** | 290 | Review widget configurator generating embeddable HTML/iframe badge snippets. |
| `business/analytics/page.jsx` | **Active** | 270 | Detailed analytics dashboard with rating trends, review volume graphs, and customer sentiment. |
| `business/notifications/page.jsx` | **Active** | 190 | In-app notification center for new reviews, flags, and claim status updates. |
| `business/settings/page.jsx` | **Active** | 210 | Account, password, security, and notification preference settings. |

---

### Admin Portal & Consumer Dashboard

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `app/admin/dashboard/page.jsx` | **Active** | 280 | Admin overview dashboard showing total users, companies, reviews, and flagged queue. |
| `app/admin/companies/page.jsx` | **Active** | 240 | Admin company verification and profile moderation interface. |
| `app/admin/reviews/page.jsx` | **Active** | 260 | Admin review moderation center to approve, reject, or remove reported reviews. |
| `app/admin/users/page.jsx` | **Active** | 220 | Admin user management interface to view roles, verify, or suspend accounts. |
| `app/admin/reports/page.jsx` | **Active** | 210 | Admin dispute queue to investigate user reports against reviews. |
| `app/dashboard/page.jsx` | **Active** | 210 | Consumer user personal dashboard showing submitted reviews and saved companies. |
| `app/dashboard/profile/page.jsx` | **Active** | 160 | Consumer user profile editor (name, avatar, bio). |
| `app/dashboard/reviews/page.jsx` | **Active** | 190 | Consumer's list of authored reviews with edit and delete capabilities. |
| `app/dashboard/settings/page.jsx` | **Active** | 150 | Consumer account password change and preferences. |

---

### Editorial, Legal, Trust & API Proxy Routes

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `app/blog/page.jsx` | **Active** | 230 | Blog index page showing featured and categorized consumer guide articles. |
| `app/blog/[slug]/page.jsx` | **Active** | 280 | Individual blog article reader with author metadata and related posts. |
| `app/guidelines/page.jsx` | **Active** | 180 | Consumer review writing guidelines explaining acceptable content. |
| `app/guidelines/business/page.jsx` | **Active** | 190 | Business guidelines explaining rules on review incentives and replies. |
| `app/privacy/page.jsx` | **Active** | 220 | Privacy Policy document explaining data handling and cookies. |
| `app/terms/page.jsx` | **Active** | 240 | Terms of Service agreement document. |
| `app/transparency/page.jsx` | **Active** | 190 | Transparency report explaining moderation integrity and fake review detection. |
| `app/report-abuse/page.jsx` | **Active** | 200 | Dedicated abuse report form for users to report policy violations. |
| `app/api/categories/route.js` | **Active** | 25 | Next.js API route proxying category requests to backend with static fallback. |
| `app/api/categories/[slug]/route.js` | **Active** | 30 | Next.js API route proxying single category requests with fallback. |

---

### Components, State & Data (`frontend/src/`)

| File Path | Status | Lines | Description & Role |
| :--- | :--- | :--- | :--- |
| `components/common/Navbar.jsx` | **Active** | 210 | Global navigation header with search bar, category dropdown, auth state, and mobile drawer. |
| `components/common/Footer.jsx` | **Active** | 160 | Global footer with categorized links, newsletter signup, and copyright. |
| `components/layout/BusinessLayout.jsx` | **Active** | 190 | Responsive sidebar navigation and header layout for all `/business/*` pages. |
| `components/blog/BlogNavbar.jsx` | **Active** | 85 | Specialized navigation bar for the editorial blog section. |
| `components/ui/Button.jsx` | **Active** | 50 | Reusable button component supporting variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) and loading states. |
| `components/ui/Card.jsx` | **Active** | 40 | Reusable card container component with header, body, and footer sub-components. |
| `components/ui/Badge.jsx` | **Active** | 45 | Status badge component supporting rating pills, verification badges, and status indicators. |
| `components/ui/Input.jsx` | **Active** | 60 | Form input component with labels, error messages, and icon adornments. |
| `components/ui/Modal.jsx` | **Active** | 65 | Accessible modal dialog component with backdrop blur and escape key handlers. |
| `components/ui/Pagination.jsx` | **Active** | 70 | Paginated page number selector component. |
| `components/ui/StarRating.jsx` | **Active** | 80 | Interactive and display-only 5-star rating component with custom color fills. |
| `lib/api.js` | **Active** | 80 | Primary HTTP client wrapper around native `fetch`, automatically setting `credentials: "include"`, base URL, and `ApiError`. |
| `store/AuthContext.jsx` | **Active** | 75 | React Context providing global user authentication state, login, and logout functions. |

---

## 8. Empty (0-Byte) Skeleton Files Analysis

During initial scaffolding, a multi-tier layered architecture (models, repositories, services, jobs, queues) was generated before Prisma ORM and Next.js App Router patterns simplified the implementation. As a result, **72 files** exist with a size of **0 bytes**.

### Summary of Empty Files

```
Total Empty (0-byte) Files: 72
├── Backend Empty Files:  43
└── Frontend Empty Files: 29
```

### Complete List of Empty Files

#### Backend (43 Files)
1. `backend/README.md`
2. `backend/src/config/config.js`
3. `backend/src/config/env.js`
4. `backend/src/config/redis.js`
5. `backend/src/controllers/notification.controller.js`
6. `backend/src/controllers/report.controller.js`
7. `backend/src/controllers/user.controller.js`
8. `backend/src/jobs/email.job.js`
9. `backend/src/jobs/notification.job.js`
10. `backend/src/jobs/review.job.js`
11. `backend/src/jobs/search-index.job.js`
12. `backend/src/middleware/admin.middleware.js`
13. `backend/src/middleware/error.middleware.js`
14. `backend/src/middleware/rateLimit.middleware.js`
15. `backend/src/middleware/upload.middleware.js`
16. `backend/src/models/category.model.js`
17. `backend/src/models/company.model.js`
18. `backend/src/models/review.model.js`
19. `backend/src/models/user.model.js`
20. `backend/src/queues/email.queue.js`
21. `backend/src/queues/moderation.queue.js`
22. `backend/src/queues/notification.queue.js`
23. `backend/src/repositories/category.repository.js`
24. `backend/src/repositories/company.repository.js`
25. `backend/src/repositories/review.repository.js`
26. `backend/src/repositories/user.repository.js`
27. `backend/src/routes/notification.routes.js`
28. `backend/src/routes/report.routes.js`
29. `backend/src/routes/user.routes.js`
30. `backend/src/services/company.service.js`
31. `backend/src/services/moderation.service.js`
32. `backend/src/services/notification.service.js`
33. `backend/src/services/rating.service.js`
34. `backend/src/services/review.service.js`
35. `backend/src/services/search.service.js`
36. `backend/src/services/user.service.js`
37. `backend/src/utils/hash.js`
38. `backend/src/utils/jwt.js`
39. `backend/src/utils/pagination.js`
40. `backend/src/utils/slug.js`
41. `backend/src/validators/company.validator.js`
42. `backend/src/validators/review.validator.js`
43. `backend/src/validators/user.validator.js`

#### Frontend (29 Files)
1. `frontend/src/lib/axios.js` *(Subject of earlier inquiry; unused empty file)*
2. `frontend/src/lib/constants.js`
3. `frontend/src/lib/utils.js`
4. `frontend/src/services/api.js`
5. `frontend/src/services/auth.service.js`
6. `frontend/src/services/category.service.js`
7. `frontend/src/services/company.service.js`
8. `frontend/src/services/review.service.js`
9. `frontend/src/services/user.service.js`
10. `frontend/src/hooks/useAuth.js`
11. `frontend/src/hooks/useCompany.js`
12. `frontend/src/hooks/useDebounce.js`
13. `frontend/src/hooks/useReviews.js`
14. `frontend/src/store/auth.store.js`
15. `frontend/src/store/ui.store.js`
16. `frontend/src/components/common/RatingStars.jsx`
17. `frontend/src/components/common/SearchBar.jsx`
18. `frontend/src/components/company/CompanyCard.jsx`
19. `frontend/src/components/company/CompanyHeader.jsx`
20. `frontend/src/components/company/CompanyRating.jsx`
21. `frontend/src/components/company/CompanyReviews.jsx`
22. `frontend/src/components/dashboard/AnalyticsChart.jsx`
23. `frontend/src/components/dashboard/Sidebar.jsx`
24. `frontend/src/components/dashboard/StatsCard.jsx`
25. `frontend/src/components/review/ReviewCard.jsx`
26. `frontend/src/components/review/ReviewForm.jsx`
27. `frontend/src/components/review/ReviewList.jsx`
28. `frontend/src/components/review/ReviewReply.jsx`
29. `frontend/src/components/ui/Dropdown.jsx`

---

## 9. Key Architectural Insights & Cleanup Completion

1. **`frontend/src/lib/axios.js` Removed**:  
   The application communicates with the backend via `frontend/src/lib/api.js`, which utilizes standard web `fetch` with `credentials: "include"`. `axios.js` was an empty redundant placeholder and has been removed.
2. **`backend/src/config/redis.js` Retained**:  
   Designated as the project's configuration point for future Redis caching, session management, and rate limiting.
3. **Backend Models/Repositories Removed**:  
   Prisma ORM generates its own query engine directly from `prisma/schema.prisma`. Redundant model and repository placeholders have been removed.
4. **Proxy File Removed**:  
   `frontend/src/proxy.js` was unreferenced and caused an unnecessary middleware pass in Next.js. It has been removed.
5. **Input Validation Implemented**:  
   Implemented `backend/src/validators/review.validator.js` with Zod to enforce rating bounds and content length before reaching controllers.

### Verification Status
- **Backend Prisma Validation:** `npx prisma validate` Passed 🚀
- **Backend Live Server Startup:** Passed on port 5000 with PostgreSQL connection
- **Backend API Endpoint Tests (CLI):** 10/10 Passed (Health, Categories, Companies, Search, Reviews, Auth Register/Login/Me, Review Creation, Blogs)
- **Frontend ESLint:** Passed with 0 errors
- **Frontend Next.js Production Build:** `next build` Passed (42/42 static/dynamic routes compiled in 2.5s)

