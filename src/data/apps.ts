import aivideo from "@/assets/apps/aivideo.jpeg";
import tagdubtv from "@/assets/apps/tagdubtv.jpeg";
import freecine from "@/assets/apps/freecine.jpeg";
import loktv from "@/assets/apps/loktv.jpeg";
import youtube from "@/assets/apps/youtube.png";
import spotify from "@/assets/apps/spotify.png";
import deezer from "@/assets/apps/deezer.jpeg";
import gamebase from "@/assets/apps/gamebase.jpg";
import capcut from "@/assets/apps/capcut.jpg";
import turbovpn from "@/assets/apps/turbovpn.png";
import pixlab from "@/assets/apps/pixlab.png";
import nekogram from "@/assets/apps/nekogram.png";
import tunegrab from "@/assets/apps/tunegrab.png";
import subwayrun from "@/assets/apps/subwayrun.png";
import stickhero from "@/assets/apps/stickhero.png";
import towerdefense from "@/assets/apps/towerdefense.png";
import driftlegends from "@/assets/apps/driftlegends.png";
import shadowknight from "@/assets/apps/shadowknight.png";
import blockcraft from "@/assets/apps/blockcraft.png";
import discord from "@/assets/apps/discord.png";
import instagram from "@/assets/apps/instagram.png";
import tiktok from "@/assets/apps/tiktok.png";
import asphalt from "@/assets/apps/asphalt.png";
import candyblast from "@/assets/apps/candyblast.png";
import sniper from "@/assets/apps/sniper.png";
import messenger from "@/assets/apps/messenger.png";

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
    id: "tagdubtv-tagalog",
    name: "TagDubTV",
    tagline: "Tagalog dubbed movies & series, ad-free",
    description:
      "Panoorin ang libu-libong pelikula at serye na fully Tagalog dubbed — walang ads, walang bayad. Premium build na may HD streaming, offline downloads, at smooth playback kahit sa mahinang internet. Perfect para sa mga Pinoy na gustong mag-binge ng paborito nilang K-drama, anime, at Hollywood films sa sariling wika.",
    icon: tagdubtv,
    version: "1.0.7",
    size: "28 MB",
    category: "Streaming",
    rating: 4.8,
    downloads: "500K+",
    addedAt: "2026-04-24",
    url: "https://www.mediafire.com/file/s01fx7r85a6nsjg/TagdubPH_1.0.7_BienMods.apk/file",
    features: ["Ad-free streaming", "HD quality unlocked", "Tagalog dubbed library", "Offline downloads", "Lightweight & fast"],
    accent: "from-rose-500 to-orange-500",
  },
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
  {
    id: "turbovpn-pro",
    name: "TurboVPN Pro",
    tagline: "Fast & secure VPN, premium unlocked",
    description:
      "Browse safely with unlimited bandwidth, 100+ server locations and zero logs. Pro unlocks all premium servers, ad-free experience and high-speed streaming optimized for Netflix and YouTube.",
    icon: turbovpn,
    version: "4.2.1",
    size: "22 MB",
    category: "Tools",
    rating: 4.6,
    downloads: "3M+",
    addedAt: "2026-04-26",
    url: "https://www.mediafire.com/file/fxwctd6olmiqvw0/AI_Video_Generator_Premium_v1.7.5.apk/file",
    features: ["Unlimited bandwidth", "100+ servers", "No-logs policy", "Ad-free", "Streaming optimized"],
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: "pixlab-pro",
    name: "PixLab Pro",
    tagline: "All-in-one photo editor unlocked",
    description:
      "Edit photos like a pro with AI-powered tools, background remover, sky replacement, and over 200 premium filters. Pro removes watermarks and unlocks every effect, font and template.",
    icon: pixlab,
    version: "8.5.2",
    size: "84 MB",
    category: "Photography",
    rating: 4.7,
    downloads: "6M+",
    addedAt: "2026-04-25",
    url: "https://www.mediafire.com/file/k53yraaon1kbahy/FreeCine_v3.0.3_VIP.apk/file",
    features: ["AI background remover", "200+ premium filters", "No watermark", "Sky replacement", "Pro fonts & stickers"],
    accent: "from-pink-500 to-yellow-500",
  },
  {
    id: "nekogram-x",
    name: "NekoGram X",
    tagline: "Telegram mod, faster & customizable",
    description:
      "A powerful Telegram client with extra privacy options, custom themes, hidden chats, ghost mode, and unlimited file forwarding. Lightweight and faster than the official app.",
    icon: nekogram,
    version: "10.6.5",
    size: "48 MB",
    category: "Communication",
    rating: 4.8,
    downloads: "2M+",
    addedAt: "2026-04-24",
    url: "https://www.mediafire.com/file/iqycmojg6zh5opc/LOKTV_VIP_v1.9.1_%2528com.hecate.phantom%2529.apk/file",
    features: ["Ghost mode", "Custom themes", "Hidden chats", "Unlimited forwarding", "No ads"],
    accent: "from-sky-500 to-indigo-500",
  },
  {
    id: "tunegrab",
    name: "TuneGrab",
    tagline: "Download music from anywhere",
    description:
      "Search and download high-quality MP3 tracks from millions of songs. TuneGrab supports lyrics, playlists, offline listening and a built-in player — all completely ad-free.",
    icon: tunegrab,
    version: "3.4.0",
    size: "18 MB",
    category: "Music",
    rating: 4.5,
    downloads: "1M+",
    addedAt: "2026-04-23",
    url: "https://www.mediafire.com/file/gunitmt1jtu026c/%2524p0tify_%25E2%2582%25B1remium_v9.1.40.1486.apk/file",
    features: ["320kbps MP3", "Lyrics support", "Built-in player", "Offline mode", "Ad-free"],
    accent: "from-fuchsia-500 to-purple-600",
  },
  // ─── Offline modded games ─────────────────────────────────────────────
  {
    id: "subway-run-mod",
    name: "Subway Run MOD",
    tagline: "Endless runner · unlimited coins & keys",
    description:
      "Tumakbo nang walang katapusan sa subway tracks ng buong mundo. MOD version na may unlimited coins, keys, at lahat ng characters/hoverboards naka-unlock. 100% offline — walang ads, walang in-app purchase.",
    icon: subwayrun,
    version: "3.18.2",
    size: "156 MB",
    category: "Games",
    rating: 4.7,
    downloads: "1B+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited coins", "Unlimited keys", "All characters unlocked", "All boards unlocked", "100% offline"],
    accent: "from-orange-500 to-red-500",
  },
  {
    id: "stick-hero-mod",
    name: "Stick Hero MOD",
    tagline: "Stickman action RPG · god mode",
    description:
      "Epic stickman warrior battles with smooth combos and devastating combos. MOD unlocks god mode, one-hit kill, unlimited gems and all weapons. Fully offline kaya pwedeng laruin kahit walang internet.",
    icon: stickhero,
    version: "1.6.4",
    size: "98 MB",
    category: "Games",
    rating: 4.6,
    downloads: "50M+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["God mode", "One-hit kill", "Unlimited gems", "All weapons unlocked", "Offline play"],
    accent: "from-indigo-500 to-purple-600",
  },
  {
    id: "tower-defense-pro",
    name: "Tower Defense Pro MOD",
    tagline: "Pop balloons · all towers unlocked",
    description:
      "Strategic tower defense kung saan pop-popin mo ang lahat ng balloons. MOD version with unlimited monkey money, all heroes unlocked, and free upgrades. Pure offline gameplay para makapag-grind kahit walang signal.",
    icon: towerdefense,
    version: "40.3",
    size: "112 MB",
    category: "Games",
    rating: 4.8,
    downloads: "10M+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited money", "All heroes unlocked", "Free upgrades", "All maps", "Offline mode"],
    accent: "from-green-500 to-lime-500",
  },
  {
    id: "drift-legends",
    name: "Drift Legends MOD",
    tagline: "Realistic drifting · all cars unlocked",
    description:
      "Karera at drift sa pinakamagagandang sports cars. MOD nagbibigay ng unlimited money, all cars at tracks unlocked, no ads, at premium upgrades nang libre. Single-player mode kaya offline-friendly.",
    icon: driftlegends,
    version: "1.9.6",
    size: "245 MB",
    category: "Games",
    rating: 4.5,
    downloads: "5M+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited money", "All cars unlocked", "All tracks", "Free upgrades", "No ads"],
    accent: "from-pink-500 to-rose-600",
  },
  {
    id: "shadow-knight-rpg",
    name: "Shadow Knight RPG MOD",
    tagline: "Dark fantasy action RPG · mega menu",
    description:
      "Pumasok sa mundo ng shadow knights at lumaban sa mga demonyo. MOD may mega menu — god mode, unlimited mana, one-hit kill, free shopping at all skins unlocked. Pwedeng laruin offline.",
    icon: shadowknight,
    version: "3.24.110",
    size: "188 MB",
    category: "Games",
    rating: 4.7,
    downloads: "20M+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Mega menu", "God mode", "One-hit kill", "Free shopping", "All skins unlocked"],
    accent: "from-red-600 to-purple-700",
  },
  {
    id: "block-craft-world",
    name: "Block Craft World MOD",
    tagline: "Sandbox builder · unlimited resources",
    description:
      "Mag-build ng kahit anong gusto mo sa infinite blocky world. MOD bersyon may unlimited resources, all blocks unlocked, premium skins libre, at survival mode na walang hunger. Fully offline sandbox fun.",
    icon: blockcraft,
    version: "2.6.18",
    size: "135 MB",
    category: "Games",
    rating: 4.6,
    downloads: "100M+",
    addedAt: "2026-04-27",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited resources", "All blocks unlocked", "Premium skins free", "No hunger", "Creative + survival"],
    accent: "from-sky-500 to-emerald-500",
  },
  // ─── Socials & Communication ─────────────────────────────────────────
  {
    id: "discord-nitro",
    name: "Discord Nitro",
    tagline: "Voice, video & chat — Nitro unlocked",
    description:
      "Premium Discord experience with Nitro perks: HD streaming, larger uploads, animated avatars, custom emojis everywhere, and boosted server perks. Lightweight build optimized for Android.",
    icon: discord,
    version: "212.16",
    size: "84 MB",
    category: "Socials",
    rating: 4.8,
    downloads: "100M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/iqycmojg6zh5opc/LOKTV_VIP_v1.9.1_%2528com.hecate.phantom%2529.apk/file",
    features: ["HD streaming", "100MB uploads", "Animated avatars", "Custom emojis", "Server boosts"],
    accent: "from-indigo-500 to-purple-600",
  },
  {
    id: "instagram-pro",
    name: "Instagram Pro",
    tagline: "IG with downloads & no ads",
    description:
      "Modded Instagram na may built-in story, reel, at post downloader. Walang ads, may ghost mode, copy captions, at zoom sa profile pictures. Perfect para sa content curators.",
    icon: instagram,
    version: "324.0.10",
    size: "76 MB",
    category: "Socials",
    rating: 4.7,
    downloads: "50M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/gunitmt1jtu026c/%2524p0tify_%25E2%2582%25B1remium_v9.1.40.1486.apk/file",
    features: ["Story/reel downloader", "Ghost mode", "No ads", "Zoom profile pic", "Copy captions"],
    accent: "from-pink-500 to-orange-500",
  },
  {
    id: "tiktok-plus",
    name: "TikTok Plus",
    tagline: "Region-free · video downloader",
    description:
      "Pwedeng manood ng videos mula sa kahit anong region (US, JP, KR, atbp). May built-in video downloader na walang watermark, walang ads, at smooth scrolling kahit sa lumang phone.",
    icon: tiktok,
    version: "34.5.4",
    size: "92 MB",
    category: "Socials",
    rating: 4.6,
    downloads: "1B+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/k53yraaon1kbahy/FreeCine_v3.0.3_VIP.apk/file",
    features: ["Region unlock", "No watermark download", "No ads", "HD playback", "Background music"],
    accent: "from-cyan-500 to-pink-500",
  },
  {
    id: "messenger-plus",
    name: "Messenger Plus",
    tagline: "Privacy-focused · ghost mode",
    description:
      "Modded Messenger with ghost mode (read messages without 'seen'), undo unsend, hide typing indicator, and download photos/videos directly. Lightweight at mas mabilis sa default app.",
    icon: messenger,
    version: "452.0.0",
    size: "68 MB",
    category: "Socials",
    rating: 4.6,
    downloads: "500M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/iqycmojg6zh5opc/LOKTV_VIP_v1.9.1_%2528com.hecate.phantom%2529.apk/file",
    features: ["Ghost mode", "Undo unsend", "Hide typing", "Photo/video download", "No ads"],
    accent: "from-blue-500 to-sky-400",
  },
  // ─── More games ──────────────────────────────────────────────────────
  {
    id: "asphalt-nitro-mod",
    name: "Asphalt Nitro MOD",
    tagline: "Arcade racing · unlimited tokens",
    description:
      "High-octane arcade racing with the world's most exotic cars. MOD unlocks unlimited tokens, credits, all cars and tracks. Offline single-player mode kaya kahit walang signal pwede.",
    icon: asphalt,
    version: "1.7.5a",
    size: "48 MB",
    category: "Games",
    rating: 4.7,
    downloads: "100M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited tokens", "All cars unlocked", "All tracks", "Offline mode", "No ads"],
    accent: "from-red-500 to-orange-500",
  },
  {
    id: "candy-blast-mod",
    name: "Candy Blast MOD",
    tagline: "Match-3 puzzle · unlimited lives",
    description:
      "Sweet match-3 puzzle adventure na nakakaadik. MOD nagbibigay ng unlimited lives, moves, gold bars at boosters. All levels unlocked at no waiting time. 100% offline.",
    icon: candyblast,
    version: "12.4.1",
    size: "78 MB",
    category: "Games",
    rating: 4.5,
    downloads: "200M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["Unlimited lives", "Unlimited moves", "All boosters", "All levels", "No ads"],
    accent: "from-pink-400 to-rose-500",
  },
  {
    id: "sniper-strike-mod",
    name: "Sniper Strike MOD",
    tagline: "FPS shooter · god mode",
    description:
      "Tactical sniper shooter na may realistic ballistics at over 100 missions. MOD unlocks god mode, unlimited ammo, all weapons at one-hit kill. Offline campaign mode.",
    icon: sniper,
    version: "500.106",
    size: "172 MB",
    category: "Games",
    rating: 4.6,
    downloads: "30M+",
    addedAt: "2026-04-28",
    url: "https://www.mediafire.com/file/i1ikjc5ixopggt6/GameBase+_april15.apk/file",
    features: ["God mode", "Unlimited ammo", "All weapons", "One-hit kill", "Offline campaign"],
    accent: "from-emerald-600 to-green-700",
  },
];

export const findApp = (id: string) => apps.find((a) => a.id === id);
