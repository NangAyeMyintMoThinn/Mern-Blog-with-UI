import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const imageUrl = `http://localhost:5000/uploads/${post.thumbnail}`;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {/* Thumbnail */}
      <Link to={`/posts/${post._id}`}>
        <img
          src={imageUrl}
          alt={post.title}
          className="h-56 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        {/* Category */}
        {/* <Link
          to={`/category/${post.category}`}
          className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600"
        >
          {post.category}
        </Link> */}
        <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
          {post.category}
        </p>
        {/* Title */}
        <Link to={`/posts/${post._id}`}>
          <h2 className="mt-3 line-clamp-2 text-xl font-bold text-gray-900 hover:text-blue-600">
            {post.title}
          </h2>
        </Link>
        {/* Description */}
        <p className="mt-3 line-clamp-3 text-gray-600">{post.description}</p>
        {/* Author */}
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">By</span>

            <span className="font-medium text-gray-800">
              {post.creator?.name || "Unknown Author"}
            </span>
          </div>

          <Link
            to={`/posts/${post._id}`}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
