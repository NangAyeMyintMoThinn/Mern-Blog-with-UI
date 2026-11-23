import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import PostCard from "../components/PostCard";
import usePostStore from "../store/postStore";
import { categories } from "../utils/categories";

const Home = () => {
  const { category } = useParams();
  // const location = useLocation();

  const posts = usePostStore((state) => state.posts);
  const loading = usePostStore((state) => state.loading);
  const error = usePostStore((state) => state.error);
  const fetchPosts = usePostStore((state) => state.fetchPosts);

  useEffect(() => {
    fetchPosts(category || "");
  }, [category, fetchPosts]);

  // useEffect(() => {
  //   if (location.hash === "#posts-section") {
  //     const section = document.getElementById("posts-section");

  //     section?.scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }
  // }, [location]);
  const handleCategoryClick = () => {
    document.getElementById("posts-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      {/* Hero Section */}
      {/* {!category && ( */}
      <section className="bg-blue-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-semibold text-blue-600">Welcome to my blog</p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Discover stories, ideas and perspectives.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Explore interesting articles from different authors and discover new
            ideas from our community.
          </p>

          <Link
            to="/authors"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Authors
          </Link>
        </div>
      </section>
      {/* )} */}

      {/* Posts Section */}
      <section
        id="posts-section"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12"
      >
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {category ? `${category} Posts` : "Latest Posts"}
          </h2>

          <p className="mt-2 text-gray-500">
            {category
              ? `Explore articles about ${category}.`
              : "Discover the latest stories from our community."}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            to="/"
            onClick={handleCategoryClick}
            className={`rounded-full px-4 py-2 transition ${
              !category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
          >
            All Posts
          </Link>

          {categories.map((item) => (
            <Link
              key={item}
              to={`/category/${item}`}
              onClick={handleCategoryClick}
              className={`rounded-full px-4 py-2 transition ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">Loading posts...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No posts found
            </h3>

            <p className="mt-2 text-gray-500">
              There are currently no posts in this category.
            </p>
          </div>
        )}

        {/* Posts */}
        {!loading && !error && posts.length > 0 && (
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

export default Home;
