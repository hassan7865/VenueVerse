import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link
              to="/home"
              className="group flex items-center gap-3 text-white hover:text-blue-400 transition-all duration-300 ease-out"
            >
              <div className="relative">
                <img src="/images.svg" className="h-8 w-8" alt="Logo" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Venue Verse
              </span>
            </Link>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              Discover and book exceptional venues for your perfect events and
              memorable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
            <div>
              <h3 className="font-semibold text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/home"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Venues
                </Link>
                <Link
                  to="/search"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Services
                </Link>
                <Link
                  to="/search_shop"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Shop
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">Support</h3>
              <div className="space-y-2">
                <Link
                  to="/help"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Help Center
                </Link>
                <Link
                  to="/privacy"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="block text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Connect With Us</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/biplobhasan.emon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group relative p-3 bg-slate-700/50 rounded-xl hover:bg-brand-blue transition-all duration-300 backdrop-blur-sm border border-slate-600/30 hover:border-blue-500/50"
              >
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="group relative p-3 bg-slate-700/50 rounded-xl hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 backdrop-blur-sm border border-slate-600/30 hover:border-pink-500/50"
              >
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.95.25 2.4.415.51.19.875.415 1.26.8.385.385.61.75.8 1.26.165.45.36 1.23.415 2.4.058 1.265.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.25 1.95-.415 2.4-.19.51-.415.875-.8 1.26-.385.385-.75.61-1.26.8-.45.165-1.23.36-2.4.415-1.265.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.95-.25-2.4-.415a3.57 3.57 0 01-1.26-.8 3.57 3.57 0 01-.8-1.26c-.165-.45-.36-1.23-.415-2.4C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.056-1.17.25-1.95.415-2.4a3.57 3.57 0 01.8-1.26 3.57 3.57 0 011.26-.8c.45-.165 1.23-.36 2.4-.415C8.416 2.212 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 2.2a4.3 4.3 0 110 8.6 4.3 4.3 0 010-8.6z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="group relative p-3 bg-slate-700/50 rounded-xl hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm border border-slate-600/30 hover:border-gray-500/50"
              >
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.86-.01-1.68-2.79.6-3.38-1.34-3.38-1.34-.46-1.15-1.12-1.45-1.12-1.45-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.52 2.34 1.08 2.91.83.09-.66.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 .1-2.69.1-.26.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03.82-.23 1.7-.35 2.58-.35.88 0 1.76.12 2.58.35 1.91-1.3 2.75-1.03 2.75-1.03.45 1.38.1 2.39.1 2.65.63.69 1.03 1.59 1.03 2.69 0 3.84-2.34 4.7-4.56 4.95.36.31.68.91.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.17.58.67.48C19.13 20.14 22 16.41 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Venue Verse. All rights
              reserved.
            </div>
            <div className="flex gap-6 text-xs text-slate-400">
              <Link
                to="/privacy"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
