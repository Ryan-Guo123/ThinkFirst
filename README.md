
<div align="center">

# 🧠 ThinkFirst
### Turn AI into your sparring partner, not your ghostwriter.

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=Ryan-Guo123.ThinkFirst)](https://github.com/Ryan-Guo123/ThinkFirst)
[![GitHub stars](https://img.shields.io/github/stars/Ryan-Guo123/ThinkFirst?style=flat-square&logo=github)](https://github.com/Ryan-Guo123/ThinkFirst/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Ryan-Guo123/ThinkFirst?style=flat-square&logo=github)](https://github.com/Ryan-Guo123/ThinkFirst/network)
[![Vercel](https://vercelbadge.vercel.app/api/Ryan-Guo123/ThinkFirst)](https://think-first.vercel.app)

![Repo Size](https://img.shields.io/github/repo-size/Ryan-Guo123/ThinkFirst?style=flat-square&color=orange)
![Last Commit](https://img.shields.io/github/last-commit/Ryan-Guo123/ThinkFirst?style=flat-square&color=success)
![Top Language](https://img.shields.io/github/languages/top/Ryan-Guo123/ThinkFirst?style=flat-square)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&style=flat-square)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?logo=google&style=flat-square)](https://deepmind.google/technologies/gemini/)
[![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-38B2AC?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)

<p align="center">
  <a href="#-core-philosophy">Philosophy</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-contributing">Contributing</a>
</p>

<img width="100%" alt="ThinkFirst Interface" src="https://github.com/user-attachments/assets/be32cdab-cd52-4800-90d1-500cdba7f32f" />

</div>



---

## 🌟 Core Philosophy

**The Problem:** Most AI tools create a "Copy-Paste Trap" — outsourcing the struggle of thinking to a machine.
**The Solution:** ThinkFirst flips the interaction using the **"Brain First -> AI -> Brain Last"** methodology:

1.  **🛑 My Brain First**: You formulate your own thesis or rough ideas *before* touching the AI.
2.  **🤖 AI's Turn**: The AI acts as a **Socratic Coach**. It critiques, structures, and offers counter-arguments, but **refuses to generate the final text**.
3.  **📝 My Brain Last**: You synthesize the feedback and write the final work yourself.

> "Don't let AI steal your 'Aha!' moment."

## ✨ Features

### 🛡️ The Persona System
Switch between specialized coaching modes tailored to your cognitive needs:

| Persona | Function | Best For |
| :--- | :--- | :--- |
| 🧠 **General Coach** | Balanced guidance & feedback. | General inquiry. |
| 🛡️ **Devil's Advocate** | Ruthlessly logical critique. | Strengthening weak arguments. |
| 🏗️ **The Architect** | Structures scattered thoughts. | Outlining essays or projects. |
| ❓ **Socratic Expander** | Pushes for deeper "Why" & "How". | Breaking through writer's block. |
| 🔗 **Analogy Maker** | Explains via metaphors. | Understanding complex abstract concepts. |

### 🚀 Modern Capabilities
- **Powered by Gemini 2.5 Flash**: Leveraging Google's model for high-speed, low-latency reasoning.
- **Multi-Modal Playground**: Upload diagrams or notes; the AI "sees" and critiques them.
- **Dual Modes**:
    - **Search**: Grounds answers with real-time Google Search data.
    - **Think**: Enhanced reasoning depth for complex logic puzzles.
- **Privacy First**: API keys are stored locally in your browser (`localStorage`). No backend tracking.

## 🛠 Tech Stack

This project is engineered with a focus on performance and modern web standards.

- **Frontend**: [React 18](https://react.dev/) (ESM) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `clsx` + `tailwind-merge`
- **Motion**: [Framer Motion](https://www.framer.com/motion/) for fluid UI interactions.
- **AI SDK**: [`@google/genai`](https://www.npmjs.com/package/@google/genai)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ryan-Guo123/ThinkFirst
   cd ThinkFirst
    ```

2.  **Install dependencies**

    ```bash
    yarn install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  **Configure API Key**

      - Open the app in your browser (usually `http://localhost:3000/`).
      - Click Start Thinking
      - Click the **Key Icon** in the sidebar.
      - Paste your Gemini API Key.


## 📂 Key Structure


```text
src/
├── components/
│   └── Playground.tsx      # Main chat interface & Markdown rendering
├── services/
│   └── geminiService.ts    # Gemini SDK implementation & stream handling
├── constants.ts            # System Instructions (Prompts) & Persona definitions
└── App.tsx                 # Routing & Layout
```

## 🤝 Contributing

We are looking for contributions to expand the "Thinking" capabilities:

  * **Prompt Engineering**: Refine existing personas in `constants.ts`.
  * **UI/UX**: Improve the thinking flow visualization.
  * **Integrations**: Connect with Notion or Obsidian.

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Ryan-Guo123/ThinkFirst&type=date&legend=top-left)](https://www.star-history.com/#Ryan-Guo123/ThinkFirst&type=date&legend=top-left)

