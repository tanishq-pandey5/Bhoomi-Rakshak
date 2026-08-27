import React from 'react';
import { Shield, Mountain } from 'lucide-react';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="border-t border-white/10 bg-bgDark py-10 mt-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Top: Logo & Info */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-tealAccent/20 border border-tealAccent/30 text-tealAccent">
                <Mountain className="w-4 h-4 absolute z-10 translate-y-[-1px]" />
                <Shield className="w-5 h-5 opacity-60" />
              </div>
              <span className="text-sm font-extrabold text-textWhite uppercase tracking-wider">
                Bhoomi Rakshak
              </span>
            </div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              An AI-powered 72-hour landslide hazard prediction and geomechanical early-warning decision support platform.
            </p>
            <p className="text-[10px] text-textMuted tracking-wider font-semibold uppercase">
              Tagline: “Early Signals. Safer Hills.”
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-textWhite uppercase text-[10px] tracking-wider">Platform</span>
              <button onClick={() => onScrollTo('dashboard')} className="text-left text-textMuted hover:text-tealAccent transition-colors">Dashboard</button>
              <button onClick={() => onScrollTo('risk-map')} className="text-left text-textMuted hover:text-tealAccent transition-colors">Interactive Map</button>
              <button onClick={() => onScrollTo('alerts')} className="text-left text-textMuted hover:text-tealAccent transition-colors">Threat Alerts</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-textWhite uppercase text-[10px] tracking-wider">Research</span>
              <button onClick={() => onScrollTo('methodology')} className="text-left text-textMuted hover:text-tealAccent transition-colors">Our Methodology</button>
              <span className="text-textMuted cursor-default">Satellite Telemetry</span>
              <span className="text-textMuted cursor-default">Geotech IoT Docs</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-textWhite uppercase text-[10px] tracking-wider">Collaboration</span>
              <span className="text-textMuted cursor-default">Smart India Hackathon</span>
              <span className="text-textMuted cursor-default">Technical Contact</span>
              <span className="text-textMuted cursor-default">Prototype Disclaimer</span>
            </div>
          </div>

        </div>

        {/* Middle: Disclaimer Panel */}
        <div className="p-4 rounded-xl border border-saffronAccent/20 bg-saffronAccent/5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-saffronAccent uppercase tracking-wide">
            IMPORTANT PROTOTYPE DISCLAIMER
          </span>
          <p className="text-[11px] text-textMuted leading-relaxed">
            This dashboard is a research and decision-support prototype built for presentation purposes (Smart India Hackathon). All risk parameters, forecast values, and localized threat warnings are simulated using realistic geomechanical baseline profiles. Always verify current weather conditions and official safety advisories with the Geological Survey of India (GSI) and local disaster management authorities (NDMA/SDMA) before travel or emergency response.
          </p>
        </div>

        {/* Bottom: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6 text-[11px] text-textMuted">
          <span>
            © {new Date().getFullYear()} Bhoomi Rakshak Project. Developed under Open-Source Climate-Tech Initiative.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-textWhite cursor-pointer">Privacy Policy</span>
            <span className="hover:text-textWhite cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
