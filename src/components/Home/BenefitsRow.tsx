import React from 'react';
import { Sparkles, Truck, DollarSign, Store } from 'lucide-react';

const benefits = [
  {
    icon: Sparkles,
    title: 'Fresh Daily Cuts',
    description: 'A-grade meats prepared daily on-premise by master butchers.',
  },
  {
    icon: Truck,
    title: 'Cold-Chain Delivery',
    description: 'Chilled temperature-controlled delivery preserving peak freshness.',
  },
  {
    icon: DollarSign,
    title: 'Bulk & Family Savings',
    description: 'Direct butcher prices with volume pack discounts for every budget.',
  },
  {
    icon: Store,
    title: 'Express Click & Collect',
    description: 'Order online and collect ready-packed at your nearest branch.',
  },
];

export const BenefitsRow: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex items-start gap-4 hover:border-blue-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#0B2B64] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
