export type ProjectId =
  | "meta"
  | "sonos"
  | "hulu"
  | "noble-ai"
  | "google"
  | "samsung-vr";

export type PageContent = {
  title: string;
  role: string;
  blurb: string;
  surfaces: string;
  skills: string;
};

export type ProjectSubItem = {
  id: string;
  label: string;
  href: string;
  image: string;
  imagePosition?: string;
  imagePositionMobile?: string;
  content: PageContent;
};

export type Project = {
  id: ProjectId;
  label: string;
  /** Fallback when the project is active but no sub-item is selected yet */
  image: string;
  imagePosition?: string;
  imagePositionMobile?: string;
  content: PageContent;
  subItems: ProjectSubItem[];
};

export type BackgroundScene = {
  key: string;
  image: string;
  imagePosition: string;
  imagePositionMobile: string;
};

/** One scroll section in the Figma portfolio template */
export type PortfolioSection = {
  key: string;
  company: string;
  title: string;
  blurb: string;
  tags: string[];
  image: string;
  imagePosition: string;
  href: string | null;
};

const SURFACE_DISPLAY: Record<string, string> = {
  VR: "Virtual Reality",
};

const PLACEHOLDER_BLURB =
  "This is a blurb explaining what this project is and why it is important. This is super helpful information that everyone is interested in and should be fully digested by anyone who comes across this page.";

function pageContent(
  title: string,
  overrides: Partial<Omit<PageContent, "title">> = {},
): PageContent {
  return {
    title,
    role: "PD IC lead",
    blurb: PLACEHOLDER_BLURB,
    surfaces: "VR, Mobile, Desktop",
    skills:
      "Monetization, Gamification, Creator tools, Meta Credits, digital goods, live events, live ops.",
    ...overrides,
  };
}

