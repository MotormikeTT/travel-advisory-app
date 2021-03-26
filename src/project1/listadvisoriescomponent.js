import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import theme from "../theme";
import Project1Component from "./project1component";

const ListAdvisoriesComponent = (props) => {
  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };
  const GRAPHURL = "/graphql";
  const travellerQuery = `query {travellers}`;
  const regionQuery = `query {regions}`;
  const subregionQuery = `query {subregions}`;
  const advisoriesForTravellerQuery = `query($name: String) {advisoriesfortraveller(name: $name) {country,text,date}}`;
  const alertsForRegionQuery = `query($region: String) {alertsforregion(region: $region) {name,text,date}}`;
  const alertsForSubRegionQuery = `query($subregion: String) {alertsforsubregion(subregion: $subregion) {name,text,date}}`;

  const initialState = {
    advisories: null,
    resetAutocomplete: false,
    names: [],
    selection: "traveller",
    autocompleteLabel: "travellers",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchInfo(travellerQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfo = async (query, variables, selectedOption) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      });
      let payload = await response.json();
      let resArr = [];
      resArr =
        payload.data.travellers ||
        payload.data.regions ||
        payload.data.subregions ||
        null;
      let advArr = [];
      advArr =
        payload.data.advisoriesfortraveller ||
        payload.data.alertsforregion ||
        payload.data.alertsforsubregion ||
        null;
      setState({
        names: resArr ? resArr : state.names,
        advisories: advArr,
      });
      sendParentMsg(
        resArr
          ? `found ${resArr.length} ${Object.keys(payload.data)}`
          : `found ${advArr.length} alerts for ${selectedOption}`
      );
    } catch (error) {
      console.log(error);
      sendParentMsg(`Problem loading server data - ${error.message}`);
    }
  };

  const onChange = (e, selectedOption) => {
    switch (state.autocompleteLabel) {
      case "travellers":
        fetchInfo(
          advisoriesForTravellerQuery,
          `{"name": "${selectedOption}"}`,
          selectedOption
        );
        break;
      case "regions":
        fetchInfo(
          alertsForRegionQuery,
          `{"region": "${selectedOption}"}`,
          selectedOption
        );
        break;
      default:
        fetchInfo(
          alertsForSubRegionQuery,
          `{"subregion": "${selectedOption}"}`,
          selectedOption
        );
        break;
    }
    setState({
      resetAutocomplete: state.resetAutocomplete ? false : true,
    });
  };

  const handleSelection = (e) => {
    setState({
      selection: e.target.value,
      autocompleteLabel: `${e.target.value}s`,
      resetAutocomplete: state.resetAutocomplete ? false : true,
      advisories: null,
    });
    switch (e.target.value) {
      case "region":
        fetchInfo(regionQuery);
        break;
      case "subregion":
        fetchInfo(subregionQuery);
        break;
      default:
        fetchInfo(travellerQuery);
        break;
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Project1Component style={{ maxWidth: "50%" }} />
      <Card>
        <CardHeader
          style={{ textAlign: "center", paddingBottom: 0 }}
          title={<Typography color="primary">List Advisories by:</Typography>}
        />
        <CardContent style={{ paddingTop: 0 }}>
          <FormControl
            component="fieldset"
            style={{
              display: "flex",
            }}
          >
            <RadioGroup
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
              }}
              row
              value={state.selection}
              onChange={handleSelection}
            >
              <FormControlLabel
                value="traveller"
                control={<Radio color="primary" />}
                label="Traveller"
              />
              <FormControlLabel
                value="region"
                control={<Radio color="primary" />}
                label="Region"
              />
              <FormControlLabel
                value="subregion"
                control={<Radio color="primary" />}
                label="Sub-Region"
              />
            </RadioGroup>
          </FormControl>
          <Autocomplete
            options={state.names}
            key={state.resetAutocomplete}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={state.autocompleteLabel}
                variant="outlined"
                fullWidth
              />
            )}
          />
          {state.advisories != null && (
            <TableContainer style={{ maxHeight: 300, marginTop: 10 }}>
              <Table style={{ color: "primary" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell>Alert Information</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.advisories.map((row) => (
                    <TableRow key={row.name || row.country}>
                      <TableCell component="th" scope="row">
                        {row.name || row.country}
                      </TableCell>
                      <TableCell>
                        {row.text} <br />
                        {row.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default ListAdvisoriesComponent;
