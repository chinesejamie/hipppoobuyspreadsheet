'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Percent, TrendingDown, Shield, Sparkles } from 'lucide-react';

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal was shown recently (within last 24 hours)
    const lastShown = localStorage.getItem('signupModalLastShown');
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (lastShown && now - parseInt(lastShown) < oneDayInMs) {
      return; // Don't show if shown in last 24 hours
    }

    // Show modal after 15 seconds OR after user scrolls down 30%
    let timeoutId;
    let hasShown = false;

    const showModal = () => {
      if (!hasShown) {
        hasShown = true;
        setIsOpen(true);
        localStorage.setItem('signupModalLastShown', now.toString());
      }
    };

    // Timer: show after 15 seconds
    timeoutId = setTimeout(showModal, 15000);

    // Scroll: show after scrolling 30% down
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 30) {
        showModal();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 animate-slideUp">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#FF186B]/20 via-pink-200 to-purple-200 -z-10" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF186B] to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 bg-gradient-to-r from-[#FF186B] to-purple-600 bg-clip-text text-transparent">
              Get Exclusive Coupons!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Sign up now and unlock amazing discounts on all your purchases
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF186B]/10 flex items-center justify-center flex-shrink-0">
                  <Percent className="w-5 h-5 text-[#FF186B]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Instant Coupon Codes</h3>
                  <p className="text-sm text-gray-600">Save money on every order with exclusive discounts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Lower Prices</h3>
                  <p className="text-sm text-gray-600">Get access to member-only deals and promotions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Safe & Trusted</h3>
                  <p className="text-sm text-gray-600">Shop with confidence on OOPBuy's secure platform</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="https://oopbuy.com/register?inviteCode=DMP60XRTF"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF186B] via-pink-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg mb-3"
              onClick={handleClose}
            >
              <Sparkles className="w-6 h-6" />
              Sign Up Now - It's Free!
            </a>

            {/* Skip link */}
            <button
              onClick={handleClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
