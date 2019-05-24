import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import FavouritesWidget from "../components/favouritesWidget";
import LoginButton from "../components/login/loginButton";

function FavouritesPage(props) {
  return (<Layout>
      <SEO title="Favourite Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Your Favourite Games</h1>
      <FavouritesWidget/>
    </Layout>
  );
}

export default FavouritesPage;
