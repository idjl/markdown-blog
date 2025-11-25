import { BlogConfig } from '../types';
import { FileUtils } from '../utils';
import path from 'path';

/**
 * 语法高亮插件
 */
export class SyntaxHighlightPlugin {
  private config: BlogConfig;

  constructor(config: BlogConfig) {
    this.config = config;
  }

  /**
   * 应用插件
   */
  apply(context: any): void {
    if (!this.config.plugins.syntaxHighlight.enabled) {
      return;
    }

    // 配置markdown-it以支持语法高亮
    const md = context.parser.md;

    md.set({
      highlight: (code: string, lang: string) => {
        return this.highlightCode(code, lang);
      },
    });
  }

  /**
   * 高亮代码
   */
  private highlightCode(code: string, lang: string): string {
    if (!lang) {
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }

    try {
      // 这里可以集成Prism.js或其他语法高亮库
      // 为了简化，这里只返回基本的HTML结构
      return `<pre class="language-${lang}"><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>`;
    } catch (error) {
      console.error('Syntax highlighting failed:', error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  /**
   * 转义HTML
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * 生成语法高亮CSS
   */
  async generateCSS(outputDir: string): Promise<void> {
    const cssDir = path.join(outputDir, 'css');
    await FileUtils.ensureDir(cssDir);

    // const theme = this.config.plugins.syntaxHighlight.theme;
    // const darkTheme = this.config.plugins.syntaxHighlight.darkTheme;

    // 这里可以根据选择的主题生成对应的CSS
    // 为了简化，这里只返回基本的CSS
    const css = `
/* Syntax highlighting */
pre[class*="language-"] {
  background: #f8f8f8;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 1em;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.5;
}

.dark pre[class*="language-"] {
  background: #2d2d2d;
  border-color: #444;
}

code[class*="language-"] {
  color: #333;
}

.dark code[class*="language-"] {
  color: #f8f8f2;
}

/* Token colors */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #999988;
  font-style: italic;
}

.token.namespace {
  opacity: 0.7;
}

.token.string,
.token.attr-value {
  color: #e3116c;
}

.token.punctuation,
.token.operator {
  color: #393a34;
}

.token.entity,
.token.url,
.token.symbol,
.token.number,
.token.boolean,
.token.variable,
.token.constant,
.token.property,
.token.regex,
.token.inserted {
  color: #36acaa;
}

.token.atrule,
.token.keyword,
.token.attr-name,
.language-autohotkey .token.selector {
  color: #00a4db;
}

.token.function,
.token.deleted,
.language-autohotkey .token.tag {
  color: #9a050f;
}

.token.tag,
.token.selector,
.language-autohotkey .token.keyword {
  color: #00009f;
}

.token.important,
.token.function,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}
`;

    await FileUtils.writeFile(path.join(cssDir, 'syntax-highlight.css'), css);
  }
}
