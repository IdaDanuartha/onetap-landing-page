'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { IconPicker } from './IconPicker';

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  isActive: boolean;
  clickCount: number;
}

interface SortableLinkCardProps {
  link: LinkItem;
  onUpdate: (updated: LinkItem) => void;
  onDelete: () => void;
}

export function SortableLinkCard({ link, onUpdate, onDelete }: SortableLinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-5 bg-white border border-[#F6B7C8]/20 rounded-3xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 touch-none"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Icon picker */}
      <IconPicker 
        value={link.icon} 
        onChange={(icon) => onUpdate({ ...link, icon })} 
      />

      {/* Label + URL */}
      <div className="flex-1 min-w-0 space-y-2">
        <input
          type="text"
          placeholder="Label (mis: Instagram)"
          value={link.label}
          onChange={(e) => onUpdate({ ...link, label: e.target.value })}
          className="w-full h-10 px-4 text-sm font-bold rounded-xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all placeholder:text-gray-300"
        />
        <input
          type="url"
          placeholder="https://..."
          value={link.url}
          onChange={(e) => onUpdate({ ...link, url: e.target.value })}
          className="w-full h-10 px-4 text-xs font-medium rounded-xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all text-[#FF5FA2]"
        />
      </div>

      <div className="flex flex-col gap-1">
        {/* Toggle active */}
        <button
          onClick={() => onUpdate({ ...link, isActive: !link.isActive })}
          title={link.isActive ? 'Sembunyikan link' : 'Tampilkan link'}
          className={`p-2 rounded-xl transition-all ${
            link.isActive 
              ? 'text-[#FF5FA2] bg-[#FF5FA2]/5' 
              : 'text-gray-400 bg-gray-50'
          }`}
        >
          {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          title="Hapus link"
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

