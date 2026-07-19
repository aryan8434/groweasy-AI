# GrowEasy CRM

AI-powered CSV importing for messy lead data, rebuilt to feel clean, fast, and production-ready.

Live Demo: [https://groweasy-ai-five.vercel.app/](https://groweasy-ai-five.vercel.app/)

GrowEasy CRM analyzes arbitrary CSV headers with Groq AI, maps them into CRM-friendly fields, and preserves useful context in a structured import flow. It is designed to handle inconsistent real-world spreadsheets without forcing manual cleanup first.

## Highlights

- AI header mapping that normalizes unpredictable column names like `Phone No`, `Mail ID`, or `Company Name`.
- Serverless Next.js API routes, ready for Vercel deployment without a separate backend service.
- Responsive light and dark themes with polished glassmorphic surfaces and smooth transitions.
- Lead validation that skips records missing both email and mobile numbers.
- Smart note preservation for unmapped columns, duplicate emails, and extra comments in `crm_note`.
- CSV safety that escapes line breaks so exported rows stay structurally valid.

## Tech Stack

- Framework: Next.js 14 with the App Router
- Styling: CSS Modules with adaptive themes
- AI: Groq SDK using `llama-3.3-70b-versatile`
- Icons: Lucide React

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) before running the project.

### Setup

1. Clone or open the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com/).
3. Deploy with the default Next.js settings.
4. Add `GROQ_API_KEY` in the Vercel project environment variables if you want to use a custom key.
