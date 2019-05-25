import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import RankingsWidget from "../components/rankingsWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function RankingsPage(props) {
  return (<Layout>
      <SEO title="Rankings" keywords={[`board`, `games`, `statistics`, `rankings`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Game Rankings"/>
      <RankingsWidget/>
    </Layout>
  );
}

export default RankingsPage;
