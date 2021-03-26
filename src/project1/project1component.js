import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Card, CardHeader } from "@material-ui/core";
import theme from "../theme";
import logo from "../assets/travelalertslogo.gif";

const Project1Component = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Card style={{ marginTop: "2%" }}>
        <img
          src={logo}
          alt="logo"
          title="Travel alerts logo"
          width="50%"
          style={{
            paddingLeft: "25%",
          }}
        />
        <CardHeader
          title="World Wide Travel Alerts"
          style={{ textAlign: "center" }}
        />
      </Card>
    </MuiThemeProvider>
  );
};
export default Project1Component;
