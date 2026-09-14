import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: "Profile",
      description: "Complete and manage your profile",
      link: "/profile",
    },
    {
      title: "Resume",
      description: "Upload and manage your resume",
      link: "/resume",
    },
    {
      title: "Skills",
      description: "Manage your technical skills",
      link: "/skills",
    },
    {
      title: "Find Jobs",
      description: "Search jobs matching your profile",
      link: "/jobs",
    },
    {
      title: "Subscription",
      description: "Manage your FREE, PRO and PREMIUM plans.",
      link: "/subscription",
    },
  ];

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">Welcome back</p>

        <h1 className="text-3xl font-bold text-slate-900">
          {user?.name || "Candidate"}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your profile, jobs and applications from one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Profile</p>

          <h3 className="mt-2 text-2xl font-bold">Active</h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Applications</p>

          <h3 className="mt-2 text-2xl font-bold">0</h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Subscription</p>

          <h3 className="mt-2 text-2xl font-bold text-blue-600">Free</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.link}
              to={card.link}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600">Open →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
