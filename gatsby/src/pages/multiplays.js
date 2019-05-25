import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import MultiPlaysWidget from "../components/multiplaysWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function MultiPlaysPage(props) {
  return (<Layout>
      <SEO title="Comparative Plays" keywords={[`board`, `games`, `statistics`, `plays`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Comparative Plays"/>
      <MultiPlaysWidget/>
    </Layout>
  );
}

export default MultiPlaysPage;
