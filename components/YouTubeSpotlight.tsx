import { ArrowUpRight, Youtube } from "lucide-react";

import VideoEmbed from "@/components/VideoEmbed";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { featuredVideo, youtubeChannel } from "@/lib/youtube";

export default function YouTubeSpotlight({ locale }: { locale: Locale }) {
  const { youtube } = getDictionary(locale);

  return (
    <section id="youtube" className="container mx-auto max-w-6xl px-4 py-24 md:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.25fr]">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            <Youtube aria-hidden="true" className="h-5 w-5" />
            {youtube.eyebrow}
          </p>
          <h2 className="mb-5 text-3xl font-bold leading-tight md:text-5xl">{youtube.title}</h2>
          <div className="mb-7 h-1 w-20 rounded-full bg-red-500" />
          <p className="mb-8 text-lg leading-relaxed text-slate-400">{youtube.description}</p>
          <a
            href={youtubeChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            {youtube.visitChannel}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <VideoEmbed
          videoId={featuredVideo.id}
          videoUrl={featuredVideo.url}
          title={youtube.playerTitle}
          playLabel={youtube.playVideo}
          watchLabel={youtube.watchVideo}
        />
      </div>
    </section>
  );
}
