import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import MonthlyWidget from "../components/monthlyWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function MonthlyPage(props) {
  return (<Layout>
      <SEO title="Plays by Month" keywords={[`board`, `games`, `statistics`, `plays`, `monthly`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Your Plays By Month"/>
      <MonthlyWidget/>
    </Layout>
  );
}

export default MonthlyPage;
