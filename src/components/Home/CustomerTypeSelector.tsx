import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Building2, ArrowRight, Check } from 'lucide-react';

export const CustomerTypeSelector: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-xl border border-gray-100">
          {/* Left Block: Retail Customers (Red) */}
          <div className="bg-[#E51E2A] text-white p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-red-200">
                    Individual & Household
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Retail Butchery
                  </h2>
                </div>
              </div>

              <p className="text-sm text-red-50 mb-6 leading-relaxed">
                Order fresh meat cuts for your weekly dinners, weekend family braais, and special occasions. Cut fresh daily by our skilled butchers, vacuum packed or tray-wrapped to preserve maximum tenderness.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-xs font-semibold text-red-100">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>No minimum order required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Doorstep chilled delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Money-saving bulk meat packs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Free delivery on orders over R500</span>
                </div>
              </div>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-[#E51E2A] hover:bg-red-50 font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded shadow-md transition-all active:scale-98"
            >
              Shop Retail Cuts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Block: Wholesale & Business (Blue) */}
          <div className="bg-[#0B2B64] text-white p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
                    B2B & Food Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Wholesale & Supply
                  </h2>
                </div>
              </div>

              <p className="text-sm text-blue-50 mb-6 leading-relaxed">
                Tailored meat supply solutions for restaurants, takeaway venues, caterers, schools, and local grocers. Enjoy wholesale tier pricing, customized portioning, and scheduled cold chain logistics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-xs font-semibold text-blue-100">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Wholesale bulk tier pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Consistent specification cuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Scheduled refrigerated drops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedicated trade account manager</span>
                </div>
              </div>
            </div>

            <Link
              to="/wholesale"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-[#0B2B64] hover:bg-blue-50 font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded shadow-md transition-all active:scale-98"
            >
              Apply For Trade Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
