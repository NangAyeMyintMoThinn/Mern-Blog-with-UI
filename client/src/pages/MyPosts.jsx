import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import useAuthStore from "../store/authStore";

const MyPosts = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await API.get(`/posts/users/${currentUser.id}`);

        setPosts(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch your posts.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [currentUser.id]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/posts/${postId}`);

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Heading */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>

          <p className="mt-2 text-gray-500">Manage your published articles.</p>
        </div>

        <Link
          to="/create"
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Create Post
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-20 text-center text-gray-500">Loading your posts...</p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl bg-white py-20 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            You haven't created any posts yet.
          </h2>

          <p className="mt-2 text-gray-500">
            Start sharing your ideas with the community.
          </p>

          <Link
            to="/create"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Your First Post
          </Link>
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white max-h-50 md:flex-row"
            >
              {/* Thumbnail */}
              <Link to={`/posts/${post._id}`} className="md:w-1/3">
                <img
                  src={`http://localhost:5000/uploads/${post.thumbnail}`}
                  alt={post.title}
                  className="h-64 w-full object-cover md:h-full"
                />
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  {post.category}
                </span>

                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  {post.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-gray-600">
                  {post.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Link
                    to={`/posts/${post._id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    View
                  </Link>

                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyPosts;
