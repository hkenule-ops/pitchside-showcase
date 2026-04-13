import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchPlayers, fetchGallery, fetchVideos,
  addPlayer, updatePlayer, deletePlayer as apiDeletePlayer,
  addGalleryItem, deleteGalleryItem,
  addVideo, deleteVideo as apiDeleteVideo,
  uploadFile, isApiConfigured, getApiUrlConfig, setApiUrl,
} from "@/lib/api";
import { fallbackPlayers, fallbackGallery, fallbackVideos, type Player, type GalleryItem, type Video } from "@/lib/data";
import { Plus, Trash2, Edit, Save, X, Users, LayoutGrid, Film, LogOut, Settings, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tab = "players" | "gallery" | "videos" | "settings";

const Admin = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("players");
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [videosData, setVideosData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getApiUrlConfig());

  // Player form state
  const [form, setForm] = useState({
    name: "", position: "Forward", age: 18, jersey: 0,
    image: "", videoUrl: "", resumeUrl: "", bio: "",
    goals: 0, assists: 0, appearances: 0, rating: 0,
    imageUrls: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const loadData = useCallback(async () => {
    if (!isApiConfigured()) {
      setPlayersData(fallbackPlayers);
      setGalleryData(fallbackGallery);
      setVideosData(fallbackVideos);
      return;
    }
    setLoading(true);
    try {
      const [p, g, v] = await Promise.all([fetchPlayers(), fetchGallery(), fetchVideos()]);
      setPlayersData(p);
      setGalleryData(g);
      setVideosData(v);
    } catch (e) {
      toast({ title: "Error loading data", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
      setPlayersData(fallbackPlayers);
      setGalleryData(fallbackGallery);
      setVideosData(fallbackVideos);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setForm({ name: "", position: "Forward", age: 18, jersey: 0, image: "", videoUrl: "", resumeUrl: "", bio: "", goals: 0, assists: 0, appearances: 0, rating: 0, imageUrls: "" });
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  const editPlayerFn = (player: Player) => {
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

  const savePlayer = async () => {
    const data = {
      name: form.name, position: form.position, age: form.age, jersey: form.jersey,
      image: form.image, images: form.imageUrls.split("\n").filter(Boolean),
      videoUrl: form.videoUrl, resumeUrl: form.resumeUrl, bio: form.bio, featured: true,
      goals: form.goals, assists: form.assists, appearances: form.appearances, rating: form.rating,
    };
    try {
      if (isApiConfigured()) {
        if (editingPlayer) {
          await updatePlayer(editingPlayer.id, data);
        } else {
          await addPlayer(data);
        }
        toast({ title: "Player saved!" });
        loadData();
      } else {
        // Local fallback
        const playerObj: Player = {
          id: editingPlayer?.id || Date.now().toString(),
          ...data,
          stats: { goals: data.goals, assists: data.assists, appearances: data.appearances, rating: data.rating },
        };
        if (editingPlayer) {
          setPlayersData(playersData.map((p) => p.id === editingPlayer.id ? playerObj : p));
        } else {
          setPlayersData([...playersData, playerObj]);
        }
      }
    } catch (e) {
      toast({ title: "Error saving player", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
    resetForm();
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      if (isApiConfigured()) {
        await apiDeletePlayer(id);
        loadData();
      } else {
        setPlayersData(playersData.filter((p) => p.id !== id));
      }
      toast({ title: "Player deleted" });
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({ src: "", title: "", category: "training" as GalleryItem["category"] });
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  const handleAddGallery = async () => {
    try {
      if (isApiConfigured()) {
        await addGalleryItem({ ...galleryForm, type: "image" });
        loadData();
      } else {
        setGalleryData([...galleryData, { id: Date.now().toString(), ...galleryForm, type: "image" }]);
      }
      setGalleryForm({ src: "", title: "", category: "training" });
      setShowGalleryForm(false);
      toast({ title: "Gallery item added!" });
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      if (isApiConfigured()) {
        await deleteGalleryItem(id);
        loadData();
      } else {
        setGalleryData(galleryData.filter((g) => g.id !== id));
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", thumbnail: "", videoUrl: "", category: "highlight" as Video["category"], duration: "", date: "" });
  const [showVideoForm, setShowVideoForm] = useState(false);

  const handleAddVideo = async () => {
    try {
      if (isApiConfigured()) {
        await addVideo(videoForm);
        loadData();
      } else {
        setVideosData([...videosData, { id: Date.now().toString(), ...videoForm }]);
      }
      setVideoForm({ title: "", thumbnail: "", videoUrl: "", category: "highlight", duration: "", date: "" });
      setShowVideoForm(false);
      toast({ title: "Video added!" });
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      if (isApiConfigured()) {
        await apiDeleteVideo(id);
        loadData();
      } else {
        setVideosData(videosData.filter((v) => v.id !== id));
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  // File upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isApiConfigured()) {
      toast({ title: "Configure API first", description: "Go to Settings tab to set your Apps Script URL", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const result = await uploadFile(file);
      callback(result.url);
      toast({ title: "File uploaded!" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveApiUrl = () => {
    setApiUrl(apiUrlInput);
    toast({ title: "API URL saved!", description: "Data will now load from your Google Sheet" });
    loadData();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "players", label: "Players", icon: <Users size={18} /> },
    { key: "gallery", label: "Gallery", icon: <LayoutGrid size={18} /> },
    { key: "videos", label: "Videos", icon: <Film size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const inputCls = "w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider">
              <span className="text-gradient-primary">Admin</span> Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm hidden sm:block">Hi, {username}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-secondary text-muted-foreground rounded-lg text-sm hover:text-foreground transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}

          {!isApiConfigured() && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 text-sm text-accent">
              ⚠️ Google Apps Script URL not configured. Using demo data. Go to <button onClick={() => setTab("settings")} className="underline font-bold">Settings</button> to connect your backend.
            </div>
          )}

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

          {/* Settings Tab */}
          {tab === "settings" && (
            <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground uppercase mb-6">Backend Configuration</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Paste your deployed Google Apps Script Web App URL below. This connects the admin panel to your Google Sheet database and Google Drive storage.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Apps Script Web App URL</label>
                  <input
                    value={apiUrlInput}
                    onChange={(e) => setApiUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/YOUR_ID/exec"
                    className={inputCls}
                  />
                </div>
                <button onClick={handleSaveApiUrl} className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                  <Save size={16} /> Save & Connect
                </button>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="font-display text-lg font-bold text-foreground uppercase mb-3">Setup Guide</h3>
                <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
                  <li>Create a Google Sheet with tabs: Players, Gallery, Videos, Admins</li>
                  <li>Go to script.google.com and create a new project</li>
                  <li>Copy the Code.gs file from the <code className="text-primary">google-apps-script</code> folder</li>
                  <li>Replace SPREADSHEET_ID and DRIVE_FOLDER_ID</li>
                  <li>Deploy as Web App (Execute as: Me, Access: Anyone)</li>
                  <li>Paste the URL above</li>
                </ol>
              </div>
            </div>
          )}

          {/* Players Tab */}
          {tab === "players" && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Players</h2>
                <button onClick={() => { resetForm(); setShowPlayerForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                  <Plus size={16} /> Add Player
                </button>
              </div>

              {showPlayerForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground uppercase">{editingPlayer ? "Edit Player" : "New Player"}</h3>
                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                    <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputCls}>
                      <option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option>
                    </select>
                    <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} className={inputCls} />
                    <input type="number" placeholder="Jersey #" value={form.jersey} onChange={(e) => setForm({ ...form, jersey: +e.target.value })} className={inputCls} />
                    <div className="md:col-span-2">
                      <div className="flex gap-2">
                        <input placeholder="Profile Image URL (or upload)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} />
                        <label className="flex items-center gap-1 px-4 py-2 bg-secondary text-muted-foreground rounded-lg text-sm cursor-pointer hover:text-foreground transition-colors shrink-0">
                          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setForm({ ...form, image: url }))} />
                        </label>
                      </div>
                    </div>
                    <input placeholder="Video URL (YouTube embed)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputCls} />
                    <input placeholder="Resume URL (Google Drive preview link)" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} className={inputCls} />
                    <div className="grid grid-cols-4 gap-2 md:col-span-2">
                      <input type="number" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: +e.target.value })} className={inputCls} />
                      <input type="number" placeholder="Assists" value={form.assists} onChange={(e) => setForm({ ...form, assists: +e.target.value })} className={inputCls} />
                      <input type="number" placeholder="Apps" value={form.appearances} onChange={(e) => setForm({ ...form, appearances: +e.target.value })} className={inputCls} />
                      <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} className={inputCls} />
                    </div>
                    <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={`${inputCls} md:col-span-2`} />
                    <textarea placeholder="Additional Image URLs (one per line, or upload via Drive)" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} rows={3} className={`${inputCls} md:col-span-2`} />
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
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-foreground truncate">{player.name}</h4>
                      <p className="text-muted-foreground text-sm">#{player.jersey} · {player.position} · Age {player.age}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => editPlayerFn(player)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDeletePlayer(player.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {playersData.length === 0 && !loading && (
                  <p className="text-center text-muted-foreground py-8">No players yet. Add your first player!</p>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {tab === "gallery" && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Gallery</h2>
                <button onClick={() => setShowGalleryForm(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
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
                    <div className="flex gap-2">
                      <input placeholder="Image URL" value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })} className={inputCls} />
                      <label className="flex items-center gap-1 px-4 py-2 bg-secondary text-muted-foreground rounded-lg text-sm cursor-pointer hover:text-foreground transition-colors shrink-0">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setGalleryForm({ ...galleryForm, src: url }))} />
                      </label>
                    </div>
                    <input placeholder="Title" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className={inputCls} />
                    <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as GalleryItem["category"] })} className={inputCls}>
                      <option value="training">Training</option><option value="match">Match</option><option value="team">Team</option><option value="facility">Facility</option>
                    </select>
                  </div>
                  <button onClick={handleAddGallery} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                    <Save size={16} /> Save
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryData.map((item) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center">
                      <button onClick={() => handleDeleteGallery(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-destructive rounded-full text-destructive-foreground">
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
          {tab === "videos" && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground uppercase">Manage Videos</h2>
                <button onClick={() => setShowVideoForm(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
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
                    <input placeholder="Title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} className={inputCls} />
                    <div className="flex gap-2">
                      <input placeholder="Thumbnail URL" value={videoForm.thumbnail} onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })} className={inputCls} />
                      <label className="flex items-center gap-1 px-4 py-2 bg-secondary text-muted-foreground rounded-lg text-sm cursor-pointer hover:text-foreground transition-colors shrink-0">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setVideoForm({ ...videoForm, thumbnail: url }))} />
                      </label>
                    </div>
                    <input placeholder="Video URL (YouTube embed)" value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} className={inputCls} />
                    <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as Video["category"] })} className={inputCls}>
                      <option value="highlight">Highlight</option><option value="training">Training</option><option value="spotlight">Spotlight</option>
                    </select>
                    <input placeholder="Duration (e.g., 5:30)" value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} className={inputCls} />
                    <input type="date" value={videoForm.date} onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })} className={inputCls} />
                  </div>
                  <button onClick={handleAddVideo} className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
                    <Save size={16} /> Save
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {videosData.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-foreground truncate">{video.title}</h4>
                      <p className="text-muted-foreground text-sm">{video.category} · {video.duration} · {video.date}</p>
                    </div>
                    <button onClick={() => handleDeleteVideo(video.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0">
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
