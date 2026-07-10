# GrowEasy CRM — AI-Powered CSV Importer

An intelligent lead importer that extracts CRM contact information from **any** raw CSV layout using Groq AI. 

The application utilizes **Header Schema Mapping** to analyze column structures in a single AI request, preventing daily token rate limits (TPD) while mapping records programmatically at the edge.

---

## ✨ Features

- **Header Mapping via AI**: One-click analysis of random CSV column structures (e.g. mapping `Phone No` or `Mail ID` to standard CRM fields) using Groq's Llama 3.3 model.
- **Vercel Serverless Ready**: Integrated Next.js API Routes run serverlessly without needing a separate Express backend.
- **Aesthetic Light & Dark Modes**: Responsive, high-contrast layouts with glassmorphic cards and smooth transitions.
- **CRM Lead Validation**: Skips invalid records missing both email and mobile numbers.
- **Smart Note Appends**: Conserves all unmapped columns, duplicate emails, and additional comments directly inside the `crm_note` field.
- **CSV Format Integrity**: Escapes line breaks (`\n`) to ensure imported files remain valid single-row structures.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS Modules (adaptive themes)
- **AI Integration**: Groq SDK (`llama-3.3-70b-versatile`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone or navigate to the directory:
   ```bash
   cd groweasy-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

1. Push this project directly to your GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and import the project.
3. Vercel automatically detects Next.js at the root level.
4. Click **Deploy**!
5. Add `GROQ_API_KEY` under Environment Variables in the project settings on Vercel if you wish to use a custom key (otherwise it automatically falls back to the active pre-configured key).
