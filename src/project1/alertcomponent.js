import React, { useEffect, useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import theme from "../theme";
import Project1Component from "./project1component";

const AlertComponent = (props) => {
  const GRAPHURL = "/graphql";
  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };
  const initialState = {
    msg: "",
    alerts: [],
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      sendParentMsg("running setup...");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: "query {setupalerts {results}}" }),
      });
      let payload = await response.json();
      let resArr = [];
      resArr = payload.data.setupalerts.results
        .replace(/([.])\s*(?=[A-Z])/g, "$1|")
        .split("|");
      setState({
        alerts: resArr,
      });
      sendParentMsg("alerts collection setup completed");
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Project1Component style={{ maxWidth: "50%" }} />
      <Card>
        <CardContent>
          <CardHeader
            style={{ color: "grey", textAlign: "center" }}
            title="Alert Setup - Details"
          />
          <TableContainer>
            <Table>
              <TableBody>
                {state.alerts.map((row) => (
                  <TableRow key={row}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ color: theme.palette.primary.main }}
                    >
                      {row}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CardContent>
            <Typography color="primary">{state.msg}</Typography>
          </CardContent>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default AlertComponent;
