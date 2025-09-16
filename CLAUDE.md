# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo-based static website for Luca Guidi's personal blog (lucaguidi.com). The site uses the Casper theme (ported from Ghost) and focuses on Ruby, software architecture, and open-source development content.

## Development Environment

The project uses Nix flakes for reproducible development environments.
All the commands MUST be prefixed with `nix develop -c`

Example:

```bash
# Enter development shell with Hugo and Dart Sass
nix develop -c hugo server
```

## Common Commands

### Development Server
```bash
nix develop -c hugo server           # Start development server (usually on :1313)
nix develop -c hugo server -D        # Include drafts in development
```

### Build
```bash
nix develop -c hugo                  # Build static site to public/ directory
```

## Architecture

### Content Structure
- `content/post/` - Blog posts in Markdown format with YAML frontmatter
- `content/now/` - "Now" page content
- `content/sponsors/` - Sponsors page
- `static/` - Static assets (images, CSS, JS, fonts)
- `public/` - Generated site output (not tracked in git)

### Theme
- Uses `themes/casper/` - Modified Casper theme for Hugo
- Theme includes responsive design, syntax highlighting, social sharing
- Custom CSS in `static/css/` overrides theme defaults

### Configuration
- `config.toml` - Hugo site configuration including menus, params, and permalinks
- Configured for Google Analytics, Disqus comments, and social media integration

### Content Guidelines
Blog posts use YAML frontmatter with these key fields:
- `title`, `date`, `description`
- `tags` and `keywords` for categorization
- `image` and `thumbnail` for cover images (stored in `/covers/` and `/thumbnails/`)

### Deployment
- Deploys via Netlify
- Site at lucaguidi.com domain
