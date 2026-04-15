import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "./globals.css";

export const metadata = {
  title: {
    default: "PortSwigger Labs",
    template: "%s - PortSwigger Labs"
  },
  description: "PortSwigger Academy writeups with a dark-blue Nextra UI."
};

const navbar = <Navbar logo={<strong>PortSwigger Labs</strong>} />;
const footer = <Footer>PortSwigger Labs</Footer>;

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
            defaultOpen: false,
            autoCollapse: true,
            defaultMenuCollapseLevel: 1
          }}
          darkMode
          nextThemes={{ defaultTheme: "dark" }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
