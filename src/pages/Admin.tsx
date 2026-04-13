import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { players as initialPlayers, galleryItems as initialGallery, videos as initialVideos, type Player, type GalleryItem, type Video } from "@/lib/data";
import { Plus, Trash2, Edit, Save, X, Image, Film, Users, LayoutGrid } from "lucide-react";

type Tab = "players" | "gallery" | "videos";

const Admin = () => {
  const [tab, setTab] = useState<Tab>("players");
  const [playersData, setPlayersData] = useState<Player[]>(initialPlayers);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(initialGallery);
  const [videosData, setVideosData] = useState<Video[]>(initialVideos);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  // Player form state
  const [form, setForm] = useState({
    name: "", position: "Forward", age: 18, jersey: 0,
    image: "", videoUrl: "", resumeUrl: "", bio: "",
    goals: 0, assists: 0, appearances: 0, rating: 0,
    imageUrls: "",
  });

  const resetForm = () => {
    setForm({ name: "", position: "Forward", age: 18, jersey: 0, image: "", videoUrl: "", resumeUrl: "", bio: "", goals: 0, assists: 0, appearances: 0, rating: 0, imageUrls: "" });
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  const editPlayer = (player: Player) => {
    setForm({
      name: player.name, position: player.position, age: player.age, jersey: player.jersey,
      image: player.image, videoUrl: player.videoUrl || "", resumeUrl: player.resumeUrl || "",
      bio: player.bio, goals: player.stats.goals, assists: player.stats.assists,
      appearances: player.stats.appearances, rating: player.stats.rating,
      imageUrls: player.images.join("\n"),
    });
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const savePlayer = () => {
    const playerData: Player = {
      id: editingPlayer?.id || Date.now().toString(),
      name: form.name, position: form.position, age: form.age, jersey: form.jersey,
      image: form.image, images: form.imageUrls.split("\n").filter(Boolean),
      videoUrl: form.videoUrl || undefined, resumeUrl: form.resumeUrl || undefined,
      bio: form.bio, featured: true,
      stats: { goals: form.goals, assists: form.assists, appearances: form.appearances, rating: form.rating },
    };
    if (editingPlayer) {
      setPlayersData(playersData.map((p) => p.id === editingPlayer.id ? playerData : p));
    } else {
      setPlayersData([...playersData, playerData]);
    }
    resetForm();
  };

  const deletePlayer = (id: string) => setPlayersData(playersData.filter((p) => p.id !== id));

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({ src: "", title: "", category: "training" as GalleryItem["category"] });
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  const addGalleryItem = () => {
    setGalleryData([...galleryData, { id: Date.now().toString(), ...galleryForm, type: "image" }]);
    setGalleryForm({ src: "", title: "", category: "training" });
    setShowGalleryForm(false);
  };

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", thumbnail: "", videoUrl: "", category: "highlight" as Video["category"], duration: "", date: "" });
  const [showVideoForm, setShowVideoForm] = useState(false);

  const addVideo = () => {
    setVideosData([...videosData, { id: Date.now().toString(), ...videoForm }]);
    setVideoForm({ title: "", thumbnail: "", videoUrl: "", category: "highlight", duration: "", date: "" });
    setShowVideoForm(false);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "players", label: "Players", icon: <Users size={18} /> },
    { key: "gallery", label: "Gallery", icon: <LayoutGrid size={18} /> },
    { key: "videos", label: "Videos", icon: <Film size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-10">
            <span className="text-gradient-primary">Admin</span> Panel
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                  tab === t.key ? "bg-gradient-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Players Tab */}
          {tab === "players" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Players</h2>
                <button
                  onClick={() => { resetForm(); setShowPlayerForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold"
                >
                  <Plus size={16} /> Add Player
                </button>
              </div>

              {showPlayerForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground uppercase">
                      {editingPlayer ? "Edit Player" : "New Player"}
                    </h3>
                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none">
                      <option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option>
                    </select>
                    <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input type="number" placeholder="Jersey #" value={form.jersey} onChange={(e) => setForm({ ...form, jersey: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input placeholder="Profile Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none md:col-span-2" />
                    <input placeholder="Video URL (YouTube embed)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input placeholder="Resume URL (Google Drive preview)" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <div className="grid grid-cols-4 gap-2 md:col-span-2">
                      <input type="number" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-3 py-3 text-sm border border-border focus:border-primary outline-none" />
                      <input type="number" placeholder="Assists" value={form.assists} onChange={(e) => setForm({ ...form, assists: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-3 py-3 text-sm border border-border focus:border-primary outline-none" />
                      <input type="number" placeholder="Apps" value={form.appearances} onChange={(e) => setForm({ ...form, appearances: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-3 py-3 text-sm border border-border focus:border-primary outline-none" />
                      <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} className="bg-secondary text-foreground rounded-lg px-3 py-3 text-sm border border-border focus:border-primary outline-none" />
                    </div>
                    <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none md:col-span-2" />
                    <textarea placeholder="Additional Image URLs (one per line)" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} rows={3} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none md:col-span-2" />
                  </div>
                  <button onClick={savePlayer} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                    <Save size={16} /> Save Player
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {playersData.map((player) => (
                  <div key={player.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                    <img src={player.image} alt={player.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-foreground">{player.name}</h4>
                      <p className="text-muted-foreground text-sm">#{player.jersey} · {player.position} · Age {player.age}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editPlayer(player)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit size={18} /></button>
                      <button onClick={() => deletePlayer(player.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {tab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Gallery</h2>
                <button
                  onClick={() => setShowGalleryForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold"
                >
                  <Plus size={16} /> Add Image
                </button>
              </div>

              {showGalleryForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground uppercase">Add Gallery Image</h3>
                    <button onClick={() => setShowGalleryForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Image URL" value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input placeholder="Title" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as GalleryItem["category"] })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none">
                      <option value="training">Training</option><option value="match">Match</option><option value="team">Team</option><option value="facility">Facility</option>
                    </select>
                  </div>
                  <button onClick={addGalleryItem} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                    <Save size={16} /> Save
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryData.map((item) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => setGalleryData(galleryData.filter((g) => g.id !== item.id))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-destructive rounded-full text-destructive-foreground"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 bg-background/80 text-foreground text-xs p-2 truncate">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {tab === "videos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Videos</h2>
                <button
                  onClick={() => setShowVideoForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold"
                >
                  <Plus size={16} /> Add Video
                </button>
              </div>

              {showVideoForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground uppercase">Add Video</h3>
                    <button onClick={() => setShowVideoForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input placeholder="Thumbnail URL" value={videoForm.thumbnail} onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input placeholder="Video URL (YouTube embed)" value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as Video["category"] })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none">
                      <option value="highlight">Highlight</option><option value="training">Training</option><option value="spotlight">Spotlight</option>
                    </select>
                    <input placeholder="Duration (e.g., 5:30)" value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                    <input type="date" value={videoForm.date} onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })} className="bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
                  </div>
                  <button onClick={addVideo} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                    <Save size={16} /> Save
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {videosData.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-foreground">{video.title}</h4>
                      <p className="text-muted-foreground text-sm">{video.category} · {video.duration} · {video.date}</p>
                    </div>
                    <button
                      onClick={() => setVideosData(videosData.filter((v) => v.id !== video.id))}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
