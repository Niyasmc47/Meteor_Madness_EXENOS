// frontend/src/components/SocialShare.jsx
import React, { useState } from 'react';

function SocialShare({ impactData, targetLocation }) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!impactData || !targetLocation) return null;

  const generateShareText = () => {
    const { simulation_results } = impactData;
    const impactType = simulation_results.impact_type;
    
    let text = `🌍 I just simulated an asteroid impact on Earth! 🌠\n\n`;
    text += `📍 Location: ${targetLocation.lat.toFixed(2)}°, ${targetLocation.lng.toFixed(2)}°\n`;
    text += `☄️ Asteroid: ${impactData.asteroid_details.name}\n`;
    text += `📏 Size: ${impactData.asteroid_details.diameter_m}m diameter\n`;
    text += `⚡ Speed: ${impactData.asteroid_details.velocity_kps} km/s\n`;
    text += `💥 Energy: ${simulation_results.page_1_overview.impact_energy_gt} Gigatons TNT\n\n`;
    
    if (impactType === 'land') {
      text += `🏔️ LAND IMPACT:\n`;
      text += `Crater: ${simulation_results.page_2_crater.diameter_km} km wide\n`;
      text += `Seismic: ${simulation_results.page_5_seismic.magnitude} magnitude earthquake\n`;
    } else {
      text += `🌊 WATER IMPACT:\n`;
      text += `Tsunami: ${simulation_results.page_2_tsunami.initial_wave_height_m}m wave\n`;
      text += `Danger zone: ${simulation_results.page_2_tsunami.near_source_danger_zone_radius_km} km\n`;
    }
    
    text += `\n🎮 Try it yourself: Meteor Madness - NASA Space Apps Challenge 2025`;
    return text;
  };

  const generateHashtags = () => {
    return [
      'MeteorMadness',
      'NASASpaceApps',
      'SpaceApps2025',
      'AsteroidImpact',
      'PlanetaryDefense',
      'SaveEarth',
      'SpaceScience'
    ];
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    const hashtags = encodeURIComponent(generateHashtags().join(','));
    const url = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(generateShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToReddit = () => {
    const title = encodeURIComponent('I simulated an asteroid impact on Earth!');
    const text = encodeURIComponent(generateShareText());
    const url = `https://reddit.com/submit?title=${title}&text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    // In a full implementation, this would capture a screenshot
    // of the impact visualization using html2canvas or similar
    alert('📸 Screenshot feature coming soon! For now, use your device\'s screenshot tool.');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="w-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 border border-pink-500/40 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
      >
        <span>📤</span>
        <span>Share Results</span>
      </button>

      {showShare && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-pink-500/40 shadow-2xl z-50 animate-in slide-in-from-bottom-4">
          <h4 className="text-sm font-bold text-pink-300 mb-3">Share Your Impact Simulation</h4>
          
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={shareToTwitter}
              className="bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/40 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>🐦</span>
              <span>Twitter</span>
            </button>
            
            <button
              onClick={shareToFacebook}
              className="bg-[#4267B2]/20 hover:bg-[#4267B2]/30 border border-[#4267B2]/40 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>📘</span>
              <span>Facebook</span>
            </button>
            
            <button
              onClick={shareToLinkedIn}
              className="bg-[#0077B5]/20 hover:bg-[#0077B5]/30 border border-[#0077B5]/40 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>💼</span>
              <span>LinkedIn</span>
            </button>
            
            <button
              onClick={shareToReddit}
              className="bg-[#FF4500]/20 hover:bg-[#FF4500]/30 border border-[#FF4500]/40 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>🤖</span>
              <span>Reddit</span>
            </button>
          </div>

          {/* Copy & Download */}
          <div className="space-y-2">
            <button
              onClick={copyToClipboard}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            
            <button
              onClick={downloadImage}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>📸</span>
              <span>Download Screenshot</span>
            </button>
          </div>

          {/* Hashtags */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">Suggested hashtags:</p>
            <div className="flex flex-wrap gap-1">
              {generateHashtags().map((tag) => (
                <span key={tag} className="text-xs bg-pink-600/20 text-pink-300 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowShare(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default SocialShare;
