import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import GeekWidget from "../components/geekWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function GeekPage(props) {
  return (<Layout>
      <SEO title="Geek Home" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Geek Home"/>
      <GeekWidget/>
    </Layout>
  );
}

export default GeekPage;
