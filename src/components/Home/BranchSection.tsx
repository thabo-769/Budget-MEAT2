import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { branches } from '../../data/branches';
import BranchesMap from '../Shared/BranchesMap';

export const BranchSection = () => (
  <section className="bg-white py-16 sm:py-20">
    <div className="page-shell">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#e8eaed] pb-6 sm:flex-row sm:items-end">
        <div><p className="eyebrow mb-2">Around your corner</p><h2 className="section-heading">Find your local butcher.</h2><p className="mt-2 text-sm text-[#758295]">Three friendly counters across Bulawayo.</p></div>
        <Link to="/branches" className="inline-flex w-fit items-center gap-2 text-xs font-extrabold uppercase tracking-[.07em] text-[#082869] hover:text-[#ed1c2e]">All branch details <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="h-[340px] overflow-hidden rounded-md border border-[#e7e9ec] shadow-[0_10px_28px_rgba(8,40,105,.07)] sm:h-[420px] lg:h-[480px]">
        <BranchesMap branches={branches} />
      </div>
    </div>
  </section>
);
