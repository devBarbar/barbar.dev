import type { BlogPost, BlogPostSummary } from "@/lib/blog";
import type { Locale } from "@/lib/locales";
import { youtubeChannel } from "@/lib/youtube";

export const siteConfig = {
  url: "https://barbar.dev",
  name: "barbar.dev",
  authorName: "Barbar Ahmad",
  authorId: "https://barbar.dev/#barbar-ahmad",
  websiteId: "https://barbar.dev/#website",
  linkedInUrl: "https://www.linkedin.com/in/barbar-ahmad",
  defaultImage: {
    url: "/og.png",
    width: 1731,
    height: 909,
  },
} as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${siteConfig.url}/`).toString();
}

export function getFeedPath(locale: Locale) {
  return `/${locale}/blog/feed.xml`;
}

export function getPostImage(post: BlogPostSummary) {
  if (post.featuredImage && post.featuredImageAlt) {
    return {
      url: absoluteUrl(post.featuredImage),
      alt: post.featuredImageAlt,
    };
  }

  if (post.youtubeVideoId) {
    return {
      url: `https://i.ytimg.com/vi/${post.youtubeVideoId}/maxresdefault.jpg`,
      alt: post.title,
    };
  }

  return undefined;
}

const authorJsonLd = {
  "@type": "Person",
  "@id": siteConfig.authorId,
  name: siteConfig.authorName,
  url: absoluteUrl("/en#about"),
  jobTitle: "Lead Software Engineer",
  sameAs: [siteConfig.linkedInUrl, youtubeChannel.url],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Frankfurt am Main",
    addressCountry: "DE",
  },
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": siteConfig.websiteId,
      url: absoluteUrl(),
      name: siteConfig.name,
      alternateName: siteConfig.authorName,
      inLanguage: ["en", "de"],
      publisher: { "@id": siteConfig.authorId },
    },
    authorJsonLd,
  ],
};

export function getBlogJsonLd({
  locale,
  title,
  description,
  posts,
}: {
  locale: Locale;
  title: string;
  description: string;
  posts: BlogPostSummary[];
}) {
  const blogUrl = absoluteUrl(`/${locale}/blog`);

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    url: blogUrl,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { "@id": siteConfig.websiteId },
    author: { "@id": siteConfig.authorId },
    blogPost: posts.map((post) => {
      const url = absoluteUrl(`/${locale}/blog/${post.slug}`);
      const image = getPostImage(post);

      return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: post.title,
        description: post.description,
        datePublished: `${post.date}T00:00:00.000Z`,
        dateModified: `${post.updated ?? post.date}T00:00:00.000Z`,
        author: { "@id": siteConfig.authorId },
        ...(image ? { image: image.url } : {}),
      };
    }),
  };
}

export function getPostJsonLd({
  post,
  homeLabel,
  blogLabel,
}: {
  post: BlogPost;
  homeLabel: string;
  blogLabel: string;
}) {
  const postUrl = absoluteUrl(`/${post.locale}/blog/${post.slug}`);
  const homeUrl = absoluteUrl(`/${post.locale}`);
  const blogUrl = absoluteUrl(`/${post.locale}/blog`);
  const image = getPostImage(post);
  const video =
    post.youtubeVideoId && post.youtubeVideoUploadDate
      ? {
          "@type": "VideoObject",
          name: post.title,
          description: post.description,
          thumbnailUrl: `https://i.ytimg.com/vi/${post.youtubeVideoId}/maxresdefault.jpg`,
          uploadDate: `${post.youtubeVideoUploadDate}T00:00:00.000Z`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${post.youtubeVideoId}`,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        url: postUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        headline: post.title,
        description: post.description,
        datePublished: `${post.date}T00:00:00.000Z`,
        dateModified: `${post.updated ?? post.date}T00:00:00.000Z`,
        inLanguage: post.locale,
        author: authorJsonLd,
        publisher: { "@id": siteConfig.authorId },
        isPartOf: { "@id": `${blogUrl}#blog` },
        keywords: post.tags,
        ...(image
          ? {
              image: {
                "@type": "ImageObject",
                url: image.url,
                caption: image.alt,
              },
            }
          : {}),
        ...(video ? { video } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: blogLabel,
            item: blogUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: postUrl,
          },
        ],
      },
    ],
  };
}
