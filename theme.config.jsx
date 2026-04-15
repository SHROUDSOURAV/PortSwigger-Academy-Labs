import React from "react";

const currentYear = new Date().getFullYear();

export default {
  logo: (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]"></div>
      <span className="font-mono font-bold tracking-tighter uppercase flicker">PortSwigger_Academy</span>
    </div>
  ),
  project: {
    link: "https://github.com/SHROUDSOURAV/PortSwigger-Academy-Labs"
  },
  feedback: { content: null },
  editLink: { text: null },
  footer: {
    text: (
      <div className="flex flex-col gap-1 font-mono text-[10px] opacity-50 uppercase">
        <span>PortSwigger_Academy_Writeups // {currentYear}</span>
        <span className="text-primary/70">Secure Uplink Established // Status: Online</span>
      </div>
    )
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s | PortSwigger Labs"
    };
  },
  head: (
    <>
      <meta name="theme-color" content="#00E5FF" />
      <meta
        name="description"
        content="Professional PortSwigger Academy writeups in a light blue Cyber-Hacker UI."
      />
    </>
  ),
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark"
  }
};
