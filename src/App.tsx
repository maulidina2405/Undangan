/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Home,
  Users,
  Map as MapIcon,
  MessageSquare,
  Volume2,
  VolumeX,
  Music,
  Gift,
  Image as ImageIcon,
  Copy,
  ChevronDown,
  Send
} from 'lucide-react';
import musicSource from './assets/Musik.mp3';
import vintageBg from './assets/vintage_wedding_bg.png';
import quoteBg from './assets/quote_section_bg.png';
import coupleBg from './assets/couple_section_bg.png';
import countdownBg from './assets/countdown_bg.png';
import eventSectionBg from './assets/event_section_bg.png';
import eventCardBg from './assets/event_card_bg.png';
import storySectionBg from './assets/story_section_bg.png';
import saveTheDateCouple from './assets/save_the_date_couple.jpg';
import brideProfile from './assets/bride_profile.jpg';
import groomProfile from './assets/groom_profile.jpg';
import countdownCouple from './assets/countdown_couple.jpg';
import gallery1 from './assets/gallery_1.jpg';
import gallery2 from './assets/gallery_2.jpg';
import gallery3 from './assets/gallery_3.jpg';
import gallery4 from './assets/gallery_4.jpg';
import closingCouple from './assets/closing_couple.jpg';






// --- Constants & Types ---
const TARGET_DATE = new Date('2026-05-31T07:00:00');

const smoothTransition = {
  duration: 1.5
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 1.2 } }
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// --- Components ---

const GununganSVG = ({ className, color = "currentColor" }: { className?: string, color?: string }) => (
  <svg className={className} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L95 120H5L50 5Z" stroke={color} strokeWidth="1" />
    <path d="M50 20V120" stroke={color} strokeWidth="0.5" />
    <circle cx="50" cy="70" r="20" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
    <path d="M30 150H70M50 120V150" stroke={color} strokeWidth="1" />
    <path d="M50 40Q70 50 80 80M50 50Q30 60 20 80" stroke={color} strokeWidth="0.5" />
  </svg>
);

const ButterflySVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 25C20 25 25 15 35 15C35 15 38 20 30 25C38 30 35 35 35 35C25 35 20 25 20 25Z" fill="#D4AF37" fillOpacity="0.8" />
    <path d="M20 25C20 25 15 15 5 15C5 15 2 20 10 25C2 30 5 35 5 35C15 35 20 25 20 25Z" fill="#D4AF37" fillOpacity="0.8" />
    <path d="M20 15V35" stroke="#1A237E" strokeWidth="1" />
  </svg>
);

const FlowerSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="10" fill="#D4AF37" opacity="0.6" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <ellipse key={angle} cx="50" cy="30" rx="15" ry="25" fill="white" transform={`rotate(${angle} 50 50)`} opacity="0.9" />
    ))}
  </svg>
);

