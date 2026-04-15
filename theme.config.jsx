import React from "react";

const currentYear = new Date().getFullYear();

export default {
  logo: <strong>PortSwigger Labs</strong>,
  project: {
    link: "https://github.com/SHROUDSOURAV/PortSwigger-Academy-Labs"
  },
  docsRepositoryBase:
    "https://github.com/SHROUDSOURAV/PortSwigger-Academy-Labs/tree/main",
  footer: {
    text: `PortSwigger Labs ${currentYear}`
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - PortSwigger Labs"
    };
  },
  head: (
    <>
      <meta name="theme-color" content="#081633" />
      <meta
        name="description"
        content="PortSwigger Academy writeups in a dark blue Nextra documentation UI."
      />
    </>
  ),
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark"
  }
};
