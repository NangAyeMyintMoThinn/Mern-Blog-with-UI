import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Myint Mo's Blog
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/authors" className={navLinkClass}>
            Authors
          </NavLink>

          {currentUser && (
            <>
              <NavLink to="/my-posts" className={navLinkClass}>
                My Posts
              </NavLink>

              <NavLink to="/account" className={navLinkClass}>
                Account
              </NavLink>

              <Link
                to="/create"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Create Post
              </Link>

              <button
                onClick={handleLogout}
                className="font-medium text-red-500 hover:text-red-700"
              >
                Sign Out
              </button>
            </>
          )}

          {!currentUser && (
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
