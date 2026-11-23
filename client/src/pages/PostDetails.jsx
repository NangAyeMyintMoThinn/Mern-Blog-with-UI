import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import API from "../services/api";

const PostDetails = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center">Loading post...</p>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const imageUrl = `http://localhost:5000/uploads/${post.thumbnail}`;

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      {/* Category */}
      <Link
        to={`/category/${post.category}`}
        className="inline-block rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-600"
      >
        {post.category}
      </Link>

      {/* Title */}
      <h1 className="mt-6 text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
        {post.title}
      </h1>

      {/* Author and Date */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-gray-500">
        <span>By {post.creator?.name || "Unknown Author"}</span>

        <span>•</span>

        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Thumbnail */}
      <img
        src={imageUrl}
        alt={post.title}
        className="mt-8 max-h-125 w-full rounded-2xl object-cover"
      />

      {/* Content */}
      <div className="mt-10 whitespace-pre-wrap text-lg leading-8 text-gray-700">
        {post.description}
      </div>

      {/* Back */}
      <Link
        to="/"
        className="mt-10 inline-block font-semibold text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
    </article>
  );
};

export default PostDetails;
