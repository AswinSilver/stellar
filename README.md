# ✨ Stellar

![Stellar Hero](frontend/public/favicon.svg) <!-- Replace with an actual hero image if you have one -->

Stellar is a modern, real-time rich-text editor application built with React, Vite, and Firebase. It provides a seamless editing experience using Tiptap, combined with the blazing-fast performance of Vite and the beautiful UI utility classes from Tailwind CSS.

## 🚀 Features

- **Rich Text Editing**: Powered by [Tiptap](https://tiptap.dev/), offering a highly customizable and smooth editing experience.
- **Real-time Sync**: Built-in synchronization using Firebase (Firestore/Realtime Database).
- **Modern UI**: Styled with [Tailwind CSS 4](https://tailwindcss.com/) and beautiful animations via [Framer Motion](https://www.framer.com/motion/).
- **State Management**: Uses [Zustand](https://github.com/pmndrs/zustand) for lightweight and predictable state management.
- **Fast Build Times**: Powered by [Vite](https://vitejs.dev/) for instant server start and lightning-fast HMR.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Tailwind Typography
- **Editor**: Tiptap
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend/Database**: Firebase
- **State**: Zustand

## 📦 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AswinSilver/stellar.git
   cd stellar
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Variables:**
   Create a `.env.local` file in the `frontend` directory and add your Firebase configuration details:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running Locally

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate the compiled static assets in the `frontend/dist` directory.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
