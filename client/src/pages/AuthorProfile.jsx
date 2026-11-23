import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";
import PostCard from "../components/PostCard";

const AuthorProfile = () => {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const [authorResponse, postsResponse] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/posts/users/${id}`),
        ]);

        setAuthor(authorResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load author profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center">Loading profile...</p>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  const avatarUrl = author.avatar
    ? `http://localhost:5000/uploads/${author.avatar}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Author Information */}
      <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold text-blue-600">
                {author.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Information */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>

            <p className="mt-2 text-gray-500">{author.email}</p>

            <p className="mt-4 font-medium text-blue-600">
              {posts.length} Published Posts
            </p>
          </div>
        </div>
      </section>

      {/* Author Posts */}
      <section>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          Articles by {author.name}
        </h2>

        {posts.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            This author hasn't published any posts yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorProfile;
