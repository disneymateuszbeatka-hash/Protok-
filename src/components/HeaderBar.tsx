import React from 'react';
import { InspectionReport } from '../types/report';
import { calculateReportStats } from '../utils/reportLogic';
import {
  ClipboardCheck,
  FileText,
  RotateCcw,
  Sparkles,
  Share2,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Download,
  QrCode,
  Send,
} from 'lucide-react';

interface HeaderBarProps {
  report: InspectionReport;
  onNewReport: () => void;
  onLoadSample: () => void;
  onOpenExportModal: () => void;
  onOpenSavedModal: () => void;
  onOpenInstallModal: () => void;
  savedReportsCount: number;
}

export function HeaderBar({
  report,
  onNewReport,
  onLoadSample,
  onOpenExportModal,
  onOpenSavedModal,
  onOpenInstallModal,
  savedReportsCount,
}: HeaderBarProps) {
  const stats = calculateReportStats(report.items);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-3 sm:px-6 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Address */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                Raport Odbioru Lokalu
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Android & PDF
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 truncate max-w-[200px] sm:max-w-xs">
                {report.general.address || 'Nowy lokal'} • {report.general.clientName || 'Brak klienta'}
              </p>
            </div>
          </div>

          {/* Mobile primary share button */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1 active:scale-95"
              title="Zainstaluj aplikację na telefonie Android (APK / PWA)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android
            </button>
            <button
              type="button"
              onClick={onOpenExportModal}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              PDF & E-mail
            </button>
          </div>
        </div>

        {/* Stats Pill & Desktop Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          {/* Quick metric pills */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stats.okCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.defectCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium text-[11px]">
              {stats.percentComplete}%
            </span>
          </div>

          {/* Android APK install modal button */}
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Zainstaluj aplikację na telefonie z systemem Android (WebAPK / PWA)"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Zainstaluj na Android (APK)</span>
            <span className="md:hidden">Android</span>
          </button>

          {/* Quick Load Attachment Sample */}
          <button
            type="button"
            onClick={onLoadSample}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
            title="Wczytaj checklistę z załącznika (Kamil Sot, Stołeczna)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Wczytaj wzór z PDF</span>
            <span className="md:hidden">Wzór</span>
          </button>

          {/* New Report */}
          <button
            type="button"
            onClick={onNewReport}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
            title="Wyczyść formularz i rozpocznij nowy odbiór"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Nowy</span>
          </button>

          {/* Saved Reports */}
          <button
            type="button"
            onClick={onOpenSavedModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all relative"
            title="Historia raportów"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Zapisane ({savedReportsCount})</span>
          </button>

          {/* Desktop primary share button */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="hidden sm:flex px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Generuj PDF & Wyślij na E-mail
          </button>
        </div>
      </div>
    </header>
  );
}
