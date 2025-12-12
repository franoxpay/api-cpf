# Design Guidelines: API Proxy Service for CPF Lookup

## Design Approach
**System Selected:** Stripe-inspired developer documentation approach
**Rationale:** Developer-focused utility tool requiring clarity, functionality, and ease of use over visual flair. Reference: Stripe API docs, Postman, Railway.

## Core Design Principles
1. **Clarity First:** Information hierarchy prioritizes understanding over aesthetics
2. **Developer Experience:** Fast comprehension, copy-paste ready code
3. **Functional Minimalism:** Clean interface without unnecessary decoration

## Layout System
**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing (p-2, p-4) for code blocks and inline elements
- Medium spacing (p-6, p-8) for cards and sections
- Generous spacing (p-12, p-16, p-24) for section separation

**Container Strategy:**
- Max width: `max-w-6xl` for main content
- Code blocks: `max-w-4xl` for optimal readability
- Two-column layout: 40% sidebar (documentation navigation) + 60% main content on desktop

## Typography
**Font Stack:**
- Headings: `font-sans` (system default), weights 600-700
- Body: `font-sans`, weight 400
- Code: `font-mono` for endpoints, JSON responses, parameters

**Hierarchy:**
- H1: Large, bold for main title
- H2: Medium for section headers
- H3: Slightly smaller for subsections
- Code snippets: Monospace, slightly smaller than body text

## Component Library

### Hero Section (Compact)
- Brief headline explaining the proxy service
- Subheading: "HTTPS-enabled CPF lookup API"
- Primary endpoint display in prominent code block
- Single CTA: "View Documentation" button

### API Documentation Cards
- Endpoint cards with method badge (GET), path, description
- Collapsible request/response examples
- Parameter tables with type, description, required status
- Copy button for endpoint URLs

### Interactive Testing Area
- Input field for CPF (with format hint)
- "Test Request" button
- Live response viewer with syntax-highlighted JSON
- Response status indicator (200, 404, 500 etc.)

### Code Examples Section
- Tabbed interface for different languages (cURL, JavaScript, Python)
- Dark background code blocks with syntax highlighting
- Copy-to-clipboard functionality for each example

### Response Documentation
- Table showing all possible response fields
- Type indicators, sample values, descriptions
- Status code reference (200, 400, 404, 500)

### Footer
- Minimal: API version, status page link, contact support
- No heavy footer content needed for developer tool

## Visual Treatment

**Accent Strategy:**
- Minimal use of Brazilian green (#009739) for success states only
- Neutral grays for majority of interface
- Syntax highlighting for code (standard developer color schemes)

**Component Styling:**
- Subtle borders (gray-200) for card separation
- Rounded corners: `rounded-lg` for cards, `rounded-md` for buttons
- Code blocks: Dark background with light text
- Buttons: Solid backgrounds with clear hover states

## Page Structure

1. **Hero Section (20vh):** Service title, key endpoint, CTA
2. **Quick Start (auto height):** 3-step getting started guide
3. **API Reference (auto height):** Detailed endpoint documentation
4. **Interactive Playground (auto height):** Live testing interface
5. **Response Examples (auto height):** Sample responses with annotations
6. **Error Handling (auto height):** Common errors and solutions

## Images
**No hero images required.** This is a developer tool where code and documentation are the primary visual elements. Focus on:
- Code block presentation
- JSON response formatting
- Clear typography hierarchy

## Accessibility
- High contrast for code blocks
- Keyboard navigation for testing interface
- Clear focus states on interactive elements
- Semantic HTML for documentation structure

## Key Differentiators
- Split-screen layout (docs + live code examples side-by-side on desktop)
- Instant copy-to-clipboard for all code snippets
- Real-time API testing without leaving the page
- Clean, distraction-free documentation that developers can scan quickly