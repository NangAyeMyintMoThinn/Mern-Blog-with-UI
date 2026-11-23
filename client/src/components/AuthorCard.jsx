import { Link } from "react-router-dom";

const AuthorCard = ({ author }) => {
  const avatarUrl = author.avatar
    ? `http://localhost:5000/uploads/${author.avatar}`
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg">
      {/* Avatar */}
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={author.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-blue-600">
            {author.name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Author Name  */}
      <h2 className="text-xl font-bold text-gray-900">{author.name}</h2>

      {/* Post Count  */}
      <p className="mt-2 text-sm text-gray-500">{author.posts || 0} Posts</p>

      {/* Profile  */}
      <Link
        to={`/authors/${author._id}`}
        className="mt-5 inline-block rounded-lg border border-blue-600 px-5 py-2 font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        View Profile
      </Link>
    </div>
  );
};

export default AuthorCard;
