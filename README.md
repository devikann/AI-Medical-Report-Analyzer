# AI Medical Report Analyzer

An enterprise-grade intelligent medical lab report analyzer that converts complex pathology tests, blood panels, and diagnostic documents into clear, patient-friendly insights, risk evaluations, and actionable health guidance.

---

## 🌟 Key Features

- 📑 **Comprehensive Report Analysis**: Upload PDF documents or images of blood panels, metabolic reports, lipid tests, CBCs, thyroid panels, and renal/liver function tests.
- 🩸 **Biomarker Risk Evaluation**: Automatically categorizes lab parameters into **Normal**, **Elevated/High**, **Low**, and **Critical** with visual gauge meters and clinical significance notes.
- 🌐 **Multilingual Translation**: Translate report summaries, lab explanations, and doctor advice seamlessly into **English**, **Malayalam (മലയാളം)**, and **Hindi (हिंदी)**, along with other regional and global languages.
- 📚 **Medical Normal Ranges Guide**: An integrated clinical reference directory containing standard benchmarks for fasting glucose, postprandial sugar, HbA1c, cholesterol, hemoglobin, creatinine, TSH, liver enzymes, and vitals.
- 💬 **Interactive AI Medical Chat**: Ask follow-up questions directly about lab values, dietary recommendations, and precautions.
- 🔐 **Google / Gmail Authentication**: Quick and secure sign-in options using Gmail or Google credentials.
- 🖨️ **Print & Export**: Print formatted medical summary reports or save them as PDFs for physician review.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Vite
- **Backend**: Node.js, Express, Python 3 Medical Analysis Engine
- **AI Integration**: Google Gemini API for clinical document parsing, structuring, and language translation

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: v18+ 
- **Python**: v3.9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/devikann/AI-Medical-Report-Analyzer>
   cd ai-medical-report-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=AQ.Ab8RN6LClyJ1WRzXvEu-WOsyWgHtIG0sxPaSyNlEDe8zzccCcgre
   PORT=3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Production Build & Start**
   ```bash
   npm run build
   npm start
   ```