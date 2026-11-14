"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = { avatar: 2 * 1024 * 1024, banner: 5 * 1024 * 1024 }; // 2MB & 5MB

const labelClass = "block text-base font-bold mb-3 text-text/90";
const inputClass =
  "w-full bg-primary/70 rounded-md px-5 py-4 outline-none border border-transparent focus:border-accent/60 placeholder:text-text/40 transition";

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); 

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-text/60 animate-pulse">Loading profile...</p>
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
  const bannerSrc = bannerPreview || user.banner;

  const hasChanges =
    form.username.trim() !== (user.username || "") ||
    form.email.trim() !== (user.email || "") ||
    form.password !== "" ||
    !!avatarFile ||
    !!bannerFile;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePickImage = (e, type) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // biar bisa pilih file yang sama lagi
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Format harus JPG, PNG, atau WEBP." });
      return;
    }
    if (file.size > MAX_SIZE[type]) {
      setMessage({
        type: "error",
        text: `Ukuran maksimal ${type === "avatar" ? "2MB" : "5MB"} untuk ${type}.`,
      });
      return;
    }

    setMessage(null);
    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(file);
      setAvatarPreview(url);
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerFile(file);
      setBannerPreview(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    const username = form.username.trim();
    const email = form.email.trim();

    // validasi sederhana
    if (username.length < 3) {
      return setMessage({ type: "error", text: "Username minimal 3 karakter." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setMessage({ type: "error", text: "Format email tidak valid." });
    }
    if (form.password) {
      if (form.password.length < 8) {
        return setMessage({ type: "error", text: "Password minimal 8 karakter." });
      }
      if (form.password !== form.confirmPassword) {
        return setMessage({ type: "error", text: "Konfirmasi password tidak sama." });
      }
    }

    setSaving(true);
    try {
      // 1. Simpan data teks (hanya field yang berubah)
      const payload = {};
      if (username !== user.username) payload.username = username;
      if (email !== user.email) payload.email = email;
      if (form.password) payload.password = form.password;

      if (Object.keys(payload).length > 0) {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Gagal menyimpan perubahan.");
      }

      // 2. Upload gambar yang dipilih
      for (const [type, file] of [
        ["avatar", avatarFile],
        ["banner", bannerFile],
      ]) {
        if (!file) continue;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(`/api/profile/${type}`, {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error(`Gagal upload ${type}, coba lagi.`);
      }

      setAvatarFile(null);
      setBannerFile(null);
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
      setMessage({ type: "success", text: "Perubahan berhasil disimpan." });

      if (typeof refreshUser === "function") {
        await refreshUser();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
        <div className="mx-auto px-5 md:px-8 mt-6">
            <h1 className="text-text text-3xl font-semibold mb-4">
                My Profile
            </h1>
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
                <div className="w-40 h-40 overflow-hidden bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-6xl font-semibold text-text flex-shrink-0">
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
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl text-text font-semibold leading-none align-top">
                        {user.username || "Username"}
                    </h2>
                    <p className="text-text/70 text-sm mt-2 max-w-md">
                        {user.bio || "Belum ada bio. Tuliskan sesuatu tentang dirimu!"}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Link href="/profile/edit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-text font-semibold transition">
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    </section>
    )
}