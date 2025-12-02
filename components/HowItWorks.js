'use client';

import { Search, ShoppingCart, Package, Truck, CheckCircle, Shield } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Explore thousands of curated products from Taobao, 1688, and Weidian on our easy-to-use spreadsheet. Filter by category, search by keyword, and discover amazing deals.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: ShoppingCart,
      title: "Click & Buy",
      description: "Found something you love? Click the buy button to go directly to OOPBuy's secure platform. Use your invite code for instant coupon access and exclusive member pricing.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Package,
      title: "We Handle Everything",
      description: "OOPBuy purchases from the Chinese seller, receives the product at our warehouse, inspects quality, and prepares it for international shipping. No Chinese required!",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Choose your preferred shipping method (express, standard, or economy). Track your package in real-time as it travels from China to your doorstep.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: CheckCircle,
      title: "Enjoy Your Products",
      description: "Receive authentic products at 50-80% off retail prices. Quality guaranteed, buyer protection included. Shop with confidence knowing OOPBuy has your back.",
      color: "from-green-500 to-green-600"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Buyer Protection",
      description: "Quality inspection, dispute resolution, and secure payments"
    },
    {
      icon: Package,
      title: "Factory Direct Prices",
      description: "Save 50-80% compared to retail with wholesale access"
    },
    {
      icon: Truck,
      title: "Worldwide Shipping",
      description: "Multiple shipping options with full tracking to 200+ countries"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF186B]/10 rounded-full mb-4">
            <CheckCircle className="w-5 h-5 text-[#FF186B]" />
            <span className="text-[#FF186B] font-semibold text-sm">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-[#FF186B] to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Shopping from Chinese platforms has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 z-0"
               style={{ width: 'calc(100% - 120px)', left: '60px' }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>

                {/* Step Number */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-700 mb-3 shadow-sm">
                  {index + 1}
                </div>

                {/* Content */}
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Bar */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl shadow-xl border-2 border-[#FF186B]/20 p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF186B] to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://oopbuy.com/register?inviteCode=DMP60XRTF"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF186B] via-pink-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-base sm:text-lg"
          >
            Start Shopping Now - Get Coupons!
          </a>
        </div>
      </div>
    </section>
  );
}
