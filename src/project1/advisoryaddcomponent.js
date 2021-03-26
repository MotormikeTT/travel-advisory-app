import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import theme from "../theme";
import Project1Component from "./project1component";

const format = require("date-fns/format");

const AdvisoryAddComponent = (props) => {
  const GRAPHURL = "/graphql";
  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };
  const initialState = {
    msg: "",
    name: "",
    country: null,
    alerts: [],
    resetAutocomplete: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAlerts = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: "query {alerts {country,name,text,date,region,subregion}}",
        }),
      });
      let payload = await response.json();
      let resArr = [];
      resArr = payload.data.alerts;
      setState({
        alerts: resArr,
      });
      sendParentMsg(`found ${resArr.length} countries`);
    } catch (error) {
      console.log(error);
      sendParentMsg(`Problem loading server data - ${error.message}`);
    }
  };

  const onAddClicked = async () => {
    let advisory = {
      name: state.name,
      country: state.country.name,
      text: state.country.text,
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `mutation {addadvisory(name:"${advisory.name}",country:"${advisory.country}",text:"${advisory.text}",date:"${advisory.date}") {name,country,text,date}}`,
        }),
      });
      setState({
        name: "",
        country: "",
        resetAutocomplete: state.resetAutocomplete ? false : true,
      });
      response.ok
        ? sendParentMsg(`added advisory on ${advisory.date}`)
        : sendParentMsg(`send failed - ${response.statusText}`);
    } catch (error) {
      sendParentMsg(error.message);
    }
  };

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setState({
          country: selectedOption,
        })
      : setState({
          country: null,
        });
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.country === undefined ||
    state.country === null;

  return (
    <MuiThemeProvider theme={theme}>
      <Project1Component style={{ maxWidth: "50%" }} />
      <Card>
        <CardHeader
          style={{ textAlign: "center" }}
          title="Add Advisory"
          color="inherit"
        />
        <CardContent>
          <TextField
            onChange={handleNameInput}
            helperText="Traveller's name"
            value={state.name}
          />
          <Autocomplete
            options={state.alerts}
            key={state.resetAutocomplete}
            getOptionLabel={(option) => option.name}
            style={{ width: 300, marginTop: 10 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="countries"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={onAddClicked}
            disabled={emptyorundefined}
            style={{ marginTop: 10 }}
          >
            Add Advisory
          </Button>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default AdvisoryAddComponent;
