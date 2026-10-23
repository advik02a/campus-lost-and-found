import { Search, Plus, CheckCircle2, Users, PackageSearch, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 text-[#0a0a0a] dark:text-gray-100">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 mb-6">
              <MapPin size={12} />
              NIT HAMIRPUR CAMPUS RECOVERY NETWORK
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Lost something on campus?
              <br />
              <span className="text-blue-800 dark:text-blue-400">Let's get it back.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
              A single, trusted place for NIT Hamirpur students to report lost items, post
              what they've found, and reconnect belongings with their owners
              — fast.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/browse"
                className="flex items-center justify-center gap-2 bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors"
              >
                <Search size={16} />
                Browse Listings
              </Link>
              <Link
                to="/report"
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 dark:text-gray-100 font-semibold rounded-lg px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
                Report an Item
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/report"
                className="bg-orange-50 dark:bg-orange-950 rounded-2xl p-5 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
              >
                <Users size={20} className="text-gray-500 dark:text-gray-400 mb-6" />
                <div className="font-bold text-lg dark:text-gray-100">Lost</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Report what's missing</div>
              </Link>
              <Link
                to="/report"
                className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-5 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Users size={20} className="text-gray-500 dark:text-gray-400 mb-6" />
                <div className="font-bold text-lg dark:text-gray-100">Found</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Post what you found</div>
              </Link>
            </div>

            <Link
              to="/browse"
              className="block bg-blue-800 rounded-2xl p-6 text-white hover:bg-blue-900 transition-colors"
            >
              <PackageSearch size={22} className="mb-6 opacity-90" />
              <div className="font-bold text-xl mb-1">Search. Match. Recover.</div>
              <div className="text-sm text-blue-100">
                The whole campus, working together.
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            {
              icon: <Plus size={18} />,
              title: "Report in seconds",
              desc: "Post a lost or found item with a category, location and date. No photo required.",
            },
            {
              icon: <Search size={18} />,
              title: "Search & filter",
              desc: "Filter by type, category and location. Full-text search across every listing.",
            },
            {
              icon: <CheckCircle2 size={18} />,
              title: "Track recovery",
              desc: "Move items through Lost → Found → Claimed → Recovered. History stays visible.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`px-4 sm:px-8 py-10 sm:py-12 ${
                i > 0 ? "md:border-l border-gray-200 dark:border-gray-800" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full border border-blue-800 dark:border-blue-400 text-blue-800 dark:text-blue-400 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <div className="font-bold text-lg mb-2">{f.title}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              title: "Create an account",
              desc: "Register as a student to post and manage items.",
            },
            {
              n: "02",
              title: "Report or search",
              desc: "Post what you lost/found, or browse existing listings.",
            },
            {
              n: "03",
              title: "Reconnect",
              desc: "Contact the poster and mark the item recovered when returned.",
            },
          ].map((s) => (
            <div key={s.n} className="border-l-2 border-blue-800 dark:border-blue-400 pl-5">
              <div className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-3">{s.n}</div>
              <div className="font-bold text-lg mb-1.5">{s.title}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}