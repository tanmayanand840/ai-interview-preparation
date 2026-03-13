import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import {
  Brain,
  Sparkles,
  BarChart3,
  CheckCircle2,
  BookOpen,
  Gauge,
  ListChecks,
  FileText,
  Code2,
  Shield,
} from "lucide-react";
import vivamindLogo from "../assets/ChatGPT Image Feb 25, 2026, 12_08_44 PM.png";

const features = [
  {
    title: "AI Generated Questions",
    description:
      "Practice unlimited problems across Arrays, Graphs, Trees, and Dynamic Programming.",
    icon: Sparkles,
  },
  {
    title: "Learn Mode",
    description:
      "Study core concepts with guided explanations and structured learning.",
    icon: BookOpen,
  },
  {
    title: "Practice Mode",
    description:
      "Solve targeted interview problems with progressive difficulty.",
    icon: ListChecks,
  },
  {
    title: "Adaptive Mode",
    description:
      "Get personalized question difficulty based on your live performance.",
    icon: Gauge,
  },
  {
    title: "AI Code Analysis",
    description:
      "Get instant feedback on correctness, time complexity, and improvements.",
    icon: Brain,
  },
  {
    title: "AI Coding Practice",
    description:
      "Practice coding interviews with AI-assisted workflows and feedback loops.",
    icon: Code2,
  },
  {
    title: "Resume Match",
    description: "Match your preparation plan to your resume and target roles.",
    icon: FileText,
  },
  {
    title: "Performance Dashboard",
    description: "Track progress and identify weak topics.",
    icon: BarChart3,
  },
  {
    title: "Admin Practice Control",
    description:
      "Manage and curate practice content with admin-level controls.",
    icon: Shield,
  },
];

const topics = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Sliding Window",
  "Backtracking",
];

const heroHeadline = "Master Coding Interviews with AI";

const Home = () => {
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-10 h-72 w-72 rounded-full bg-indigo/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-16 h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />

      <header className="sticky top-0 z-30 bg-background/45 backdrop-blur-xl border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={vivamindLogo}
              alt="VivaMind logo"
              className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform duration-200 shrink-0"
            />
            <h1 className="text-sm sm:text-base font-semibold tracking-wide truncate">
              AI Interviewer
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm text-textMuted">
            <a href="#features" className="hover:text-cyan transition-colors">
              Features
            </a>
            <a href="#topics" className="hover:text-cyan transition-colors">
              Topics
            </a>
            <a
              href="#how-it-works"
              className="hover:text-cyan transition-colors"
            >
              How It Works
            </a>
            <a href="#about" className="hover:text-cyan transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-cyan transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 sm:px-4 py-2 rounded-lg border border-white/20 text-xs sm:text-sm font-medium hover:border-cyan/70 hover:text-cyan transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="pt-14 sm:pt-20 pb-10 text-center">
          <div className="mx-auto max-w-4xl">
            <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-cyan/90 mb-4">
              AI Interview Platform
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-5">
              <span className="hero-title-motion bg-gradient-to-r from-indigo via-cyan to-indigo bg-clip-text text-transparent">
                {heroHeadline.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="hero-title-letter"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-textMuted leading-relaxed max-w-3xl mx-auto">
              Practice AI-generated DSA problems and receive instant feedback on
              correctness, time complexity, and code improvements.
            </p>

            <div className="mt-8 flex sm:hidden items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-white/20 text-sm font-medium hover:border-cyan/70 hover:text-cyan transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-14 sm:pb-16">
          <div className="mx-auto max-w-md bg-card/75 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-xl font-semibold text-center">
              Start Your Session
            </h3>
            <p className="text-center text-textMuted text-sm mt-2 mb-6">
              Login or create your account to begin practicing right now.
            </p>

            <div className="grid gap-3">
              <Link
                to="/login"
                className="w-full text-center p-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full text-center p-3 rounded-xl font-semibold border border-white/15 hover:border-cyan/70 hover:text-cyan transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-5xl bg-surface/80 border border-white/10 rounded-2xl p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.16em] text-cyan/90 mb-2">
              About
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
              Why VivaMind
            </h3>
            <p className="text-textMuted leading-relaxed max-w-4xl">
              VivaMind is built for focused interview preparation. Instead of
              long, distracting flows, you get a direct path: pick a topic,
              solve coding problems, and receive AI-driven feedback on
              correctness and complexity. The platform combines guided learning,
              adaptive difficulty, and performance analytics so every practice
              session improves your interview readiness.
            </p>
          </div>
        </section>

        <section id="features" className="pb-16 sm:pb-20">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.16em] text-cyan/90 mb-2">
              Platform Features
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold">
              Built for Interview Mastery
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="bg-surface/80 border border-white/10 rounded-2xl p-5 hover:border-cyan/40 hover:-translate-y-1 transition duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo/30 to-cyan/30 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-cyan" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
                  <p className="text-sm text-textMuted leading-relaxed">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div
              id="topics"
              className="bg-surface/80 border border-white/10 rounded-2xl p-6 sm:p-7"
            >
              <p className="text-sm uppercase tracking-[0.16em] text-cyan/90 mb-2">
                How It Works
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
                Three simple steps
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="font-medium text-lg">1. Choose Topic</p>
                  <p className="text-textMuted text-sm mt-1">
                    Pick Arrays, Graphs, DP, and more.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-lg">2. Solve Problem</p>
                  <p className="text-textMuted text-sm mt-1">
                    Write and submit your solution in practice mode.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-lg">3. AI Analysis</p>
                  <p className="text-textMuted text-sm mt-1">
                    Receive feedback, insights, and improvement tips instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.16em] text-cyan/90 mb-2">
                Topics
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
                Practice across all major DSA patterns
              </h3>

              <div className="flex flex-wrap gap-2.5">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-card/70 border border-white/10 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cyan" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center bg-card/70 border border-white/10 rounded-2xl p-7 sm:p-9 backdrop-blur-xl">
            <p className="text-2xl sm:text-3xl font-semibold mb-5">
              Ready to improve your coding interviews?
            </p>
            <Link
              to="/login"
              className="inline-flex px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
            >
              Start Practicing
            </Link>
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="border-t border-white/10 py-6 sm:py-7 bg-surface/35"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between text-sm text-textMuted">
          <div className="text-center sm:text-left">
            <p className="font-medium text-textPrimary">VivaMind</p>
            <p>© 2026 Tanmay Anand</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href="#features" className="hover:text-cyan transition">
              Features
            </a>
            <a href="#topics" className="hover:text-cyan transition">
              Topics
            </a>
            <a href="#how-it-works" className="hover:text-cyan transition">
              How It Works
            </a>
            <a href="#about" className="hover:text-cyan transition">
              About
            </a>
            <a
              href="mailto:tanmay@example.com"
              className="hover:text-cyan transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
