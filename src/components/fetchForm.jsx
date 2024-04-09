import { CustomDataProvider } from "@dhis2/app-runtime";
import {
  AlertBar,
  Box,
  Button,
  CalendarInput,
  Card,
  Divider,
  DropdownButton,
  Field,
  OrganisationUnitTree,
  SelectorBar,
  SelectorBarItem,
  SingleSelect,
  SingleSelectOption,
} from "@dhis2/ui";
import React, { useEffect, useState } from "react";
import ValidationWidget from "./validation.widget";

const GetYears = () => {
  let years = [];
  let year = new Date().getFullYear();
  for (let index = 0; index < 20; index++) {
    years.push(year - index);
  }
  return years;
};
const periodTypes = ["Monthly", "Quarterly", "SixMonthly", "Yearly"];

const Months = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const Quarters = [
  { name: "January-March", value: "Q1" },
  { name: "April-June", value: "Q2" },
  { name: "July-September", value: "Q3" },
  { name: "October-December", value: "Q4" },
];

const sixMonths = [
  { name: "January-June", value: "S1" },
  { name: "July-December", value: "S2" },
];

function FetchForm(props) {
  const orgUnits = props?.orgUnits;
  const dSets = props?.dataSets;
  const [selectedDuration, setDuration] = useState();
  const [datasets, setDatasets] = useState([]);
  const [choice, setSelected] = useState();
  const [dataset, setDataset] = useState();
  const [period, setPeriod] = useState();
  const [year, setYear] = useState();
  const [parameters, setParameters] = useState(undefined);
  const [errorMessage, setMessage] = useState();
  const [error, setError] = useState(false);
  const [errorMessageSuccess, setMessageSuccess] = useState(false);
  const [hide, setHidden] = useState(true);
  const [valState, setValidationState] = useState(0);


  const onClickBtn = () => {
    if (choice === undefined) {
      setMessage("Organisation unit is required");
      setHidden(false);
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    } else if (dataset === undefined) {
      setMessage("dataset is required");
      setHidden(false);
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    } else if (period === undefined) {
      setMessage(" period type is required");
      setHidden(false);
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    } else if (year === undefined) {
      setMessage("year is required");
      setHidden(false);
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    } else if (period !== "Yearly" && selectedDuration === undefined) {
      setMessage("Period is not selected");
      setHidden(false);
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    } else {
      let dataSt = dSets?.dataSets?.find((dataSet) => dataSet.id === dataset);
      setParameters({
        orgUnit: choice,
        period: year + selectedDuration,
        dataSet: dataSt,
      });
      setValidationState(Math.random);
    }
  };

  const nullifyParameter = () => {
    props?.ondataStoreSave();
    setDataset();
    setYear();
    setDuration();
    setSelected();
    setParameters(undefined);
  };

  const setErr = (erro) => {
    setError(erro);
  };

  const orgUnitLevels = (orgs) => {
    let orgsList = [];

    orgs?.map((org) => {
      org?.level == 1 ? orgsList?.push(org?.id) : "";
    });
    return orgsList;
  };
  const getEvent = (response) => {
    setHidden(response?.hidden);
    setMessage(response?.message);
    setError(response?.error);
  };
  const setPeriodValue = (period) => {
    if (period == "Monthly") {
      return (
        <Field label="Month">
          <SingleSelect
            className="select"
            onChange={(e) => {
              setDuration(e?.selected);
            }}
            placeholder="--select Month--"
            filterable
            noMatchText="No match found"
            selected={selectedDuration}
          >
            {Months.map((month, index) => {
              return (
                <SingleSelectOption
                  key={index}
                  label={month?.name}
                  value={month?.value}
                />
              );
            })}
          </SingleSelect>
        </Field>
      );
    } else if (period == "SixMonthly") {
      return (
        <Field label="SixMonthly">
          <SingleSelect
            className="select"
            onChange={(e) => {
              setDuration(e?.selected);
            }}
            placeholder="--select Period--"
            filterable
            noMatchText="No match found"
            selected={selectedDuration}
          >
            {sixMonths.map((sixMonth, index) => {
              return (
                <SingleSelectOption
                  key={index}
                  label={sixMonth?.name}
                  value={sixMonth?.value}
                />
              );
            })}
          </SingleSelect>
        </Field>
      );
    } else if (period == "Quarterly") {
      return (
        <Field label="Quarterly">
          {" "}
          <SingleSelect
            className="select"
            onChange={(e) => {
              setDuration(e.selected);
            }}
            placeholder="--select Quarter--"
            filterable
            noMatchText="No match found"
            selected={selectedDuration}
          >
            {Quarters?.map((Quarter, index) => {
              return (
                <SingleSelectOption
                  key={index}
                  label={Quarter?.name}
                  value={Quarter?.value}
                />
              );
            })}
          </SingleSelect>
        </Field>
      );
    }
  };

  return (
    <Box className={props?.styles?.LayoutBox}>
      <Box className={`${props?.styles.sideNav} ${props?.styles.backgroud}`}>
        <Field label="Organization units">
          <OrganisationUnitTree
            name="Root org unit"
            onChange={(selectedOrgUnits) => {
              setSelected(selectedOrgUnits);
              setDataset(null);
              setDatasets(
                dSets?.dataSets?.filter((set) =>
                  set?.organisationUnits.some(
                    (org) => org?.id === selectedOrgUnits?.id
                  )
                )
              );
            }}
            roots={orgUnitLevels(orgUnits)}
            singleSelection
            selected={choice?.selected}
            hideMemberCount={false}
            onSelectClick={(orgUnit) => {}}
          />
        </Field>
      </Box>

      <Box className={`${props?.styles?.mainContent}`}>
        <Card
          className={`${props?.styles?.padding} ${props?.styles?.marginTop}`}
        >
          <div
            className={`${props?.styles?.padding} ${props?.styles?.marginTop} ${props?.styles?.row}`}
          >
            <Field label="Dataset">
              <SingleSelect
                className="select"
                onChange={(e) => {
                  let dataSt = dSets?.dataSets.find(
                    (dataSet) => dataSet?.id === e?.selected
                  );
                  setDuration();
                  setDataset(e?.selected);
                  setPeriod(dataSt?.periodType);
                }}
                placeholder="--select dataset--"
                filterable
                noMatchText="No match found"
                selected={dataset}
              >
                {datasets?.length > 0
                  ? datasets?.map((Dataset, index) => {
                      return (
                        <SingleSelectOption
                          key={index}
                          label={Dataset.name.toString()}
                          value={Dataset.id}
                        />
                      );
                    })
                  : null}
              </SingleSelect>
            </Field>
            <Field label="Year">
              <SingleSelect
                className="select"
                onChange={(e) => {
                  setYear(e.selected);
                }}
                placeholder="--select year--"
                filterable
                noMatchText="No match found"
                selected={year}
              >
                {GetYears()?.map((yr, index) => {
                  return (
                    <SingleSelectOption
                      key={index}
                      label={yr.toString()}
                      value={yr + ""}
                    />
                  );
                })}
              </SingleSelect>
            </Field>
            {setPeriodValue(period)}
            <div className={`${props?.styles?.marginTop}`}>
              <Button
                className={`${props?.styles.fetchButton}`}
                name="Primary button"
                onClick={() => onClickBtn()}
                primary
                value="default"
              >
                Fetch
              </Button>
              <Divider dense />
            </div>
          </div>
          <div>
            {parameters !== undefined ? (
              <ValidationWidget
                ondataStoreSave={nullifyParameter}
                setError={setErr}
                setMessageSuccess={setMessageSuccess}
                key={valState}
                setHidden={(h) => setHidden(h)}
                categoryOptionCombos={props?.categoryOptionCombos}
                styles={props?.styles}
                parameters={parameters}
                program={props?.program}
                getEvent={getEvent}
              />
            ) : (
              <></>
            )}
          </div>
          <div style={{ marginLeft: "20px",position : 'absolute',bottom : '0', left : '45%', right: '50%' }}>
            {error ? (
              <AlertBar
                warning
                hidden={hide}
                duration={4000}
                onHidden={() => setHidden(true)}
              >
                {errorMessage}
              </AlertBar>
            ) : (
              <AlertBar
                success
                hidden={hide}
                duration={4000}
                onHidden={() => setHidden(true)}
              >
                {errorMessage}
              </AlertBar>
            )}
          </div>
        </Card>
      </Box>
    </Box>
  );
}

export default FetchForm;
