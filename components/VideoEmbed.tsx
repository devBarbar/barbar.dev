"use client";

import { ExternalLink, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VideoEmbed({
  videoId,
  title,
  videoUrl,
  playLabel,
  watchLabel,
  className = "",
}: {
  videoId: string;
  title: string;
  videoUrl: string;
  playLabel: string;
  watchLabel: string;
  className?: string;
}) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const encodedVideoId = encodeURIComponent(videoId);
  const posterUrl = `https://i.ytimg.com/vi_webp/${encodedVideoId}/maxresdefault.webp`;
  const fallbackPosterUrl = `https://i.ytimg.com/vi_webp/${encodedVideoId}/hqdefault.webp`;

  useEffect(() => {
    if (isPlayerLoaded) {
      playerRef.current?.focus();
    }
  }, [isPlayerLoaded]);

  return (
    <div className={className}>
      <div className="glass overflow-hidden rounded-2xl border-slate-800 shadow-2xl shadow-blue-950/20">
        <div className="aspect-video bg-slate-950">
          {isPlayerLoaded ? (
            <iframe
              ref={playerRef}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodedVideoId}?autoplay=1&playsinline=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlayerLoaded(true)}
              aria-label={`${playLabel}: ${title}`}
              className="group relative h-full w-full overflow-hidden bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400"
            >
              {/* A raw image keeps this facade tiny and avoids loading Next's image runtime. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl}
                alt=""
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={(event) => {
                  if (event.currentTarget.src !== fallbackPosterUrl) {
                    event.currentTarget.src = fallbackPosterUrl;
                  }
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-16 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl transition-transform group-hover:scale-105"
              >
                <Play className="h-8 w-8 fill-current" />
              </span>
            </button>
          )}
        </div>
      </div>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
      >
        {watchLabel}
        <ExternalLink aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
