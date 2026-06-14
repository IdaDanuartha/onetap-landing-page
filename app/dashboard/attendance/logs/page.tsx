"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle, Search, Calendar, User, ArrowRight, Filter, Download, Globe, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dict } from "@/lib/i18n/dict";
import Toast from "@/app/components/Toast";

export const dynamic = 'force-dynamic';

interface AttendanceLog {
  id: string;
  student_name: string;
  class_name: string;
  subject: string;
  tapped_at: string;
  wa_sent: boolean;
}

export default function DashboardAttendanceLogsPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const { locale, setLocale } = useLanguage();
  const d_attendance = dict[locale].dashboard.attendance;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }));
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);
  
  // Resend WhatsApp states
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [isBulkResending, setIsBulkResending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");
  
  // WhatsApp connection validation states
  const [waStatus, setWaStatus] = useState<{ isConnected: boolean; deviceStatus: string } | null>(null);
  const [showWAWarningModal, setShowWAWarningModal] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("attendance_logs")
          .select("*")
          .eq("created_by", user.id)
          .order("tapped_at", { ascending: false })
          .limit(200);

        if (error) {
          console.error("Error fetching logs:", error);
        } else {
          setLogs(data || []);
        }

        // Fetch unique classes and subjects from tags for filters
        const { data: tags } = await supabase
          .from("attendance_tags")
          .select("class_name, subject")
          .eq("created_by", user.id);
        
        if (tags) {
          setUniqueClasses(Array.from(new Set(tags.map(t => t.class_name).filter(Boolean))) as string[]);
          setUniqueSubjects(Array.from(new Set(tags.map(t => t.subject).filter(Boolean))) as string[]);
        }

        // Check WhatsApp status on load
        try {
          const res = await fetch("/api/whatsapp/status");
          if (res.ok) {
            const statusData = await res.json();
            setWaStatus(statusData);
          }
        } catch (err) {
          console.error("Failed to check WA status:", err);
        }
      }
      setLoading(false);
    }

    fetchLogs();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-attendance-logs")
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "attendance_logs"
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new.created_by === user.id) {
            setLogs((prev) => [payload.new as AttendanceLog, ...prev.slice(0, 199)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleResend = async (logId: string) => {
    setResendingId(logId);
    try {
      const res = await fetch("/api/attendance/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId })
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        // Update local logs list
        setLogs(prev => prev.map(log => 
          log.id === logId 
            ? { ...log, wa_sent: true } 
            : log
        ));
        setToastMsg("WhatsApp berhasil dikirim ulang!");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMsg(result.error || "Gagal mengirim ulang WhatsApp");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error resending WA:", err);
      setToastMsg("Terjadi kesalahan koneksi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setResendingId(null);
    }
  };

  const handleBulkResend = async (idsToResend: string[]) => {
    if (idsToResend.length === 0) return;
    setIsBulkResending(true);
    try {
      const res = await fetch("/api/attendance/resend-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logIds: idsToResend })
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        // Update local logs list
        setLogs(prev => prev.map(log => 
          idsToResend.includes(log.id) 
            ? { ...log, wa_sent: true } 
            : log
        ));
        setToastMsg(`Berhasil memproses ${result.processedCount} notifikasi! (${result.successCount} terkirim, ${result.failCount} gagal)`);
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMsg(result.message || result.error || "Gagal mengirim notifikasi massal");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error bulk resending WA:", err);
      setToastMsg("Terjadi kesalahan koneksi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsBulkResending(false);
    }
  };

  const triggerResend = (logId: string) => {
    if (waStatus && !waStatus.isConnected) {
      setShowWAWarningModal(true);
    } else {
      handleResend(logId);
    }
  };

  const triggerBulkResend = (failedIds: string[]) => {
    if (waStatus && !waStatus.isConnected) {
      setShowWAWarningModal(true);
    } else {
      handleBulkResend(failedIds);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.class_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate = !dateFilter || log.tapped_at.startsWith(dateFilter);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "success" && log.wa_sent) || 
      (statusFilter === "failed" && !log.wa_sent);

    const matchesClass = !classFilter || log.class_name === classFilter;
    const matchesSubject = !subjectFilter || log.subject === subjectFilter;
    
    return matchesSearch && matchesDate && matchesStatus && matchesClass && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div>
            <Link href="/dashboard/attendance" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 mb-4 font-bold transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
              {d_attendance.back}
            </Link>
            <h1 className="text-3xl font-black text-[#18080F] tracking-tight">{d_attendance.actions.history}</h1>
            <p className="text-gray-500 font-medium">Log kehadiran lengkap dengan status pengiriman WhatsApp.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 h-4" />
              {locale}
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1" />
            {filteredLogs.some(log => !log.wa_sent) && (
              <button
                onClick={() => {
                  const failedIds = filteredLogs.filter(log => !log.wa_sent).map(log => log.id);
                  triggerBulkResend(failedIds);
                }}
                disabled={isBulkResending}
                className="px-6 py-3 rounded-2xl bg-[#FF5FA2] text-white font-bold hover:bg-[#E8457E] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                {isBulkResending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Kirim Ulang Semua Gagal
              </button>
            )}
            <button             onClick={() => {
              if (filteredLogs.length === 0) return;
              
              const headers = ["Nama Siswa", "Kelas", "Mapel", "Waktu Tap", "Status WA"];
              const csvContent = [
                headers.join(","),
                ...filteredLogs.map(log => [
                  `"${log.student_name}"`,
                  `"${log.class_name}"`,
                  `"${log.subject || '-'}"`,
                  `"${new Date(log.tapped_at).toLocaleString('id-ID')}"`,
                  log.wa_sent ? "Terkirim" : "Gagal"
                ].join(","))
              ].join("\n");

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `histori_absensi_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-[#18080F] font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={filteredLogs.length === 0}
          >
            <Download className="w-5 h-5" />
            Ekspor CSV
          </button>
        </div>
      </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-medium appearance-none"
            >
              <option value="all">Semua Status</option>
              <option value="success">Berhasil (WA)</option>
              <option value="failed">Gagal (WA)</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-bold text-[#18080F] appearance-none"
            >
              <option value="">Semua Kelas</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-bold text-[#18080F] appearance-none"
            >
              <option value="">Semua Mapel</option>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Siswa</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Kelas</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Waktu Tap</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status WA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? null : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#FFF8F2] border border-[#F6B7C8]/20 flex items-center justify-center text-[#FF5FA2] font-black text-xs">
                            {log.student_name?.[0]}
                          </div>
                          <span className="font-bold text-[#18080F]">{log.student_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-medium whitespace-nowrap">{log.class_name}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[#18080F] font-bold text-sm">
                            {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(log.tapped_at))} WIB
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(log.tapped_at))}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {log.wa_sent ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider border border-green-100 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" />
                            Terkirim
                          </span>
                        ) : (
                          <div className="flex items-center gap-3 flex-row flex-nowrap whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider border border-red-100 whitespace-nowrap">
                              <XCircle className="w-3 h-3" />
                              Gagal
                            </span>
                            <button
                              onClick={() => triggerResend(log.id)}
                              disabled={resendingId === log.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:text-[#FF5FA2] bg-gray-50 hover:bg-[#FF5FA2]/5 border border-gray-200 hover:border-[#FF5FA2]/30 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                              title="Kirim Ulang WhatsApp"
                            >
                              {resendingId === log.id ? (
                                <Loader2 className="w-3 h-3 animate-spin text-[#FF5FA2] shrink-0" />
                              ) : (
                                <RefreshCw className="w-3 h-3 shrink-0" />
                              )}
                              <span>Kirim Ulang</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <Calendar className="w-12 h-12 text-[#18080F]" />
                        <p className="text-[#18080F] font-bold">Tidak ada data ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        type={toastType} 
        onClose={() => setShowToast(false)} 
      />

      {/* WA Warning Modal */}
      <AnimatePresence>
        {showWAWarningModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#18080F]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>

              <h3 className="text-xl font-black text-[#18080F] mb-3">WhatsApp Belum Terhubung</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                {waStatus?.deviceStatus === 'unconfigured' 
                  ? 'Anda belum mengonfigurasi Token WhatsApp di menu Pengaturan.' 
                  : `Nomor WhatsApp Anda sedang tidak aktif (Status: ${waStatus?.deviceStatus || 'disconnect'}).`} 
                <br />Silakan hubungkan perangkat Anda terlebih dahulu agar notifikasi dapat terkirim dengan sukses.
              </p>

              <div className="flex flex-col gap-3">
                <Link 
                  href="/dashboard/whatsapp"
                  className="w-full py-4 bg-[#FF5FA2] text-white rounded-2xl font-bold text-sm hover:bg-[#E8457E] transition-all shadow-lg shadow-[#FF5FA2]/15 flex items-center justify-center gap-2"
                >
                  Buka Pengaturan WhatsApp
                </Link>
                
                <button
                  onClick={() => {
                    setShowWAWarningModal(false);
                  }}
                  className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200 rounded-2xl font-bold text-sm transition-all cursor-pointer mt-1"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
