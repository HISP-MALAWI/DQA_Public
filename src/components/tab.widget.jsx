import {
  Box,
  Button,
  InputField,
  Tab,
  TabBar,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import React, { useState, useEffect } from "react";
import FetchForm from "./fetchForm";
import HistoryWidget from "./history.widget";
import { useDataEngine } from "@dhis2/app-runtime";
import Indicators from "./indicators/indicators";
const tabs = [
  { id: 1, name: "Data Elements" },
  { id: 3, name: "Indicators" },
  { id: 2, name: "History" },
];

export default function TabsWidget(props) {
  const engine = useDataEngine();
  const [tab, setTab] = useState(1);
  const [dataStoreValues, setdataStoreValues] = useState([]);
  // const [dataSets, setDataSets] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);

  let dataStorePath = "dataStore/VDT_summaries";

  const ondataStoreSave = () => {
    props?.refetch();
  };

  const getSummaries = async () => {
    const query = {
      dataStore: {
        resource: dataStorePath,
        params: {
          fields: ["."],
        },
      },
    };

    try {
      try {
        const res = await engine?.query(query);
        setdataStoreValues(res);
        setOrgUnits(res?.organisationUnits);
      } catch (e) {}
    } catch (e) {}
  };

  useEffect(() => {
    getSummaries();
  }, [tab]);

  return (
    <div className={`${props?.styles?.marginTop}`}>
      <Box>
        <div>
          {/* TabBar displays two history and data validations tab headers used for navigation */}
          <TabBar>
            {tabs?.map((tabIndex, key) => {
              return (
                <Tab
                  className="tabs"
                  key={key}
                  onClick={() => {
                    setTab(tabIndex?.id);
                  }}
                  selected={tab === tabIndex?.id}
                >
                  {tabIndex?.name}
                </Tab>
              );
            })}
          </TabBar>
          {
            // rendering default tab content if no tab click event is triggered, otherwise render content based to the selected tab
            tab == 1 ? (
              <div className={`${props?.styles?.tabContent}`}>
                <FetchForm
                  key={props?.dataSets?.dataSets?.length}
                  styles={props?.styles}
                  periodTypes={props?.periodTypes}
                  ondataStoreSave={ondataStoreSave}
                  dataSets={props?.dataSets}
                  dataElements={props?.dataElements}
                  categoryOptionCombos={props?.categoryOptionCombos}
                  orgUnits={props?.orgUnits}
                />
              </div>
            ) : (
              <Box>
                {tab == 3 ? (
                  <div>
                    <Indicators
                      periodTypes={props?.periodTypes}
                      indicators={props?.indicators}
                      orgUnits={props?.orgUnits}
                      styles={props?.styles}
                    />
                  </div>
                ) : (
                  <div className={`${props?.styles?.tabContent}`}>
                    <HistoryWidget
                      refetch={getSummaries}
                      dataStoreValues={dataStoreValues}
                      dataStore={props?.dataStore}
                      orgUnits={props?.orgUnits}
                      styles={props?.styles}
                      categoryOptionCombos={props?.categoryOptionCombos}
                      dataElements={props?.dataElements}
                    />
                  </div>
                )}
              </Box>
            )
          }
        </div>
      </Box>
    </div>
  );
}
