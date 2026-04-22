import aivideo from "@/assets/apps/aivideo.jpeg";
import freecine from "@/assets/apps/freecine.jpeg";
import loktv from "@/assets/apps/loktv.jpeg";
import youtube from "@/assets/apps/youtube.png";
import spotify from "@/assets/apps/spotify.png";
import deezer from "@/assets/apps/deezer.jpeg";
import gamebase from "@/assets/apps/gamebase.jpg";
import capcut from "@/assets/apps/capcut.jpg";

export type App = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  version: string;
  size: string;
  category: string;
  rating: number;
  downloads: string;
  addedAt: string; // ISO
  url: string;
  features: string[];
  accent: string; // tailwind-friendly tint label
};

export const apps: App[] = [
  {
    id: "ai-video-generator",
    name: "AI Video Generator",
    tagline: "Turn text & photos into stunning videos",
    description:
      "Create cinematic videos from a single prompt. AI Video Generator Premium unlocks 4K export, unlimited renders, no watermark, and access to every premium template and voice.",
    icon: aivideo,
    version: "1.7.5",
    size: "78 MB",
    category: "AI / Video",
    rating: 4.8,
    downloads: "1M+",
    addedAt: "2025-04-18",
    url: "https://www.mediafire.com/file/fxwctd6olmiqvw0/AI_Video_Generator_Premium_v1.7.5.apk/file",
    features: ["4K export", "No watermark", "Unlimited renders", "All premium voices", "Priority AI servers"],
    accent: "from-fuchsia-500 to-blue-500",
  },
  {
    id: "freecine",
    name: "FreeCine VIP",
    tagline: "Movies & series, ad-free",
    description:
      "Stream thousands of movies and TV series in HD. The VIP build removes all ads, unlocks 1080p streaming, multi-subtitle support and offline downloads.",
    icon: freecine,
    version: "3.0.3",
    size: "45 MB",
    category: "Streaming",
    rating: 4.7,
    downloads: "5M+",
    addedAt: "2025-04-15",
    url: "https://www.mediafire.com/file/k53yraaon1kbahy/FreeCine_v3.0.3_VIP.apk/file",
    features: ["Ad-free", "1080p HD streaming", "Offline downloads", "Multi-subtitles", "Cast to TV"],
    accent: "from-orange-500 to-pink-500",
  },
  {
    id: "loktv",
    name: "LOKTV VIP",
    tagline: "Asian dramas & blockbusters",
    description:
      "LOKTV VIP brings unlimited Asian dramas, anime and movies with no ads. Unlocks dubbed audio tracks, HD quality and download-for-offline anywhere.",
    icon: loktv,
    version: "1.9.1",
    size: "52 MB",
    category: "Streaming",
    rating: 4.6,
    downloads: "2M+",
    addedAt: "2025-04-12",
    url: "https://www.mediafire.com/file/iqycmojg6zh5opc/LOKTV_VIP_v1.9.1_%2528com.hecate.phantom%2529.apk/file",
    features: ["No ads", "Dubbed tracks", "HD quality", "Offline mode", "Continue watching"],
    accent: "from-purple-500 to-blue-500",
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    tagline: "Background play, no ads",
    description:
      "The premium YouTube experience: zero ads, background playback, picture-in-picture and offline downloads — fully unlocked.",
    icon: youtube,
    version: "5.6.80.12",
    size: "92 MB",
    category: "Video",
    rating: 4.9,
    downloads: "10M+",
    addedAt: "2025-04-20",
    url: "https://www.mediafire.com/file/6fsaaizzr0mf2nh/Y0uTub3_%25E2%2582%25B1r3m1um_v5.6.80.12.apk/file",
    features: ["Ad-free playback", "Background play", "Picture-in-picture", "Offline downloads", "4K support"],
    accent: "from-red-500 to-rose-500",
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    tagline: "Unlimited music, no ads",
    description:
      "Listen to millions of songs and podcasts ad-free. Premium unlocks unlimited skips, offline mode, high-quality streaming and on-demand playback.",
    icon: spotify,
    version: "9.1.40.1486",
    size: "68 MB",
    category: "Music",
    rating: 4.9,
    downloads: "20M+",
    addedAt: "2025-04-19",
    url: "https://www.mediafire.com/file/gunitmt1jtu026c/%2524p0tify_%25E2%2582%25B1remium_v9.1.40.1486.apk/file",
    features: ["Ad-free", "Unlimited skips", "Offline mode", "High-quality 320kbps", "On-demand play"],
    accent: "from-emerald-500 to-green-600",
  },
  {
    id: "deezer-premium",
    name: "Deezer Premium",
    tagline: "HiFi music, everywhere",
    description:
      "Stream over 90 million tracks in HiFi quality. Deezer Premium offers unlimited downloads, no ads, lyrics and Flow personalised radio.",
    icon: deezer,
    version: "9.0.12.2",
    size: "61 MB",
    category: "Music",
    rating: 4.7,
    downloads: "8M+",
    addedAt: "2025-04-10",
    url: "https://www.mediafire.com/file/c1dgwz83tdhbjwl/Deezer_Premium_v9.0.12.2.apk/file",
    features: ["HiFi audio", "Offline downloads", "Ad-free", "Live lyrics", "Flow radio"],
    accent: "from-purple-600 to-fuchsia-500",
  },
  {
    id: "gamebase",
    name: "GameBase+",
    tagline: "Premium games hub",
    description:
      "GameBase+ is your launcher for premium and modded games. Browse curated titles, install with one tap and get exclusive unlocked content.",
    icon: gamebase,
    version: "April 15",
    size: "34 MB",
    category: "Gaming",
    rating: 4.5,
    downloads: "500K+",
    addedAt: "2025-04-15",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Curated games", "1-tap install", "Mod support", "Auto-update", "No ads"],
    accent: "from-violet-500 to-blue-600",
  },
  {
    id: "capcut-premium",
    name: "CapCut Premium",
    tagline: "Pro video editor unlocked",
    description:
      "Edit like a pro. CapCut Premium unlocks all effects, filters, fonts, premium templates, AI tools and exports without watermark.",
    icon: capcut,
    version: "19.9.0",
    size: "210 MB",
    category: "Video Editor",
    rating: 4.8,
    downloads: "15M+",
    addedAt: "2025-04-17",
    url: "https://www.mediafire.com/file/yct8x3rrsde9xrs/CapCut_Premium_Apps_Free_19.9.0.apk/file",
    features: ["No watermark", "All effects unlocked", "Premium templates", "AI tools", "4K export"],
    accent: "from-pink-500 to-indigo-500",
  },
];

export const findApp = (id: string) => apps.find((a) => a.id === id);
