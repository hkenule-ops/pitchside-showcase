import player1 from "@/assets/player-1.jpg";
import player2 from "@/assets/player-2.jpg";
import player3 from "@/assets/player-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  jersey: number;
  image: string;
  images: string[];
  videoUrl?: string;
  resumeUrl?: string;
  stats: {
    goals: number;
    assists: number;
    appearances: number;
    rating: number;
  };
  bio: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: "training" | "match" | "team" | "facility";
  type: "image" | "video";
  videoUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: "highlight" | "training" | "spotlight";
  duration: string;
  date: string;
}

export const players: Player[] = [
  {
    id: "1",
    name: "Chukwueze Amadi",
    position: "Forward",
    age: 19,
    jersey: 9,
    image: player1,
    images: [player1, gallery1, gallery2],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    resumeUrl: "https://drive.google.com/file/d/EXAMPLE/preview",
    stats: { goals: 24, assists: 12, appearances: 38, rating: 8.5 },
    bio: "A dynamic forward with incredible pace and finishing ability. Chukwueze has been the academy's top scorer for two consecutive seasons.",
    featured: true,
  },
  {
    id: "2",
    name: "Obinna Nwankwo",
    position: "Midfielder",
    age: 20,
    jersey: 10,
    image: player2,
    images: [player2, gallery2, gallery3],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stats: { goals: 8, assists: 22, appearances: 40, rating: 8.2 },
    bio: "A creative playmaker with exceptional vision and passing range. Obinna dictates the tempo of every match.",
    featured: true,
  },
  {
    id: "3",
    name: "Emeka Okafor",
    position: "Goalkeeper",
    age: 18,
    jersey: 1,
    image: player3,
    images: [player3, gallery1, gallery3],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stats: { goals: 0, assists: 2, appearances: 35, rating: 7.9 },
    bio: "A commanding presence in goal with lightning reflexes. Emeka has kept 18 clean sheets this season.",
    featured: true,
  },
];

export const galleryItems: GalleryItem[] = [
  { id: "1", src: gallery1, title: "Team Photo 2024", category: "team", type: "image" },
  { id: "2", src: gallery2, title: "Training Session", category: "training", type: "image" },
  { id: "3", src: gallery3, title: "Academy Facility", category: "facility", type: "image" },
  { id: "4", src: heroBg, title: "Match Day Action", category: "match", type: "image" },
  { id: "5", src: player1, title: "Player Portrait", category: "team", type: "image" },
  { id: "6", src: player2, title: "Training Drill", category: "training", type: "image" },
];

export const videos: Video[] = [
  { id: "1", title: "Season Highlights 2024", thumbnail: gallery1, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "highlight", duration: "5:30", date: "2024-12-01" },
  { id: "2", title: "Training Camp Recap", thumbnail: gallery2, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "training", duration: "3:45", date: "2024-11-15" },
  { id: "3", title: "Player Spotlight: Chukwueze", thumbnail: player1, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "spotlight", duration: "4:20", date: "2024-10-20" },
];

export const heroImage = heroBg;
