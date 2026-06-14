"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Globe, School, Calendar, ArrowRight, Plus, Search, MoreVertical, Edit3, Trash2, X, Loader2, Smartphone, Save, AlertTriangle, Wifi, CheckCircle2, Download, Upload, Zap, Radio, Signal, AlertCircle, Info, Lightbulb, BookOpen } from "lucide-react";
import Link from "next/link";
import Toast from "@/app/components/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dict } from "@/lib/i18n/dict";
import { canAccess, isExpired } from "@/lib/plans";
import dynamic from 'next/dynamic';
const GuidedTour = dynamic(() => import('@/app/components/GuidedTour'), { ssr: false });

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

interface ScanLog {
  student_name: string;
  class_name: string;
  status: "success" | "warning" | "error";
  time: string;
  message?: string;
}

export default function AttendanceManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showBulkWAModal, setShowBulkWAModal] = useState(false);
  const [bulkWAPhone, setBulkWAPhone] = useState("");
  const [isSubmittingBulkWA, setIsSubmittingBulkWA] = useState(false);
  const [isBulkScanning, setIsBulkScanning] = useState(false);
  const [bulkScanError, setBulkScanError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [presentToday, setPresentToday] = useState(0);
  const [schoolName, setSchoolName] = useState("Umum");
  const [globalMessageTemplate, setGlobalMessageTemplate] = useState("✅ *Presensi Kehadiran*\n\nSiswa *{student_name}* hadir dalam kelas *{class_name}*\n📅 {date}\n🕒 {time} WIB");
  const [user, setUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWritingNFC, setIsWritingNFC] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");
  const [writeStatus, setWriteStatus] = useState<"idle" | "writing" | "success" | "error">("idle");
  const [showNFCFallback, setShowNFCFallback] = useState(false);
  const [fallbackToken, setFallbackToken] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [bulkWriteQueue, setBulkWriteQueue] = useState<Tag[]>([]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(-1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "bulk">("single");
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const { locale, setLocale, t } = useLanguage();
  const d = dict[locale].dashboard.attendance;

  const [plan, setPlan] = useState<string>("starter");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(true);

  // Guided Tour State
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [tourKey, setTourKey] = useState(0);
  const [isProcessingTap, setIsProcessingTap] = useState(false);

  useEffect(() => {
    if (!loading && hasAccess) {
      const searchParams = new URLSearchParams(window.location.search);
      const isTourParam = searchParams.get('tour') === 'true';
      const completed = localStorage.getItem('onetap_tour_attendance_completed');
      if (isTourParam || !completed) {
        setRunTour(true);
        if (isTourParam) {
          setTourStepIndex(0);
        }
        // Save immediately to prevent auto-restart on re-render / page revisit
        localStorage.setItem('onetap_tour_attendance_completed', 'true');
        // Clean URL parameters immediately
        if (window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete('tour');
          window.history.replaceState({ path: url.href }, '', url.href);
        }
      }
    }
  }, [loading, hasAccess]);

  const handleTourClose = () => {
    setRunTour(false);
    localStorage.setItem('onetap_tour_attendance_completed', 'true');
  };

  const handleTourRestart = () => {
    setTourStepIndex(0);
    setTourKey(prev => prev + 1);
    setRunTour(true);
  };

  const handleTourCallback = (data: any) => {
    const { action, index, status, type } = data;
    if (type === "step:after") {
      const nextIndex = index + (action === "prev" ? -1 : 1);
      
      // Pre-emptively trigger transitions before advancing index to avoid Joyride target:not_found race conditions
      if (nextIndex === 2 && !showModal) {
        handleOpenModal();
        setTimeout(() => setTourStepIndex(2), 300);
        return;
      }
      if (nextIndex === 4 && !isWritingNFC && displayTags.length > 0) {
        startSingleWrite(displayTags[0]);
        setTimeout(() => setTourStepIndex(4), 300);
        return;
      }
      if (nextIndex === 6 && !showScanModal) {
        startBulkScan();
        setTimeout(() => setTourStepIndex(6), 300);
        return;
      }
      
      setTourStepIndex(nextIndex);
    } else if (["finished", "skipped"].includes(status) || type === "tour:end") {
      handleTourClose();
    }
  };

  const tourSteps = useMemo(() => [
    {
      target: '#tour-school-name',
      title: t('dashboard.tour.attendance.schoolName.title'),
      content: t('dashboard.tour.attendance.schoolName.desc'),
      placement: 'bottom' as const,
      data: { id: 'save' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-add-student-btn',
      title: t('dashboard.tour.attendance.addStudent.title'),
      content: t('dashboard.tour.attendance.addStudent.desc'),
      placement: 'bottom' as const,
      data: { id: 'addLink' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-student-title',
      title: t('dashboard.tour.attendance.studentForm.title'),
      content: t('dashboard.tour.attendance.studentForm.desc'),
      placement: 'bottom' as const,
      data: { id: 'linksList' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-write-nfc-btn',
      title: t('dashboard.tour.attendance.writeNFC.title'),
      content: t('dashboard.tour.attendance.writeNFC.desc'),
      placement: 'left' as const,
      data: { id: 'scan' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-writing-modal',
      title: t('dashboard.tour.attendance.writingModal.title'),
      content: t('dashboard.tour.attendance.writingModal.desc'),
      placement: 'top' as const,
      data: { id: 'write' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-bulk-scan-btn',
      title: t('dashboard.tour.attendance.bulkScan.title'),
      content: t('dashboard.tour.attendance.bulkScan.desc'),
      placement: 'bottom' as const,
      data: { id: 'bulk' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-scan-modal-title',
      title: t('dashboard.tour.attendance.scanModal.title'),
      content: t('dashboard.tour.attendance.scanModal.desc'),
      placement: 'bottom' as const,
      data: { id: 'scanner' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-history-link',
      title: t('dashboard.tour.attendance.historyLink.title'),
      content: t('dashboard.tour.attendance.historyLink.desc'),
      placement: 'bottom' as const,
      data: { id: 'export' },
      disableBeacon: true,
      spotlightClicks: true,
    },
  ], [t]);


  const [formData, setFormData] = useState({
    student_name: "",
    class_name: "",
    teacher_phone: "",
    token: "",
    subject: "",
    is_active: true,
  });

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    if (user) {
        // Fetch user profile for plan info
        const { data: profile } = await supabase
          .from("users_profile")
          .select("plan, plan_expires_at")
          .eq("id", user.id)
          .single();

        const currentPlan = profile?.plan || "starter";
        const expiresAt = profile?.plan_expires_at;
        
        setPlan(currentPlan);
        setPlanExpiresAt(expiresAt);

        // Attendance is only for Education plan
        const access = canAccess(currentPlan, "attendance") && !isExpired(expiresAt);
        setHasAccess(access);

        const { data: tagsData } = await supabase
        .from("attendance_tags")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
        
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
        const { count } = await supabase
        .from("attendance_logs")
        .select("*", { count: 'exact', head: true })
        .eq("created_by", user.id)
        .gte("tapped_at", `${today}T00:00:00+07:00`);

        setTags(tagsData || []);
        
        // Load school name from localStorage or DB
        const savedSchool = localStorage.getItem('onetap_school_name');
        if (savedSchool) {
          setSchoolName(savedSchool);
        } else if (tagsData && tagsData.length > 0 && tagsData[0].school_name) {
          setSchoolName(tagsData[0].school_name);
          localStorage.setItem('onetap_school_name', tagsData[0].school_name);
        }

        if (tagsData && tagsData.length > 0 && tagsData[0].message_template) {
          setGlobalMessageTemplate(tagsData[0].message_template);
        }
        
        setPresentToday(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
      } else {
        window.location.href = "/auth/login";
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length === 0) {
          setImportError(d.import.error);
          return;
        }

        // Skip header if it exists
        const startLine = (lines[0].toLowerCase().includes('nama') || lines[0].toLowerCase().includes('name')) ? 1 : 0;
        const newTags = [];

        for (let i = startLine; i < lines.length; i++) {
          const row = lines[i].split(',');
          if (row.length < 2) continue; // Skip rows that don't have at least name and class

          const [name, className, subject, phone] = row.map(s => s?.trim());
          
          if (!name || !className) {
            setImportError(d.import.invalidRow.replace("{row}", (i + 1).toString()));
            return;
          }

          newTags.push({
            student_name: name,
            class_name: className,
            subject: subject || "",
            teacher_phone: phone || "",
            token: Math.random().toString(36).substring(2, 8).toUpperCase(),
            created_by: user.id,
            is_active: true,
            school_name: schoolName
          });
        }

        if (newTags.length === 0) {
          setImportError(d.import.noValidData);
          return;
        }

        const { error } = await supabase.from("attendance_tags").insert(newTags);
        if (error) throw error;
        
        setSuccessMessage(d.import.success);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchData();
        setShowImportModal(false);
      } catch (err) {
        console.error("Import failed:", err);
        setImportError(d.import.error);
      } finally {
        setImportLoading(false);
        if (e.target) e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleBulkDeleteTrigger = () => {
    if (selectedTags.length === 0) return;
    setDeleteMode("bulk");
    setShowDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeletingBulk(true);
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("attendance_tags")
        .delete()
        .in("id", selectedTags);

      if (error) throw error;

      setSuccessMessage(d.table.delete + " Success!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSelectedTags([]);
      fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Bulk delete failed:", err);
      alert("Gagal menghapus data terpilih.");
    } finally {
      setIsDeletingBulk(false);
      setIsSubmitting(false);
    }
  };

  const handleBulkUpdateWA = async () => {
    if (!bulkWAPhone || bulkWAPhone.trim() === "") {
      setToastMsg("Nomor WhatsApp wajib diisi.");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    setIsSubmittingBulkWA(true);
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("attendance_tags")
        .update({ teacher_phone: bulkWAPhone })
        .in("id", selectedTags);

      if (error) throw error;

      setSuccessMessage("Bulk Update Success!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setBulkWAPhone("");
      setShowBulkWAModal(false);
      setSelectedTags([]);
      fetchData();
      setToastMsg("Nomor WhatsApp berhasil diperbarui.");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      console.error("Bulk update WA failed:", err);
      setToastMsg("Gagal memperbarui nomor WhatsApp.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmittingBulkWA(false);
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = locale === "id"
      ? "Nama Siswa, Kelas, Mapel, No WhatsApp (Gunakan 62...)\nBudi Santoso, 10A, Matematika, 628123456789\nSiti Aminah, 10A, Bahasa Indonesia, 628987654321"
      : "Student Name, Class, Subject, WhatsApp Number (Use 62...)\nBudi Santoso, 10A, Mathematics, 628123456789\nSiti Aminah, 10A, Indonesian Language, 628987654321";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", locale === "id" ? "template_import_siswa.csv" : "student_import_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        student_name: tag.student_name,
        class_name: tag.class_name,
        teacher_phone: tag.teacher_phone || "",
        token: tag.token,
        subject: tag.subject || "",
        is_active: tag.is_active,
      });
    } else {
      setEditingTag(null);
      setFormData({
        student_name: "",
        class_name: "",
        teacher_phone: "",
        token: Math.random().toString(36).substring(2, 8).toUpperCase(),
        subject: "",
        is_active: true,
      });
    }
    setShowModal(true);
    
    // Advance tour if active
    if (runTour && tourStepIndex === 1) {
      setTourStepIndex(2);
    }
  };

  const handleDeleteTrigger = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteMode("single");
    setShowDeleteModal(true);
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
      setSuccessMessage(d.school.saveSuccess);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Advance tour if active
      if (runTour && tourStepIndex === 0) {
        setTourStepIndex(1);
      }
    }
  };

  const handleSaveGlobalTemplate = async () => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("attendance_tags")
      .update({ message_template: globalMessageTemplate })
      .eq("created_by", user.id);
    
    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      setTags(tags.map(t => ({ ...t, message_template: globalMessageTemplate })));
      setSuccessMessage(d.globalSettings.saveSuccess);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const startBulkScan = async () => {
    if (!('NDEFReader' in window)) {
      setToastMsg("Browser Anda tidak mendukung NFC. Gunakan Chrome di Android.");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    try {
      setIsBulkScanning(true);
      setShowScanModal(true);
      setBulkScanError(null);
      
      // Advance tour if active
      if (runTour && tourStepIndex === 5) {
        setTourStepIndex(6);
      }
      
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.scan();
      
      ndef.onreading = async (event: any) => {
        try {
          const { message } = event;
          if (!message || !message.records || message.records.length === 0) return;
          const record = message.records[0];
          
          if (record && record.recordType === "url") {
            const decoder = new TextDecoder();
            // Fallback for older Web NFC implementations that used .payload instead of .data
            const dataToDecode = record.data || record.payload;
            if (!dataToDecode) return;
            
            const url = decoder.decode(dataToDecode);
            const token = url.split('/').pop();
            
            if (token) {
              await processAttendance(token);
            }
          }
        } catch (err) {
          console.error("NFC Parsing Error:", err);
        }
      };

      ndef.onreadingerror = () => {
        console.error("NFC Reading Error");
      };
    } catch (error: any) {
      console.error("Bulk scan error:", error);
      setIsBulkScanning(false);
      
      let errorMessage = locale === 'id' 
        ? "Pastikan NFC aktif pada perangkat Anda dan izin telah diberikan."
        : "Make sure NFC is enabled on your device and permissions are granted.";
      
      if (error && error.name === 'NotAllowedError') {
        errorMessage = locale === 'id'
          ? "Izin NFC ditolak oleh browser atau sistem."
          : "NFC permission was denied by browser or system.";
      } else if (error && error.name === 'NotSupportedError') {
        errorMessage = locale === 'id'
          ? "NFC tidak didukung atau dinonaktifkan pada perangkat ini."
          : "NFC is not supported or disabled on this device.";
      } else if (error && error.name === 'SecurityError') {
        if (runTour) {
          errorMessage = ""; // Suppress error in tour mode
        } else {
          errorMessage = locale === 'id'
            ? "Aksi ini memerlukan interaksi pengguna langsung."
            : "This action requires direct user interaction.";
        }
      } else if (error && error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage) {
        setBulkScanError(errorMessage);
        setToastMsg(errorMessage);
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  const processingTokens = React.useRef<Record<string, boolean>>({});

  const processAttendance = async (token: string) => {
    if (processingTokens.current[token]) return;
    
    processingTokens.current[token] = true;
    setIsProcessingTap(true);
    const startTime = Date.now();

    try {
      const res = await fetch(`/api/attendance/${token}`, { method: 'POST' });
      const result = await res.json();
      
      const isAlreadyLogged = result.alreadyLogged === true;
      const isInactive = result.inactive === true;
      const newLog: ScanLog = {
        student_name: result.studentName || (res.status === 404 ? "Tag Tidak Terdaftar" : "Tag Baru"),
        class_name: result.className || "-",
        status: res.ok ? "success" : (isAlreadyLogged ? "warning" : "error"),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: isAlreadyLogged 
          ? "Sudah Absen" 
          : (isInactive 
              ? "Siswa Nonaktif" 
              : (result.message ? `${result.error}: ${result.message}` : (result.error || (res.ok ? "Kehadiran Berhasil!" : "Gagal"))))
      };

      setScanLogs(prev => [newLog, ...prev].slice(0, 50));
      
      if (res.ok) {
        setPresentToday(prev => prev + 1);
      }
    } catch (err) {
      console.error("Attendance processing error:", err);
    } finally {
      // Ensure loading state is shown for at least 400ms to be visually clear
      const elapsedTime = Date.now() - startTime;
      const minDelay = 400;
      if (elapsedTime < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
      }
      setIsProcessingTap(false);

      // Release lock after 3 seconds to prevent duplicate rapid scans
      setTimeout(() => {
        processingTokens.current[token] = false;
      }, 3000);
    }
  };

  const performNFCWrite = async (token: string, index: number) => {
    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: `${window.location.origin}/attend/${token}` }]
      });
      
      setWriteStatus("success");
      
      if (index < bulkWriteQueue.length - 1) {
        // Wait 2 seconds so the user has time to swap cards, then trigger the next write
        setTimeout(() => {
          setCurrentBulkIndex(index + 1);
          setWriteStatus("writing");
        }, 2000);
      } else {
        // Complete bulk write
        setTimeout(() => {
          setIsWritingNFC(false);
          setWriteStatus("idle");
          setCurrentBulkIndex(-1);
          setBulkWriteQueue([]);
          
          if (runTour && tourStepIndex === 4) {
            setTourStepIndex(5);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("NFC Write Error at index", index, error);
      setWriteStatus("error");
    }
  };

  useEffect(() => {
    if (isWritingNFC && currentBulkIndex >= 0 && currentBulkIndex < bulkWriteQueue.length && writeStatus === "writing") {
      const currentTag = bulkWriteQueue[currentBulkIndex];
      performNFCWrite(currentTag.token, currentBulkIndex);
    }
  }, [currentBulkIndex, writeStatus, isWritingNFC, bulkWriteQueue]);

  const startSingleWrite = (tag: Tag) => {
    if (!('NDEFReader' in window)) {
      const url = `${window.location.origin}/attend/${tag.token}`;
      navigator.clipboard.writeText(url);
      setFallbackToken(tag.token);
      setShowNFCFallback(true);
      
      if (runTour && tourStepIndex === 3) {
        setTourStepIndex(4);
      }
      return;
    }
    setBulkWriteQueue([tag]);
    setCurrentBulkIndex(0);
    setIsWritingNFC(true);
    setWriteStatus("writing");
    
    if (runTour && tourStepIndex === 3) {
      setTourStepIndex(4);
    }
  };

  const startBulkWrite = () => {
    if (displayTags.length === 0) return;
    if (!('NDEFReader' in window)) {
      setToastMsg("Browser Anda tidak mendukung NFC. Gunakan Chrome di Android.");
      setToastType("warning");
      setShowToast(true);
      return;
    }
    setBulkWriteQueue(displayTags);
    setCurrentBulkIndex(0);
    setIsWritingNFC(true);
    setWriteStatus("writing");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingTag && (!formData.teacher_phone || formData.teacher_phone.trim() === "")) {
      setToastMsg(locale === 'id' ? "Nomor WhatsApp Pendamping wajib diisi agar notifikasi bisa terkirim." : "Parent WhatsApp number is required for notifications to be sent.");
      setToastType("warning");
      setShowToast(true);
      return;
    } 

    setIsSubmitting(true);

    const dataToSave = {
      ...formData,
      created_by: user.id,
      school_name: schoolName,
      message_template: globalMessageTemplate,
    };

    if (editingTag) {
      const { error } = await supabase
        .from("attendance_tags")
        .update(dataToSave)
        .eq("id", editingTag.id);
      if (error) {
        setToastMsg(error.message);
        setToastType("error");
        setShowToast(true);
      } else {
        setSuccessMessage(d.modal.save + " Success!");
      }
    } else {
      const { error } = await supabase
        .from("attendance_tags")
        .insert([dataToSave]);
      if (error) {
        setToastMsg(error.message);
        setToastType("error");
        setShowToast(true);
      } else {
        setSuccessMessage(d.modal.save + " Success!");
      }
    }

    setIsSubmitting(false);
    setShowModal(false);
    fetchData();
    
    if (runTour && tourStepIndex === 2) {
      setTourStepIndex(3);
    }
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("attendance_tags").delete().eq("id", tagToDelete.id);
    if (error) {
      setToastMsg(error.message);
      setToastType("error");
      setShowToast(true);
    } else {
      setSuccessMessage(locale === 'id' ? "Berhasil menghapus data siswa!" : "Successfully deleted student data!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
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

  const displayTags = useMemo(() => {
    if (filteredTags.length > 0) return filteredTags;
    if (runTour) {
      return [{
        id: "dummy-tour-tag",
        student_name: locale === 'id' ? "Siswa Contoh (Panduan)" : "Example Student (Guide)",
        class_name: "12 IPA 1",
        teacher_phone: "628123456789",
        token: "SAMPLE",
        is_active: true,
        subject: "Matematika",
      }];
    }
    return [];
  }, [filteredTags, runTour, locale]);

  const uniqueClasses = Array.from(new Set(tags.map(t => t.class_name).filter(Boolean)));
  const uniqueSubjects = Array.from(new Set(tags.map(t => t.subject).filter(Boolean)));

  // Sync Tour Step Index with Modal / NFC states
  useEffect(() => {
    if (!runTour) return;

    if (tourStepIndex === 2) {
      if (!showModal) {
        handleOpenModal();
      }
    } else {
      if (showModal && (tourStepIndex < 2 || tourStepIndex > 2)) {
        setShowModal(false);
      }
    }

    if (tourStepIndex === 4) {
      if (!isWritingNFC && displayTags.length > 0) {
        startSingleWrite(displayTags[0]);
      }
    } else {
      if (isWritingNFC && (tourStepIndex < 4 || tourStepIndex > 4)) {
        setIsWritingNFC(false);
        setWriteStatus("idle");
      }
    }

    if (tourStepIndex === 6) {
      if (!showScanModal) {
        startBulkScan();
      }
    } else {
      if (showScanModal && (tourStepIndex < 6 || tourStepIndex > 6)) {
        setShowScanModal(false);
        setIsBulkScanning(false);
        setBulkScanError(null);
      }
    }
  }, [tourStepIndex, runTour, displayTags]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2]">
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-4">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-12 h-8 bg-gray-100 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 h-48 animate-pulse" />
          
          <div className="bg-white rounded-[2.5rem] border border-gray-100 h-96 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#FFF8F2]">
        <main className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-8">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-[#18080F] mb-4">{d.locked.title}</h1>
          <p className="text-gray-500 max-w-md mb-10 font-medium">
            {d.locked.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/pricing" 
              className="px-8 py-4 bg-[#FF5FA2] text-white font-black rounded-2xl hover:bg-[#E8457E] transition-all shadow-lg shadow-[#FF5FA2]/20"
            >
              {d.locked.upgrade}
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white border border-gray-100 text-[#18080F] font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            >
              {d.back}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 mb-4 font-bold transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
              {d.back}
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#FF5FA2]/10 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-[#FF5FA2]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#18080F] tracking-tight leading-tight">{d.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div id="tour-school-name" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm group/school focus-within:ring-2 focus-within:ring-[#FF5FA2]/20 transition-all">
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
                      placeholder={d.school.placeholder}
                      className="text-[10px] font-black text-[#18080F] bg-transparent border-none outline-none w-32 focus:w-48 transition-all p-0 placeholder:text-gray-300 uppercase tracking-widest"
                    />
                    {user && tags.length > 0 && tags[0].school_name !== schoolName && (
                      <button 
                        onClick={handleSaveSchoolName}
                        className="p-1 hover:bg-[#FF5FA2]/10 text-[#FF5FA2] rounded-full transition-colors"
                        title={d.table.saveTooltip}
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[70px]">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${showSuccess ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${showSuccess ? 'text-blue-500' : 'text-gray-400'}`}>
                      {showSuccess ? d.table.saved : d.table.liveSync}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            {/* Utility buttons row */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
                <button
                  onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-white transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap shadow-sm border border-transparent hover:border-gray-100"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 h-4 text-gray-400" />
                  <span>{locale.toUpperCase()}</span>
                </button>
                
                <div className="h-4 w-px bg-gray-200" />
                
                <button
                  onClick={handleTourRestart}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-white transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap shadow-sm border border-transparent hover:border-gray-100 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 h-4 text-gray-400" />
                  <span>{t('dashboard.tour.restart')}</span>
                </button>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="grid grid-cols-3 gap-2 w-full md:flex md:items-center md:gap-3 md:w-auto">
              <Link 
                id="tour-history-link"
                href="/dashboard/attendance/logs"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-gray-100 text-[#18080F] font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 sm:w-5 h-5 text-[#FF5FA2]" />
                <span className="hidden sm:inline">{d.actions.history}</span>
                <span className="sm:hidden">History</span>
              </Link>
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-gray-100 text-[#18080F] font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4 sm:w-5 h-5 rotate-180 text-gray-400" />
                <span className="hidden sm:inline">{d.actions.importCsv}</span>
                <span className="sm:hidden">Import</span>
              </button>
              <button 
                id="tour-bulk-scan-btn"
                onClick={startBulkScan}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-orange-500 text-white font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 text-xs sm:text-sm whitespace-nowrap"
              >
                <Radio className="w-4 h-4 sm:w-5 h-5 animate-pulse text-white/95" />
                <span className="hidden sm:inline">{d.actions.bulkScan}</span>
                <span className="sm:hidden">Scan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: d.stats.totalStudents, value: tags.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: d.stats.presentToday, value: presentToday, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
            { label: d.stats.activeTags, value: tags.filter(t => t.is_active).length, icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
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

        {/* Global Settings */}
        <div className="mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5FA2]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-[#18080F]">{d.globalSettings.title}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between ml-1 gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{d.globalSettings.templateLabel}</label>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{`{student_name}`}</span>
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{`{class_name}`}</span>
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{`{subject}`}</span>
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{`{date}`}</span>
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{`{time}`}</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <textarea
                  rows={5}
                  value={globalMessageTemplate}
                  onChange={(e) => setGlobalMessageTemplate(e.target.value)}
                  placeholder="Halo Pendamping {student_name}, ananda telah hadir..."
                  className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold text-sm resize-none"
                />
                <button
                  onClick={handleSaveGlobalTemplate}
                  className="px-8 py-4 bg-[#FF5FA2] text-white font-black rounded-2xl hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5FA2]/20 w-full lg:w-fit h-fit"
                >
                  <Save className="w-4 h-4" />
                  {d.globalSettings.saveTemplate}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium ml-1">
                {d.globalSettings.templateNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {tags.length > 0 && tags.some(t => !t.teacher_phone || t.teacher_phone.trim() === "") && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-base font-black text-amber-900">{d.warning.waMissing}</p>
                <p className="text-sm font-bold text-amber-700/80">{d.warning.waMissingDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 border border-amber-200 text-amber-800 rounded-xl text-xs font-black shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> {d.warning.bulkWaUpdate}
            </div>
          </motion.div>
        )}

        {/* List Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={d.table.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none text-sm font-bold text-gray-500 min-w-[140px]"
              >
                <option value="">{d.table.allClasses}</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none text-sm font-bold text-gray-500 min-w-[140px]"
              >
                <option value="">{d.table.allSubjects}</option>
                {uniqueSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {filteredTags.length > 0 && (
                <button 
                  onClick={startBulkWrite}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-[#FF5FA2]/10 text-[#FF5FA2] font-black text-sm hover:bg-[#FF5FA2]/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Wifi className="w-4 h-4" />
                  Bulk Write ({filteredTags.length})
                </button>
              )}

              <button 
                id="tour-add-student-btn"
                onClick={() => handleOpenModal()}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-[#FF5FA2] text-white font-black text-sm hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#FF5FA2]/20"
              >
                <Plus className="w-4 h-4" />
                {d.actions.addStudent}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-5 w-10">
                    <input 
                      type="checkbox"
                      checked={selectedTags.length === displayTags.length && displayTags.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags(displayTags.map(t => t.id));
                        } else {
                          setSelectedTags([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF5FA2] focus:ring-[#FF5FA2]"
                    />
                  </th>
                  <th className="px-4 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">{d.table.student}</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">{d.table.classSubject}</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">{d.table.status}</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">{d.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {selectedTags.length > 0 && (
                  <tr className="bg-[#FF5FA2]/5">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#FF5FA2]">
                          {selectedTags.length} {d.table.student} {d.table.selected}
                        </span>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setShowBulkWAModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                          >
                            <Smartphone className="w-3 h-3" />
                            Update WA ({selectedTags.length})
                          </button>
                          <button 
                            onClick={handleBulkDeleteTrigger}
                            disabled={isDeletingBulk}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                          >
                            {isDeletingBulk ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            {d.table.delete} {d.table.selected}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
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
                ) : displayTags.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                          <Users className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-lg font-bold text-[#18080F]">{d.table.noDataFound}</p>
                        <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto">
                          {search ? `Tidak ada hasil untuk "${search}". Coba kata kunci lain.` : "Belum ada data siswa yang ditambahkan."}
                        </p>
                        {!search && (
                          <button 
                            onClick={() => handleOpenModal()}
                            className="mt-4 text-[#FF5FA2] font-black text-sm hover:underline"
                          >
                            {d.table.addFirst} →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : displayTags.map((tag, index) => (
                  <tr key={tag.id} className={`hover:bg-gray-50/30 transition-colors ${selectedTags.includes(tag.id) ? 'bg-[#FF5FA2]/5' : ''}`}>
                    <td className="px-6 py-5">
                      <input 
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags(prev => [...prev, tag.id]);
                          } else {
                            setSelectedTags(prev => prev.filter(id => id !== tag.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#FF5FA2] focus:ring-[#FF5FA2]"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="font-bold text-[#18080F]">{tag.student_name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: {tag.token}</div>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{tag.class_name || "-"}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tag.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tag.is_active ? d.table.active : d.table.inactive}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          id={index === 0 ? "tour-write-nfc-btn" : undefined}
                          onClick={() => startSingleWrite(tag)}
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
              id="tour-student-form"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 id="tour-student-title" className="text-2xl font-black text-[#18080F] tracking-tight">
                  {editingTag ? d.modal.editTitle : d.modal.addTitle}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{d.modal.name} <span className="text-red-500">*</span></label>
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
                    <label className="text-[10px] font-black text-[#18080F] uppercase tracking-widest ml-1">{d.modal.class} <span className="text-red-500">*</span></label>
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{d.modal.subject}</label>
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

                {editingTag ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{d.modal.wa} <span className="text-red-500">*</span></label>
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
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-blue-700 mb-1 uppercase tracking-wider">Tips Pengisian</p>
                      <p className="text-xs font-bold text-blue-600/80 leading-relaxed">
                        Nomor WA tidak perlu diisi sekarang. Anda bisa mengisi nomor WA banyak siswa sekaligus menggunakan fitur <span className="text-blue-700 underline font-extrabold">Bulk Update WA</span> di tabel utama.
                      </p>
                    </div>
                  </div>
                )}

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


                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <div className="text-sm font-bold text-[#18080F]">{d.modal.active}</div>
                    <div className="text-[10px] text-gray-400 font-medium">Siswa tidak aktif tidak dapat melakukan absensi.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all"
                  >
                    {d.table.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5FA2]/20 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {editingTag ? d.modal.save : d.actions.addStudent}
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
              <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              
              <h3 className="text-2xl font-black text-[#18080F] mb-3">
                {deleteMode === "bulk" ? `${d.table.delete} ${selectedTags.length} ${d.table.student}?` : `${d.table.delete} ${d.table.student}?`}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                {deleteMode === "bulk" 
                  ? `Apakah Anda yakin ingin menghapus ${selectedTags.length} siswa yang dipilih?`
                  : <>Anda akan menghapus data <span className="text-[#18080F] font-bold">{tagToDelete?.student_name}</span>.</>}
                <br />Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-500 font-black hover:bg-gray-100 transition-all"
                >
                  {d.table.cancel}
                </button>
                <button
                  onClick={deleteMode === "bulk" ? confirmBulkDelete : confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : d.table.confirmDelete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk WA Update Modal */}
      <AnimatePresence>
        {showBulkWAModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBulkWAModal(false)}
              className="absolute inset-0 bg-[#18080F]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10"
            >
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Smartphone className="w-10 h-10 text-blue-500" />
              </div>
              
              <h3 className="text-2xl font-black text-[#18080F] mb-3 text-center">
                {d.warning.bulkWaUpdate}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 text-center">
                Masukkan nomor WhatsApp baru untuk <span className="text-blue-600 font-bold">{selectedTags.length} siswa</span> terpilih.
              </p>

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp Baru</label>
                  <input
                    type="text"
                    value={bulkWAPhone}
                    onChange={(e) => setBulkWAPhone(e.target.value)}
                    placeholder="Contoh: 628123456789"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkWAModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-500 font-black hover:bg-gray-100 transition-all"
                >
                  {d.table.cancel}
                </button>
                <button
                  onClick={handleBulkUpdateWA}
                  disabled={isSubmittingBulkWA}
                  className="flex-[2] py-4 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmittingBulkWA ? <Loader2 className="w-5 h-5 animate-spin" /> : d.table.updateAll}
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
              id="tour-writing-modal"
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
                      {currentBulkIndex !== -1 ? bulkWriteQueue[currentBulkIndex].student_name : d.nfc.writing}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mt-2">{d.nfc.tap}</p>
                  </div>
                </div>
              )}

              {writeStatus === "success" && (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-green-600">{d.table.success}</h3>
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
                    <h3 className="text-xl font-black text-red-600">{d.nfc.error}</h3>
                    <p className="text-gray-400 text-sm font-medium mt-2">Pastikan NFC aktif dan kartu tidak terkunci.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setWriteStatus("writing")}
                      className="flex-1 py-3 rounded-xl bg-[#18080F] text-white font-bold"
                    >
                      Coba Lagi
                    </button>
                    <button 
                      onClick={() => {
                        setIsWritingNFC(false);
                        setWriteStatus("idle");
                        setCurrentBulkIndex(-1);
                        setBulkWriteQueue([]);
                        if (runTour && tourStepIndex === 4) {
                          setTourStepIndex(5);
                        }
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
              
              <h3 className="text-2xl font-black text-[#18080F] mb-3">{d.table.linkCopied}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                {d.bulkScan.nfcFallbackDesc}
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">URL Absensi</div>
                <div className="text-[10px] font-mono text-gray-400 break-all bg-white p-2 rounded-lg border border-gray-100">
                  {window.location.origin}/api/attendance/{fallbackToken}
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowNFCFallback(false);
                  if (runTour && tourStepIndex === 4) {
                    setTourStepIndex(5);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-[#18080F] text-white font-black hover:bg-black transition-all shadow-lg"
              >
                {d.table.understand}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#18080F]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#18080F]">{d.import.title}</h3>
                <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {importError && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium">{importError}</p>
                  </div>
                )}

                <div className="p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-start gap-3.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none" />
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="relative z-10 space-y-2">
                    <h4 className="font-bold text-blue-950 text-sm">{d.import.csvFormat}</h4>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      {d.import.csvFormatDesc}
                    </p>
                    <div className="bg-white/60 p-2 rounded-xl border border-blue-100/50 text-[10px] font-mono font-bold text-blue-900 break-all select-all">
                      {d.import.columns}
                    </div>
                    <div className="pt-1.5">
                      <button
                        onClick={downloadTemplate}
                        className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {d.import.downloadTemplate}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block cursor-pointer group">
                    <div className="w-full py-8 px-4 rounded-[1.5rem] border-2 border-dashed border-gray-200 group-hover:border-[#FF5FA2] group-hover:bg-[#FF5FA2]/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center relative overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#FF5FA2]/10 flex items-center justify-center text-gray-400 group-hover:text-[#FF5FA2] transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#18080F] group-hover:text-[#FF5FA2] transition-colors">
                          {d.import.chooseFile}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                          {d.import.dragDropDesc}
                        </p>
                      </div>
                      
                      {importLoading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                          <Loader2 className="w-6 h-6 animate-spin text-[#FF5FA2]" />
                          <span className="text-xs font-bold text-[#18080F]">{d.import.uploading}</span>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleImportCSV}
                        disabled={importLoading}
                      />
                    </div>
                  </label>
                </div>

                <p className="text-center text-xs text-gray-400 font-medium">
                  {d.import.autoGenerateNotice}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Scan Modal */}
      <AnimatePresence>
        {showScanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-[#18080F]/60 backdrop-blur-md">
            <motion.div
              id="tour-scan-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] relative custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-orange-500 overflow-hidden">
                <motion.div 
                  className="h-full bg-white/30 w-1/3"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div>
                  <div className="flex items-center gap-2 text-orange-500 mb-1">
                    <Signal className="w-3.5 h-3.5 animate-ping" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{d.bulkScan.activeSystem}</span>
                  </div>
                  <h3 id="tour-scan-modal-title" className="text-2xl md:text-3xl font-black text-[#18080F]">{d.bulkScan.title}</h3>
                  <p className="text-xs md:text-sm text-gray-400 font-medium">{d.bulkScan.instruction}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsBulkScanning(false);
                    setShowScanModal(false);
                    setBulkScanError(null);
                    if (runTour && tourStepIndex === 6) {
                      setTourStepIndex(7);
                    }
                  }}
                  className="p-2.5 md:p-3 bg-gray-50 hover:bg-gray-100 rounded-xl md:rounded-2xl transition-colors group"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Visual Radar / Error State */}
                {bulkScanError ? (
                  <div className="aspect-square bg-red-50/50 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-red-100 p-6 min-h-[220px]">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                    </div>
                    <p className="text-sm font-black text-red-600 mb-2">
                      {locale === 'id' ? "Gagal Memulai Pemindaian" : "Failed to Start Scan"}
                    </p>
                    <p className="text-[11px] md:text-xs font-semibold text-red-500/80 mb-5 max-w-[200px] leading-relaxed mx-auto text-center">
                      {bulkScanError}
                    </p>
                    <button
                      onClick={() => {
                        setBulkScanError(null);
                        startBulkScan();
                      }}
                      className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 z-20 cursor-pointer"
                    >
                      {locale === 'id' ? "Coba Lagi" : "Try Again"}
                    </button>
                  </div>
                ) : isProcessingTap ? (
                  <div className="aspect-square bg-blue-50/30 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-blue-100 min-h-[220px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-32 h-32 md:w-48 md:h-48 border-2 border-blue-200 rounded-full"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-blue-500 relative z-10 mb-3 md:mb-4 animate-spin" />
                    <p className="text-xs md:text-sm font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                      {locale === 'id' ? "Memproses..." : "Processing..."}
                    </p>
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-gray-100 min-h-[220px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-32 h-32 md:w-48 md:h-48 border-2 border-orange-200 rounded-full"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="w-32 h-32 md:w-48 md:h-48 border-2 border-orange-200 rounded-full"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                    <Radio className="w-12 h-12 md:w-16 md:h-16 text-orange-500 relative z-10 mb-3 md:mb-4 animate-pulse" />
                    <p className="text-xs md:text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">{d.bulkScan.waiting}</p>
                  </div>
                )}

                {/* Scan Logs */}
                <div className="flex flex-col h-[250px] md:h-[300px]">
                  <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-3 md:mb-4 flex justify-between">
                    <span>{d.bulkScan.activity}</span>
                    <span className="text-orange-500">{scanLogs.length} {d.bulkScan.detected}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2.5 md:space-y-3 pr-2 custom-scrollbar">
                    {scanLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-2xl md:rounded-3xl">
                        <p className="text-xs md:text-sm text-gray-300 font-medium italic">{d.bulkScan.noActivity}</p>
                      </div>
                    ) : (
                      scanLogs.map((log, i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex items-center justify-between gap-3 md:gap-4 ${
                            log.status === 'success' 
                              ? 'bg-green-50 border-green-100' 
                              : log.status === 'warning'
                                ? 'bg-amber-50 border-amber-100'
                                : 'bg-red-50 border-red-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${
                              log.status === 'success' 
                                ? 'bg-white text-green-500' 
                                : log.status === 'warning'
                                  ? 'bg-white text-amber-500'
                                  : 'bg-white text-red-500'
                            }`}>
                              {log.status === 'success' && <CheckCircle2 className="w-4 h-4 md:w-5 h-5" />}
                              {log.status === 'warning' && <AlertCircle className="w-4 h-4 md:w-5 h-5" />}
                              {log.status === 'error' && <AlertTriangle className="w-4 h-4 md:w-5 h-5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-[#18080F] truncate">{log.student_name}</p>
                              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">{log.class_name} • {log.time}</p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              log.status === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : log.status === 'warning'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {log.status === 'success' && "Hadir"}
                              {log.status === 'warning' && "Sudah Absen"}
                              {log.status === 'error' && "Gagal"}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-orange-50 rounded-xl md:rounded-2xl border border-orange-100">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <p className="text-[10px] md:text-xs text-orange-800 font-medium leading-relaxed">
                  <strong>Tips:</strong> {d.bulkScan.tips}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[200] bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 font-bold text-sm w-[90%] max-w-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <GuidedTour
        key={`attendance-${tourKey}`}
        pageKey="attendance"
        steps={tourSteps}
        run={runTour}
        onClose={handleTourClose}
        stepIndex={tourStepIndex}
        callback={handleTourCallback}
      />
      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        type={toastType} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}
