import { useEffect, type ComponentType } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AboutPanel from "../components/marketing/home/AboutPanel";
import ContactPanel from "../components/marketing/home/ContactPanel";
import StartPanel from "../components/marketing/home/StartPanel";
import PageMeta from "../components/marketing/PageMeta";
import { EASE } from "../components/marketing/motion";
import { homeMeta } from "../constants/homeContent";
import { isHomeTab, type HomeTabKey } from "../constants/homeTabs";

const panels: Record<HomeTabKey, ComponentType> = {
  start: StartPanel,
  about: AboutPanel,
  contact: ContactPanel,
};

export default function Home() {
  const [params] = useSearchParams();
  const raw = params.get("tab");
  const tab: HomeTabKey = isHomeTab(raw) ? raw : "start";
  const reduceMotion = useReducedMotion();
  const Panel = panels[tab];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [tab]);

  return (
    <>
      <PageMeta
        title={homeMeta[tab].title}
        description={homeMeta[tab].description}
      />

      <motion.section
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="outline-none"
      >
        <Panel />
      </motion.section>
    </>
  );
}
