import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import { categories } from "../utils/categories";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`);
        const post = response.data;

        setTitle(post.title);
        setCategory(post.category);
        setDescription(post.description);

        setPreview(`http://localhost:5000/uploads/${post.thumbnail}`);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Change thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Thumbnail must be smaller than 2MB.");
      return;
    }

    setError("");
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (description.trim().length < 12) {
      setError("Description must contain at least 12 characters.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    setSubmitting(true);

    try {
      await API.patch(`/posts/${id}`, formData);

      navigate("/my-posts");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update post.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="py-20 text-center">Loading post...</p>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Edit Post</h1>

        <p className="mb-8 text-gray-500">Update your article.</p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-semibold text-gray-700"
            >
              Post Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block font-semibold text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={10}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label
              htmlFor="thumbnail"
              className="mb-2 block font-semibold text-gray-700"
            >
              Thumbnail
            </label>

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            {preview && (
              <img
                src={preview}
                alt="Thumbnail preview"
                className="mt-4 max-h-72 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
