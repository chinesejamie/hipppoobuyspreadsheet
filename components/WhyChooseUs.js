'use client';

import { Percent, Globe, Shield, Zap, HeartHandshake, TrendingDown, Clock, Award } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Percent,
      title: "Save 50-80% Off Retail",
      description: "Access factory-direct prices from Chinese manufacturers and wholesalers. No middlemen means massive savings on authentic products.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: Shield,
      title: "Buyer Protection Guaranteed",
      description: "Quality inspection before shipping, secure payments, dispute resolution, and full refund policy. Shop with complete confidence.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Globe,
      title: "Ships to 200+ Countries",
      description: "Worldwide shipping with multiple delivery options. Track your package every step of the way from China to your doorstep.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: Zap,
      title: "Fast & Easy Process",
      description: "No Chinese language needed. Click buy, we handle everything: ordering, inspection, packaging, and international shipping.",
      gradient: "from-yellow-400 to-orange-600"
    },
    {
      icon: TrendingDown,
      title: "Exclusive Coupon Codes",
      description: "Sign up for instant access to member-only discounts, seasonal sales, and promotional codes. Save even more on already low prices.",
      gradient: "from-pink-400 to-pink-600"
    },
    {
      icon: HeartHandshake,
      title: "Trusted by Thousands",
      description: "Join our community of satisfied customers worldwide. Rated highly for service quality, product authenticity, and customer support.",
      gradient: "from-red-400 to-red-600"
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Our dedicated support team is here to help with orders, tracking, and questions. Multi-language support available.",
      gradient: "from-indigo-400 to-indigo-600"
    },
    {
      icon: Award,
      title: "Authentic Products Only",
      description: "We verify sellers and inspect products for quality and authenticity. Say no to counterfeits with our rigorous quality control.",
      gradient: "from-cyan-400 to-cyan-600"
    }
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF186B]/10 rounded-full mb-4">
            <Award className="w-5 h-5 text-[#FF186B]" />
            <span className="text-[#FF186B] font-semibold text-sm">Why Choose OOPBuy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-[#FF186B] to-purple-600 bg-clip-text text-transparent">
            Your Trusted Chinese Shopping Agent
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            We make international shopping simple, safe, and affordable. Discover why thousands choose OOPBuy for their Chinese marketplace purchases.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-[#FF186B]/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 bg-gradient-to-r from-[#FF186B] via-pink-600 to-purple-600 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center text-white">
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">50-80%</div>
              <div className="text-white/90 text-sm sm:text-base font-medium">Average Savings</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">200+</div>
              <div className="text-white/90 text-sm sm:text-base font-medium">Countries Shipped</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">1M+</div>
              <div className="text-white/90 text-sm sm:text-base font-medium">Products Available</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">24/7</div>
              <div className="text-white/90 text-sm sm:text-base font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
