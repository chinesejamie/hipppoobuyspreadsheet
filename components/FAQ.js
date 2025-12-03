'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is CNFans and how does it work?",
      answer: "CNFans is a trusted shopping agent that helps you purchase products from Chinese e-commerce platforms like Taobao, 1688, and Weidian. We handle the entire purchasing process, including ordering, quality inspection, and international shipping to your doorstep. Simply find products on our spreadsheet, click the buy button, and we'll take care of the rest."
    },
    {
      question: "How much can I save shopping through Chinese platforms?",
      answer: "Shopping directly from Chinese platforms can save you 50-80% compared to retail prices in Western countries. Products are sourced directly from manufacturers and wholesalers, eliminating middlemen markups. With CNFans's coupons and discounts, you save even more on already low prices."
    },
    {
      question: "Is it safe to buy from Chinese shopping platforms?",
      answer: "Yes! CNFans provides buyer protection and quality inspection services. We verify products before shipping, handle disputes with sellers, and ensure you receive authentic items. Our platform has successfully processed thousands of orders with a high satisfaction rate and secure payment processing."
    },
    {
      question: "How long does shipping take from China?",
      answer: "Shipping times vary by method: Express shipping (5-10 days), Standard shipping (10-20 days), and Economy shipping (20-40 days). CNFans offers multiple shipping options to balance speed and cost based on your needs. We provide tracking for all shipments."
    },
    {
      question: "What are Taobao, 1688, and Weidian?",
      answer: "Taobao is China's largest consumer marketplace (like eBay), 1688 is Alibaba's wholesale platform for bulk purchases, and Weidian is a mobile-first platform popular for fashion and streetwear. Each platform offers unique products at factory-direct prices. CNFans helps you access all three platforms easily."
    },
    {
      question: "Do I need to speak Chinese to use these platforms?",
      answer: "No! CNFans handles all communication with Chinese sellers for you. Our spreadsheet provides English product descriptions, and our platform translates everything automatically. Simply browse, click buy, and we manage all Chinese language interactions."
    },
    {
      question: "What payment methods does CNFans accept?",
      answer: "CNFans accepts major credit cards, PayPal, and various international payment methods. You pay CNFans directly in your local currency, and we handle the payment to Chinese sellers in Chinese Yuan (CNY). No need for Alipay or WeChat Pay."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Yes, CNFans offers return and exchange services. If products arrive damaged or don't match the description, you can request a return within the specified period. We facilitate communication with sellers and help process refunds. Terms vary by seller and product type."
    },
    {
      question: "Are there additional fees beyond the product price?",
      answer: "The total cost includes: product price, domestic Chinese shipping (to CNFans warehouse), CNFans service fee (typically 5-10%), and international shipping. Some countries charge customs/import duties. We provide transparent pricing calculators before you complete your order."
    },
    {
      question: "How do I get coupon codes and discounts?",
      answer: "Sign up for a free CNFans account to receive welcome coupons, exclusive member discounts, and promotional codes. We regularly offer seasonal sales, bulk purchase discounts, and special deals. Check your account dashboard for available coupons before placing orders."
    },
    {
      question: "What products can I buy from these platforms?",
      answer: "You can buy almost anything: clothing, shoes, accessories, electronics, home goods, beauty products, toys, sports equipment, and more. Some restricted items (weapons, hazardous materials, counterfeit goods) cannot be shipped internationally. CNFans will notify you if any items in your order are restricted."
    },
    {
      question: "How does CNFans Spreadsheet help me find products?",
      answer: "Our curated spreadsheet features thousands of verified products with direct links, accurate descriptions, real images, and price comparisons. We organize products by category, making it easy to discover deals. Each product links directly to CNFans's platform where you can complete your purchase with your invite code for extra savings."
    }
  ];

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C92910]/10 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-[#C92910]" />
            <span className="text-[#C92910] font-semibold text-sm">Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-[#C92910] to-purple-600 bg-clip-text text-transparent">
            Everything You Need to Know
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Get answers to common questions about shopping from Chinese platforms with CNFans
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[#C92910] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Still have questions?</p>
          <a
            href="https://cnfans.com/register?ref=137664"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C92910] to-red-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
          >
            Join CNFans & Get Support
          </a>
        </div>
      </section>
    </>
  );
}
