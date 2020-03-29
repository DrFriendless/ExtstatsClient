import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import YearlyWidget from "../components/yearlyWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function YearlyPage(props) {
    return (<Layout>
        <SEO title="Plays by Year" keywords={[`board`, `games`, `statistics`, `plays`, `yearly`]}/>
    <ExtstatsNavbar/>
    <PageTitleWithLogin title="Your Plays By Year"/>
        <YearlyWidget/>
        </Layout>
);
}

export default YearlyPage;
