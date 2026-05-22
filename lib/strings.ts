export type Locale = "en" | "uk";

export const dictionary: Record<
  Locale,
  Record<
    | "navTrending"
    | "searchPlaceholder"
    | "loadMore"
    | "filterAll"
    | "heroLive"
    | "heroRead"
    | "footerTagline"
    | "footerDesks"
    | "footerDesksBody"
    | "footerNewsletter"
    | "footerNewsletterBody"
    | "sidebarAiTitle"
    | "sidebarAiBody"
    | "sidebarTags"
    | "sidebarMostViewed"
    | "articleShare"
    | "articleRelated"
    | "articleTimeline"
    | "articleReadOriginal"
    | "articleLead"
    | "aiShow"
    | "aiHide"
    | "aiBadge"
    | "langEn"
    | "langUk",
    string
  >
> = {
  en: {
    navTrending: "Trending global stories",
    searchPlaceholder: "Search stories, topics, tags...",
    loadMore: "Load more stories",
    filterAll: "All",
    heroLive: "LIVE BREAKING",
    heroRead: "Read full coverage",
    footerTagline: "The world, as it happens.",
    footerDesks: "Global desks",
    footerDesksBody: "World · Politics · Technology · AI · Crypto · Business",
    footerNewsletter: "Newsletter",
    footerNewsletterBody: "Daily intelligence briefing at 07:00 UTC.",
    sidebarAiTitle: "AI insights",
    sidebarAiBody:
      "Voxera AI highlights acceleration in policy, semiconductor supply chains, and geopolitical signal clusters.",
    sidebarTags: "Trending hashtags",
    sidebarMostViewed: "Most viewed",
    articleShare: "Share",
    articleRelated: "Related stories",
    articleTimeline: "Timeline",
    articleReadOriginal: "Read original source",
    articleLead: "Lead",
    aiShow: "Show AI summary",
    aiHide: "Hide AI summary",
    aiBadge: "AI summary",
    langEn: "EN",
    langUk: "UK",
  },
  uk: {
    navTrending: "Трендові світові новини",
    searchPlaceholder: "Пошук статей, тем, тегів...",
    loadMore: "Більше матеріалів",
    filterAll: "Усі",
    heroLive: "НАЖИВО · ГОЛОВНЕ",
    heroRead: "Повне покриття",
    footerTagline: "Світ таким, яким він є.",
    footerDesks: "Глобальні редакції",
    footerDesksBody: "Світ · Політика · Технології · ШІ · Крипта · Бізнес",
    footerNewsletter: "Розсилка",
    footerNewsletterBody: "Щоденний дайджест о 07:00 UTC.",
    sidebarAiTitle: "Інсайти ШІ",
    sidebarAiBody:
      "Voxera AI відстежує прискорення в регуляції, ланцюгах постачання напівпровідників і геополітичних сигналах.",
    sidebarTags: "Трендові хештеги",
    sidebarMostViewed: "Найбільше переглядів",
    articleShare: "Поділитися",
    articleRelated: "Схожі матеріали",
    articleTimeline: "Хронологія",
    articleReadOriginal: "Читати оригінал джерела",
    articleLead: "Лід",
    aiShow: "Показати AI-підсумок",
    aiHide: "Сховати AI-підсумок",
    aiBadge: "AI-підсумок",
    langEn: "EN",
    langUk: "УКР",
  },
};

export const categoryLabelsUk: Record<string, string> = {
  World: "Світ",
  Politics: "Політика",
  Technology: "Технології",
  AI: "ШІ",
  Crypto: "Крипта",
  Business: "Бізнес",
  War: "Війна",
  Science: "Наука",
  Gaming: "Ігри",
  Culture: "Культура",
};
