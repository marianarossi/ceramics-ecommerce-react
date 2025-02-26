[![wakatime](https://wakatime.com/badge/github/marianarossi/ceramics-ecommerce-react.svg)](https://wakatime.com/badge/github/marianarossi/ceramics-ecommerce-react)

# E-commerce Front-end

This repository contains the front-end application for an e-commerce solution. Built with React, TypeScript, and Vite, the application delivers a responsive, intuitive user interface that connects to a RESTful backend API to handle user authentication, product browsing, and shopping cart management. he client application communicates with the backend API to fetch and manage data. API is available at: [ceramics-eCommerce-API](https://github.com/marianarossi/ceramics-eCommerce-API)

## Key Technologies

- **React & TypeScript:**  
  Create dynamic, component-based UIs with type safety and modern JavaScript features.

- **Vite:**  
  Enjoy fast development and build times with Vite’s optimized bundling and hot module replacement.

- **React Router:**  
  Declaratively manage routes for public pages (like login and signup) and protected areas (like home, product lists, and category management).

- **UI Libraries:**  
  - **Bootstrap:** Provides a responsive grid system and prebuilt styles for rapid UI development.
  - **Chakra UI:** Offers a set of accessible, themeable components for a polished user interface.
  - **React Icons:** Enhances the visual appeal with a comprehensive icon library.

- **Form & API Management:**  
  - **React Hook Form:** Simplifies form handling and validation.
  - **Axios:** Manages HTTP requests to the backend API via a centralized configuration.

## Project Structure

The project follows a modular, scalable structure:

- **public/**  
  Contains the static HTML file and other public assets.

- **src/**  
  - **assets/**: Images and static files.
  - **components/**: Reusable UI components (e.g., Input, ButtonWithProgress, NavBar).
  - **commons/**: Shared interfaces and types.
  - **lib/**: Axios configuration (`axios.ts`) for centralized API communication.
  - **pages/**: Page-level components for features like Home, Login, User Signup, Category, and Product management.
  - **routes/**: React Router configuration for managing public and protected routes.
  - **App.tsx:**  
  The application’s entry point that integrates routing (and ChakraProvider for UI styling).

- **vite.config.ts:**  
  Vite’s configuration file, which includes aliases for cleaner imports.

## How to Run

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/marianarossi/ceramics-ecommerce-react.git
   cd ceramics-ecommerce-react

2. Install the dependencies:
   ```bash
    npm install

3. Run the development server:
   ```bash
    npm run dev

4. Open your browser and navigate to http://localhost:3000 to see the application in action.
