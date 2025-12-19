'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { createWorkspace, updateWorkspace } from '@/actions/workspace';
import { Loader2, Plus, X } from 'lucide-react';

type Device = {
  id: string;
  name: string;
  description: string;
  xPercent: number;
  yPercent: number;
  price: string;
  link: string;
};

const initialState = {
  error: '',
  title: '',
  description: '',
  devices: [] as Device[],
};

interface WorkspaceEditorProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    devices: Device[];
  };
}

const categories = ['Gaming', 'Software Development', 'Streaming', 'Minimalist', 'Productivity', 'Creative'];

export default function WorkspaceEditor({ initialData }: WorkspaceEditorProps) {
  const [state, action, isPending] = useActionState(
    initialData ? updateWorkspace : createWorkspace, 
    initialState
  );

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [devices, setDevices] = useState<Device[]>(initialData?.devices || (state?.devices as Device[]) || []);
  const [category, setCategory] = useState(initialData?.category || 'Gaming');
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Synchronize devices from state if it changes (on error)
  useEffect(() => {
    if (state?.devices && state.devices.length > 0) {
      setDevices(state.devices as Device[]);
    }
  }, [state?.devices, state?.error]); // Added error to trigger sync on failure

  // Form states for new device
  const [deviceName, setDeviceName] = useState('');
  const [deviceDesc, setDeviceDesc] = useState('');
  const [devicePrice, setDevicePrice] = useState('');
  const [deviceLink, setDeviceLink] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPoint({ x, y });
    setIsModalOpen(true);
  };

  const handleAddDevice = () => {
    if (!pendingPoint) return;
    const newDevice: Device = {
      id: crypto.randomUUID(),
      name: deviceName,
      description: deviceDesc,
      xPercent: pendingPoint.x,
      yPercent: pendingPoint.y,
      price: devicePrice,
      link: deviceLink,
    };
    setDevices([...devices, newDevice]);
    setIsModalOpen(false);
    setPendingPoint(null);
    setDeviceName('');
    setDeviceDesc('');
    setDevicePrice('');
    setDeviceLink('');
  };

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const handleFormAction = (formData: FormData) => {
    // If we have a file in state but not in the form data (browser cleared it), append it
    const file = formData.get('image') as File;
    if (selectedFile && (!file || file.size === 0)) {
      formData.set('image', selectedFile);
    }
    action(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-neutral-900 leading-none italic uppercase">
          {initialData ? 'Edit Your' : 'Share Your'} <span className="text-neutral-900 border-b-4 border-neutral-900">Workspace</span>
        </h1>
        <p className="text-neutral-500 font-medium">
          {initialData ? 'Update your tags and details.' : 'Upload a photo and tag your gear.'}
        </p>
      </div>

      <form action={handleFormAction} className="space-y-10">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        <div className="space-y-4">
          <label className="block text-sm font-black uppercase tracking-widest text-neutral-400">
            Workspace Title
          </label>
          <input
            name="title"
            required
            defaultValue={state?.title || initialData?.title}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-3 text-neutral-900 font-bold focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900 outline-none transition-all shadow-sm"
            placeholder="My Productivity Setup"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-black uppercase tracking-widest text-neutral-400">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={state?.description || initialData?.description}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-3 text-neutral-900 font-medium focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900 outline-none h-32 transition-all shadow-sm"
            placeholder="Tell us about your theme..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-black uppercase tracking-widest text-neutral-400">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  category === cat
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-md'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input type="hidden" name="category" value={category} />
        </div>

        <div className="space-y-4">
           <label className="block text-sm font-black uppercase tracking-widest text-neutral-400">
            Workspace Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required={!initialData && !imagePreview}
            onChange={handleImageChange}
            className="sr-only"
            id="image-upload"
          />
          {!imagePreview ? (
            <div className="border-4 border-dashed border-neutral-100 rounded-3xl p-20 text-center hover:bg-neutral-50 hover:border-indigo-200 transition-all group">
              <label htmlFor="image-upload" className="cursor-pointer space-y-6">
                <div className="p-6 bg-indigo-50 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/5">
                    <Plus className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-neutral-500 font-bold text-lg">Drop your photo here or click to browse</div>
              </label>
            </div>
          ) : (
             <div className="relative rounded-3xl overflow-hidden border border-white bg-neutral-50 shadow-2xl group">
                <div className="relative flex justify-center min-h-[400px]">
                   <img
                     src={imagePreview}
                     alt="Preview"
                     ref={imageRef}
                     onClick={handleImageClick}
                     className="max-w-full h-auto max-h-[70vh] object-contain cursor-crosshair select-none"
                   />
                   {/* Render Devices */}
                   {devices.map((device) => (
                     <div
                       key={device.id}
                       className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-4 border-white bg-indigo-600 shadow-2xl cursor-pointer transform transition-transform hover:scale-110 flex items-center justify-center group/marker"
                       style={{ left: `${device.xPercent}%`, top: `${device.yPercent}%` }}
                     >
                       <div className="absolute opacity-0 group-hover/marker:opacity-100 bottom-full mb-3 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none transition-all scale-90 group-hover/marker:scale-100 shadow-xl">
                         {device.name}
                       </div>
                     </div>
                   ))}
                </div>
                <div className="absolute top-4 right-4">
                   <button
                     type="button"
                     onClick={() => { setImagePreview(null); if(!initialData) setDevices([]); }}
                     className="bg-white/90 backdrop-blur-md hover:bg-red-500 hover:text-white text-neutral-900 p-3 rounded-2xl shadow-xl transition-all border border-white/50"
                   >
                     <X className="h-5 w-5" />
                   </button>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-800 pointer-events-none shadow-2xl border border-white/50 ring-1 ring-black/5">
                   Click on gear in the photo to tag it
                </div>
             </div>
          )}
        </div>

        <input type="hidden" name="devices" value={JSON.stringify(devices)} />

        {devices.length > 0 && (
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">Tagged Gear ({devices.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map(device => (
                 <div key={device.id} className="flex items-center justify-between p-4 bg-white/50 border border-white/50 rounded-2xl shadow-sm">
                    <span className="text-neutral-900 font-bold tracking-tight">{device.name}</span>
                    <button type="button" onClick={() => handleRemoveDevice(device.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                 </div>
              ))}
            </div>
          </div>
        )}

        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100">
            {state.error}
          </div>
        )}

        <div className="flex justify-end pt-6">
           <button
             type="submit"
             disabled={isPending}
             className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95"
           >
             {isPending && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
             {initialData ? 'Update Setup' : 'Publish Showcase'}
           </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/40 backdrop-blur-xl p-4">
          <div className="bg-white/90 backdrop-blur-3xl border border-white/80 rounded-[32px] p-10 w-full max-w-lg space-y-8 shadow-2xl ring-1 ring-black/5">
            <div className="space-y-2">
                <h3 className="text-3xl font-black text-neutral-900 italic uppercase">Tag <span className="text-gradient">Gear</span></h3>
                <p className="text-neutral-500 font-medium">Link this hotspot to specific gear details.</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">Gear Name</label>
                  <input
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3 text-neutral-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="Ex: MacBook Pro M3"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">Details (Optional)</label>
                  <textarea
                    value={deviceDesc}
                    onChange={(e) => setDeviceDesc(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3 text-neutral-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 h-24 transition-all"
                    placeholder="Why do you love this gear?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">Price (USD)</label>
                      <input
                         type="number"
                         step="0.01"
                         value={devicePrice}
                         onChange={(e) => setDevicePrice(e.target.value)}
                         className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3 text-neutral-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                         placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">Buy Link</label>
                      <input
                         value={deviceLink}
                         onChange={(e) => setDeviceLink(e.target.value)}
                         className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3 text-neutral-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                         placeholder="https://..."
                      />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-8 py-4 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDevice}
                disabled={!deviceName}
                className="flex-1 px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 font-black uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
