import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import FavouritesWidget from "../components/favouritesWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function FavouritesPage(props) {
  return (<Layout>
      <SEO title="Favourite Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Your Favourite Games"/>
      <FavouritesWidget/>
    </Layout>
  );
}

export default FavouritesPage;
