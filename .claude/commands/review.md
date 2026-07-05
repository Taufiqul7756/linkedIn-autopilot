Phase 4 Review — audit the feature just built in Phase 3.

1. Code audit — check for:
   - Hardcoded colors (must use Tailwind tokens)
   - Any `any` types
   - Missing TypeScript types
   - Components duplicating src/components/ui/ primitives
   - Mock data hardcoded inside components (must be in src/mock/)
   - Missing loading / error / empty states
   - Role rules violated (employee seeing admin-only content)
   - Accessibility issues (aria labels, keyboard nav)
2. Check token compliance against docs/designs/design-system.md

3. Design audit — use Playwright to: ( this step execute if there is any files in /docs/designs/screenshots )
   - Screenshot the feature in light and dark mode

4. Propose a commit message: feat(<feature>): description
5. Show full diff
6. Wait for explicit human approval before committing
