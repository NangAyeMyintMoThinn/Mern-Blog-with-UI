import { useEffect, useState } from "react";
import API from "../services/api";
import AuthorCard from "../components/AuthorCard";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await API.get("/users");
        setAuthors(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch authors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Our Authors</h1>

        <p className="mt-3 text-gray-500">
          Meet the people behind the stories.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-20 text-center text-gray-500">Loading authors...</p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      {/* Authors */}
      {!loading && !error && authors.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <AuthorCard key={author._id} author={author} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && authors.length === 0 && (
        <p className="py-20 text-center text-gray-500">No authors found.</p>
      )}
    </section>
  );
};

export default Authors;
