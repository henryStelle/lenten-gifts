import React from "react";
import { Typography, Tabs, Tab, Paper, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { toTitleCase } from "../utils/toTitleCase";
import Listing from "../components/Listing";
import useQuery from "../utils/useQuery";
import { Listing as ListingDocument } from "../models/Listing";

export default function View() {
  const router = useRouter();

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<ListingDocument>("/api/listing/list");
  const [subject, setSubject] = React.useState("");

  const handleChangeSubject = (nxt: string) => {
    setSubject(nxt);
    router.push(router.pathname, { query: { v: nxt } });
  };

  React.useEffect(() => {
    // waiting for router to load and then waiting for the query to load and then only if not already a subject
    if (
      router &&
      router.asPath.includes("v=") == !!router.query.v &&
      !subject
    ) {
      handleChangeSubject(router.query.v?.toString() || "gifts");
    }
  }, [router]);

  return (
    <Layout title={subject ? `View ${toTitleCase(subject)}` : "View"}>
      {/* <Typography variant="h3" gutterBottom>
        View {toTitleCase(subject)}
      </Typography> */}
      <Paper>
        <Tabs
          value={subject}
          variant="fullWidth"
          onChange={(_, nextSubject) => handleChangeSubject(nextSubject)}
        >
          <Tab value={"gifts"} label={"Gifts"} />
          <Tab value={"groups"} label={"Groups"} />
        </Tabs>
      </Paper>
      <div style={{ height: 24 }} />
      {error && <Typography color={"error"}>{error.toString()}</Typography>}
      {isLoading && <Typography align={"center"}>Loading...</Typography>}
      <Grid container spacing={3}>
        {data
          .filter(({ type }) => type == subject)
          .map((gift) => (
            <Listing key={gift._id} {...gift} />
          ))}
      </Grid>
    </Layout>
  );
}
