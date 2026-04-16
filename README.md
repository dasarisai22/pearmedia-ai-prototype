# Pear Media AI Prototype

This is a complete, production-ready React web application that fulfills the Pear Media LLC Assignment requirements. It bridges the gap between simple user inputs and advanced AI outputs using two distinct creative workflows.

## 🚀 Features

### Tab 1: Creative Studio (Text Workflow)
- **Input:** Provide a simple text idea.
- **NLP Enhancement:** Google Gemini instantly expands the original idea into a highly descriptive 50-word cinematic prompt including lighting, camera angles, and artistic style.
- **Approval:** A human-in-the-loop step to review and edit the generated prompt.
- **Image Generation:** Connects to Hugging Face Inference API (Stable Diffusion XL) to render a stunning masterpiece.

### Tab 2: Style Lab (Image Workflow)
- **Upload & Reverse Engineer:** Load a local image and send the Base64 data to Gemini Vision.
- **Analysis:** Automatically extracts structured visual metadata (Main Objects, Artistic Style, Color Palette, Lighting).
- **Variations Generation:** Magically constructs new, stylized prompts based on the extracted metadata and generates multiple stunning variations simultaneously.

### 🎨 Clean UI & UX
- Modern, clean aesthetic utilizing Tailwind CSS.
- Interactive components with subtle micro-animations (`hover`, `scale`, `opacity`).
- Loading states and resilient error handling for seamless experiences.
- Full features like Copy Prompt to clipboard and one-click Image Downloads.

## 🛠 Tech Stack

- **Frontend:** React.js (Create React App), completely functional without Redux.
- **Styling:** Tailwind CSS + Lucide React (Icons).
- **APIs:** 
  - Text & Vision Analysis: [Google Gemini 1.5 Flash](https://aistudio.google.com/) (Handles both Multimodal and NLP via generic fetch).
  - Image Generation: [Hugging Face Serverless Inference API](https://huggingface.co/) (Stable Diffusion XL).
  
## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pearmedia-ai-prototype.git
cd pearmedia-ai-prototype
```

### 2. Install Dependencies
Make sure you have Node (v18+) installed.
```bash
npm install
```

### 3. Environment Variables setup
You will need free API keys from [Google AI Studio](https://aistudio.google.com/) and [Hugging Face](https://huggingface.co/settings/tokens).
Create a `.env` file in the root of your project directory (in the same folder as `package.json`).

```
REACT_APP_GEMINI_KEY=your_gemini_api_key_here
REACT_APP_HUGGINGFACE_KEY=your_huggingface_api_key_here
```
> **Note**: The `.env` file is included in `.gitignore` by default. Do not expose your literal keys to GitHub.

### 4. Run Locally
```bash
npm start
```
The application will launch on [http://localhost:3000](http://localhost:3000).

## 🌍 Deployment Steps (Vercel)

1. Commit all code and push to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and log in with GitHub.
3. Click **Add New** > **Project** and select your `pearmedia-ai-prototype` repository.
4. Open the **Environment Variables** tab before deploying and add:
   - `REACT_APP_GEMINI_KEY` -> `<your_key>`
   - `REACT_APP_HUGGINGFACE_KEY` -> `<your_key>`
5. Click **Deploy**. Vercel will automatically build the `Create React App` and deploy it perfectly!

## 📸 Screenshots

*(Placeholders - replace these with real screenshots of your running app)*
- **Creative Studio View:** `![Creative Studio](https://via.placeholder.com/800x400.png?text=Creative+Studio+Screenshot)`
- **Generated Image View:** `![Generated Image](https://via.placeholder.com/800x400.png?text=Generated+Image+Screenshot)`
- **Style Lab Upload:** `![Style Lab](https://via.placeholder.com/800x400.png?text=Style+Lab+Screenshot)`
- **Extracted Metadata:** `![Vision Flow](https://via.placeholder.com/800x400.png?text=Vision+Metadata+Screenshot)`

## 🎯 Author
Built for Pear Media Assignment Sprint.
