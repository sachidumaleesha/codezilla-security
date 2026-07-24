# 🛡️ CodeZilla Security — Cybersecurity Awareness Training Platform

**CodeZilla Security** is a full-stack web application built with **Next.js 14**, **Prisma**, and **Clerk** that delivers an online **security awareness training program** for individuals and organizations. It helps users learn how to recognize phishing, social engineering, and other cyber threats through structured courses, progress tracking, and interactive learning tools.

🌐 **Live Demo:** [codezilla-security.vercel.app](https://codezilla-security.vercel.app)

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma">
  <img alt="Clerk" src="https://img.shields.io/badge/Auth-Clerk-6C47FF">
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## 📖 About the Project

CodeZilla Security is a **cybersecurity education and awareness platform** designed to make security training accessible, engaging, and measurable. It combines a public-facing marketing site with an authenticated learning dashboard, giving learners a guided path through security topics such as data protection, social engineering defense, and secure data exchange, while giving admins the tools to manage course content and track participant progress.

The project is a great reference implementation for anyone building a **learning management system (LMS)**, **course platform**, or **SaaS dashboard** with the modern Next.js App Router stack.

### ✨ Key Highlights

- 🔐 **Secure authentication & user management** powered by Clerk
- 📚 **Structured security awareness courses** with rich-text lesson content
- 📊 **Progress tracking & analytics dashboards** with interactive charts
- 🧩 **Admin content management** for creating and editing courses
- 💬 **Testimonials, FAQ, and marketing pages** for onboarding new users
- 🌓 **Light/dark theme support** out of the box
- 📱 **Fully responsive UI** built with Radix UI and Tailwind CSS

---

## 🚀 Features

| Category | Description |
|---|---|
| **Authentication** | Sign up / sign in flows and route protection via [Clerk](https://clerk.com), with webhook syncing via [Svix](https://www.svix.com) |
| **Course Content** | Rich-text course/lesson authoring using [TinyMCE](https://www.tiny.cloud) editor |
| **Data Layer** | Type-safe database access with [Prisma ORM](https://www.prisma.io) |
| **Data Fetching** | Server-state management with [TanStack Query](https://tanstack.com/query) |
| **Tables & Dashboards** | Sortable, filterable data tables via [TanStack Table](https://tanstack.com/table) |
| **Analytics** | Progress and engagement charts rendered with [Recharts](https://recharts.org) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) schema validation |
| **UI Components** | Accessible, composable primitives from [Radix UI](https://www.radix-ui.com), styled with [Tailwind CSS](https://tailwindcss.com) |
| **Marketing Site** | Landing page with features, testimonials, FAQ, About Us, and Contact Us sections |

---

## 🧱 Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `tailwindcss-animate`, `class-variance-authority`
- **UI Primitives:** Radix UI (accordion, dialog, dropdown, tooltip, toast, and more)
- **Authentication:** Clerk (`@clerk/nextjs`) with Svix webhook verification
- **Database / ORM:** Prisma (`@prisma/client`)
- **Data Fetching:** TanStack Query & TanStack Table
- **Rich Text Editor:** TinyMCE React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod resolvers
- **Icons:** Lucide React
- **Deployment:** [Vercel](https://vercel.com)

---

## 📂 Project Structure

```
codezilla-security/
├── app/               # Next.js App Router pages, layouts, and API routes
├── components/        # Reusable UI components (Radix-based design system)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions, Prisma client, shared config
├── prisma/            # Prisma schema and database migrations
├── public/images/     # Static assets and illustrations
├── middleware.ts       # Clerk auth middleware / route protection
├── tailwind.config.ts  # Tailwind CSS configuration
└── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**
- A **PostgreSQL** (or your preferred Prisma-supported) database
- A [Clerk](https://clerk.com) account for authentication keys
- A [TinyMCE](https://www.tiny.cloud) API key for the rich-text editor

### 1. Clone the repository

```bash
git clone https://github.com/sachidumaleesha/codezilla-security.git
cd codezilla-security
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root with values such as:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# TinyMCE Editor
NEXT_PUBLIC_TINYMCE_API_KEY=
```

> ⚠️ Check `app/`, `lib/`, and `middleware.ts` for the exact set of environment variables the app expects, since requirements may evolve.

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Generate the Prisma client and build the production app |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

---

## 🗺️ Roadmap

- [ ] Course completion certificates
- [ ] Quiz / assessment modules
- [ ] Organization/team accounts
- [ ] Email notifications for course reminders
- [ ] Multi-language support

Have an idea? Open an [issue](https://github.com/sachidumaleesha/codezilla-security/issues) to suggest a feature.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is available under the [MIT License](LICENSE). Feel free to use it as a learning reference or starting point for your own project.

---

## 👤 Author

**Sachidu Maleesha**
GitHub: [@sachidumaleesha](https://github.com/sachidumaleesha)

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub — it helps others discover it too!
