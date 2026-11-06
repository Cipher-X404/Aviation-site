import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_CONFIG } from '../../config/hero';
import { HeroSearchCard } from './HeroSearchCard';
import { ChevronDown, ArrowDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── Scene Definitions ───────────────────────── */

interface SceneContent {
  id: string;
  badge: string;
  headline: string;
  subheadline: string;
  start: number;
  end: number;
}

const SCENES: SceneContent[] = [
  {
    id: 'scene-1',
    badge: 'START WITH THE JOURNEY',
    headline: 'AEROVISTA',
    subheadline:
      'Plan a flight, find a place to stay, and keep the details together.',
    start: 0.0,
    end: 0.28,
  },
  {
    id: 'scene-2',
    badge: 'ROUTES TO CONSIDER',
    headline: 'ABOVE THE HORIZON',
    subheadline:
      'Fly direct from Lagos to regional capitals and global destinations across all cabin classes.',
    start: 0.28,
    end: 0.58,
  },
  {
    id: 'scene-3',
    badge: 'MAKE ROOM FOR THE STAY',
    headline: 'A PLACE TO STAY',
    subheadline:
      'Find a stay that suits your plans, with arrival dates close at hand.',
    start: 0.58,
    end: 0.82,
  },
  {
    id: 'scene-4',
    badge: 'PLAN THE DETAILS',
    headline: 'YOUR NEXT JOURNEY',
    subheadline:
      'Explore flights, hotels and payment-plan examples in one place.',
    start: 0.82,
    end: 1.0,
  },
];

const MAX_DPR = 1.5;
const CONCURRENT_LOADS = 16;

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Scene DOM refs for zero-overhead direct style manipulation */
  const scene0Ref = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);

  /* Frame state refs (non-reactive for maximum 120fps performance) */
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number>(0);
  const isMobileRef = useRef<boolean>(false);
  const totalFramesRef = useRef<number>(HERO_CONFIG.desktop.frameCount);
  const hasScrolledRef = useRef<boolean>(false);
  const scrollProgressRef = useRef<number>(0);

  /* Only high-level state changes trigger React re-renders */
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isFinalSceneActive, setIsFinalSceneActive] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const checkIsMobile = useCallback(() => window.innerWidth < 768, []);

  /** Draw a frame using cover math with fallback to closest loaded frame */
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const total = totalFramesRef.current;
    const images = imagesRef.current;

    // 1. Check target image
    let img = images[frameIndex - 1];

    // 2. Fallback to nearest loaded frame if target is still loading (eliminates glitch/freeze)
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < total; offset++) {
        const prev = frameIndex - 1 - offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]!.naturalWidth > 0) {
          img = images[prev];
          break;
        }
        const next = frameIndex - 1 + offset;
        if (next < total && images[next]?.complete && images[next]!.naturalWidth > 0) {
          img = images[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const canvasAspect = cw / ch;
    const imgAspect = iw / ih;

    let sx: number, sy: number, sw: number, sh: number;

    if (imgAspect > canvasAspect) {
      sh = ih;
      sw = ih * canvasAspect;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      sw = iw;
      sh = iw / canvasAspect;
      sx = 0;
      sy = (ih - sh) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Draw directly over without clearRect to avoid black/white frame flicker
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  /** Continuous lightweight render loop */
  const tick = useCallback(() => {
    const target = targetFrameRef.current;
    if (target !== currentFrameRef.current) {
      currentFrameRef.current = target;
      renderFrame(target);
    }
    rafIdRef.current = requestAnimationFrame(tick);
  }, [renderFrame]);

  /** Size canvas to viewport × capped DPR */
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  /* Detect reduced motion */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* High-speed parallel preloader with img.decode() */
  useEffect(() => {
    if (isReducedMotion) return;

    isMobileRef.current = checkIsMobile();
    const config = isMobileRef.current ? HERO_CONFIG.mobile : HERO_CONFIG.desktop;
    const totalFrames = config.frameCount;
    totalFramesRef.current = totalFrames;

    const images: (HTMLImageElement | null)[] = new Array<HTMLImageElement | null>(totalFrames).fill(null);
    imagesRef.current = images;

    let loaded = 0;

    const loadSingle = async (index: number): Promise<void> => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = config.framePath(index);

        const onReady = async () => {
          try {
            if ('decode' in img) {
              await img.decode();
            }
          } catch {
            // Ignore decode rejection, image will still render via drawImage
          }
          images[index - 1] = img;
          loaded++;
          setLoadedCount(loaded);

          // First frame renders instantly
          if (index === 1 && currentFrameRef.current === 1) {
            renderFrame(1);
          }
          resolve();
        };

        img.onload = () => void onReady();
        img.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
      });
    };

    // Parallel pool execution
    const runFastPreload = async () => {
      // Step 1: Guarantee frame 1 arrives first
      await loadSingle(1);

      // Step 2: Pool remaining frames with high concurrency
      const remainingIndices: number[] = [];
      for (let i = 2; i <= totalFrames; i++) {
        remainingIndices.push(i);
      }

      let currentIndex = 0;
      const worker = async () => {
        while (currentIndex < remainingIndices.length) {
          const idx = remainingIndices[currentIndex++];
          await loadSingle(idx);
        }
      };

      const workers: Promise<void>[] = [];
      for (let w = 0; w < Math.min(CONCURRENT_LOADS, remainingIndices.length); w++) {
        workers.push(worker());
      }
      await Promise.all(workers);
    };

    void runFastPreload();
  }, [isReducedMotion, checkIsMobile, renderFrame]);

  /* Canvas sizing & render loop */
  useEffect(() => {
    if (isReducedMotion) return;

    sizeCanvas();
    rafIdRef.current = requestAnimationFrame(tick);

    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [isReducedMotion, sizeCanvas, tick]);

  /* Direct DOM Scene Style Updater (runs in 0.02ms with ZERO React re-renders) */
  const updateSceneDOM = useCallback((progress: number) => {
    // Scene 0 (0.0 to 0.28)
    let op0 = 0, ty0 = 15;
    if (progress <= 0.2) {
      op0 = 1; ty0 = 0;
    } else if (progress < 0.28) {
      op0 = 1 - (progress - 0.2) / 0.08;
      ty0 = -(progress - 0.2) * 120;
    }

    // Scene 1 (0.28 to 0.58)
    let op1 = 0, ty1 = 15;
    if (progress >= 0.25 && progress < 0.32) {
      op1 = (progress - 0.25) / 0.07;
      ty1 = (1 - op1) * 15;
    } else if (progress >= 0.32 && progress <= 0.5) {
      op1 = 1; ty1 = 0;
    } else if (progress > 0.5 && progress < 0.58) {
      op1 = 1 - (progress - 0.5) / 0.08;
      ty1 = -(progress - 0.5) * 120;
    }

    // Scene 2 (0.58 to 0.82)
    let op2 = 0, ty2 = 15;
    if (progress >= 0.55 && progress < 0.62) {
      op2 = (progress - 0.55) / 0.07;
      ty2 = (1 - op2) * 15;
    } else if (progress >= 0.62 && progress <= 0.76) {
      op2 = 1; ty2 = 0;
    } else if (progress > 0.76 && progress < 0.82) {
      op2 = 1 - (progress - 0.76) / 0.06;
      ty2 = -(progress - 0.76) * 120;
    }

    // Scene 3 (0.82 to 1.0)
    let op3 = 0, ty3 = 20;
    if (progress >= 0.8 && progress < 0.86) {
      op3 = (progress - 0.8) / 0.06;
      ty3 = (1 - op3) * 20;
    } else if (progress >= 0.86) {
      op3 = 1; ty3 = 0;
    }

    if (scene0Ref.current) {
      scene0Ref.current.style.opacity = String(Math.max(0, Math.min(1, op0)));
      scene0Ref.current.style.transform = `translateY(${ty0}px)`;
      scene0Ref.current.style.pointerEvents = op0 > 0.4 ? 'auto' : 'none';
    }
    if (scene1Ref.current) {
      scene1Ref.current.style.opacity = String(Math.max(0, Math.min(1, op1)));
      scene1Ref.current.style.transform = `translateY(${ty1}px)`;
      scene1Ref.current.style.pointerEvents = op1 > 0.4 ? 'auto' : 'none';
    }
    if (scene2Ref.current) {
      scene2Ref.current.style.opacity = String(Math.max(0, Math.min(1, op2)));
      scene2Ref.current.style.transform = `translateY(${ty2}px)`;
      scene2Ref.current.style.pointerEvents = op2 > 0.4 ? 'auto' : 'none';
    }
    if (scene3Ref.current) {
      scene3Ref.current.style.opacity = String(Math.max(0, Math.min(1, op3)));
      scene3Ref.current.style.transform = `translateY(${ty3}px)`;
      scene3Ref.current.style.pointerEvents = op3 > 0.4 ? 'auto' : 'none';
    }
  }, []);

  /* GSAP ScrollTrigger: Instant snappy scrub with Lenis */
  useEffect(() => {
    if (isReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // Initialize scenes on mount
    updateSceneDOM(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=450%',
        pin: true,
        scrub: true, // Immediate 1:1 scrub with Lenis physics (eliminates rubber-band lag)
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          scrollProgressRef.current = progress;

          // Map progress directly to frame index
          const totalFrames = totalFramesRef.current;
          const frame = Math.max(1, Math.min(totalFrames, Math.round(progress * (totalFrames - 1)) + 1));
          targetFrameRef.current = frame;

          // Update scene DOM styles directly (no React overhead)
          updateSceneDOM(progress);

          // Update active dot index only when scene boundary is crossed
          let currentScene = 0;
          if (progress >= 0.82) currentScene = 3;
          else if (progress >= 0.58) currentScene = 2;
          else if (progress >= 0.28) currentScene = 1;

          setActiveSceneIndex((prev) => (prev !== currentScene ? currentScene : prev));

          // Toggle booking card visibility state
          const isFinal = progress >= 0.82;
          setIsFinalSceneActive((prev) => (prev !== isFinal ? isFinal : prev));

          if (progress > 0.02 && !hasScrolledRef.current) {
            hasScrolledRef.current = true;
            setHasScrolled(true);
          }
        },
      });
    }, container);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, updateSceneDOM]);

  const handleSkipToBooking = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTarget = window.scrollY + rect.height * 4.1;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }, []);

  const totalFrames = totalFramesRef.current;
  const loadingProgress = totalFrames > 0 ? loadedCount / totalFrames : 0;
  const isLoading = loadedCount < totalFrames;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0E2931] select-none"
    >
      {/* Loading progress bar */}
      {isLoading && !isReducedMotion && (
        <div className="absolute top-0 left-0 right-0 z-50 h-0.5">
          <div
            className="h-full bg-[#F2B632] transition-[width] duration-150 ease-out shadow-[0_0_8px_#F2B632]"
            style={{ width: `${loadingProgress * 100}%` }}
          />
        </div>
      )}

      {/* Canvas: scroll-driven frame-by-frame surface */}
      {!isReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}

      {/* Reduced-motion fallback */}
      {isReducedMotion && (
        <img
          src={HERO_CONFIG.desktop.posterPath}
          alt="Airplane taking off in warm evening light"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Subtle cinematic gradient overlay for text contrast while keeping frames vibrant */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E2931]/70 via-[#0E2931]/15 to-[#0E2931]/35 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#0E2931]/40 pointer-events-none" />

      {/* ── Top Bar: Redesigned Architectural Corridor & Skip Containers ── */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between pointer-events-auto">
        {/* Left: Corridor Telemetry Capsule */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07161B]/80 backdrop-blur-md border border-[#2B7574]/40 shadow-lg text-[10px] font-mono">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </div>
          <span className="text-[#F2B632] font-semibold tracking-wider">CORRIDOR // MM2 LAGOS</span>
          <span className="text-[#2B7574] hidden xs:inline">·</span>
          <span className="text-[#A5D1E1]/80 tracking-wider hidden xs:inline">FL380 ACTIVE</span>
        </div>

        {/* Right: Redesigned Fast-Descent Skip to Booking Capsule */}
        {!isFinalSceneActive && (
          <button
            onClick={handleSkipToBooking}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07161B]/80 hover:bg-[#12484C] backdrop-blur-md border border-[#2B7574]/40 hover:border-[#F2B632]/80 shadow-lg transition-all duration-300 cursor-pointer"
            title="Fast descent to booking form"
          >
            <span className="text-[10px] font-mono tracking-wider text-[#A5D1E1] group-hover:text-white uppercase transition-colors">
              Skip to Booking
            </span>
            <ArrowDownRight className="w-3.5 h-3.5 text-[#F2B632] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* ── Editorial Text Phases (Direct DOM manipulation) ─────── */}
      <div className="relative z-20 w-full h-full max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center pointer-events-none">
        {/* Scene 1 */}
        <div
          ref={scene0Ref}
          className="absolute max-w-3xl space-y-4 transition-transform duration-75"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#12484C]/80 border border-[#2B7574]/60 text-[11px] font-mono uppercase tracking-[0.2em] text-[#F2B632] shadow-md backdrop-blur-sm">
            {SCENES[0].badge}
          </span>
          <h1 className="font-monument text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F4F6F5] tracking-tight leading-[1.05] uppercase drop-shadow-xl">
            {SCENES[0].headline}
          </h1>
          <p className="text-sm sm:text-lg text-[#A5D1E1] max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
            {SCENES[0].subheadline}
          </p>
        </div>

        {/* Scene 2 */}
        <div
          ref={scene1Ref}
          className="absolute max-w-3xl space-y-4 transition-transform duration-75"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#12484C]/80 border border-[#2B7574]/60 text-[11px] font-mono uppercase tracking-[0.2em] text-[#F2B632] shadow-md backdrop-blur-sm">
            {SCENES[1].badge}
          </span>
          <h1 className="font-monument text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F4F6F5] tracking-tight leading-[1.05] uppercase drop-shadow-xl">
            {SCENES[1].headline}
          </h1>
          <p className="text-sm sm:text-lg text-[#A5D1E1] max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
            {SCENES[1].subheadline}
          </p>
        </div>

        {/* Scene 3 */}
        <div
          ref={scene2Ref}
          className="absolute max-w-3xl space-y-4 transition-transform duration-75"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#12484C]/80 border border-[#2B7574]/60 text-[11px] font-mono uppercase tracking-[0.2em] text-[#F2B632] shadow-md backdrop-blur-sm">
            {SCENES[2].badge}
          </span>
          <h1 className="font-monument text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F4F6F5] tracking-tight leading-[1.05] uppercase drop-shadow-xl">
            {SCENES[2].headline}
          </h1>
          <p className="text-sm sm:text-lg text-[#A5D1E1] max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
            {SCENES[2].subheadline}
          </p>
        </div>

        {/* Scene 4 + Booking Card */}
        <div
          ref={scene3Ref}
          className="absolute inset-0 flex flex-col justify-end sm:justify-center items-center pb-10 sm:pb-0 px-4 sm:px-6 pointer-events-auto transition-transform duration-75"
        >
          <div className="text-center space-y-2 mb-4 sm:mb-6 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#12484C]/90 border border-[#2B7574]/60 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F2B632]">
              {SCENES[3].badge}
            </span>
            <h2 className="font-monument text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F6F5] tracking-tight uppercase">
              {SCENES[3].headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#A5D1E1] max-w-lg mx-auto font-light">
              {SCENES[3].subheadline}
            </p>
          </div>

          <div
            className={`w-full max-w-3xl transition-all duration-500 ease-out transform ${
              isFinalSceneActive
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}
          >
            <HeroSearchCard suggestedTab="flights" />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar: Scene Dots + Scroll Cue ─────────────────── */}
      <div className="absolute bottom-6 left-0 right-0 z-30 max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between text-xs text-[#A5D1E1] pointer-events-none">
        {/* Left: Scene progress dots */}
        <div className="flex items-center gap-2">
          {SCENES.map((sc, idx) => {
            const isActive = activeSceneIndex === idx;
            return (
              <div
                key={sc.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-[#F2B632]' : 'w-2 bg-[#F4F6F5]/25'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Scroll cue text */}
        <div
          className={`flex items-center gap-1.5 font-mono text-[11px] text-[#A5D1E1] transition-opacity duration-500 ${
            hasScrolled ? 'opacity-0' : 'opacity-80 animate-bounce'
          }`}
        >
          <span className="hidden md:inline">Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 stroke-[2] text-[#F2B632]" />
        </div>
      </div>
    </div>
  );
};
