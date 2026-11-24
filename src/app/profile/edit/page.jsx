"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const labelClass = "block text-base font-bold mb-3 text-text/90";

const inputClass =
  "w-full bg-primary/70 rounded-md px-5 py-4 outline-none border border-transparent focus:border-accent/60 placeholder:text-text/40 transition";

export default function ProfileEditPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-text/60 animate-pulse">
          Loading profile...
        </p>
      </main>
    );
  }

  const initial = user.username?.charAt(0).toUpperCase() || "U";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const avatarSrc = avatarPreview || user.avatar;

  const hasChanges =
    form.username.trim() !== (user.username || "") ||
    form.email.trim() !== (user.email || "") ||
    form.bio.trim() !== (user.bio || "") ||
    form.password !== "" ||
    !!avatarFile;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage({
        type: "error",
        text: error.message || "Gagal logout.",
      });
    }
  };

  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Format harus JPG, PNG, atau WEBP.",
      });
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setMessage({
        type: "error",
        text: "Ukuran maksimal avatar adalah 2MB.",
      });
      return;
    }

    setMessage(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setForm({
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      password: "",
      confirmPassword: "",
    });

    setAvatarFile(null);
    setAvatarPreview(null);
    setMessage(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  // Mengambil pesan error backend
  const getErrorMessage = (data, fallback) => {
    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }

    return data.message || data.error || fallback;
  };

  // Menyimpan perubahan
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    const username = form.username.trim();
    const email = form.email.trim();
    const bio = form.bio.trim();

    // Validasi API URL
    if (!API_URL) {
      setMessage({
        type: "error",
        text: "Backend API URL belum dikonfigurasi.",
      });
      return;
    }

    // Validasi username
    if (username.length < 3 || username.length > 30) {
      setMessage({
        type: "error",
        text: "Username harus terdiri dari 3–30 karakter.",
      });
      return;
    }

    // Validasi email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({
        type: "error",
        text: "Format email tidak valid.",
      });
      return;
    }

    // Validasi bio
    if (bio.length > 300) {
      setMessage({
        type: "error",
        text: "Bio maksimal 300 karakter.",
      });
      return;
    }

    // Validasi password
    if (form.password) {
      if (form.password.length < 8) {
        setMessage({
          type: "error",
          text: "Password minimal 8 karakter.",
        });
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage({
          type: "error",
          text: "Konfirmasi password tidak sama.",
        });
        return;
      }
    }

    const profilePayload = {};

    if (username !== (user.username || "")) {
      profilePayload.username = username;
    }

    if (email !== (user.email || "")) {
      profilePayload.email = email;
    }

    if (bio !== (user.bio || "")) {
      profilePayload.bio = bio;
    }

    const hasProfileChanges = Object.keys(profilePayload).length > 0;
    const hasPasswordChange = Boolean(form.password);

    if (!hasProfileChanges && !hasPasswordChange && !avatarFile) {
      return;
    }

    setSaving(true);

    try {
      // 1. Simpan username, email, dan bio
      if (hasProfileChanges) {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profilePayload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            getErrorMessage(data, "Gagal menyimpan perubahan profile.")
          );
        }
      }

      // 2. Simpan password melalui endpoint terpisah
      if (hasPasswordChange) {
        const response = await fetch(`${API_URL}/users/me/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password: form.password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            getErrorMessage(data, "Gagal mengubah password.")
          );
        }
      }

      // 3. Upload avatar ke Supabase Storage
      if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await fetch(`${API_URL}/users/me/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Avatar upload failed");
      }
    }

      // 4. Ambil data terbaru dari backend
      await refreshUser();

      // 5. Reset form password dan avatar
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setAvatarFile(null);
      setAvatarPreview(null);

      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }

      setMessage({
        type: "success",
        text: "Perubahan berhasil disimpan.",
      });
    } catch (error) {
      console.error("Profile update failed:", error);

      setMessage({
        type: "error",
        text: error.message || "Terjadi kesalahan.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-auto min-h-screen bg-primary text-text px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSave}
          className="grid lg:grid-cols-[300px_1fr] gap-8"
        >
          {/* LEFT: Profile Photo */}
          <aside>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="w-40 h-40 rounded-xl overflow-hidden bg-accent flex items-center justify-center text-6xl font-bold text-text">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition"
              >
                Change Photo
              </button>

              <p className="text-xs text-text/40">
                JPG, PNG, atau WEBP. Maks 2MB.
              </p>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePickImage}
              />
            </div>
          </aside>

          {/* RIGHT: Profile Information */}
          <div className="flex flex-col gap-4 w-full">
          <section className="bg-secondary p-6 md:p-8 space-y-8 h-fit">
            {/* Username */}
            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className={inputClass}
                autoComplete="username"
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                autoComplete="email"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className={labelClass}>
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                maxLength={300}
                className={`${inputClass} resize-none`}
                placeholder="Write something about yourself..."
              />

              <p className="text-xs text-text/40 mt-2 text-right">
                {form.bio.length}/300 characters
              </p>
            </div>

            {/* Password */}
            <div>
              <p className={labelClass}>
                Change Password
              </p>

              <div className="space-y-4">
                <input
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="new-password"
                />

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>

              <p className="text-sm text-text/50 mt-3">
                At least 8 characters.
              </p>
            </div>

            {/* Account Information */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text/50 pt-2 border-t border-white/5">
              <span>Member since {joinedDate}</span>
            </div>

            {/* Message + Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-h-5">
                {message && (
                  <p
                    className={`text-sm ${
                      message.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!hasChanges || saving}
                  className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/70 border border-white/10 text-text font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!hasChanges || saving}
                  className="px-6 py-3 rounded-lg bg-accent hover:bg-red-500 text-white font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
          <button
              type="button"
              onClick={handleLogout}
              className="ml-auto px-6 py-4 rounded-2xl text-text bg-accent hover:bg-accent-hover transition font-semibold text-sm text-center"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
