import { useState } from "react";
import { toast } from "react-hot-toast";
import { addProblem } from "../services/practiceService";

const AdminPractice = () => {
  const [form, setForm] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    link: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProblem(form);
      toast.success("Problem added successfully");
      setForm({
        title: "",
        topic: "",
        difficulty: "Easy",
        link: "",
      });
    } catch (err) {
      toast.error("Admin access required");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        Admin DSA Problems
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 max-w-xl"
      >
        <input
          className="w-full p-3 mb-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="w-full p-3 mb-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          placeholder="Topic"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          required
        />

        <select
          className="w-full p-3 mb-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input
          className="w-full p-3 mb-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          placeholder="Problem Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          required
        />

        <button className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition">
          Add Problem
        </button>
      </form>
    </div>
  );
};

export default AdminPractice;
