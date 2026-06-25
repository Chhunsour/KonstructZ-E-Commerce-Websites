import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/sour/dashboard", label: "Posts" },
  { to: "/sour/categories", label: "Categories" },
];

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    navigate("/sour", { replace: true });
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-theme-card/95 backdrop-blur border-b border-theme-border/20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            to="/sour/dashboard"
            className="font-clofieBold text-lg text-theme-heading hover:text-theme-accent transition-colors"
          >
            Konstructz Admin
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `px-3 py-2 font-googleSans text-sm uppercase tracking-wider rounded transition-colors ${
                    isActive
                      ? "bg-theme-accent/10 text-theme-accent"
                      : "text-theme-muted hover:text-theme-text hover:bg-theme-bg"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline font-glonimove text-xs text-theme-muted">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={onSignOut}
              className="font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-2 rounded transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        {/* Mobile nav row */}
        <nav className="sm:hidden flex items-center gap-1 border-t border-theme-border/20 px-5 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `px-3 py-1.5 font-googleSans text-xs uppercase tracking-wider rounded transition-colors ${
                  isActive
                    ? "bg-theme-accent/10 text-theme-accent"
                    : "text-theme-muted hover:text-theme-text"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
