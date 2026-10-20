import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileCheck, PhoneCall, ArrowRight } from 'lucide-react';

export const WholesaleCTA: React.FC = () => {
  return (
    <section className="py-16 bg-[#0B2B64] text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="inline-block bg-[#E51E2A] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded mb-4">
              B2B Meat Partner
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white">
              Supplying South Africa's Finest Restaurants, Caterers & Institutions
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
              Need reliable, portion-controlled meat cuts delivered weekly or daily at trade pricing? Our commercial butchery division provides custom portion specs, health-certified cold chain delivery, and flexible 30-day billing terms for verified businesses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-blue-100 mb-8">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-400 shrink-0" />
                <span>Custom portioning & vacuum bagging</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-400 shrink-0" />
                <span>Bulk carcass & box discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-red-400 shrink-0" />
                <span>Dedicated trade account representative</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/wholesale"
                className="inline-flex items-center justify-center gap-2 bg-[#E51E2A] hover:bg-[#c91621] text-white font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded shadow-md transition-all active:scale-98"
              >
                Open Wholesale Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded border border-white/30 transition-all"
              >
                Request Quotation
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/20">
            <h3 className="font-bold text-base text-white mb-2 uppercase tracking-wide">
              Quick Wholesale Inquiry
            </h3>
            <p className="text-xs text-blue-100 mb-4">
              Speak directly with our commercial butchery desk.
            </p>
            <div className="space-y-3 text-xs">
              <div className="bg-[#04356e] p-3 rounded border border-blue-400/30">
                <span className="text-gray-300 block text-[10px] uppercase font-bold">Trade Desk Hotline</span>
                <span className="text-white font-bold text-sm">+27 (0)11 888 4322</span>
              </div>
              <div className="bg-[#04356e] p-3 rounded border border-blue-400/30">
                <span className="text-gray-300 block text-[10px] uppercase font-bold">Email Direct</span>
                <span className="text-white font-bold text-sm">wholesale@budgetmeatshop.co.za</span>
              </div>
              <div className="bg-[#04356e] p-3 rounded border border-blue-400/30">
                <span className="text-gray-300 block text-[10px] uppercase font-bold">Coverage Area</span>
                <span className="text-white font-bold text-sm">Greater Gauteng & surrounds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
