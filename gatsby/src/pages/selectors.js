import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import SelectorsTestWidget from "../components/selectorsTestWidget";
import PageTitle from "../components/pageTitle"

function SelectorsPage(props) {
  return (<Layout>
      <SEO title="Selector Test" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <PageTitle title="Selector Test"/>
      <SelectorsTestWidget/>
    </Layout>
  );
}

export default SelectorsPage;
