import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Authors from "./pages/Authors";
import AuthorProfile from "./pages/AuthorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import MyPosts from "./pages/MyPosts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home
      {
        index: true,
        element: <Home />,
      },

      // Categories
      {
        path: "category/:category",
        element: <Home />,
      },

      // Authors
      {
        path: "authors",
        element: <Authors />,
      },
      {
        path: "authors/:id",
        element: <AuthorProfile />,
      },

      // Authentication
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      // Account
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },

      // My Posts
      {
        path: "my-posts",
        element: (
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        ),
      },

      // Create Post
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },

      // Edit Post
      {
        path: "posts/:id/edit",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },

      // Post Details
      {
        path: "posts/:id",
        element: <PostDetails />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