export const projects: Project[] = [
  {
    id: "meta",
    label: "Meta",
    image: "/images/meta-monetization.jpg",
    imagePosition: "center center",
    imagePositionMobile: "62% 20%",
    content: pageContent("Meta", {
      skills: "Product leadership, VR, social, platform design",
      surfaces: "VR, Mobile, Desktop",
    }),
    subItems: [
      {
        id: "gamification",
        label: "Gamification",
        href: "/work/meta/gamification",
        image: "/images/meta-avatars.jpg",
        imagePosition: "center center",
        imagePositionMobile: "center 40%",
        content: pageContent("Gamification", {
          blurb:
            "Gamification systems rewarded users for spending time in the metaverse. Users were rewarded with points and digital goods from Meta as well as content creators. Meta points were introduced as an earnable token that could be exchanged for digital goods.",
          skills:
            "Gamification, Creator tools, live events, live ops, digital goods",
        }),
      },
      {
        id: "monetization",
        label: "Monetization",
        href: "/work/meta/monetization",
        image: "/images/meta-avatar-portrait.png",
        imagePosition: "center center",
        imagePositionMobile: "center 30%",
        content: pageContent("Monetization", {
          blurb:
            "Systems that enable users to purchase in-game items and for creators to publish in-game items. Meta Credits were developed as a token that could be purchased for cash and exchanged for digital goods.",
        }),
      },
      {
        id: "creator-tools",
        label: "Creator Tools",
        href: "/work/meta/creator-tools",
        image: "/images/meta-creator-tools.png",
        imagePosition: "center center",
        imagePositionMobile: "center 35%",
        content: pageContent("Creator Tools", {
          blurb:
            "Economy tools were opened up to creators who were able to create digital goods and offer them for Meta Credits or in exchange for completing achievements or trading points.",
          surfaces: "VR, Mobile, Desktop",
          skills: "Creator tools, content publishing, live ops, monetization",
        }),
      },
      {
        id: "oculus-tv",
        label: "Oculus TV",
        href: "/work/meta/oculus-tv",
        image: "/images/meta-oculus-tv.png",
        imagePosition: "center center",
        imagePositionMobile: "center 35%",
        content: pageContent("Oculus TV", {
          blurb:
            "The primary source for experiencing the best immersive video content Oculus and Oculus creators had to offer. Featuring flat, 180, and 360 video.",
          surfaces: "VR",
          skills: "Media, spatial UI, entertainment, passthrough",
        }),
      },
    ],
  },
  {
    id: "sonos",
    label: "Sonos",
    image: "/images/sonos.jpg",
    imagePosition: "center center",
    imagePositionMobile: "center 30%",
    content: pageContent("Sonos", {
      surfaces: "Mobile, Desktop, Hardware",
      skills: "Home audio, hardware software, brand systems",
    }),
    subItems: [
      {
        id: "arc",
        label: "Arc",
        href: "/work/sonos/arc",
        image: "/images/sonos-arc.jpg",
        imagePosition: "center center",
        imagePositionMobile: "center 30%",
        content: pageContent("Arc", {
          blurb:
            "The premier soundbar touting Dolby Atmos immersive sound as well as up to 7.1 surround sound and Alexa interactivity.",
          surfaces: "Hardware, Mobile, Desktop",
          skills: "Soundbar, home theater, product design",
        }),
      },
      {
        id: "beam",
        label: "Beam",
        href: "/work/sonos/beam",
        image: "/images/sonos-beam.png",
        imagePosition: "center center",
        imagePositionMobile: "center 30%",
        content: pageContent("Beam", {
          blurb:
            "Entry-level soundbar delivering industry-leading sound quality and functionality. Included 5.1 surround, Amazon Alexa, and seamless integration with the Sonos connected home system.",
          surfaces: "Hardware, Mobile, Desktop",
          skills: "Compact soundbar, home theater, product design",
        }),
      },
    ],
  },
  {
    id: "hulu",
    label: "Hulu",
    image: "/images/hulu.jpg",
    imagePosition: "center center",
    imagePositionMobile: "center 35%",
    content: pageContent("Hulu", {
      surfaces: "TV, Mobile, Desktop",
      skills: "Streaming, live TV, content discovery",
    }),
    subItems: [
      {
        id: "streaming-live",
        label: "Streaming + Live",
        href: "/work/hulu/streaming-live",
        image: "/images/hulu.jpg",
        imagePosition: "center center",
        imagePositionMobile: "center 35%",
        content: pageContent("Streaming + Live", {
          blurb:
            "First-ever launch of the Hulu streaming and live TV offering. Cloud recording and content saving allowed users to curate their favorite content and watch it at their leisure.",
          surfaces: "TV, Mobile, Desktop",
          skills: "Streaming, live TV, playback, discovery",
        }),
      },
      {
        id: "mobile",
        label: "Mobile",
        href: "/work/hulu/mobile",
        image: "/images/hulu-mobile.png",
        imagePosition: "center center",
        imagePositionMobile: "center 35%",
        content: pageContent("Mobile", {
          blurb:
            "All of the brand-new features from Hulu TV included in the portable format so users can consume content on the go.",
          surfaces: "Mobile",
          skills: "Mobile streaming, content discovery, live",
        }),
      },
    ],
  },
  {
    id: "noble-ai",
    label: "Noble.AI",
    image: "/images/noble-ai.png",
    imagePosition: "center center",
    imagePositionMobile: "center 30%",
    content: pageContent("Core Products", {
      blurb:
        "A suite of web apps allowing scientists to 10x their productivity with a state-of-the-art data ingestion engine (Blueprint) and result generation (Reactor).",
      surfaces: "Desktop, Web",
      skills: "AI, enterprise, data visualization",
    }),
    subItems: [],
  },
  {
    id: "google",
    label: "Google",
    image: "/images/google.png",
    imagePosition: "center center",
    imagePositionMobile: "center 30%",
    content: pageContent("Impact Challenge", {
      blurb:
        "Connecting some of the most important initiatives across the Bay Area with both attention and money. The site allowed users to allocate funds to their favorite nonprofits.",
      surfaces: "Web, Desktop",
      skills: "Web, civic tech, content systems",
    }),
    subItems: [],
  },
  {
    id: "samsung-vr",
    label: "Samsung",
    image: "/images/samsung-vr.png",
    imagePosition: "center center",
    imagePositionMobile: "center 35%",
    content: pageContent("Marvel Avengers VR", {
      blurb:
        "Developed between Disney Marvel and Samsung Gear VR to give users never-before-seen immersion into an exclusive scene from the film Avengers: Age of Ultron.",
      surfaces: "VR",
      skills: "VR, spatial UI, headset experiences",
    }),
    subItems: [],
  },
];

