import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface SlideData {
  id: string;
  slug: string;
  tagEn: string;
  tagZh: string;
  headlineEn: string;
  headlineZh: string;
  taglineEn: string;
  taglineZh: string;
  priceUsd: number;
  imageUrl: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'e30',
    slug: 'kylin-e30-titanium-maxon',
    tagEn: 'FLAGSHIP TITANIUM',
    tagZh: '旗舰钛合金',
    headlineEn: 'Kylin E30 Titanium',
    headlineZh: 'Kylin E30 钛金',
    taglineEn: 'Swiss Maxon Core. Surgical Precision.',
    taglineZh: '瑞士原厂 Maxon 医用电机 · 极致超低震颤',
    priceUsd: 260.0,
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'black-ghost',
    slug: 'kylin-black-ghost-handmade-brass',
    tagEn: 'SOLID BRASS HERITAGE',
    tagZh: '纯铜传世名器',
    headlineEn: 'Black Ghost & R07',
    headlineZh: '黑鬼 & R07 纯铜',
    taglineEn: 'Hand-Cast Solid Brass. Unrelenting Power.',
    taglineZh: '65纯铜古法失蜡精铸 · 10圈手工线圈',
    priceUsd: 250.0,
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 't7max',
    slug: 'kylin-t7max-wireless-pen',
    tagEn: 'WIRELESS FREEDOM',
    tagZh: '调频双电无线',
    headlineEn: 'T7max Variable-Stroke',
    headlineZh: 'T7max 刻度调频',
    taglineEn: 'Instant Click Dial. 14-Hour Magnetic Power.',
    taglineZh: '2.4–4.2mm 旋钮即调 · 14小时磁吸续航',
    priceUsd: 350.0,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2400&q=95',
  },
];

const SLIDE_DURATION_MS = 6000;

export const HeroBannerSlides: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastTimeRef = useRef<number>(Date.now());

  const currentSlide = SLIDES[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SLIDES.length);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    lastTimeRef.current = Date.now();
  };

  // Progress ticker with hover pause
  useEffect(() => {
    lastTimeRef.current = Date.now();

    const interval = window.setInterval(() => {
      if (!isPaused) {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;

        setProgress(prev => {
          const next = prev + (delta / SLIDE_DURATION_MS) * 100;
          if (next >= 100) {
            nextSlide();
            return 0;
          }
          return next;
        });
      } else {
        lastTimeRef.current = Date.now();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      aria-label="Flagship Hardware Posters"
      className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-black text-white overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fullpage Background Visuals with Smooth Crossfade & Cinematic Scale */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.headlineEn}
              className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Cinematic Apple Master Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(197,160,89,0.15),transparent_65%)]" />
          </div>
        );
      })}

      {/* Pure Apple Keynote Distilled Typography */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center h-full pb-14 sm:pb-16">
        <div className="max-w-2xl">
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#c5a059] uppercase mb-2.5 sm:mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
            <span>{isZh ? currentSlide.tagZh : currentSlide.tagEn}</span>
          </div>

          {/* Bold Striking Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-2 sm:mb-3">
            {isZh ? currentSlide.headlineZh : currentSlide.headlineEn}
          </h1>

          {/* Crisp Single-Sentence Tagline */}
          <p className="text-sm sm:text-lg md:text-xl text-neutral-300 font-normal tracking-tight max-w-xl leading-snug mb-5 sm:mb-6">
            {isZh ? currentSlide.taglineZh : currentSlide.taglineEn}
          </p>

          {/* Action & Starting Price */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link
              to="/products/$slug"
              params={{ slug: currentSlide.slug }}
              className="apple-btn px-6 py-2.5 sm:py-3 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs sm:text-sm tracking-tight flex items-center gap-2 shadow-[0_8px_25px_rgba(197,160,89,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isZh ? '立即了解' : 'Explore'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>

            <a
              href="#catalog"
              className="apple-btn px-5 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-semibold tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isZh ? '全系机型' : 'View All'}</span>
            </a>

            <div className="flex items-baseline gap-1.5 pl-2 sm:pl-3 text-neutral-300">
              <span className="text-xs text-neutral-400 font-medium">
                {isZh ? '起售价' : 'From'}
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                ${currentSlide.priceUsd.toFixed(0)}
              </span>
              <span className="text-xs text-[#c5a059] font-semibold">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Apple Bottom Segmented Switcher */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between gap-4">
        {/* Progress Pills */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-md">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className="group relative py-2 flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className={`transition-colors ${isActive ? 'text-[#c5a059] font-bold' : 'text-neutral-500'}`}>
                    0{idx + 1}
                  </span>
                  <span className={`hidden sm:inline text-xs transition-colors ${isActive ? 'text-white font-medium' : 'text-neutral-500'}`}>
                    {isZh
                      ? idx === 0 ? 'E30 钛金' : idx === 1 ? '黑鬼 纯铜' : 'T7max 无线'
                      : idx === 0 ? 'E30 Titanium' : idx === 1 ? 'Black Ghost' : 'T7max Wireless'}
                  </span>
                </div>

                <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c5a059] transition-all rounded-full"
                    style={{
                      width: isActive ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                      transitionDuration: isActive ? '40ms' : '200ms',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Minimal Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="apple-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/15 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="apple-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/15 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
