# StackIt — Minimal Q&A Forum Platform

Odoo Hackathon 2025 | Team 404: TeamNotFound | EdTech

---

[![Watch the demo video](https://img.youtube.com/vi/93hnUhkaVa0/0.jpg)](https://youtu.be/93hnUhkaVa0)


## Overview

StackIt is an EdTech web application designed to simplify community-based knowledge sharing by providing a minimal, distraction-free Q&A platform. It enables learners and professionals to ask questions, provide solutions and collaborate more effectively in a focused, clean environment.

---

## Problem Statement

Modern knowledge-sharing platforms often suffer from cluttered interfaces and feature bloat, making it difficult for users to focus on actual learning. Common problems include:

- Complex navigation making it difficult to locate relevant content.
- Overloaded features that dilute core functionality.
- Low engagement due to lack of simple voting and tagging mechanisms.
- Limited lightweight solutions focused on minimal, clean Q&A interaction.

StackIt solves these issues by offering a straightforward, minimalistic approach to community-driven learning and problem-solving.

---

## Solution

StackIt empowers users to:

- Ask clear, taggable questions.
- Answer questions using a simple and elegant rich text editor.
- Upvote and downvote answers to highlight the best solutions.
- Mark an answer as "accepted" to help future visitors find the correct answer quickly.
- Filter questions by relevant tags.
- Engage in a clean, distraction-free UI that is fully responsive for desktop and mobile use.

---

## Core Features

| Feature            | Description                                                       |
|--------------------|-------------------------------------------------------------------|
| **Question Posting**   | Submit questions with title, description and tags.              |
| **Answer Submission**  | Provide answers to existing questions with formatting support.   |
| **Voting System**      | Upvote or downvote answers to highlight the best content.        |
| **Accepted Answer**    | Question owners can mark the most helpful answer as accepted.   |
| **Tags**               | Tag questions for easy categorization and filtering.             |
| **Notifications**      | Basic notification icon for new answers or mentions (MVP).      |
| **Authentication**     | Sign up and log in to participate in asking, answering and voting. |
| **Guest Mode**     | Read questions without creating an account. |
| **Responsive UI**      | Fully responsive design optimized for mobile, tablet and desktop. |

---

## Pages & User Flow

| Page            | Description                                             |
|-----------------|---------------------------------------------------------|
| **Splash**        | Brand screen redirecting to role selection               |
| **Login/Signup**    | User authentication flow.                              |
| **Home Page**       | List all questions, search/filter by tags.             |
| **Question Detail** | View question, all answers and submit new answers.    |
| **Ask Question**    | Post a new question with title, description and tags. |
| **Profile** | View user’s posted questions and answers.     |
| **Admin Panel**   | Content moderation, user bans (Admin only).          |
| **Notifications** | Activity updates & mentions.

---

## Tech Stack

| Layer       | Technology                            |
|--------------|-------------------------------------|
| Frontend    | React.js, TypeScript, Vite, ShadCN, Tailwind CSS               |
| Backend     | Node.js, Express.js                 |
| Database    | Firebase Firestore, SQL            |
| Auth        | Firebase Authentication          |
State & Logic | React Hooks, Context API                         |
| Version Control | Git & GitHub                                     |

---

## Development Methodology

- Agile Development: Iterative sprints with clear task breakdown and fast feedback cycles.
- MVC Pattern: Clean separation of logic and presentation for easier maintenance.
- Component-based Frontend: Reusable and modular UI components using React.

---

## How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Angat-Shah/StackIt.git
cd StackIt
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Team

- **Angat Shah**
- **Gati Shah**
- **Yash Patel**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or contributions, please contact us via [GitHub Issues](https://github.com/Angat-Shah/StackIt/issues).
