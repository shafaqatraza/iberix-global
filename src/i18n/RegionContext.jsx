import { createContext, useContext, useState, useCallback } from "react";
import { REGIONS, STRINGS } from "./translations";

const RegionContext = createContext(null);

export function RegionProvider({ children }) {
  const [regionId, setRegionId] = useState(() => {
    if (typeof window === "undefined") return "global";
    return localStorage.getItem("iberix-region") || "global";
  });

  const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0];
  const lang = region.lang;

  const setRegion = useCallback((id) => {
    setRegionId(id);
    try {
      localStorage.setItem("iberix-region", id);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key, vars) => {
      let str = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
      if (vars) {
        Object.keys(vars).forEach((v) => {
          str = str.replace(`{${v}}`, vars[v]);
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <RegionContext.Provider value={{ region, regionId, lang, t, setRegion, regions: REGIONS }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    // Fallback so components never crash if rendered outside provider
    return {
      region: REGIONS[0],
      regionId: "global",
      lang: "en",
      t: (key) => STRINGS.en[key] || key,
      setRegion: () => {},
      regions: REGIONS,
    };
  }
  return ctx;
}