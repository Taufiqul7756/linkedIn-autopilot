# AI Agent Demo

> Next.js 16 App Router starter with full stack tooling pre-configured.

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Framework     | Next.js 16 (App Router)          |
| Language      | TypeScript                       |
| Styling       | Tailwind CSS v4                  |
| Data Fetching | React Query + Axios              |
| Validation    | Zod                              |
| Animations    | Framer Motion                    |
| Theming       | next-themes                      |
| Notifications | react-hot-toast                  |
| Icons         | react-icons                      |
| Utilities     | lodash                           |
| Linting       | ESLint + Prettier                |
| Git Hooks     | Husky + lint-staged + commitlint |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/your-org/ai-agent-demo.git
cd ai-agent-demo
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
```

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run type-check   # TypeScript check (no emit)
```

## Project Structure

See `CLAUDE.md` for the full folder structure and architectural decisions.

## Environment Variables

See `.env.example` for all required variables.

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

Format: `type(scope): subject`

Types: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore` | `revert`

## License

MIT
