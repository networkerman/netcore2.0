# CPaaS Platform with Template Management and CTWA

A comprehensive CPaaS (Communications Platform as a Service) platform that combines template management and Click-to-WhatsApp Ads (CTWA) functionality.

## Features

### Template Management
- Keyword-based auto-reply system
- Multi-language support
- Keyword variations
- Quick reply buttons
- Default response handling

### Click-to-WhatsApp Ads (CTWA)
- Integration with WhatsApp Business API
- Ad campaign management
- Click tracking and analytics
- Custom landing pages

## Project Structure

```
src/
├── components/
│   └── KeywordConfigManager.tsx    # UI for managing keyword configurations
├── lib/
│   ├── types.ts                    # TypeScript type definitions
│   └── services/
│       └── auto-reply.service.ts   # Core auto-reply functionality
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

- React
- TypeScript
- Tailwind CSS
- WhatsApp Business API
- (Coming soon) Supabase
- (Coming soon) AI Integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
