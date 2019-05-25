import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import AdminWidget from "../components/adminWidget";
import PageTitle from "../components/pageTitle"

function AdminPage(props) {
  return (<Layout>
      <SEO title="Admin" keywords={[]}/>
      <ExtstatsNavbar/>
      <PageTitle title="Admin"/>
      <AdminWidget/>
    </Layout>
  );
}

export default AdminPage;
