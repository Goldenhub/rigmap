"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Tag, Bookmark, BookmarkCheck, Loader2, Heart } from "lucide-react";
import { toggleSaveWorkspace } from "@/actions/saved";
import { toggleDeviceLike, toggleSaveDevice } from "@/actions/device";

interface Device {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  xPercent: number;
  yPercent: number;
  price: number | null;
  link: string | null;
}

interface WorkspaceViewerProps {
  workspaceId: string;
  imageUrl: string;
  devices: Device[];
  isSavedInitial?: boolean;
  isLoggedIn?: boolean;
  deviceLikesInitial?: { [deviceId: string]: boolean };
  deviceSavesInitial?: { [deviceId: string]: boolean };
}

export default function WorkspaceViewer({ workspaceId, imageUrl, devices, isSavedInitial = false, isLoggedIn = false, deviceLikesInitial = {}, deviceSavesInitial = {} }: WorkspaceViewerProps) {
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);
  const [deviceLikes, setDeviceLikes] = useState(deviceLikesInitial);
  const [deviceSaves, setDeviceSaves] = useState(deviceSavesInitial);
  const [loadingDeviceId, setLoadingDeviceId] = useState<string | null>(null);

  const totalValue = devices.reduce((sum, device) => sum + (device.price || 0), 0);
  const formattedTotal = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalValue);

  const handleToggleSave = async () => {
    setIsSaving(true);
    // Optimistic update
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    const result = await toggleSaveWorkspace(workspaceId);
    if (result.error) {
      setIsSaved(prevSaved);
    } else if (result.saved !== undefined) {
      setIsSaved(result.saved);
    }
    setIsSaving(false);
  };

  const handleToggleDeviceLike = async (deviceId: string) => {
    if (!isLoggedIn) return;
    setLoadingDeviceId(deviceId);
    const prevLiked = deviceLikes[deviceId];
    setDeviceLikes({ ...deviceLikes, [deviceId]: !prevLiked });

    const result = await toggleDeviceLike(deviceId);
    if (result.error) {
      setDeviceLikes({ ...deviceLikes, [deviceId]: prevLiked });
    } else if (result.liked !== undefined) {
      setDeviceLikes({ ...deviceLikes, [deviceId]: result.liked });
    }
    setLoadingDeviceId(null);
  };

  const handleToggleDeviceSave = async (deviceId: string) => {
    if (!isLoggedIn) return;
    setLoadingDeviceId(deviceId);
    const prevSaved = deviceSaves[deviceId];
    setDeviceSaves({ ...deviceSaves, [deviceId]: !prevSaved });

    const result = await toggleSaveDevice(deviceId);
    if (result.error) {
      setDeviceSaves({ ...deviceSaves, [deviceId]: prevSaved });
    } else if (result.saved !== undefined) {
      setDeviceSaves({ ...deviceSaves, [deviceId]: result.saved });
    }
    setLoadingDeviceId(null);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-visible border border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
      <div className="relative flex justify-center bg-neutral-50/50 p-6">
        <img src={imageUrl} alt="Workspace" className="w-full h-auto max-h-[75vh] object-contain select-none rounded-2xl" />

        {devices.map((device) => (
          <div key={device.id} className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center cursor-pointer z-10 group/hotspot" style={{ left: `${device.xPercent}%`, top: `${device.yPercent}%` }} onMouseEnter={() => setActiveDevice(device.id)} onMouseLeave={() => setActiveDevice(null)} onClick={() => setActiveDevice(activeDevice === device.id ? null : device.id)}>
            <motion.div initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-indigo-500" />
            <div className="relative w-4 h-4 bg-white rounded-full border-2 border-indigo-600 shadow-xl shadow-indigo-500/50 group-hover/hotspot:scale-125 transition-transform" />

            {/* Tooltip / Card */}
            <AnimatePresence>
              {activeDevice === device.id && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full mb-5 left-1/2 -translate-x-1/2 w-72 bg-white/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl text-left z-50 ring-1 ring-black/5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-extrabold text-neutral-900 text-base leading-tight tracking-tight">{device.name}</h4>
                    {device.link && (
                      <a href={device.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-400 p-1 bg-indigo-50 rounded-lg transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{device.price ? `$${device.price.toLocaleString()}` : "Custom"}</span>
                  </div>
                  {device.description && <p className="text-neutral-600 text-xs leading-relaxed font-medium mb-3">{device.description}</p>}
                  {device.features && device.features.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Features</div>
                      <div className="flex flex-wrap gap-1.5">
                        {device.features.map((feature, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {isLoggedIn && (
                    <div className="flex gap-2 pt-3 border-t border-white/20">
                      <button onClick={() => handleToggleDeviceLike(device.id)} disabled={loadingDeviceId === device.id} className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-2 px-2 rounded-lg transition-all ${deviceLikes[device.id] ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
                        {loadingDeviceId === device.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Heart className="h-3 w-3" fill={deviceLikes[device.id] ? "currentColor" : "none"} />
                            Like
                          </>
                        )}
                      </button>
                      <button onClick={() => handleToggleDeviceSave(device.id)} disabled={loadingDeviceId === device.id} className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-2 px-2 rounded-lg transition-all ${deviceSaves[device.id] ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
                        {loadingDeviceId === device.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : deviceSaves[device.id] ? (
                          <>
                            <BookmarkCheck className="h-3 w-3" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3 w-3" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/90"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="absolute top-6 right-6 z-20">
        <button onClick={handleToggleSave} disabled={isSaving} className={`p-4 rounded-2xl backdrop-blur-xl border transition-all shadow-xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] ${isSaved ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20" : "bg-white/80 text-neutral-900 border-white/50 hover:bg-white"}`}>
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSaved ? (
            <>
              <BookmarkCheck className="h-5 w-5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="h-5 w-5" />
              <span>Save Rig</span>
            </>
          )}
        </button>
      </div>

      {/* Rig Details Info Panel */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-xl shadow-indigo-500/5 ring-1 ring-black/2 inset-shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-indigo-500 font-black mb-1">Total Rig Value</div>
          <div className="text-2xl font-black text-neutral-900 tracking-tighter">{formattedTotal}</div>
        </div>
        <div className="bg-indigo-600 text-white rounded-full px-4 py-1.5 w-fit shadow-lg shadow-indigo-500/30">
          <div className="text-[10px] font-black tracking-widest uppercase">{devices.length} ITEMS MAPPED</div>
        </div>
      </div>

      {/* Footer Helper */}
      <div className="absolute bottom-6 right-6 glass rounded-full px-5 py-2.5 flex items-center gap-2.5 text-xs font-bold text-neutral-800 pointer-events-none">
        <div className="flex -space-x-1">
          <Tag className="h-4 w-4 text-indigo-600" />
        </div>
        <span className="tracking-tight">Interact with tags for gear intel</span>
      </div>
    </div>
  );
}
