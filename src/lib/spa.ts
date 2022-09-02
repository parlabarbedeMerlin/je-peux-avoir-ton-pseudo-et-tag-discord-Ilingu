declare global {
  interface Document {
    createDocumentTransition: () => any;
  }
}

const HandleVisibleA: IntersectionObserverCallback = (entries) => {
  const routeToCache = new Set<string>();

  // get route and listen onclick event
  for (const entry of entries) {
    if (entry.isIntersecting && entry.target.tagName === "A") {
      const route = entry.target.getAttribute("href");
      if (!route || route.startsWith("http")) continue;

      routeToCache.add(route);
      entry.target.addEventListener("click", (e) => {
        e.preventDefault();
        SwitchDocument(route);
      });
    }
  }

  // Fetch && cache routes
  routeToCache.forEach(CacheRoute);
};

const CacheRoute = async (route: string): Promise<string | null> => {
  const res = sessionStorage.getItem(route);
  if (res) return null;

  try {
    const resp = await fetch(route);
    if (!resp.ok) return null;

    const html = await resp.text();
    sessionStorage.setItem(route, html);

    console.log(`"${route}" cached successfully ✅`);
    return html;
  } catch (err) {
    console.warn(`Couldn't cache "${route}" ❌`);
    return null;
  }
};

const SwitchDocument = async (route: string) => {
  let res = sessionStorage.getItem(route);
  if (!res) res = await CacheRoute(route);

  if (!document.createDocumentTransition)
    UpdateDOM(res); // Without transition api
  else {
    const transition = document.createDocumentTransition();
    await transition.start(() => UpdateDOM(res)); // With transition api
  }

  AstroSPA();
};

const UpdateDOM = (newDom: unknown) => {
  if (typeof newDom !== "string") return;
  document.documentElement.innerHTML = newDom;
};

let observer: IntersectionObserver;
const AstroSPA = () => {
  observer && observer.disconnect();

  console.log("Astro SPA");
  observer = new IntersectionObserver(HandleVisibleA, {
    root: document.body,
    threshold: 1.0,
  });

  document.querySelectorAll("a").forEach((a) => observer.observe(a));
};

export default AstroSPA;
