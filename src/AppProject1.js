import React, { useState, useReducer } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import Reorder from "@material-ui/icons/Reorder";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Project1Component from "./project1/project1component";
import AlertComponent from "./project1/alertcomponent";
import AdvisoryAddComponent from "./project1/advisoryaddcomponent";
import ListAdvisoriesComponent from "./project1/listadvisoriescomponent";

import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@material-ui/core";

const App = () => {
  const initialState = {
    snackbarMsg: "",
    msgFromParent: "data from parent",
    gotData: false,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ gotData: false });
  };
  const msgFromChild = (msg) => {
    setState({ snackbarMsg: msg, gotData: true });
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Case Study #1
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/home" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/alerts" onClick={handleClose}>
              Reset Alerts
            </MenuItem>
            <MenuItem component={Link} to="/add" onClick={handleClose}>
              Add Advisory
            </MenuItem>
            <MenuItem component={Link} to="/list" onClick={handleClose}>
              List Advisories
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route
          path="/alerts"
          render={() => <AlertComponent dataFromChild={msgFromChild} />}
        />
        <Route
          path="/add"
          render={() => <AdvisoryAddComponent dataFromChild={msgFromChild} />}
        />
        <Route
          path="/list"
          render={() => (
            <ListAdvisoriesComponent dataFromChild={msgFromChild} />
          )}
        />
        <Route path="/home" component={Project1Component} />
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
    </MuiThemeProvider>
  );
};
export default App;