const BatikBorder = ({ position = 'top' }: { position?: 'top' | 'bottom' }) => (
  <div className={`absolute left-0 w-full h-12 overflow-hidden z-20 pointer-events-none ${position === 'top' ? 'top-0' : 'bottom-0 rotate-180'}`}>
    <div className="flex w-[200%] opacity-20">
      {[...Array(20)].map((_, i) => (
        <svg key={i} width="60" height="40" viewBox="0 0 60 40" fill="none">
          <path d="M0 40 Q15 0 30 40 Q45 0 60 40" stroke="#D4AF37" strokeWidth="2" fill="none" />
          <path d="M15 40 Q30 10 45 40" stroke="#1A237E" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  </div>
);

export default function App() {
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [adminGuestInput, setAdminGuestInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      if (isOpen && !isMuted) {
        audioRef.current.play().catch((err) => {
          console.log("Audio playback blocked: ", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isOpen, isMuted]);
  const [showGiftCards, setShowGiftCards] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Parallax Setup
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const gununganY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE.getTime() - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor berhasil disalin!');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateInviteLink = () => {
    if (!adminGuestInput) {
      alert('Tulis nama tamu terlebih dahulu!');
      return;
    }
    const baseUrl = window.location.origin + window.location.pathname;
    const inviteUrl = `${baseUrl}?to=${encodeURIComponent(adminGuestInput)}`;
    const message = `Assalamu'alaikum Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${adminGuestInput}* untuk menghadiri acara pernikahan kami.\n\nBerikut link undangan kami:\n${inviteUrl}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Music (Local HTML5 Audio) */}
      <audio ref={audioRef} src={musicSource} loop preload="auto" />

      {/* 1. Cinematic Opening (Cover) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={smoothTransition}
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
          >
            {/* Unified Premium Background */}
            <div className="absolute inset-0 z-0">
              <img src={vintageBg} alt="Wedding Background" className="w-full h-full object-cover" />
            </div>

            {/* Central Content (Perfectly Overlaying the Golden Oval) */}
            <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-8 text-center px-4">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="animate-gentle-float w-full max-w-[290px] flex flex-col items-center justify-center space-y-4 py-6 px-4"
              >
                <div className="space-y-2">
                  <motion.div variants={fadeInUp} className="space-y-1 mb-1">
                    <p className="text-lg font-serif text-gold-accent select-none">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <p className="text-[7px] font-sans font-bold tracking-[0.2em] text-royal-blue/60 uppercase leading-relaxed max-w-[240px] mx-auto">
                      ATAS BERKAT ROCHMAT ALLOH YANG MAHA KUASA
                    </p>
                  </motion.div>
                  <motion.p variants={fadeInUp} className="font-serif italic text-royal-blue/70 text-xs mb-0.5">The Wedding of</motion.p>
                  <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-accent text-gold-accent leading-tight">
                    Yayang <br />
                    <span className="text-2xl">&</span> <br />
                    Irfan
                  </motion.h1>
                  <motion.div variants={fadeInUp} className="w-12 h-[1px] bg-royal-blue/30 mx-auto" />
                </div>

                <motion.div variants={fadeInUp} className="space-y-2.5">
                  <p className="font-sans text-[10px] font-medium text-navy-indigo/70 tracking-widest uppercase mb-1">Minggu, 31 Mei 2026</p>

                  <div className="mb-3 py-1.5 border-y border-royal-blue/10">
                    <p className="text-[9px] font-medium text-royal-blue/60 uppercase tracking-[0.2em] mb-0.5 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <p className="text-lg font-serif text-royal-blue font-bold tracking-wide italic">{guestName}</p>
                  </div>

                  <button
                    onClick={handleOpen}
                    className="group relative px-10 py-3 bg-royal-blue text-white rounded-full font-bold tracking-widest text-[10px] hover:bg-gold-accent hover:text-royal-blue transition-all duration-300 shadow-xl overflow-hidden"
                  >
                    <span className="relative z-10">BUKA UNDANGAN</span>
                    <motion.div
                      className="absolute inset-0 bg-gold-accent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main ref={containerRef} className={`bg-ivory paper-texture transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {/* Helper for parallax gunungan */}
        <motion.div
          style={{ y: gununganY }}
          className="fixed left-1/2 -translate-x-1/2 top-40 opacity-[0.03] pointer-events-none z-0"
        >
          <GununganSVG className="w-[80vw] h-auto text-royal-blue" />
        </motion.div>

        {/* 2. Hero Section */}
        <section id="home" className="relative py-20 min-h-[600px] flex flex-col items-center justify-center p-8 text-center overflow-hidden">

          {/* Scenic Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={vintageBg} alt="Hero Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="w-full max-w-[290px] flex flex-col items-center justify-center space-y-4 py-6 px-4 z-10 animate-gentle-float"
          >
            <div className="space-y-2">
              <motion.div variants={fadeInUp} className="space-y-1 mb-1">
                <p className="text-lg font-serif text-gold-accent select-none">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="text-[7px] font-sans font-bold tracking-[0.2em] text-royal-blue/60 uppercase leading-relaxed max-w-[240px] mx-auto">
                  ATAS BERKAT ROCHMAT ALLOH YANG MAHA KUASA
                </p>
              </motion.div>
              <motion.p variants={fadeInUp} className="font-serif text-xs text-royal-blue/80 italic tracking-widest">The Wedding of</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl font-accent text-gold-accent leading-tight">
                Yayang <br />
                <span className="text-2xl">&</span> <br />
                Irfan
              </motion.h2>
              <motion.p variants={fadeInUp} className="font-serif text-sm text-royal-blue/60 mt-2 tracking-widest">31 . 05 . 2026</motion.p>
              <div className="w-12 h-[1px] bg-royal-blue/30 mx-auto mt-3" />
            </div>

            <motion.button
              variants={fadeInUp}
              onClick={() => scrollToSection('quote')}
              className="btn-save-date"
            >
              Save The Date
            </motion.button>
          </motion.div>
        </section>

        {/* 3. Quote Section (Image 3) */}
        <section id="quote" className="py-16 px-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Elegant Blue & White Floral Corner Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[6%] -bottom-[6%] -left-[6%] -right-[6%] w-[112%] h-[112%] overflow-hidden">
              <img src={quoteBg} alt="Quote Background" className="w-full h-full object-cover opacity-95" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ivory to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl mb-12 relative aspect-[3/4] z-10"
          >
            <img src={saveTheDateCouple} alt="Couple Quote" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-center space-y-6 max-w-md px-4 relative z-10"
          >
            <p className="font-serif text-[13px] leading-relaxed text-royal-blue/80 italic font-medium px-4">
              'Dan nikahkanlah orang-orang yang sendirian di antara kamu, dan orang-orang yang layak (berkawin) dari hamba-hamba sahayamu yang lelaki dan hamba-hamba sahayamu yang perempuan. Jika mereka miskin Allah akan memampukan mereka dengan karunia-Nya. Dan Allah Maha luas (pemberian-Nya) lagi Maha Mengetahui.'
            </p>
            <div className="w-8 h-[1px] bg-gold-accent mx-auto" />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 font-sans tracking-widest font-sans">(QS. An-Nur: 32)</p>
          </motion.div>
        </section>

        {/* 4. Individual Profiles (Circular - Image 4 & 5) */}
        <section id="couple" className="py-16 px-8 flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden">
          {/* Beautiful Blue Sky & Batik Border Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={coupleBg} className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" alt="Couple Section Background" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ivory to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-6 z-10 relative max-w-md mx-auto"
          >
            <p className="font-accent text-gold-accent text-4xl py-2">Bride & Groom</p>
            <p className="font-serif text-[13px] leading-relaxed text-royal-blue/80 italic font-medium px-4">
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasang. Ya Allah berkatilah pernikahan kami:
            </p>
          </motion.div>

          {/* Bride (Image 5) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center space-y-8 z-10 relative"
          >
            <div className="w-56 h-72 rounded-full shadow-2xl overflow-hidden relative z-10">
              <img src={brideProfile} alt="Yayang Profile" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-serif text-royal-blue">Yayang Aisyawa Syakhilla</h4>
              <p className="text-[11px] font-medium opacity-50 uppercase tracking-widest mt-2 max-w-[250px] mx-auto leading-relaxed">Putri pertama dari Bapak Sali <br /> & Ibu Indah Malisya yatin</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 w-full justify-center opacity-40 z-10 relative">
            <div className="h-[1px] w-12 bg-gold-accent" />
            <span className="text-4xl font-serif text-gold-accent italic">dan</span>
            <div className="h-[1px] w-12 bg-gold-accent" />
          </div>

          {/* Groom (Image 4) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center space-y-8 z-10 relative"
          >
            <div className="w-56 h-72 rounded-full shadow-2xl overflow-hidden relative z-10">
              <img src={groomProfile} alt="Irfan Profile" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-serif text-royal-blue">Mochammad Irfan Arifin</h4>
              <p className="text-[11px] font-medium opacity-50 uppercase tracking-widest mt-2 max-w-[250px] mx-auto leading-relaxed">Putra Ketiga dari Bapak Rohmat <br /> & Ibu Chusnia</p>
            </div>
          </motion.div>
        </section>

        {/* 5. Save The Date Countdown (Steel Blue Floral - Image 6) */}
        <section id="countdown" className="relative py-16 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
          {/* Steel Blue & Top Floral Border Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={countdownBg}
              alt="Countdown Background"
              className="absolute -top-20 -bottom-20 -left-20 -right-20 w-[calc(100%+10rem)] h-[calc(100%+10rem)] object-cover origin-center"
              style={{ transform: 'scale(1.6) rotate(-2.2deg)' }}
            />
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-ivory to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#507290] to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="z-10 space-y-8 max-w-md mx-auto"
          >
            {/* Couple Card Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl mb-4 aspect-[3/4] mx-auto"
            >
              <img src={countdownCouple} alt="Couple Countdown" className="w-full h-full object-cover" />
            </motion.div>

            <h2 className="text-5xl font-accent text-white drop-shadow-md">Save The Date</h2>

            <div className="flex gap-3 justify-center">
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="bg-white text-royal-blue w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg border border-royal-blue/10">
                  <span className="text-xl font-bold leading-none">{item.value}</span>
                  <span className="text-[9px] uppercase font-bold tracking-tighter opacity-70 mt-1 italic">{item.label}</span>
                </div>
              ))}
            </div>

            <p className="text-[12px] font-sans text-white/90 max-w-xs mx-auto leading-relaxed drop-shadow-sm px-2">
              Dengan segala kerendahan hati dan ucapan Syukur atas Rahmat Allah SWT kami bermaksud mengundang Bapak/Ibu/Saudara/I untuk hadir di acara pernikahan kami, yang Insya Allah akan dilaksanakan pada:
            </p>
          </motion.div>
        </section>

        {/* 6. Event Details Section (Cards - Image 7 & 8) */}
        <section id="event" className="py-16 px-8 space-y-8 flex flex-col items-center bg-[#507290] relative overflow-hidden">

          {/* Elegant Floral Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={eventSectionBg} alt="Event Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#507290] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center space-y-2 mb-10 z-10"
          >
            <h2 className="text-5xl font-accent text-white tracking-widest leading-loose">Detail Acara</h2>
          </motion.div>

          {/* Akad (Image 7) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="event-card w-full max-w-md text-center space-y-8 z-10 pb-20"
          >
            <h4 className="text-4xl font-accent text-gold-accent pb-2">Akad Nikah</h4>

            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-royal-blue/60">Minggu, 31 Mei 2026</p>
                <p className="text-2xl font-serif text-royal-blue">Pukul 07.00 WIB - Selesai</p>
              </div>
            </div>

            <div className="w-24 h-[1px] bg-gold-accent/40 mx-auto" />

            <div className="space-y-2">
              <p className="text-lg font-serif text-royal-blue">Kediaman Mempelai Wanita</p>
              <p className="text-sm opacity-70 leading-relaxed max-w-[240px] mx-auto font-medium text-royal-blue">Lemahbang Sukorejo, Pasuruan, Jawa Timur</p>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-7.6970224,112.7104578" target="_blank" rel="noreferrer"
              className="btn-primary mt-6 hover:scale-105"
            >
              <MapPin className="w-4 h-4" /> Lokasi Acara
            </a>
          </motion.div>

          {/* Resepsi (Image 8) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="event-card w-full max-w-md text-center space-y-8 z-10 pb-20"
          >
            <h4 className="text-4xl font-accent text-gold-accent pb-2">Resepsi</h4>

            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-royal-blue/60">Minggu, 31 Mei 2026</p>
                <p className="text-2xl font-serif text-royal-blue">Pukul 10.00 WIB - Selesai</p>
              </div>
            </div>

            <div className="w-24 h-[1px] bg-gold-accent/40 mx-auto" />

            <div className="space-y-2">
              <p className="text-lg font-serif text-royal-blue">Kediaman Mempelai Wanita</p>
              <p className="text-sm opacity-70 leading-relaxed max-w-[240px] mx-auto font-medium text-royal-blue">Lemahbang Sukorejo, Pasuruan, Jawa Timur</p>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-7.6970224,112.7104578" target="_blank" rel="noreferrer"
              className="btn-primary mt-6 hover:scale-105"
            >
              <MapPin className="w-4 h-4" /> Lokasi Acara
            </a>
          </motion.div>
        </section>

        {/* 7. Love Story Section (Image 9 & 10) - Hidden as requested
        <section id="story" className="py-12 px-8 relative overflow-hidden flex flex-col items-center bg-ivory">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[8%] -bottom-[8%] -left-[8%] -right-[8%] w-[116%] h-[116%] overflow-hidden">
              <img src={storySectionBg} alt="Misty Background" className="w-full h-full object-cover scale-115 origin-center" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 space-y-4 z-10"
          >
            <GununganSVG className="w-16 h-16 mx-auto text-gold-accent opacity-60" />
            <h2 className="text-5xl font-accent text-gold-accent tracking-widest leading-none">Love Story</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl mb-8 border-4 border-white z-10"
          >
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="Story Intro" className="w-full h-full object-cover" />
          </motion.div>

          <div className="w-full max-w-sm space-y-8 py-4 z-10">
            <div className="story-line">
              <div className="story-dot" />
              <div className="space-y-2">
                <h5 className="text-2xl font-accent text-gold-accent">Awal Cerita</h5>
                <p className="text-[13px] font-serif leading-relaxed opacity-70 italic">
                  Berawal dari teman kuliah bersama-sama memperjuangkan S1 Teknik Sipil, bertemu pada tahun 2016 hingga selalu bertemu untuk sesekali makan bersama.
                </p>
              </div>
            </div>

            <div className="story-line">
              <div className="story-dot" />
              <div className="space-y-2">
                <h5 className="text-2xl font-accent text-gold-accent">Menjalin Hubungan</h5>
                <p className="text-[13px] font-serif leading-relaxed opacity-70 italic">
                  Lalu menjalin hubungan pacaran pada 11-11-2017. Perjalanan panjang yang penuh dengan tawa dan dukungan satu sama lain.
                </p>
              </div>
            </div>

            <div className="story-line">
              <div className="story-dot" />
              <div className="space-y-2">
                <h5 className="text-2xl font-accent text-gold-accent">Pernikahan</h5>
                <p className="text-[13px] font-serif leading-relaxed opacity-70 italic">
                  Hingga akhirnya kami memutuskan untuk mengikat janji suci pada hari yang penuh bahagia ini, Minggu 31 Mei 2026.
                </p>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* 11. Gallery Section (Images 11 & 12) */}
        <section id="gallery" className="py-12 px-8 relative overflow-hidden flex flex-col items-center bg-ivory">
          {/* Misty Watercolor Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[8%] -bottom-[8%] -left-[8%] -right-[8%] w-[116%] h-[116%] overflow-hidden">
              <img src={storySectionBg} alt="Misty Background" className="w-full h-full object-cover scale-115 origin-center" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#507290] to-transparent pointer-events-none z-10" />
          </div>

          <BatikBorder position="top" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-8 z-10"
          >
            <h2 className="text-5xl font-accent text-gold-accent leading-loose">Galeri Foto</h2>
          </motion.div>

          <div className="w-full max-w-lg space-y-4 px-2 relative z-10">
            {/* Large Main Photo (Image 11) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
            >
              <img src={gallery1} className="gallery-photo" alt="Gallery 1" />
            </motion.div>

            {/* Grid Layout (Image 12) */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img src={gallery2} className="gallery-photo" alt="Gallery 2" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img src={gallery3} className="gallery-photo" alt="Gallery 3" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="col-span-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img src={gallery4} className="gallery-photo" alt="Gallery 4" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 12. Wedding Gift Section (Images 13 & 14) */}
        <section id="gift" className="py-16 px-6 relative overflow-hidden flex flex-col items-center justify-center bg-[#507290]">

          {/* Elegant Floral Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={eventSectionBg} alt="Gift Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#507290] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#507290] to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md bg-[#FDFCF0]/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-gold-accent/30 shadow-2xl relative overflow-hidden z-10 flex flex-col items-center text-center space-y-6"
          >
            <h2 className="text-5xl font-accent text-gold-accent leading-loose mt-4">Wedding Gift</h2>
            <p className="text-sm font-serif italic text-royal-blue max-w-xs mx-auto leading-relaxed">
              Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan hadiah pernikahan dapat melalui rekening di bawah ini:
            </p>

            <button
              onClick={() => setShowGiftCards(!showGiftCards)}
              className="btn-primary mt-2"
            >
              <Gift className="w-4 h-4" /> {showGiftCards ? 'Tutup' : 'Klik Disini'}
            </button>

            {/* Account Cards (Image 14) */}
            <AnimatePresence>
              {showGiftCards && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full space-y-4 pt-4 overflow-hidden z-10"
                >
                  {/* BCA Card 1 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gift-card text-royal-blue w-full"
                  >
                    <div className="flex justify-between w-full items-start">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" className="h-6 w-auto" alt="BCA" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-lg font-bold tracking-widest uppercase">1991591147</p>
                      <p className="text-[10px] opacity-60 font-medium uppercase">YAYANG AISYAWA SYAKHILLA</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard('1991591147')}
                      className="gift-card-copy"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </motion.div>

                  {/* BCA Card 2 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gift-card text-royal-blue w-full"
                  >
                    <div className="flex justify-between w-full items-start">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" className="h-6 w-auto" alt="BCA" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-lg font-bold tracking-widest uppercase">8945190058</p>
                      <p className="text-[10px] opacity-60 font-medium uppercase">MOH IRFAN ARIFIN</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard('8945190058')}
                      className="gift-card-copy"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </motion.div>

                  {/* Send Gift Address Card Removed */}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-12" />
          </motion.div>
        </section>

        {/* 8. Location Section */}
        <section id="maps" className="py-16 px-8 flex flex-col items-center justify-center text-center bg-[#507290] text-ivory relative overflow-hidden">
          <BatikBorder position="top" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="max-w-md space-y-10 z-10"
          >
            <div className="bg-white/10 p-5 w-fit mx-auto rounded-full text-gold-accent backdrop-blur-md border border-white/20">
              <MapPin className="w-10 h-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-gold-accent">Lokasi Acara</h2>
              <div className="w-12 h-[1px] bg-gold-accent/30 mx-auto" />
            </div>

            <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="font-serif text-xl">Kediaman Mempelai Wanita</p>
              <p className="text-sm font-light opacity-80 leading-relaxed max-w-[250px] mx-auto">Lemahbang Sukorejo, Pasuruan, Provinsi Jawa Timur 67161</p>
            </div>

            <div className="w-full h-56 bg-white/10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Map Preview" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-gold-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <div className="w-2 h-2 bg-royal-blue rounded-full animate-ping" />
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-7.6970224,112.7104578" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-3 px-12 py-4 bg-gold-accent text-royal-blue rounded-full font-bold shadow-xl hover:bg-ivory transition-all transform hover:-translate-y-1"
            >
              PETUNJUK LOKASI <MapIcon className="w-4 h-4" />
            </a>
          </motion.div>
        </section>

        {/* 9. RSVP / Footer (Image 15) */}
        <section id="rsvp" className="py-16 px-6 relative overflow-hidden flex flex-col items-center justify-center bg-[#507290]">
          <BatikBorder position="bottom" />

          {/* Elegant Floral Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={eventSectionBg} alt="RSVP Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#507290] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#507290] to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md bg-[#FDFCF0]/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-gold-accent/30 shadow-2xl relative overflow-hidden z-10 flex flex-col items-center text-center space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-5xl font-accent text-gold-accent leading-loose mt-4">Ucapkan Sesuatu</h2>
              <p className="text-[11px] font-serif italic text-royal-blue/60 leading-relaxed max-w-[250px] mx-auto font-medium">
                Berikan ucapan harapan dan do'a kepada kedua mempelai
              </p>
            </div>

            <p className="text-xs font-bold text-royal-blue/40 uppercase tracking-widest italic">0 Comments</p>

            <div className="flex gap-4 w-full">
              <div className="rsvp-stat-box bg-green-50/80 border border-green-200">
                <span className="text-3xl font-bold text-green-700">0</span>
                <span className="text-[10px] uppercase font-bold text-green-600/80 tracking-widest">Hadir</span>
              </div>
              <div className="rsvp-stat-box bg-red-50/80 border border-red-200">
                <span className="text-3xl font-bold text-red-700">0</span>
                <span className="text-[10px] uppercase font-bold text-red-600/80 tracking-widest">Tidak Hadir</span>
              </div>
            </div>

            <form className="w-full text-left" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Nama" className="rsvp-input" />
              <textarea placeholder="Ucapan" rows={4} className="rsvp-input" />
              <div className="relative mb-6">
                <select className="rsvp-input appearance-none bg-white">
                  <option value="">Konfirmasi Kehadiran</option>
                  <option value="hadir">Peserta / Hadir</option>
                  <option value="tidak-hadir">Berhalangan / Tidak Hadir</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-blue/40 pointer-events-none" />
              </div>

              <button className="w-full py-4 bg-royal-blue text-white rounded-full font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-gold-accent hover:text-royal-blue transition-all">
                Kirim <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-6 pb-2 opacity-40 text-[10px] tracking-widest font-light text-royal-blue">
              DESIGNED WITH LOVE FOR YAYANG & IRFAN
            </div>

            <div className="h-12" />
          </motion.div>
        </section>

        {/* 13. Closing Section (Image 16) */}
        <section id="closing" className="py-16 px-8 flex flex-col items-center justify-center relative text-center overflow-hidden">
          {/* Scenic Background Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={eventSectionBg} alt="Closing Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover scale-110 origin-center" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#507290] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#507290] to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-sm bg-[#FDFCF0]/95 backdrop-blur-md rounded-[2.5rem] p-8 border border-gold-accent/30 shadow-2xl relative overflow-hidden z-10 text-center space-y-10"
          >
            <div className="arch-frame aspect-[4/5] w-64 mx-auto">
              <img src={closingCouple} alt="Closing Couple" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            <div className="space-y-6">
              <p className="text-[12px] font-serif italic text-royal-blue/90 leading-relaxed max-w-[280px] mx-auto">
                "Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih."
              </p>

              <div className="space-y-4 pt-4 border-t border-gold-accent/10">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-royal-blue/40 font-sans">Kami yang berbahagia,</p>
                <h3 className="text-5xl font-accent text-gold-accent drop-shadow-sm">Yayang & Irfan</h3>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Admin Link Generator Section */}
        <section className="py-16 px-6 relative overflow-hidden flex flex-col items-center justify-center bg-[#507290]">
          {/* Elegant Floral Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={eventSectionBg} alt="Admin Background" className="absolute -top-12 -bottom-12 left-0 right-0 w-full h-[calc(100%+6rem)] object-cover" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#507290] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md bg-[#FDFCF0]/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-gold-accent/30 shadow-2xl relative overflow-hidden z-10 flex flex-col items-center text-center space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-4xl font-accent text-gold-accent leading-loose mt-4">Invitation Link Generator</h3>
              <p className="text-[11px] font-serif italic text-royal-blue/60 leading-relaxed max-w-[250px] mx-auto font-medium">
                Ketik nama tamu untuk meng-generate link undangan & kirim ke WhatsApp
              </p>
            </div>

            <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="Nama Tamu..."
                className="rsvp-input text-center font-medium placeholder-royal-blue/30"
                value={adminGuestInput}
                onChange={(e) => setAdminGuestInput(e.target.value)}
              />
              <button
                onClick={generateInviteLink}
                className="w-full py-4 bg-royal-blue text-white rounded-full font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-gold-accent hover:text-royal-blue transition-all cursor-pointer"
              >
                GENERATE & KIRIM WHATSAPP <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4" />
          </motion.div>
        </section>

      </main>

      {/* Music Control */}
      {isOpen && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-20 right-4 z-[90] p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-royal-blue shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
        </button>
      )}
    </div>
  );
}
