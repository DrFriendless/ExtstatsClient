import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import WarTableWidget from "../components/warTableWidget";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function WarTablePage(props) {
  return (<Layout>
      <SEO title="War Table" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="The War Table"/>
      <WarTableWidget/>
    </Layout>
  );
}

export default WarTablePage;
