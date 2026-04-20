/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Flashlight, 
  MessageCircle, 
  Settings2, 
  Plus, 
  Trash2, 
  Smartphone,
  ChevronRight,
  Clock as ClockIcon,
  Calendar,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

// --- Types ---

interface Notification {
  id: string;
  type: 'whatsapp' | 'plusfit';
  sender: string;
  content: string;
  time: string;
  avatar?: string;
  appBadge?: string;
}

// --- Components ---

const NotificationItem = ({ notification, onDelete }: { notification: Notification; onDelete: (id: string) => void; key?: string }) => {
  const isWhatsApp = notification.type === 'whatsapp';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full bg-white/80 backdrop-blur-[30px] rounded-[24px] px-3 py-4 shadow-sm border border-white/20 relative group"
    >
      <div className="flex gap-3 items-start">
        {/* Avatar with Overlapping Badge Container */}
        <div className="relative flex-shrink-0 w-[48px] h-[48px]">
          {/* Main Large Avatar */}
          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200 shadow-inner">
            {notification.avatar ? (
              <img src={notification.avatar} alt={notification.sender} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase italic bg-neutral-100">
                {notification.sender.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Overlapping App Badge (Square with rounded corners) - ONLY FOR WHATSAPP */}
          {isWhatsApp && (
            <div className="absolute bottom-[-2px] right-[-2px] w-[22px] h-[22px] rounded-[7px] overflow-hidden shadow-md flex items-center justify-center bg-white ring-2 ring-white">
               {notification.appBadge ? (
                 <img src={notification.appBadge} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-[#25D366]">
                    <img 
                      src="https://ais.ivantech.click/files/input_file_2.png" 
                      alt="WhatsApp Logo" 
                      className="w-[14px] h-[14px] object-contain" 
                    />
                 </div>
               )}
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex justify-between items-baseline mb-0">
            <h4 className="text-[15px] font-bold text-gray-900 truncate tracking-tight">
              {notification.sender}
            </h4>
            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap ml-2">
              {notification.time}
            </span>
          </div>
          <p className="text-[14px] text-gray-900 leading-[1.22] font-normal tracking-[-0.02em] whitespace-pre-wrap">
            {notification.content}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(notification.id)}
        className="absolute -top-2 -right-2 bg-black/5 hover:bg-black/20 backdrop-blur-md text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

export default function App() {
  // --- State ---
  const [time, setTime] = useState('04:35');
  const [date, setDate] = useState('Saturday, April 04');
  const [wallpaper, setWallpaper] = useState('https://picsum.photos/seed/iphone-bg/1000/2000?grayscale&blur=2');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'whatsapp',
      sender: 'Marty',
      content: 'No me creo lo que esta haciendo tu novia',
      time: '6m ago',
      avatar: 'https://i.pravatar.cc/150?u=marty'
    },
    {
      id: '2',
      type: 'whatsapp',
      sender: 'Marty',
      content: 'Lleva toda la noche besandose a ese tipo y se acaban de ir juntos ahorita. Le dije que te iba a decir y me dijo que si no te decia tambien se acostaba conmigo... Sabes que eres mi hermano y yo no te traiciono, así tienes la verdad. Tú verás qué haces.',
      time: 'now',
      avatar: 'https://i.pravatar.cc/150?u=marty'
    },
    {
      id: '3',
      type: 'plusfit',
      sender: 'Symmetry',
      content: 'Session finished! Brutal workout today, machine. You are close to Diamond I rank. Tomorrow Chest and Triceps to secure promotion. Do not slow down now.',
      time: '5h ago',
      avatar: 'https://ais.ivantech.click/files/input_file_1.png'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ id: string, field: 'avatar' | 'appBadge' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const assetUploadRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleAssetUploadClick = (id: string, field: 'avatar' | 'appBadge') => {
    setUploadTarget({ id, field });
    assetUploadRef.current?.click();
  };

  const handleAssetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdateNotification(uploadTarget.id, uploadTarget.field, event.target?.result as string);
        setUploadTarget(null);
        if (assetUploadRef.current) assetUploadRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddNotification = (type: 'whatsapp' | 'plusfit') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      sender: type === 'whatsapp' ? 'New Message' : 'Plusfit',
      content: 'New notification content...',
      time: 'now',
      avatar: type === 'plusfit' ? 'https://ais.ivantech.click/files/input_file_1.png' : ''
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleUpdateNotification = (id: string, field: keyof Notification, value: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleWallpaperChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWallpaper(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-12 gap-12 font-sans overflow-hidden">
      
      {/* --- iPhone Frame --- */}
      <div className="relative group">
        {/* Shadow for depth */}
        <div className="absolute -inset-4 bg-black/40 blur-2xl rounded-[60px] opacity-50"></div>
        
        {/* Device Frame (iPhone 16 Pro Max roughly 19.5:9) */}
        <div className="relative w-[356px] h-[720px] bg-[#0c0c0c] rounded-[52px] border-[6px] border-[#1f1f21] p-2.5 shadow-2xl overflow-hidden ring-1 ring-white/10">
          
          {/* Inner Screen Surface */}
          <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-black select-none">
            
            {/* Wallpaper */}
            <img 
              src={wallpaper} 
              alt="Wallpaper" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

            {/* --- Screen Content --- */}
            <div className="relative w-full h-full flex flex-col pt-10 px-4">
              
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1c]"></div>
                <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-green-500 ring-2 ring-green-500/20"></div>
                </div>
              </div>

              {/* Time & Date */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-6 mb-8"
              >
                <span className="text-[19px] font-medium text-white/90 tracking-tight mb-2 drop-shadow-lg">
                  {date}
                </span>
                <h1 className="text-[84px] font-bold text-white tracking-tighter leading-none drop-shadow-2xl">
                  {time}
                </h1>
              </motion.div>

              {/* Notifications Area */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pb-32 no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notif) => (
                    <NotificationItem 
                      key={notif.id} 
                      notification={notif} 
                      onDelete={handleDeleteNotification} 
                    />
                  ))}
                </AnimatePresence>
                
                {notifications.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-white/40 text-sm italic py-12">
                     No notifications
                  </div>
                )}
              </div>

  {/* Bottom Actions REMOVED per user request to remove "two signs" */}

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-[5px] bg-white rounded-full z-20"></div>

            </div>
          </div>
        </div>
        
        {/* Device Buttons */}
        <div className="absolute -left-[6px] top-32 w-1.5 h-16 bg-[#2a2a2a] rounded-r-sm shadow-inner group-hover:left-[-4px] transition-all"></div>
        <div className="absolute -left-[6px] top-56 w-1.5 h-12 bg-[#2a2a2a] rounded-r-sm shadow-inner group-hover:left-[-4px] transition-all"></div>
        <div className="absolute -left-[6px] top-72 w-1.5 h-12 bg-[#2a2a2a] rounded-r-sm shadow-inner group-hover:left-[-4px] transition-all"></div>
        <div className="absolute -right-[6px] top-48 w-1.5 h-20 bg-[#2a2a2a] rounded-l-sm shadow-inner group-hover:right-[-4px] transition-all"></div>
      </div>

      {/* --- Control Panel --- */}
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[80vh] border border-neutral-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Settings2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Customization</h2>
        </div>

        <div className="space-y-6">
          {/* Wallpaper & Clock */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Smartphone size={16} /> Display
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Time</label>
                <div className="relative">
                  <ClockIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Wallpaper</label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-100 hover:border-gray-400 transition-all group"
              >
                <ImageIcon size={18} className="text-gray-400 group-hover:text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Change Image</span>
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleWallpaperChange} 
              />
            </div>
          </section>

          {/* Notifications Management */}
          <section className="space-y-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <MessageCircle size={16} /> Notifications
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAddNotification('whatsapp')}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  title="Add WhatsApp"
                >
                  <Plus size={18} />
                </button>
                <button 
                  onClick={() => handleAddNotification('plusfit')}
                  className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                  title="Add Plusfit"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group/card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      notif.type === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {notif.type}
                    </span>
                    <button 
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Sender</label>
                        <input 
                          type="text" 
                          value={notif.sender} 
                          onChange={(e) => handleUpdateNotification(notif.id, 'sender', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Time</label>
                        <input 
                          type="text" 
                          value={notif.time} 
                          onChange={(e) => handleUpdateNotification(notif.id, 'time', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Avatar (Upload)</label>
                        <button 
                          onClick={() => handleAssetUploadClick(notif.id, 'avatar')}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-600 transition-colors"
                        >
                          <ImageIcon size={14} /> <span className="text-[10px] font-medium">Big Img</span>
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Badge (Upload)</label>
                        <button 
                          onClick={() => handleAssetUploadClick(notif.id, 'appBadge')}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-600 transition-colors"
                        >
                          <Smartphone size={14} /> <span className="text-[10px] font-medium">Small Img</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Message</label>
                      <textarea 
                        value={notif.content} 
                        onChange={(e) => handleUpdateNotification(notif.id, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <input 
        ref={assetUploadRef} 
        type="file" 
        hidden 
        accept="image/*" 
        onChange={handleAssetChange} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
