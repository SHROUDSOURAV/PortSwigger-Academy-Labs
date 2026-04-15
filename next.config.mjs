import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/",
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: "github-dark-default",
        light: "github-light"
      },
      keepBackground: false
    }
  }
});

export default withNextra({
  reactStrictMode: true,
  devIndicators: false
});
