export interface Post {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: Date;
  updated?: Date;
  author?: string;
  tags: string[];
  category?: string;
  description?: string;
  coverImage?: string;
  draft?: boolean;
  readingTime?: number;
  wordCount?: number;
  filePath: string;
  url: string;
}

export interface FrontMatter {
  title: string;
  date: string | Date;
  updated?: string | Date;
  author?: string;
  tags?: string | string[];
  category?: string;
  description?: string;
  coverImage?: string;
  draft?: boolean;
  [key: string]: any;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  posts: Post[];
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
  posts: Post[];
}

export interface Archive {
  year: number;
  month: number;
  count: number;
  posts: Post[];
}

export interface BlogConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  baseUrl: string;
  language: string;
  timezone: string;
  theme: ThemeConfig;
  darkTheme: ThemeConfig;
  social: SocialConfig;
  posts: PostsConfig;
  comments: CommentsConfig;
  search: SearchConfig;
  analytics: AnalyticsConfig;
  seo: SEOConfig;
  build: BuildConfig;
  dev: DevConfig;
  plugins: PluginsConfig;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface SocialConfig {
  github?: string;
  twitter?: string;
  email?: string;
  rss: boolean;
}

export interface PostsConfig {
  dir: string;
  perPage: number;
  excerptLength: number;
  dateFormat: string;
  showDate: boolean;
  showAuthor: boolean;
  showTags: boolean;
  showCategories: boolean;
}

export interface CommentsConfig {
  provider: 'utterances' | 'giscus';
  repo: string;
  issueTerm?: string;
  theme?: string;
  darkTheme?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: string;
  reactionsEnabled?: string;
  emitMetadata?: string;
}

export interface SearchConfig {
  enabled: boolean;
  placeholder: string;
  maxResults: number;
}

export interface AnalyticsConfig {
  google?: string;
  baidu?: string;
}

export interface SEOConfig {
  keywords: string[];
  author: string;
  twitterCard: string;
  ogImage: string;
}

export interface BuildConfig {
  outputDir: string;
  assetsDir: string;
  templatesDir: string;
  clean: boolean;
  minify: boolean;
  sourcemap: boolean;
}

export interface DevConfig {
  port: number;
  host: string;
  open: boolean;
  hot: boolean;
}

export interface PluginsConfig {
  syntaxHighlight: SyntaxHighlightConfig;
  rss: RSSConfig;
  sitemap: SitemapConfig;
  pwa?: PWAConfig;
}

export interface SyntaxHighlightConfig {
  enabled: boolean;
  theme: string;
  darkTheme: string;
}

export interface RSSConfig {
  enabled: boolean;
  title: string;
  description: string;
  language: string;
  ttl: number;
}

export interface SitemapConfig {
  enabled: boolean;
  hostname: string;
  changefreq: string;
  priority: number;
}

export interface PWAConfig {
  enabled: boolean;
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
}

export interface PluginContext {
  parser: any;
  generator: any;
  template: any;
  config: BlogConfig;
}

export interface Plugin {
  name: string;
  version: string;
  apply: (context: PluginContext) => void;
}

export interface BuildResult {
  posts: Post[];
  pages: string[];
  categories: Category[];
  tags: Tag[];
  archives: Archive[];
  rss?: string;
  sitemap?: string;
}

export interface TemplateData {
  title: string;
  content: string;
  meta: MetaData;
  theme: ThemeConfig;
  config: BlogConfig;
  posts?: Post[];
  post?: Post;
  categories?: Category[];
  tags?: Tag[];
  archives?: Archive[];
  pagination?: PaginationData;
  // Additional properties for specific pages
  prevPost?: Post;
  nextPost?: Post;
  category?: Category;
  tag?: Tag;
  archive?: Archive;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image?: string;
  type: string;
  siteName: string;
  twitterCard: string;
}

export interface PaginationData {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextUrl?: string;
  prevUrl?: string;
}
