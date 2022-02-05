import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          onClick={() => router.push("/")}
        >
          Lenten Giving
        </Typography>
        <Button
          color={"secondary"}
          variant="outlined"
          onClick={() => router.push("/")}
          sx={{ marginRight: 2 }}
        >
          View Gifts
        </Button>
        <Button
          color={"secondary"}
          variant="contained"
          onClick={() => router.push("/gift")}
        >
          Offer Gift
        </Button>
      </Toolbar>
    </AppBar>
  );
}
