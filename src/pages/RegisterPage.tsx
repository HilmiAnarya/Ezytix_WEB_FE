import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${LoginBG})`,
      }}
    >
      {/* LOGO */}
      <div className="flex flex-col items-center mt-10 mb-6">
        <img src={WhiteLogo} alt="Ezytix" className="w-48 md:w-56" />
        <p className="text-white text-lg md:text-xl font-semibold tracking-wide">
          CEPAT DAN AMAN
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg px-8 py-8">
        <h2 className="text-center font-semibold text-lg mb-6">Register</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            type="text"
            placeholder="Nama Lengkap"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
            required
          />

          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="Nomor Handphone"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
            required
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
            required
          />

          {/* LINKS */}
          <div className="flex justify-between text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-red-600 hover:underline"
            >
              Sudah punya akun?
            </button>

            <span></span>
          </div>

          {/* BUTTON REGISTER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        {/* DISCLAIMER */}
        <p className="text-gray-500 text-xs text-center mt-4">
          Dengan membuat akun, kamu menyetujui kebijakan Privasi dan Syarat &
          Ketentuan Ezytix.
        </p>
      </div>

      <div className="mt-10"></div>
    </div>
  );
}
