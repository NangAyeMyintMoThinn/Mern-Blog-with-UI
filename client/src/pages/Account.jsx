import { useEffect, useState } from "react";

import API from "../services/api";
import useAuthStore from "../store/authStore";

const Account = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateUser = useAuthStore((state) => state.updateUser);

  //   const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/users/${currentUser.id}`);

        // setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);

        if (response.data.avatar) {
          setPreview(`http://localhost:5000/uploads/${response.data.avatar}`);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser.id]);

  // Avatar preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500 * 1024) {
      setError("Avatar must be smaller than 500KB.");
      return;
    }

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // Change avatar
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      setError("Please choose an avatar.");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("avatar", avatar);

    try {
      const response = await API.post("/users/change-avatar", formData);

      //   setUser(response.data);

      updateUser({
        ...currentUser,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
      });

      setSuccess("Profile picture updated successfully.");
      setAvatar(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update avatar.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await API.patch("/users/edit-user", {
        name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      //   setUser(response.data);

      updateUser({
        ...currentUser,
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="py-20 text-center">Loading account...</p>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>

        <p className="mt-2 text-gray-500">Manage your personal information.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Avatar */}
      <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Profile Picture</h2>

        <form onSubmit={handleAvatarSubmit}>
          <div className="mb-6 flex flex-col items-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-blue-100">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-blue-600">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-5"
            />

            <p className="mt-2 text-sm text-gray-500">Maximum size: 500KB</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !avatar}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Upload Avatar
          </button>
        </form>
      </div>

      {/* Profile Information */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Profile Information</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block font-medium">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="mb-2 block font-medium">Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block font-medium">New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block font-medium">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Account;
