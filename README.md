# Task Tracker + LLM Chat Application

Create a full-stack web application that combines task management with LLM chat functionality. The app should be production-ready, scalable, and maintainable.

## Core Features Required

### Task Management System
- **Backlog**: Long-running list of all tasks
- **Weekly Priority List**: Curated subset of backlog tasks for the current week
- **Task Operations**:
  - Create, edit, delete tasks
  - Move tasks between backlog and weekly priority list
  - Set task status: Todo, In Progress, Done
  - Add/edit notes on tasks
  - Basic task metadata (created date, last modified)

### LLM Chat Interface
- **Multiple Chat Pages**: Create new chat windows/tabs
- **Chat Features**:
  - Persistent conversation memory within each chat session
  - Clear conversation history function
  - File upload capability to add context
  - Filesystem browser to select files for context
- **LLM Integration**: Support for multiple providers (Claude, ChatGPT)
- **Context Management**: Visual indication of files/context currently loaded

## Technical Requirements

### Recommended Stack
- **Frontend**: React 18+ with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: SQLite with Prisma ORM (simple, file-based, easy deployment)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (lightweight alternative to Redux)
- **File Handling**: Multer for uploads, native fs for file system operations
- **LLM Integration**: Direct API calls to Anthropic and OpenAI APIs

### File Structure
```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI components
│   │   │   ├── tasks/           # Task-related components
│   │   │   └── chat/            # Chat-related components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # Zustand stores
│   │   ├── services/            # API service functions
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Utility functions
│   ├── public/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── controllers/         # Business logic
│   │   ├── services/            # External service integrations
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Database models (Prisma)
│   │   ├── types/               # Shared TypeScript types
│   │   └── utils/               # Server utilities
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── uploads/                 # Uploaded files storage
│   └── package.json
├── shared/
│   └── types/                   # Shared types between client/server
├── docker-compose.yml           # For easy deployment
└── README.md
```

## Implementation Guidelines

### Database Schema (Prisma)
```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  notes       String?
  status      TaskStatus @default(TODO)
  priority    Boolean  @default(false) // true if in weekly priority list
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ChatSession {
  id          String   @id @default(cuid())
  name        String
  messages    ChatMessage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ChatMessage {
  id          String      @id @default(cuid())
  content     String
  role        MessageRole
  sessionId   String
  session     ChatSession @relation(fields: [sessionId], references: [id])
  createdAt   DateTime    @default(now())
}

model ContextFile {
  id          String   @id @default(cuid())
  filename    String
  filepath    String
  sessionId   String
  uploadedAt  DateTime @default(now())
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum MessageRole {
  USER
  ASSISTANT
}
```

### Scalability & Code Quality Requirements

1. **Component Architecture**:
   - Use composition over inheritance
   - Implement proper prop interfaces with TypeScript
   - Create reusable UI components with consistent APIs
   - Implement proper error boundaries

2. **State Management**:
   - Use Zustand stores for different domains (tasks, chats, ui)
   - Implement optimistic updates for better UX
   - Handle loading and error states consistently

3. **API Design**:
   - RESTful API endpoints with proper HTTP status codes
   - Input validation using Zod or similar
   - Proper error handling middleware
   - Rate limiting for LLM API calls

4. **File Handling**:
   - Secure file upload validation
   - File type restrictions
   - Cleanup of temporary files
   - File size limits

5. **Environment Configuration**:
   - Separate config files for development/production
   - Environment variables for API keys and settings
   - Docker support for easy deployment

## API Endpoints Structure

### Tasks API
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/priority` - Toggle priority status

### Chat API
- `GET /api/chats` - Get all chat sessions
- `POST /api/chats` - Create new chat session
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `DELETE /api/chats/:id` - Delete chat session
- `POST /api/chats/:id/clear` - Clear chat history

### File API
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files in filesystem
- `POST /api/chats/:id/context/add-file` - Add file to chat context
- `DELETE /api/chats/:id/context/remove-file` - Remove file from context

### LLM Integration API
- `POST /api/llm/chat` - Send message to LLM (supports Claude/ChatGPT)

## Development Instructions

1. **Setup Phase**:
   - Initialize both client and server with proper TypeScript configs
   - Set up Prisma with SQLite
   - Configure Tailwind CSS
   - Set up development scripts with concurrently

2. **Security Considerations**:
   - Implement API key management
   - Add CORS configuration
   - File upload security (type checking, size limits)
   - Input sanitization

3. **Testing Strategy**:
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - Component testing for critical UI components

4. **Deployment Ready**:
   - Docker configuration
   - Environment variable templates
   - Build scripts for production
   - Basic logging setup

## UI/UX Requirements

- **Clean, Modern Interface**: Use Tailwind for consistent design
- **Responsive Design**: Works on desktop and tablet
- **Intuitive Navigation**: Clear separation between task management and chat features
- **Real-time Updates**: Optimistic UI updates for task operations
- **File Context Visualization**: Clear indication of what files are loaded in chat context
- **Keyboard Shortcuts**: Common operations should have keyboard shortcuts

## Additional Features to Consider

- Dark/light mode toggle
- Task search and filtering
- Export tasks to various formats
- Chat session search
- Bulk task operations
- Task categories/tags
- Due dates for tasks

Please implement this step by step, starting with the basic project structure, database setup, and then building out the task management features first, followed by the chat functionality. Focus on creating a solid foundation that can be easily extended with additional features.