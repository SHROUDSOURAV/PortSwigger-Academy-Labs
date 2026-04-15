import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "./globals.css";

export const metadata = {
  title: {
    default: "PortSwigger Labs",
    template: "%s | PortSwigger Labs"
  },
  description: "Professional PortSwigger Academy writeups with a Midnight Cyber UI."
};

const navbar = (
  <Navbar 
    logo={
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]"></div>
        <span className="font-mono font-bold tracking-tighter uppercase flicker">PortSwigger_Academy</span>
      </div>
    } 
    projectLink="https://github.com/SHROUDSOURAV/PortSwigger-Academy-Labs"
    search={<></>}
  />
);
const footer = <Footer>PortSwigger Labs</Footer>;

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/20 selection:text-primary">
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/SHROUDSOURAV/PortSwigger-Academy-Labs/tree/main"
          footer={footer}
          editLink={null}
          feedback={{ content: null }}
          toc={{ title: null, extraContent: null, backToTop: null, float: false }}
          copyPageButton
          sidebar={{
            defaultOpen: true,
            autoCollapse: false,
            defaultMenuCollapseLevel: 1
          }}
          navigation={false}
          darkMode={false}
          nextThemes={{ 
            defaultTheme: "dark",
            forcedTheme: "dark"
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
