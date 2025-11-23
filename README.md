# ThinkFirst 🧠

**ThinkFirst** is a cognitive coaching platform that turns AI into a thinking partner, not a homework doer. It emphasizes the **"Brain First -> AI -> Brain Last"** methodology to help students and lifelong learners think deeper.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

<img width="2090" height="988" alt="image" src="https://github.com/user-attachments/assets/be32cdab-cd52-4800-90d1-500cdba7f32f" />


## 🌟 Core Philosophy

The problem with most AI usage in education is the "Copy-Paste Trap" — outsourcing the struggle of thinking to a machine. ThinkFirst flips this interaction:

1.  **My Brain First**: You must formulate your own thesis or rough ideas before opening the tool.
2.  **AI's Turn**: The AI acts as a Socratic coach. It critiques, structures, and offers counter-arguments, but **never** writes the content for you.
3.  **My Brain Last**: You synthesize the feedback and write the final work yourself.



## ✨ Features

-   **Socratic AI Coach**: Powered by Google's **Gemini 2.5 Flash**, the AI is prompted to refuse low-effort requests and instead ask probing questions.
-   **Persona System**: Switch between specialized coaching modes:
    -   🧠 **General Coach**: Balanced guidance.
    -   🛡️ **Devil's Advocate**: Ruthlessly logical critique to strengthen arguments.
    -   🏗️ **The Architect**: Helps organize scattered thoughts into structured outlines.
    -   ❓ **Socratic Expander**: Pushes for deeper "Why" and "How" analysis.
    -   🔗 **Analogy Maker**: Explains complex concepts using metaphors.
-   **Multi-Modal Playground**: Support for text and image inputs (e.g., upload a diagram for critique).
-   **Thinking & Search Modes**: 
    -   *Search*: Grounding with Google Search for fact-checking.
    -   *Think*: Enhanced reasoning for complex logic.
-   **Privacy Focused**: API keys are stored locally in your browser (`localStorage`).

## 🚀 Getting Started

### Prerequisites

This project is built using **React**, **TypeScript**, and **Tailwind CSS**. It relies on the `@google/genai` SDK for AI interactions.

### Usage

1.  **Open the Application**: Launch the app in your browser.
2.  **Enter API Key**: Click the key icon in the sidebar or playground to enter your Google Gemini API Key.
    -   Get a key here: [Google AI Studio](https://aistudio.google.com/api-keys)
3.  **Start a Session**:
    -   Choose a Persona (e.g., "The Architect" if you are brainstorming).
    -   Type your initial thought.
    -   The AI will respond with questions, perspectives, or structural advice.

## 🛠️ Technical Architecture

-   **Frontend**: React 18 (ESM)
-   **Styling**: Tailwind CSS + `clsx`/`tailwind-merge`
-   **Animations**: Framer Motion
-   **AI Integration**: `@google/genai` SDK
-   **Icons**: Lucide React

### Key Files

-   `services/geminiService.ts`: Handles interaction with Google Gemini API, managing streaming responses and tool configurations (Search/Thinking).
-   `constants.ts`: Contains the System Instructions (Prompts) that define the AI's Socratic behavior and Persona definitions.
-   `components/Playground.tsx`: The main chat interface handling state, local storage persistence, and Markdown rendering.

## 🤝 Contributing

Contributions are welcome! We are looking for:
-   New **Personas** (Prompt Engineering in `constants.ts`).
-   UI/UX improvements.
-   Educational integrations.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Ryan-Guo123/ThinkFirst&type=date&legend=top-left)](https://www.star-history.com/#Ryan-Guo123/ThinkFirst&type=date&legend=top-left)
