export function injectGoogleAnalytics(html: string, measurementId: string | undefined): string {
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return html;
  if (html.includes(`googletagmanager.com/gtag/js?id=${measurementId}`) || html.includes(`gtag('config', '${measurementId}')`)) return html;
  const tag = renderGoogleAnalyticsTag(measurementId);
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${tag}\n  </head>`);
  }
  return `${html}\n${tag}`;
}

export function injectGigaSiteMeasurement(html: string): string {
  if (html.includes("data-giga-site-measurement")) return html;
  const tag = renderGigaSiteMeasurementTag();
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${tag}\n  </body>`);
  }
  return `${html}\n${tag}`;
}

function renderGoogleAnalyticsTag(measurementId: string): string {
  const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  return [
    "    <script>",
    "      window.dataLayer = window.dataLayer || [];",
    "      function gtag(){dataLayer.push(arguments);}",
    "      gtag('js', new Date());",
    `      gtag('config', '${measurementId}');`,
    "      (function(){",
    "        function loadGtag(){",
    "          var s=document.createElement('script');",
    "          s.async=true;",
    `          s.src='${src}';`,
    "          document.head.appendChild(s);",
    "        }",
    "        if (typeof requestIdleCallback === 'function') { requestIdleCallback(loadGtag, { timeout: 2000 }); }",
    "        else { window.addEventListener('load', function(){ setTimeout(loadGtag, 1200); }); }",
    "      })();",
    "    </script>"
  ].join("\n");
}

function renderGigaSiteMeasurementTag(): string {
  return [
    "    <script data-giga-site-measurement>",
    "      (function(){",
    "        var KEY = 'giga_site_visitor_id';",
    "        function cleanPath(path){ var p = (path || '/').replace(/\\/+/g, '/'); return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p; }",
    "        function visitorId(){",
    "          try {",
    "            var existing = localStorage.getItem(KEY);",
    "            if (existing) return existing;",
    "            var next = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(16).slice(2);",
    "            localStorage.setItem(KEY, next);",
    "            return next;",
    "          } catch(e) { return String(Date.now()) + '-' + Math.random().toString(16).slice(2); }",
    "        }",
    "        function send(eventName, metadata, articlePath){",
    "          var currentPath = cleanPath(location.pathname);",
    "          var body = JSON.stringify({ eventName: eventName, path: currentPath, articlePath: articlePath || (currentPath.indexOf('/articles') === 0 ? currentPath : undefined), visitorId: visitorId(), metadata: metadata || {} });",
    "          try { if (typeof gtag === 'function') gtag('event', eventName, metadata || {}); } catch(e) {}",
    "          try {",
    "            if (navigator.sendBeacon) {",
    "              var blob = new Blob([body], { type: 'application/json' });",
    "              if (navigator.sendBeacon('/api/measure', blob)) return;",
    "            }",
    "          } catch(e) {}",
    "          try { fetch('/api/measure', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true, credentials: 'same-origin' }).catch(function(){}); } catch(e) {}",
    "        }",
    "        window.gigaSiteTrack = send;",
    "        var currentPath = cleanPath(location.pathname);",
    "        if (currentPath === '/articles' || currentPath.indexOf('/articles/') === 0) {",
    "          var kind = currentPath === '/articles' ? 'articles_index' : currentPath.indexOf('/articles/category/') === 0 ? 'article_category' : 'article_detail';",
    "          send('article_view', { page_kind: kind }, currentPath);",
    "        }",
    "        document.addEventListener('click', function(ev){",
    "          var el = ev.target && ev.target.closest ? ev.target.closest('a,button,[data-measure-event]') : null;",
    "          if (!el) return;",
    "          var explicit = el.getAttribute('data-measure-event') || '';",
    "          var isCta = explicit === 'cta_click' || (!explicit && el.matches && el.matches('a.lp-btn,button.lp-btn,.lp-article-cta a'));",
    "          if (!isCta) return;",
    "          var text = (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 80);",
    "          send('cta_click', { href: el.getAttribute('href') || '', text: text, placement: el.getAttribute('data-measure-placement') || '', intent: el.getAttribute('data-measure-intent') || '', article: el.getAttribute('data-measure-article') || '' });",
    "        }, true);",
    "      })();",
    "    </script>"
  ].join("\n");
}
