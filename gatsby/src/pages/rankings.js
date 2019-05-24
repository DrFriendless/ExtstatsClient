import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import RankingsWidget from "../components/rankingsWidget";
import LoginButton from "../components/login/loginButton";

function RankingsPage(props) {
  return (<Layout>
      <SEO title="Rankings" keywords={[`board`, `games`, `statistics`, `rankings`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Game Rankings</h1>
      <RankingsWidget/>
    </Layout>
  );
}

export default RankingsPage;
