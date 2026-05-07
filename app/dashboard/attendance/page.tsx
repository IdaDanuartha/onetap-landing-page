"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, School, Calendar, ArrowRight, Plus, Search, MoreVertical, Edit3, Trash2, X, Loader2, Smartphone, Save, AlertTriangle, Wifi, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Tag {
  id: string;
  student_name: string;
  class_name: string;
  teacher_phone: string;
  token: string;
  is_active: boolean;
  subject?: string;
  message_template?: string;
  school_name?: string;
  created_by?: string;
}

export default function AttendanceManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [presentToday, setPresentToday] = useState(0);
  const [schoolName, setSchoolName] = useState("Umum");
  const [user, setUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWritingNFC, setIsWritingNFC] = useState(false);
  const [writeStatus, setWriteStatus] = useState<"idle" | "writing" | "success" | "error">("idle");
  const [showNFCFallback, setShowNFCFallback] = useState(false);
  const [fallbackToken, setFallbackToken] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [bulkWriteQueue, setBulkWriteQueue] = useState<Tag[]>([]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(-1);


  // Form State
  const [formData, setFormData] = useState({
    student_name: "",
    class_name: "",
    teacher_phone: "",
    token: "",
    subject: "",
  });

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
        const { data: tagsData } = await supabase
        .from("attendance_tags")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
        
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
        .from("attendance_logs")
        .select("*", { count: 'exact', head: true })
        .eq("created_by", user.id)
        .gte("tapped_at", `${today}T00:00:00Z`);

        setTags(tagsData || []);
        
        // Load school name from localStorage or DB
        const savedSchool = localStorage.getItem('onetap_school_name');
        if (savedSchool) {
          setSchoolName(savedSchool);
        } else if (tagsData && tagsData.length > 0 && tagsData[0].school_name) {
          setSchoolName(tagsData[0].school_name);
          localStorage.setItem('onetap_school_name', tagsData[0].school_name);
        }
        
        setPresentToday(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        student_name: tag.student_name,
        class_name: tag.class_name,
        teacher_phone: tag.teacher_phone,
        token: tag.token,
        subject: tag.subject || "",
      });
    } else {
      setEditingTag(null);
      setFormData({
        student_name: "",
        class_name: "",
        teacher_phone: "",
        token: Math.random().toString(36).substring(2, 8).toUpperCase(),
        subject: "",
      });
    }
    setShowModal(true);
  };

  const handleSaveSchoolName = async () => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("attendance_tags")
      .update({ school_name: schoolName })
      .eq("created_by", user.id);
    
    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      localStorage.setItem('onetap_school_name', schoolName);
      setTags(tags.map(t => ({ ...t, school_name: schoolName })));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleWriteNFC = async (token: string, isBulk = false, studentName = "") => {
    if (!('NDEFReader' in window)) {
      const url = `${window.location.origin}/api/attendance/${token}`;
      await navigator.clipboard.writeText(url);
      setFallbackToken(token);
      setShowNFCFallback(true);
      return;
    }

    try {
      setIsWritingNFC(true);
      setWriteStatus("writing");
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: `${window.location.origin}/api/attendance/${token}` }]
      });
      
      setWriteStatus("success");
      
      if (isBulk && currentBulkIndex < bulkWriteQueue.length - 1) {
        // Prepare for next student in bulk
        setTimeout(() => {
          const nextIndex = currentBulkIndex + 1;
          setCurrentBulkIndex(nextIndex);
          setWriteStatus("writing");
        }, 1500);
      } else {
        setTimeout(() => {
          setIsWritingNFC(false);
          setWriteStatus("idle");
          setCurrentBulkIndex(-1);
          setBulkWriteQueue([]);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setWriteStatus("error");
      if (!isBulk) {
        setTimeout(() => {
          setIsWritingNFC(false);
          setWriteStatus("idle");
        }, 3000);
      }
    }
  };

  const startBulkWrite = () => {
    if (filteredTags.length === 0) return;
    setBulkWriteQueue(filteredTags);
    setCurrentBulkIndex(0);
    handleWriteNFC(filteredTags[0].token, true, filteredTags[0].student_name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const dataToSave = {
      ...formData,
      created_by: user.id,
      school_name: schoolName,
    };

    if (editingTag) {
      const { error } = await supabase
        .from("attendance_tags")
        .update(dataToSave)
        .eq("id", editingTag.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from("attendance_tags")
        .insert([dataToSave]);
      if (error) alert(error.message);
    }

    setIsSubmitting(false);
    setShowModal(false);
    fetchData();
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("attendance_tags").delete().eq("id", tagToDelete.id);
    if (error) alert(error.message);
    setIsSubmitting(false);
    setShowDeleteModal(false);
    setTagToDelete(null);
    fetchData();
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.student_name.toLowerCase().includes(search.toLowerCase()) || 
                         tag.class_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = !classFilter || tag.class_name === classFilter;
    const matchesSubject = !subjectFilter || tag.subject === subjectFilter;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const uniqueClasses = Array.from(new Set(tags.map(t => t.class_name).filter(Boolean)));
  const uniqueSubjects = Array.from(new Set(tags.map(t => t.subject).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 mb-4 font-bold transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FF5FA2]/10 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-[#FF5FA2]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#18080F] tracking-tight leading-none">Manajemen Absensi</h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm group/school focus-within:ring-2 focus-within:ring-[#FF5FA2]/20 transition-all">
                    <School className="w-3.5 h-3.5 text-[#FF5FA2]" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveSchoolName();
                        }
                      }}
                      placeholder="Nama Instansi..."
                      className="text-[10px] font-black text-[#18080F] bg-transparent border-none outline-none w-32 focus:w-48 transition-all p-0 placeholder:text-gray-300 uppercase tracking-widest"
                    />
                    {user && tags.length > 0 && tags[0].school_name !== schoolName && (
                      <button 
                        onClick={handleSaveSchoolName}
                        className="p-1 hover:bg-[#FF5FA2]/10 text-[#FF5FA2] rounded-full transition-colors"
                        title="Simpan (Enter)"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[70px]">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${showSuccess ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${showSuccess ? 'text-blue-500' : 'text-gray-400'}`}>
                      {showSuccess ? 'Tersimpan!' : 'Live Sync'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all flex items-center gap-2 shadow-lg shadow-[#FF5FA2]/20"
          >
            <Plus className="w-5 h-5" />
            Tambah Siswa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Siswa', value: tags.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Hadir Hari Ini', value: presentToday, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Tag Aktif', value: tags.filter(t => t.is_active).length, icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#18080F]">{s.value}</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* List Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau kelas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none text-sm font-bold text-gray-500"
              >
                <option value="">Semua Kelas</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none text-sm font-bold text-gray-500"
              >
                <option value="">Semua Mapel</option>
                {uniqueSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {filteredTags.length > 0 && (
                <button 
                  onClick={startBulkWrite}
                  className="px-4 py-3 rounded-xl bg-[#FF5FA2]/10 text-[#FF5FA2] font-black text-sm hover:bg-[#FF5FA2]/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Wifi className="w-4 h-4" />
                  Bulk Write ({filteredTags.length})
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Siswa</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Kelas</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">WhatsApp</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredTags.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                          <Users className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-lg font-bold text-[#18080F]">Data Tidak Ditemukan</p>
                        <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto">
                          {search ? `Tidak ada hasil untuk "${search}". Coba kata kunci lain.` : "Belum ada data siswa yang ditambahkan."}
                        </p>
                        {!search && (
                          <button 
                            onClick={() => handleOpenModal()}
                            className="mt-4 text-[#FF5FA2] font-black text-sm hover:underline"
                          >
                            Tambah Siswa Pertama →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-[#18080F]">{tag.student_name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: {tag.token}</div>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{tag.class_name || "-"}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{tag.teacher_phone || "-"}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tag.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tag.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleWriteNFC(tag.token)}
                          className="p-2 hover:bg-[#FF5FA2]/5 text-[#FF5FA2] rounded-lg transition-colors"
                          title="Write NFC Tag"
                        >
                          <Wifi className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(tag)}
                          className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setTagToDelete(tag); setShowDeleteModal(true); }}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50/30 text-center">
            <Link href="/dashboard/attendance/logs" className="text-sm font-bold text-[#FF5FA2] hover:underline">
              Lihat Histori Lengkap →
            </Link>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#18080F]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[#18080F] tracking-tight">
                  {editingTag ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input
                    required
                    type="text"
                    value={formData.student_name}
                    onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold"
                  />
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#18080F] uppercase tracking-widest ml-1">Kelas</label>
                    <input
                      required
                      list="classes-list"
                      type="text"
                      value={formData.class_name}
                      onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                      placeholder="12 IPA 1"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold"
                    />
                    <datalist id="classes-list">
                      {uniqueClasses.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mata Pelajaran (Opsional)</label>
                    <input
                      list="subjects-list"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Matematika"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold"
                    />
                    <datalist id="subjects-list">
                      {uniqueSubjects.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Orang Tua (Opsional)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.teacher_phone}
                      onChange={(e) => setFormData({...formData, teacher_phone: e.target.value})}
                      placeholder="628123456789"
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unique Token (NFC ID)</label>
                  <input
                    required
                    type="text"
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    placeholder="GENERATED-ID"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-mono text-sm font-bold"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5FA2]/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingTag ? 'Simpan Perubahan' : 'Tambah Siswa'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-[#18080F]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              
              <h3 className="text-xl font-black text-[#18080F] mb-2">Hapus Data Siswa?</h3>
              <p className="text-gray-500 text-sm font-medium mb-8">
                Anda akan menghapus data <span className="text-[#18080F] font-bold">{tagToDelete?.student_name}</span>. Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* NFC Write Overlay */}
      <AnimatePresence>
        {isWritingNFC && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl relative z-10 w-full max-w-sm text-center"
            >
              {writeStatus === "writing" && (
                <div className="space-y-6">
                  {currentBulkIndex !== -1 && (
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-[#FF5FA2]/10 text-[#FF5FA2] rounded-full w-fit mx-auto text-[10px] font-black uppercase tracking-widest">
                      <Users className="w-3 h-3" />
                      Bulk Mode: {currentBulkIndex + 1} / {bulkWriteQueue.length}
                    </div>
                  )}
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-t-[#FF5FA2] border-r-transparent border-b-transparent border-l-transparent"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wifi className="w-10 h-10 text-[#FF5FA2] animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#18080F]">
                      {currentBulkIndex !== -1 ? bulkWriteQueue[currentBulkIndex].student_name : 'Siap Menulis...'}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mt-2">Tempelkan kartu NFC Anda di belakang HP sekarang.</p>
                  </div>
                </div>
              )}

              {writeStatus === "success" && (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-green-600">Berhasil!</h3>
                    <p className="text-gray-400 text-sm font-medium mt-2">
                      {currentBulkIndex !== -1 
                        ? `Data ${bulkWriteQueue[currentBulkIndex].student_name} tersimpan.` 
                        : 'Data absensi telah tersimpan di kartu NFC.'}
                    </p>
                    {currentBulkIndex !== -1 && currentBulkIndex < bulkWriteQueue.length - 1 && (
                      <p className="text-[#FF5FA2] font-bold text-xs mt-4 animate-bounce">
                        Siapkan kartu untuk {bulkWriteQueue[currentBulkIndex + 1].student_name}...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {writeStatus === "error" && (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-red-600">Gagal Menulis</h3>
                    <p className="text-gray-400 text-sm font-medium mt-2">Pastikan NFC aktif dan kartu tidak terkunci.</p>
                  </div>
                  <div className="flex gap-2">
                    {currentBulkIndex !== -1 && (
                      <button 
                        onClick={() => handleWriteNFC(bulkWriteQueue[currentBulkIndex].token, true)}
                        className="flex-1 py-3 rounded-xl bg-[#18080F] text-white font-bold"
                      >
                        Coba Lagi
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsWritingNFC(false);
                        setWriteStatus("idle");
                        setCurrentBulkIndex(-1);
                        setBulkWriteQueue([]);
                      }}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NFC Fallback Modal */}
      <AnimatePresence>
        {showNFCFallback && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNFCFallback(false)}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl relative z-10 w-full max-w-sm text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
                <Smartphone className="w-10 h-10 text-blue-500" />
              </div>
              
              <h3 className="text-2xl font-black text-[#18080F] mb-3">Link Disalin!</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                NFC Writing tidak didukung di browser ini. URL absensi telah disalin! Silakan paste ke aplikasi 
                <span className="text-blue-500 font-bold ml-1">NFC Tools</span> untuk menulis ke kartu.
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">URL Absensi</div>
                <div className="text-[10px] font-mono text-gray-400 break-all bg-white p-2 rounded-lg border border-gray-100">
                  {window.location.origin}/api/attendance/{fallbackToken}
                </div>
              </div>

              <button 
                onClick={() => setShowNFCFallback(false)}
                className="w-full py-4 rounded-2xl bg-[#18080F] text-white font-black hover:bg-black transition-all shadow-lg"
              >
                Saya Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
