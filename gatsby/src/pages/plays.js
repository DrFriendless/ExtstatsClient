import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import PlaysWidget from "../components/playsWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function PlaysPage(props) {
  return (<Layout>
      <SEO title="Plays" keywords={[`board`, `games`, `statistics`, `plays`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Your Plays"/>
      <PlaysWidget/>
    </Layout>
  );
}

export default PlaysPage;
