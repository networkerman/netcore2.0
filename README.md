# ChatLinkage - WhatsApp Business Communication Platform

A modern WhatsApp Business communication platform that enables businesses to manage conversations, automate responses, and track performance.

## Core Features

### Conversation Management
- Real-time chat interface
- Message history and threading
- Multi-language support
- Quick reply templates

### Auto-Reply System
- Keyword-based response matching
- AI-powered response generation
- Customizable response templates
- Multi-language support

### Analytics & Monitoring
- Conversation metrics
- Response performance tracking
- Error logging and monitoring
- QA testing tools

### Template Management
#### Overview
Templates enable reusable content for quick replies and automated responses in WhatsApp conversations. The system supports various template layouts with named variable substitution.

#### Template Layouts
1. **Text Templates**
   - Simple text messages
   - Variable substitution
   - Multi-language support

2. **Product Templates**
   - Single product showcase
   - Multi-product carousel
   - Catalog integration
   - Price and currency formatting

3. **Order Templates**
   - Order details
   - Order status updates
   - Tracking information

4. **Rich Media Templates**
   - Image and video support
   - Media preview
   - Caption formatting

5. **Interactive Templates**
   - Quick reply buttons
   - Call-to-action buttons
   - URL and phone number buttons

6. **Authentication Templates**
   - OTP messages
   - One-tap authentication
   - Security verification

#### Creating Templates
1. Navigate to the Template Management UI
2. Click "New Template"
3. Define template properties:
   - Name and description
   - Layout type
   - Content with named variables (e.g., `{{first_name}}`)
   - Language selection
   - Variable definitions
   - Media attachments (if applicable)
   - Interactive elements (if applicable)

#### Template Validation
- Content length limits
- Variable usage validation
- Media size and format checks
- Layout-specific constraints
- Edit frequency restrictions (once per 24 hours)

#### Chat Preview
The template management UI includes a live chat preview feature that allows you to:
- Select a template from the dropdown
- Fill in template variables
- See a real-time preview of how the message will appear
- Test interactive elements
- Send test messages to verify template rendering

Example usage:
```typescript
import { TemplateManagementService } from "@/lib/services/template-management";

const templateService = TemplateManagementService.getInstance();

// Create a new template
const template = await templateService.createTemplate({
  name: "Welcome Message",
  content: "Hello {{first_name}}! Welcome to our service.",
  type: "text",
  layout: "text",
  language: "English",
  variables: [
    {
      name: "first_name",
      type: "text",
      required: true
    }
  ]
});

// Send a template message
const message = await templateService.sendMessage({
  templateId: template.id,
  data: { first_name: "User" }
});
```

#### Using Templates
Send a template-based message:
```typescript
import { TemplateManagementService } from "@/lib/services/template-management";

const templateService = TemplateManagementService.getInstance();

// Send a template message
const response = await templateService.sendMessage({
  templateId: "welcome",
  data: { 
    first_name: "User",
    order_number: "12345",
    product_name: "Premium Plan"
  }
});

// Send a direct message
const response = await templateService.sendMessage({
  message: "Hello, how can I help you?"
});
```

## Project Structure

```
src/
├── components/           # React components
│   ├── chat/            # Chat interface components
│   │   ├── ChatInterface.tsx    # Main chat UI
│   │   └── ChatPreview.tsx      # Template preview
│   └── ui/              # Reusable UI components
├── lib/
│   ├── services/        # Core business logic
│   │   ├── template-management.ts  # Template and messaging
│   │   ├── ai-service.ts        # AI integration
│   │   ├── logging.service.ts   # Error logging
│   │   └── opt-service.ts       # OTP handling
│   └── types.ts         # TypeScript definitions
├── pages/               # Page components
│   └── TemplateManagement.tsx   # Template management UI
├── layouts/             # Layout components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/networkerman/netcore2.0.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- WhatsApp Business API
- OpenAI API (for AI features)
- Vite (build tool)

## Development

### Key Components

1. **Chat Interface** (`src/components/chat/`)
   - Real-time messaging
   - Message threading
   - Quick replies
   - Template preview
   - Interactive elements

2. **Template Management** (`src/lib/services/template-management.ts`)
   - Template creation and editing
   - Layout validation
   - Variable management
   - Media handling
   - Message sending

3. **AI Integration** (`src/lib/services/ai-service.ts`)
   - Response generation
   - Sentiment analysis
   - Keyword extraction
   - Personalization

4. **Logging & Monitoring** (`src/lib/services/logging.service.ts`)
   - Error tracking
   - Performance monitoring
   - Debug logging
   - Template usage analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
