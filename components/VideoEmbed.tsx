import { ExternalLink } from "lucide-react";

export default function VideoEmbed({
  videoId,
  title,
  videoUrl,
  watchLabel,
  className = "",
}: {
  videoId: string;
  title: string;
  videoUrl: string;
  watchLabel: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="glass overflow-hidden rounded-2xl border-slate-800 shadow-2xl shadow-blue-950/20">
        <div className="aspect-video bg-slate-950">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
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
