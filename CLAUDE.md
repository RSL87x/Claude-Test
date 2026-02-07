# CLAUDE.md

This file provides guidance for AI assistants (including Claude) working in this repository.

## Repository Overview

- **Repository:** Claude-Test
- **Status:** New project — foundational setup phase
- **Primary branch:** `main` (or as established by initial contributors)

## Project Structure

```
Claude-Test/
├── CLAUDE.md          # AI assistant guidance (this file)
└── (project files to be added)
```

> **Note:** This repository is in its initial setup phase. Update this section as the project structure evolves.

## Development Workflow

### Getting Started

1. Clone the repository
2. Check out or create a feature branch
3. Install dependencies (update this section once a package manager/build system is chosen)

### Branch Naming

- Feature branches: `feature/<description>`
- Bug fixes: `bugfix/<description>`
- Claude-generated branches: `claude/<description>-<session-id>`

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in imperative mood (e.g., "Add", "Fix", "Update", "Remove")
- Keep the subject line under 72 characters
- Add a body for non-trivial changes explaining *why*, not just *what*

### Pull Requests

- Provide a summary of changes and motivation
- Reference related issues when applicable
- Ensure all CI checks pass before requesting review

## Build & Test

> **TODO:** Update this section once the build system, test framework, and tooling are established.

```bash
# Example placeholders — replace with actual commands
# npm install        # Install dependencies
# npm run build      # Build the project
# npm test           # Run tests
# npm run lint       # Run linter
```

## Code Conventions

### General Principles

- Keep code simple and readable
- Prefer explicit over implicit
- Follow the principle of least surprise
- Don't over-engineer — solve the problem at hand
- Write tests for new functionality

### Style

> **TODO:** Update this section once a language and style guide are chosen (e.g., ESLint config, Prettier, rustfmt, Black).

- Use consistent formatting throughout the codebase
- Follow the project's established linting and formatting rules
- Prefer descriptive variable and function names

## AI Assistant Guidelines

When working in this repository, AI assistants should:

1. **Read before writing** — Always read existing files before proposing changes
2. **Stay focused** — Only make changes that are directly requested or clearly necessary
3. **Don't over-engineer** — Keep solutions minimal and targeted
4. **Preserve conventions** — Follow existing patterns and style in the codebase
5. **Test changes** — Run tests after making modifications when a test suite exists
6. **Avoid unnecessary files** — Don't create documentation, configs, or helpers unless explicitly requested
7. **Security first** — Never introduce command injection, XSS, SQL injection, or other vulnerabilities
8. **No secrets in code** — Never commit credentials, API keys, or sensitive configuration

## Key Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidance (this file) |

> **TODO:** Expand this table as the project grows with key entry points, configuration files, and important modules.

## Updating This File

This file should be kept in sync with the project as it evolves. Update it when:

- New tooling or frameworks are added
- Build/test commands change
- Project structure changes significantly
- New conventions are established
- CI/CD pipelines are configured
