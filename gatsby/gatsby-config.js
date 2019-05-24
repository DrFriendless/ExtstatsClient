module.exports = {
  siteMetadata: {
    title: `Extended Stats`,
    description: `Board game statistics you never knew you needed.`,
    author: `DrFriendless`,
  },
  proxy: {
    prefix: "/",
    url: "http://test.drfriendless.com",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/stats.gif`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: "GTM-PVMS9L9",
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false
      },
    },
    `gatsby-plugin-typescript`
  ],
};
