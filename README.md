# Task Manager

This is a React application bootstrapped with [Vite](https://vitejs.dev/), written in TypeScript and styled with Tailwind CSS. It communicates with a NestJS backend API for authentication, lists, and tasks management.

## Prerequisites

* [Node.js](https://nodejs.org/) (>= 22)
* npm or yarn
* A running NestJS backend (see its README for setup)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Loadren/libheros-frontend.git
   cd your-frontend-repo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file in the project root with the following contents (replace placeholders with your values):

   ```env
   # URL of the NestJS backend (no trailing slash)
   VITE_REACT_APP_API_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:${VITE_PORT || 5173}` by default.
