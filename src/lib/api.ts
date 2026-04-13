import { Player, GalleryItem, Video } from "./data";

// The Apps Script Web App URL — set this in the app's config page
const getApiUrl = (): string => {
  return localStorage.getItem("naija_api_url") || "";
};

const getToken = (): string | null => {
  return localStorage.getItem("naija_admin_token");
};

// ---- Generic Fetch Helpers ----

async function apiGet<T>(action: string): Promise<T> {
  const url = getApiUrl();
  if (!url) throw new Error("API URL not configured. Go to Admin → Settings.");
  const res = await fetch(`${url}?action=${action}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "API error");
  return json.data;
}

async function apiPost<T>(body: Record<string, unknown>): Promise<T> {
  const url = getApiUrl();
  if (!url) throw new Error("API URL not configured. Go to Admin → Settings.");
  const token = getToken();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // Apps Script requires text/plain to avoid CORS preflight
    body: JSON.stringify({ ...body, token }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success && json.error) throw new Error(json.error);
  return json as T;
}

// ---- Public API ----

export async function fetchPlayers(): Promise<Player[]> {
  return apiGet<Player[]>("getPlayers");
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  return apiGet<GalleryItem[]>("getGallery");
}

export async function fetchVideos(): Promise<Video[]> {
  return apiGet<Video[]>("getVideos");
}

// ---- Auth ----

export async function loginAdmin(username: string, password: string): Promise<{ token: string; username: string }> {
  const res = await apiPost<{ success: boolean; token: string; username: string; error?: string }>({
    action: "login",
    username,
    password,
  });
  if (res.token) {
    localStorage.setItem("naija_admin_token", res.token);
    localStorage.setItem("naija_admin_user", res.username);
  }
  return res;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiPost({ action: "logout" });
  } finally {
    localStorage.removeItem("naija_admin_token");
    localStorage.removeItem("naija_admin_user");
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getAdminUser(): string | null {
  return localStorage.getItem("naija_admin_user");
}

// ---- Admin CRUD ----

export async function addPlayer(data: Record<string, unknown>): Promise<{ id: string }> {
  return apiPost({ action: "addPlayer", data });
}

export async function updatePlayer(id: string, data: Record<string, unknown>): Promise<{ success: boolean }> {
  return apiPost({ action: "updatePlayer", id, data });
}

export async function deletePlayer(id: string): Promise<{ success: boolean }> {
  return apiPost({ action: "deletePlayer", id });
}

export async function addGalleryItem(data: Record<string, unknown>): Promise<{ id: string }> {
  return apiPost({ action: "addGalleryItem", data });
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean }> {
  return apiPost({ action: "deleteGalleryItem", id });
}

export async function addVideo(data: Record<string, unknown>): Promise<{ id: string }> {
  return apiPost({ action: "addVideo", data });
}

export async function deleteVideo(id: string): Promise<{ success: boolean }> {
  return apiPost({ action: "deleteVideo", id });
}

// ---- File Upload ----

export async function uploadFile(file: File): Promise<{ url: string; fileId: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const result = await apiPost<{ url: string; fileId: string; previewUrl: string }>({
          action: "uploadFile",
          fileData: base64,
          fileName: file.name,
          mimeType: file.type,
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export async function deleteFile(fileId: string): Promise<{ success: boolean }> {
  return apiPost({ action: "deleteFile", fileId });
}

// ---- Config ----

export function getApiUrlConfig(): string {
  return getApiUrl();
}

export function setApiUrl(url: string): void {
  localStorage.setItem("naija_api_url", url.trim());
}

export function isApiConfigured(): boolean {
  return !!getApiUrl();
}
