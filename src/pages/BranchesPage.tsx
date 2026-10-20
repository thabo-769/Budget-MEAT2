import { useState } from 'react';
import { Clock3, Mail, MapPin, Navigation, Phone, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { branches } from '../data/branches';
import BranchesMap from '../components/Shared/BranchesMap';

export const BranchesPage = () => {
  const [activeBranchId, setActiveBranchId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] py-9 sm:py-14">
      <div className="page-shell">
        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow mb-2">Good cuts close to home</p>
          <h1 className="page-title">Find your local butcher.</h1>
          <p className="mt-3 text-sm leading-6 text-[#758295]">
            Visit one of our Bulawayo branches, call ahead, or choose a pickup location when you order online.
          </p>
        </div>

        {/* ── Interactive Map ─────────────────────────────────────── */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-[#dde4f0] shadow-[0_8px_32px_rgba(8,40,105,.10)]">
          {/* Map legend bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[#e3eaf5] bg-white px-5 py-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#082869]">
              Our Branches
            </span>
            <div className="flex flex-wrap gap-3">
              {branches.map((branch, idx) => {
                const colors = ['#ed1c2e', '#082869', '#0f6fff'];
                const color = colors[idx % colors.length];
                const shortName = branch.name.replace('Budget Meat Shop — ', '');
                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setActiveBranchId(branch.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition hover:shadow-sm"
                    style={{
                      borderColor: activeBranchId === branch.id ? color : '#dde4f0',
                      color: activeBranchId === branch.id ? color : '#506074',
                      background: activeBranchId === branch.id ? `${color}14` : 'white',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                      style={{ background: color }}
                    >
                      {idx + 1}
                    </span>
                    {shortName}
                  </button>
                );
              })}
            </div>
            <span className="ml-auto text-[10px] text-[#9aa6b3]">Click a pin to see details</span>
          </div>

          {/* Map canvas */}
          <div className="h-[380px] sm:h-[460px]">
            <BranchesMap branches={branches} activeBranchId={activeBranchId} />
          </div>
        </div>

        {/* ── Branch Cards ────────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch, index) => (
            <article
              key={branch.id}
              id={`branch-card-${branch.id}`}
              onClick={() => setActiveBranchId(branch.id)}
              className={`flex cursor-pointer flex-col overflow-hidden rounded-md border bg-white shadow-[0_4px_20px_rgba(8,40,105,.035)] transition-all duration-200 ${
                activeBranchId === branch.id
                  ? 'border-[#082869] ring-2 ring-[#082869]/20'
                  : 'border-[#e5e7e9] hover:border-[#bbc4d5]'
              }`}
            >
              <div className="relative h-36 bg-[#082869] sm:h-40">
                <img
                  src={
                    index === 0
                      ? '/images/hero_cutting_board.jpg'
                      : index === 1
                        ? '/images/category_processed.jpg'
                        : '/images/category_beef.jpg'
                  }
                  alt=""
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061b50]/80 to-transparent" />
                <span className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-white">
                  <Store className="h-3.5 w-3.5 text-[#ed1c2e]" />
                  Bulawayo branch {index + 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className="font-display text-2xl leading-tight text-[#082869]">
                  {branch.name.replace('Budget Meat Shop — ', '')}
                </h2>
                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#687789]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ed1c2e]" />
                  {branch.address}, {branch.suburb}, {branch.city}
                </p>

                <div className="mt-4 space-y-2 border-t border-[#eceef0] pt-4">
                  <a
                    href={`tel:${branch.phone.replaceAll(' ', '')}`}
                    className="flex items-center gap-2 text-xs font-semibold text-[#506074] hover:text-[#ed1c2e]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3.5 w-3.5 text-[#082869]" />
                    {branch.phone}
                  </a>
                  {branch.email && (
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-2 break-all text-xs font-semibold text-[#506074] hover:text-[#ed1c2e]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#082869]" />
                      {branch.email}
                    </a>
                  )}
                </div>

                <div className="mt-4 rounded bg-[#f6f9ff] p-3.5">
                  <h3 className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-[#34465c]">
                    <Clock3 className="h-3.5 w-3.5 text-[#082869]" />
                    Trading hours
                  </h3>
                  <div className="space-y-1">
                    {branch.hours.map((hours) => (
                      <div key={hours.day} className="flex justify-between gap-2 text-[10px] text-[#758295]">
                        <span>{hours.day}</span>
                        <strong className="text-[#506074]">
                          {hours.closed ? 'Closed' : `${hours.open}–${hours.close}`}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-[#34465c]">
                    At this branch
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {branch.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full bg-[#edf2fb] px-2.5 py-1 text-[9px] font-semibold text-[#506074]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-2 pt-5">
                  <Link
                    to={`/shop?branch=${branch.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        localStorage.setItem('bms_selected_branch', branch.id);
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded bg-[#082869] px-3 text-[10px] font-extrabold uppercase tracking-[.05em] !text-white hover:bg-[#061b50]"
                  >
                    Shop for pickup
                  </Link>
                  <a
                    href={`https://maps.google.com?q=${encodeURIComponent(`${branch.address} ${branch.suburb} ${branch.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${branch.name} in Maps`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded border border-[#dfe3e8] px-3 text-[10px] font-extrabold uppercase tracking-[.05em] text-[#506074] hover:border-[#082869]"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Map
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
