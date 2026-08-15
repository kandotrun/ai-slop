export interface FeaturedArticleLink {
  platform: "Note" | "Zenn";
  label: string;
  href: string;
}

export const FEATURED_ARTICLE_LINKS: FeaturedArticleLink[] = [
  {
    platform: "Note",
    label: "Note: サービス紹介記事",
    href: "https://note.com/kandotrun/n/n380774ee2e57"
  },
  {
    platform: "Zenn",
    label: "Zenn: 技術設計記事",
    href: "https://zenn.dev/nixo/articles/8f5807a6cefd36"
  }
];
