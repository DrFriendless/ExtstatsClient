import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import UpdatesWidget from "../components/updatesWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function UpdatesPage(props) {
  return (<Layout>
      <SEO title="Update Schedule" keywords={['configuration']}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Update Schedule"/>
      <UpdatesWidget/>
    </Layout>
  );
}

export default UpdatesPage;
