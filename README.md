# ✨ AnySolver

AnySolver is a premium, AI-powered assignment solution platform built for speed, precision, and professional-grade presentation. Designed with a focus on modern aesthetics and granular control, it transforms raw assignment prompts into formatted solutions and high-quality PDFs.

![Header](https://images.unsplash.com/photo-1635332253475-48faa6143581?q=80&w=2000&auto=format&fit=crop)

## 🚀 Vision
AnySolver isn't just a solver—it's a productivity engine. By combining state-of-the-art AI models with a pixel-perfect design system, it bridges the gap between raw intelligence and finalized documentation.

---

## 💎 Key Features

### 🧠 Intelligent Solution Engine
*   **Multi-Model Support**: Seamless integration with Google Gemini and OpenAI GPT models.
*   **Assignment Contextualization**: Specialized modes for **Code Assignments**, **Essay Writing**, and **General Questions**.
*   **Space-Saving Mode**: An AI-driven "Vertical Compactness" setting that instructs the model to use space-efficient formatting (e.g., K&R style brackets and collapsed tables) to minimize page count.
*   **Author Personalization**: Inject custom variable names, student experience levels, and package naming conventions into generated code to match your personal style.

### 📄 Advanced PDF Engine
*   **Pixel-Perfect Layouts**: Total control over page margins, line heights, and paragraph spacing.
*   **Architecture Choice**: Choose between `Side-by-Side`, `Stacked`, or `Compact` layout engines for code and output blocks.
*   **Professional Branding**: Customizable headers, footers, and heading highlight colors for a unique, standardized look.
*   **Ink-Efficiency**: Built-in "Eco Presets" designed to maximize content density while maintaining readability, saving you paper and ink.

### 🎨 Stunning Visual Experience
*   **GridScan Background**: A sophisticated 3D background system powered by **Three.js** and **Post-Processing** effects (Bloom, Chromatic Aberration).
*   **Holographic UI**: Glassmorphic components with dynamic hover states and Gaussian blur backdrops.
*   **GSAP Pill Navigation**: A fluid, interactive navigation bar featuring ultra-smooth transitions and flooding hover effects.
*   **Bento Grid Architecture**: A clean, organized interface that groups controls into logical, aesthetically pleasing cells.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core** | [Next.js 16 (Turbopack)](https://nextjs.org), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com), [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) |
| **AI Integration** | [Vercel AI SDK](https://sdk.vercel.ai/docs), [Google Generative AI](https://ai.google.dev/), [OpenAI SDK](https://openai.com/index/openai-api/) |
| **3D & Animation** | [Three.js](https://threejs.org), [GSAP](https://gsap.com), [Post-Processing](https://github.com/vanruesc/postprocessing) |
| **UI Components** | [Radix UI](https://www.radix-ui.com), [Lucide React](https://lucide.dev), [Shadcn UI](https://ui.shadcn.com) |
| **Utilities** | [Zustand](https://zustand-demo.pmnd.rs/), [React-to-Print](https://github.com/gregnb/react-to-print), [Zod](https://zod.dev) |

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 18.x or later
*   An API Key from [Google AI Studio](https://aistudio.google.com/) or [OpenAI](https://platform.openai.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/any-solver.git
    cd any-solver
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Configure API**: Open the application settings in the browser and enter your API key. Keys are stored locally in your browser's local storage and are never sent to a central server.

---

## 📂 Project Structure

```text
├── app/                  # Next.js app router & global layout
├── components/           # Core UI & Feature components
│   ├── ui/               # Reusable primitive components (Three.js, GSAP, etc.)
│   ├── markdown-editor/  # Custom Visual/Raw MD editor
│   └── pdf-document/     # Granular PDF layout & document engine
├── lib/                  # Utilities, API configurations, and Zustand store
├── types/                # TypeScript interface definitions
└── public/               # Static assets
```

---

## 🛡️ Privacy & Security
AnySolver is built with privacy in mind. Your API keys and assignment data are processed locally on your machine. We do not maintain a backend database for assignment content, ensuring that your work stays yours.

## 🤝 Contributing
Contributions are welcome! Whether it's adding a new solver template, improving the PDF engine, or refining the 3D backgrounds, feel free to open a PR or issue.

---

<p align="center">
  Built with ❤️ for students and developers by <a href="https://github.com/bengali-creates">bengali-creates</a>
</p>
