import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      <Link color="inherit" href="https://mui.com/">
        OpenSource💓
      </Link>
      &nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;