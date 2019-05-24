import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import AdminWidget from "../components/adminWidget";

function AdminPage(props) {
  return (<Layout>
      <SEO title="Admin" keywords={[]}/>
      <ExtstatsNavbar/>
      <h1>Admin</h1>
      <AdminWidget/>
    </Layout>
  );
}

export default AdminPage;
