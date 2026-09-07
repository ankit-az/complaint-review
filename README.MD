# Complaint-Review — Review and Complaint Platform

A production-ready review and complaint intelligence platform inspired by the functionality of Trustpilot, featuring 100% original branding, modern UI/UX, and clean modular architecture.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, React Compiler, Tailwind CSS
- **Backend**: Node.js, Express.js (ES Modules), REST API (`/api/v1/`), PostgreSQL, Prisma ORM
- **Security**: Helmet, CORS with credentials, Rate Limiting, Zod Validation, HTTP-only Cookies, Bcryptjs, JWT

## Directory Structure
- `/frontend`: Next.js client and server-rendered web application
- `/backend`: Node.js Express REST API server with Prisma ORM

## Getting Started

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
Runs at: `http://localhost:5000` (API version: `http://localhost:5000/api/v1`)

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:3000`
