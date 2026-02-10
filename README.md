# 🎓 ETUITION BD - Frontend
#Live Link - https://etuition-bd-6b2cf.web.app/

A modern, high-performance Tutor Marketplace platform built with **React 19** and **Vite**. This application connects students with qualified tutors through a seamless interface, secure payments, and a robust dashboard system.

## 🚀 Key Features

* **Role-Based Dashboards:** Unique, highly-functional interfaces for **Admins**, **Tutors**, and **Students**.
* **Stripe Payment Integration:** Secure salary payments with automatic tracking of platform fees (10% from student surcharge + 10% tutor commission).
* **Ongoing Job Management:** Real-time tracking of active tuitions with the ability for students to update terms or terminate contracts.
* **Admin Business Intelligence:** A centralized analytics hub featuring **Recharts** for visualizing revenue growth and transaction volume.
* **Enhanced UX/UI:** * **Framer Motion** for smooth page transitions and micro-interactions.
    * **Lottie-React** for engaging authentication animations.
    * **DaisyUI & Tailwind CSS 4.0** for a sleek, modern aesthetic.
* **Instant Auth Flow:** Optimized Google Login with background JWT generation for a zero-wait redirection experience.

## 🛠️ Tech Stack

### Core
- **Framework:** React 19 (Vite)
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4.0 & DaisyUI 5.0
- **Form Handling:** React Hook Form

### Libraries
- **Payments:** @stripe/react-stripe-js & @stripe/stripe-js
- **Charts:** Recharts
- **Animations:** Framer Motion & Lottie-React
- **Icons:** React Icons
- **Notifications:** React Hot Toast & SweetAlert2
- **Data Fetching:** Axios

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/etuition-bd-client.git](https://github.com/your-username/etuition-bd-client.git)


npm install


VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_FIREBASE_API_KEY=your_firebase_api_key


npm run dev