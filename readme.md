# QuickTask Frontend (React + Tailwind)

This is the frontend for the QuickTask project — a clean, responsive task manager with role-based UI.

## Technologies
- React + Vite
- Tailwind CSS
- Axios
- React Router



## Setup & Run

```bash
npm install
npm run dev
```

## Roles

- `Admin`:
  - Create and assign tasks
  - View and delete all tasks
- `Member`:
  - View own tasks
  - Update task status

## Auth Flow

- Register/Login using email + password
- Token stored in localStorage
- Axios sends token via Bearer header

## Routes

| Path             | Role     | Description                  |
|------------------|----------|------------------------------|
| `/login`         | Public   | Login form                   |
| `/register`      | Public   | Register form                |
| `/dashboard`     | Both     | Welcome + role overview      |
| `/admin/tasks`   | Admin    | Task management page         |
| `/member/tasks`  | Member   | View and update assigned tasks |

## Features

- Responsive UI (mobile + desktop)
- Navbar with role info & logout
- Role-protected routes
- Task filters by status
- Reusable components
