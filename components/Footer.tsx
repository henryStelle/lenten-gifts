import {
  Container,
  Grid,
  Typography,
  Link,
  Box,
  useMediaQuery,
} from "@mui/material";

export default function Footer() {
  const wide_screen = useMediaQuery("(min-width:600px)");

  return (
    <>
      <div style={{ height: wide_screen ? 70 : 110 }} />
      <Box
        component={"footer"}
        sx={{
          paddingY: "2vh",
          bgcolor: "background.paper",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Container>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>
                  Hosted by{" "}
                  <Link href={"https://stjohnsgigharbor.org"}>
                    St. John's Episcopal Church
                  </Link>
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography align={wide_screen ? "right" : "left"}>
                Designed and developed by{" "}
                <Link href={"https://github.com/henryStelle"}>
                  Henry Stelle
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
