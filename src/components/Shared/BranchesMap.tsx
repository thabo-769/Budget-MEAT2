import { useEffect, useRef } from 'react';
import type { Branch } from '../../types';

// Leaflet CSS + custom pin label styles injected once
let cssInjected = false;
function injectLeafletCss() {
  if (cssInjected) return;
  cssInjected = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.textContent = `
    .bms-branch-label {
      background: #fff;
      border: none;
      border-radius: 999px;
      box-shadow: 0 6px 18px rgba(8, 40, 105, .18), inset 0 0 0 1px #e3e9f2;
      color: #082869;
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .01em;
      padding: 5px 11px;
      white-space: nowrap;
    }
    .bms-branch-label:hover { background: #f8faff; }
  `;
  document.head.appendChild(style);
}

interface BranchesMapProps {
  branches: Branch[];
  /** id of the currently highlighted branch — its popup opens automatically */
  activeBranchId?: string;
}

const BRANCH_COLORS = ['#ed1c2e', '#082869', '#0f6fff'];

export default function BranchesMap({ branches, activeBranchId }: BranchesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<Record<string, import('leaflet').Marker>>({});

  useEffect(() => {
    injectLeafletCss();

    // Dynamically import Leaflet so it doesn't SSR-crash
    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const validBranches = branches.filter((b) => b.lat != null && b.lng != null);
      if (validBranches.length === 0) return;

      const center: [number, number] = [
        validBranches.reduce((s, b) => s + b.lat!, 0) / validBranches.length,
        validBranches.reduce((s, b) => s + b.lng!, 0) / validBranches.length,
      ];

      const map = L.map(containerRef.current, {
        center,
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      // OpenStreetMap tiles — no API key required
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      validBranches.forEach((branch, idx) => {
        const color = BRANCH_COLORS[idx % BRANCH_COLORS.length];

        // Custom pin SVG
        const iconSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26S32 27 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
            <circle cx="16" cy="16" r="7" fill="white"/>
            <text x="16" y="20" font-size="10" font-weight="900" text-anchor="middle" fill="${color}" font-family="sans-serif">${idx + 1}</text>
          </svg>`;

        const icon = L.divIcon({
          html: iconSvg,
          className: '',
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -44],
        });

        const shortName = branch.name.replace('Budget Meat Shop — ', '');
        const mapsQuery = encodeURIComponent(`${branch.address} ${branch.suburb} ${branch.city}`);
        const popup = L.popup({ maxWidth: 220, className: 'bms-popup' }).setContent(`
          <div style="font-family:system-ui,sans-serif;min-width:180px">
            <div style="background:${color};color:#fff;padding:8px 10px;margin:-13px -19px 8px;border-radius:6px 6px 0 0">
              <span style="font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;opacity:.8">Branch ${idx + 1}</span>
              <div style="font-size:13px;font-weight:900;margin-top:2px;line-height:1.2">${shortName}</div>
            </div>
            <p style="font-size:11px;color:#506074;margin:0 0 8px">${branch.address}, ${branch.suburb}</p>
            <a href="https://maps.google.com?q=${mapsQuery}" target="_blank" rel="noopener noreferrer"
              style="display:inline-flex;align-items:center;gap:4px;background:${color};color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:5px 10px;border-radius:4px;text-decoration:none">
              ↗ Get Directions
            </a>
          </div>`);

        const marker = L.marker([branch.lat!, branch.lng!], { icon })
          .addTo(map)
          .bindPopup(popup)
          .bindTooltip(`<span style="color:${color};font-weight:900">${idx + 1}</span> · ${shortName}`, {
            permanent: true,
            direction: 'auto',
            className: 'bms-branch-label',
            offset: [10, -20],
            opacity: 1,
          });
        markersRef.current[branch.id] = marker;
      });

      // Fit all markers in view
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.25));
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open popup when activeBranchId changes
  useEffect(() => {
    if (!activeBranchId || !mapRef.current) return;
    const marker = markersRef.current[activeBranchId];
    if (marker) {
      mapRef.current.setView(marker.getLatLng(), 15, { animate: true });
      marker.openPopup();
    }
  }, [activeBranchId]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-label="Map showing Budget Meat Shop branch locations"
      role="img"
    />
  );
}