export const DEFAULT_PROJECT_ID: ProjectId = "meta";
export const DEFAULT_SUB_ID: string | null = null;

export function getBackgroundScenes(): BackgroundScene[] {
  const scenes = new Map<string, BackgroundScene>();

  for (const project of projects) {
    scenes.set(project.id, {
      key: project.id,
      image: project.image,
      imagePosition: project.imagePosition ?? "center center",
      imagePositionMobile: project.imagePositionMobile ?? "center 30%",
    });

    for (const sub of project.subItems) {
      scenes.set(`${project.id}:${sub.id}`, {
        key: `${project.id}:${sub.id}`,
        image: sub.image,
        imagePosition: sub.imagePosition ?? "center center",
        imagePositionMobile: sub.imagePositionMobile ?? "center 30%",
      });
    }
  }

  return Array.from(scenes.values());
}

export function resolveBackgroundKey(
  projectId: ProjectId,
  subId: string | null,
): string {
  if (!subId) return projectId;
  const project = projects.find((item) => item.id === projectId);
  const hasSub = project?.subItems.some((sub) => sub.id === subId);
  return hasSub ? `${projectId}:${subId}` : projectId;
}

export function resolvePageContent(
  projectId: ProjectId,
  subId: string | null,
): PageContent {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return pageContent("Work");
  }

  if (subId) {
    const sub = project.subItems.find((item) => item.id === subId);
    if (sub) return sub.content;
  }

  return project.content;
}

export function getDefaultSubId(projectId: ProjectId): string | null {
  return projects.find((item) => item.id === projectId)?.subItems[0]?.id ?? null;
}

function parseSurfaceTags(surfaces: string): string[] {
  return surfaces
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((tag) => SURFACE_DISPLAY[tag] ?? tag);
}

/** Flatten projects into scroll sections matching the Figma template. */
export function getPortfolioSections(): PortfolioSection[] {
  const sections: PortfolioSection[] = [];

  for (const project of projects) {
    if (project.subItems.length > 0) {
      for (const sub of project.subItems) {
        sections.push({
          key: `${project.id}:${sub.id}`,
          company: project.label,
          title: sub.label,
          blurb: sub.content.blurb,
          tags: parseSurfaceTags(sub.content.surfaces),
          image: sub.image,
          imagePosition: sub.imagePosition ?? "center center",
          href: sub.href,
        });
      }
      continue;
    }

    sections.push({
      key: project.id,
      company: project.label,
      title: project.content.title,
      blurb: project.content.blurb,
      tags: parseSurfaceTags(project.content.surfaces),
      image: project.image,
      imagePosition: project.imagePosition ?? "center center",
      href: null,
    });
  }

  return sections;
}

/** Unique surface tags across all sections, stable order. */
export function getAllSurfaceTags(): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const section of getPortfolioSections()) {
    for (const tag of section.tags) {
      if (seen.has(tag)) continue;
      seen.add(tag);
      tags.push(tag);
    }
  }

  return tags;
}

/** Unique brand/company labels in portfolio order. */
export function getAllBrands(): string[] {
  return projects.map((project) => project.label);
}
