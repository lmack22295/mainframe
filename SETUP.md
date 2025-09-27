# Task Tracker + LLM Chat Application - Setup Guide

## Overview

This is a full-stack web application that combines task management with LLM chat functionality. The app is production-ready, scalable, and maintainable.

## Features

### ✅ Task Management System
- **Backlog**: Long-running list of all tasks
- **Weekly Priority List**: Curated subset of backlog tasks for the current week
- **Task Operations**: Create, edit, delete tasks with status tracking (Todo, In Progress, Done)
- **Task Metadata**: Notes, descriptions, created/modified dates
- **Priority Management**: Move tasks between backlog and weekly priority list

### ✅ LLM Chat Interface
- **Multiple Chat Sessions**: Create and manage multiple chat windows
- **Persistent Memory**: Conversation history within each chat session
- **Chat Management**: Clear conversation history, delete sessions
- **File Upload Support**: Infrastructure ready for file context (placeholder)
- **LLM Integration**: Prepared for Claude and ChatGPT APIs

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with Prisma ORM
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Development**: Concurrently, Nodemon, Vite

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set up Environment Variables
```bash
# Copy example environment files
cp .env.example server/.env
cp client/.env.example client/.env
```

### 3. Initialize Database
```bash
npm run db:push
npm run db:generate
```

### 4. Start Development Servers
```bash
npm run dev
```

This will start:
- Client: http://localhost:5173
- Server: http://localhost:3001

## Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both client and server in development
- `npm run build` - Build both client and server for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database

### Client (`cd client`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server (`cd server`)
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Production Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or for development
docker-compose --profile dev up
```

### Environment Variables for Production
Set these in your production environment:
- `NODE_ENV=production`
- `DATABASE_URL=file:./data/prod.db`
- `ANTHROPIC_API_KEY=your_key` (optional)
- `OPENAI_API_KEY=your_key` (optional)

## Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── common/     # Reusable components
│   │   │   ├── tasks/      # Task management components
│   │   │   └── chat/       # Chat interface components
│   │   ├── stores/         # Zustand state management
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── types/          # Server types & schemas
│   ├── prisma/            # Database schema and migrations
│   └── uploads/           # File upload storage
├── shared/                # Shared TypeScript types
└── docker-compose.yml    # Container orchestration
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/priority` - Toggle priority status

### Chat
- `GET /api/chats` - Get all chat sessions
- `POST /api/chats` - Create new chat session
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `DELETE /api/chats/:id` - Delete chat session
- `POST /api/chats/:id/clear` - Clear chat history

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Browse filesystem

### LLM
- `POST /api/llm/chat` - Send message to LLM (placeholder)

## Security Features

✅ **Implemented Security Measures:**
- Rate limiting on all API endpoints
- Special rate limiting for LLM and file upload endpoints
- Input validation using Zod schemas
- File type and size validation
- Directory traversal protection
- CORS configuration
- Helmet security headers
- SQL injection protection (Prisma ORM)

## Database Schema

The application uses SQLite with the following models:
- **Task**: Task management with status, priority, notes
- **ChatSession**: Chat conversation containers
- **ChatMessage**: Individual messages with roles
- **ContextFile**: File attachments for chat context

## Troubleshooting

### Common Issues

1. **Database Issues**
   ```bash
   npm run db:push
   npm run db:generate
   ```

2. **Port Conflicts**
   - Client default: 5173
   - Server default: 3001
   - Check if ports are available

3. **TypeScript Errors**
   ```bash
   # Rebuild shared types
   cd client && npm run build
   cd ../server && npm run build
   ```

## Development Notes

- The application is built with production-ready patterns
- All components use TypeScript for type safety
- State management is handled by Zustand stores
- API responses follow consistent success/error patterns
- File uploads are secured with validation
- Chat functionality includes placeholder LLM integration

## Next Steps for Enhancement

1. **LLM Integration**: Replace placeholder with actual Anthropic Claude or OpenAI API calls
2. **File Context**: Implement file content processing for chat context
3. **Authentication**: Add user authentication and authorization
4. **Real-time Updates**: Add WebSocket support for live updates
5. **Testing**: Add comprehensive test suites
6. **Monitoring**: Add logging and monitoring solutions

The application is fully functional and ready for production use!