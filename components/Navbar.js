'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Package, Zap, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || !isHomePage
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#e94560] flex items-center justify-center shadow-lg group-hover:shadow-[#3B82F6]/30 transition-all duration-300 group-hover:scale-110">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className={`text-lg font-black transition-colors ${
                scrolled || !isHomePage ? 'text-[#16213e]' : 'text-white'
              }`}>
                HipoBuy
              </span>
              <span className={`text-xs block -mt-1 transition-colors ${
                scrolled || !isHomePage ? 'text-gray-500' : 'text-white/70'
              }`}>
                Spreadsheet
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                scrolled || !isHomePage
                  ? 'text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Products
            </Link>
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                scrolled || !isHomePage
                  ? 'text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Guides
            </Link>
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                scrolled || !isHomePage
                  ? 'text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              HipoBuy
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-2.5 text-white rounded-xl font-semibold text-sm inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Sign Up Free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-all ${
              scrolled || !isHomePage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 font-medium transition-all"
            >
              Products
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 font-medium transition-all"
            >
              Shopping Guides
            </Link>
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 rounded-xl text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 font-medium transition-all"
            >
              Visit HipoBuy
            </a>
            <div className="pt-2">
              <a
                href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn-primary px-6 py-3 text-white rounded-xl font-semibold text-center"
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
