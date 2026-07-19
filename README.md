# GrowEasy CRM AI Importer

AI-powered CSV importing for messy lead data, built as a polished CRM dashboard with AI header mapping, clean review flows, and fast serverless routes.

<p align="center">
   <a href="https://groweasy.vercel.app/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/Live Demo - groweasy.vercel.app-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" alt="groweasy.vercel.app" />
   </a>
   <a href="#architecture">
      <img src="https://img.shields.io/badge/Architecture-111827?style=for-the-badge&logo=diagramsdotnet&logoColor=white" alt="Architecture" />
   </a>
   <a href="#getting-started">
      <img src="https://img.shields.io/badge/Get%20Started-16a34a?style=for-the-badge&logo=npm&logoColor=white" alt="Get Started" />
   </a>
</p>

GrowEasy CRM AI Importer reads inconsistent CSV files, sends only the header and sample rows to an AI mapper, then normalizes the full dataset locally before rendering the imported leads in the dashboard. The current app is a serverless Next.js experience, so there is no separate backend or database service in the default demo flow.

## What It Does

- Upload CSV files and parse them in the server route at `app/api/upload/route.js`.
- Map unknown columns to CRM fields with Groq or Gemini in `app/api/import/route.js`.
- Normalize lead data locally so the import stays fast and deterministic.
- Skip invalid rows that do not contain a usable email or phone number.
- Preserve extra context in `crm_note` so useful data is not lost.
- Render a polished dashboard with search, lead stats, modal import flow, and theme switching.

## Tech Stack

<p align="center">
   <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
   <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
   <img src="https://img.shields.io/badge/App%20Router-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="App Router" />
   <img src="https://img.shields.io/badge/Groq-Llama%203.3-f97316?style=for-the-badge" alt="Groq" />
   <img src="https://img.shields.io/badge/Gemini-3.5%20Flash-4285f4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
   <img src="https://img.shields.io/badge/Lucide%20React-38bdf8?style=for-the-badge" alt="Lucide React" />
   <img src="https://img.shields.io/badge/Serverless%20Routes-0f766e?style=for-the-badge" alt="Serverless Routes" />
   <img src="https://img.shields.io/badge/Custom%20CSS-334155?style=for-the-badge" alt="Custom CSS" />
</p>

## Architecture

```text
+--------------------------------------------------------+
|                    CRM Dashboard UI                    |
|   Lead table, search, stats cards, theme toggle,       |
|   engine switcher, and CSV import modal                |
|   app/page.js                                          |
+-------------------------------+------------------------+
                                |
                                | Upload CSV / Import Rows
                                v
+--------------------------------------------------------+
|                 CSV Upload Route                       |
|        app/api/upload/route.js                         |
|   Custom parser converts raw file text into rows       |
+-------------------------------+------------------------+
                                |
                                | headers + sample rows
                                v
+--------------------------------------------------------+
|                 Import Orchestration                   |
|        app/api/import/route.js                         |
|   Chooses Groq or Gemini mapping engine                |
+---------------------+------------------+--------------+
                      |                  |
                      v                  v
+------------------------------+   +------------------------------+
|       Groq Service           |   |      Gemini Service          |
|   app/utils/groqService.js   |   |   app/utils/geminiService.js |
|   Llama 3.3 schema mapping   |   |   Gemini 3.5 Flash mapping   |
+------------------------------+   +------------------------------+
                      |                  |
                      +--------+---------+
                               |
                               v
+--------------------------------------------------------+
|                Local Row Normalizer                    |
|   Validates statuses, cleans phones, preserves notes,  |
|   and splits the result into imported / skipped rows   |
+-------------------------------+------------------------+
                                |
                                v
+--------------------------------------------------------+
|                Lead State in the UI                    |
|   Imported rows merge into the dashboard table         |
+--------------------------------------------------------+
```

## Project Structure

- `app/page.js` main CRM dashboard and import experience.
- `app/api/upload/route.js` CSV parsing endpoint.
- `app/api/import/route.js` AI mapping and normalization orchestrator.
- `app/utils/groqService.js` Groq mapping logic and local row mapping helpers.
- `app/utils/geminiService.js` Gemini mapping implementation.
- `samples/` example CSV files for testing the importer.
- `public/` static assets used by the UI.

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) before running the project.

### Setup

1. Clone or open the project folder.
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Set the AI key for the engine you want to use:

```bash
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

## Deployment

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com/).
3. Deploy with the default Next.js settings.
4. Add the required AI environment variables in the Vercel project settings.
