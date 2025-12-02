# Cookify - Food Recipe Blog Application

A full-stack food recipe blog application built with React (frontend) and Node.js/Express (backend).

## Features

- 🍽️ Browse and search recipes
- ➕ Add, edit, and delete recipes
- 👤 User authentication (Sign up/Login)
- 🏷️ Category management
- 👨‍💼 Admin panel for managing recipes, categories, and users
- 📸 Image upload for recipes
- ❤️ Favorite recipes functionality
- 📊 Statistics dashboard

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File uploads)
- Bcrypt (Password hashing)

## Project Structure

```
cookify/
├── backend/
│   ├── config/
│   │   └── connectionDb.js
│   ├── controller/
│   │   ├── admin.js
│   │   ├── category.js
│   │   ├── recipe.js
│   │   └── user.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   └── auth.js
│   ├── models/
│   │   ├── category.js
│   │   ├── recipe.js
│   │   └── user.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── category.js
│   │   ├── recipe.js
│   │   └── user.js
│   ├── public/
│   │   └── images/
│   ├── server.js
│   └── package.json
└── frontend/
    └── food-blog-app/
        ├── src/
        │   ├── api/
        │   ├── components/
        │   ├── pages/
        │   └── assets/
        ├── public/
        └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/food-blog-app
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/api/client.js` if needed (default: `http://localhost:5000`)

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Routes

### User Routes
- `POST /signUp` - User registration
- `POST /login` - User login
- `GET /user/:id` - Get user by ID
- `GET /profile` - Get current user profile (auth required)
- `GET /all` - Get all users (auth required)

### Recipe Routes
- `GET /recipe` - Get all recipes
- `GET /recipe/:id` - Get single recipe
- `POST /recipe` - Create recipe (auth required)
- `PUT /recipe/:id` - Update recipe
- `DELETE /recipe/:id` - Delete recipe

### Category Routes
- `GET /category` - Get all categories
- `POST /category` - Add category (auth required)
- `PUT /category/:id` - Update category (auth required)
- `DELETE /category/:id` - Delete category (auth required)

### Admin Routes
- `GET /admin/recipes` - Get all recipes (admin only)
- `GET /admin/stats` - Get statistics (admin only)
- `DELETE /admin/recipes/:id` - Delete recipe (admin only)
- `PUT /admin/recipes/:id` - Update recipe (admin only)

## Default Admin Account

The application automatically creates an admin user on first run:
- Email: `admin@cookify.com`
- Password: Check the `ensureAdminExists` function in `backend/middleware/adminAuth.js`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cookify
JWT_SECRET=your_secret_key_here
```

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

ISC

## Author

Your Name

