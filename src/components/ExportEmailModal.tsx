import React, { useState } from 'react';
import { InspectionReport } from '../types/report';
import {
  generatePdfBlobFromPages,
  downloadPdfBlob,
  openMailto,
} from '../utils/pdfGenerator';
import { getReportFileName } from '../utils/reportLogic';
import {
  X,
  FileDown,
  Mail,
  Loader2,
  CheckCircle,
  Send,
} from 'lucide-react';

interface ExportEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: InspectionReport;
  getPage1Element: () => HTMLElement | null;
  getPage2Element: () => HTMLElement | null;
  onUpdateRecipientEmail: (email: string) => void;
}

export function ExportEmailModal({
  isOpen,
  onClose,
  report,
  getPage1Element,
  getPage2Element,
  onUpdateRecipientEmail,
}: ExportEmailModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState(
    report.recipientEmail || ''
  );

  if (!isOpen) return null;

  const fileName = getReportFileName(report);

  const getBlob = async (): Promise<Blob | null> => {
    const page1 = getPage1Element();
    const page2 = getPage2Element();
    if (!page1 || !page2) {
      setStatusMessage('Błąd: nie można odnaleźć stron raportu.');
      return null;
    }
    return await generatePdfBlobFromPages([page1, page2]);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage('Generowanie pliku PDF o wysokiej rozdzielczości...');
      const blob = await getBlob();
      if (blob) {
        downloadPdfBlob(blob, fileName);
        setStatusMessage(`Plik PDF (${fileName}) został pomyślnie zapisany na urządzeniu!`);
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Wystąpił błąd podczas generowania pliku PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMailtoDirect = () => {
    onUpdateRecipientEmail(recipientEmail);
    // Explicitly open mailto WITHOUT adding message body or report statistics
    openMailto(report, recipientEmail, false);
    setStatusMessage('Otwarto program pocztowy. Dołącz zapisany plik PDF.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Generuj PDF & Wyślij na e-mail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Wybierz opcję dla sporządzonego raportu odbioru
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Status Alert if any */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Recipient Email Input */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Adres e-mail odbiorcy
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                onUpdateRecipientEmail(e.target.value);
              }}
              placeholder="np. klient@domena.pl lub biuro@deweloper.pl"
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Two choices strictly: 1. Zapisz PDF, 2. Otwórz wiadomość e-mail (mailto) */}
          <div className="space-y-3 pt-1">
            {/* Choice 1: Zapisz PDF */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-left transition-all active:scale-[0.99] disabled:opacity-60 group flex items-start gap-3.5 shadow-lg shadow-black/20 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>Zapisz PDF</span>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Pobierz
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Pobierz raport w formacie PDF (2 strony A4) do pamięci urządzenia.
                </p>
              </div>
            </button>

            {/* Choice 2: Otwórz wiadomość e-mail (mailto) */}
            <button
              type="button"
              onClick={handleMailtoDirect}
              className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-left transition-all active:scale-[0.99] group flex items-start gap-3.5 shadow-lg shadow-black/20 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>Otwórz wiadomość e-mail (mailto)</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Klient poczty
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Otwórz program pocztowy z wpisanym odbiorcą i tematem wiadomości.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-slate-900/90 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
