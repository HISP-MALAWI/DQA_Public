import React from "react";
import Page from "./Pages";
import classes from "./App.module.css";
import { Box, CircularLoader, Divider } from "@dhis2/ui";
import { DataQuery } from "@dhis2/app-runtime";

const query = {
  organisationUnits: {
    resource: "organisationUnits",
    params: {
      paging: false,
      fields: ["id,name,level,path,displayName,code,children"],
      order: "level",
    },
  },
  categoryOptionCombo: {
    resource: "categoryOptionCombos",
    params: {
      paging: false,
      fields: ["id,name"],
    },
  },
  dataElements: {
    resource: "dataElements",
    params: {
      paging: false,
      fields: ["id", "name", "formName", "displayName", "code", "valueType"],
    },
  },
  indicators: {
    resource: "indicators",
    params: {
      paging: false,
      fields: ["*"],
    },
  },
  periodTypes: {
    resource: "periodTypes",
    params: {
      paging: false,
      fields: ["*"],
    },
  },
  dataStore: {
    resource: "dataStore",
    params: {
      paging: false,
      fields: ["*"],
    },
  },

  dataSets: {
    resource: "dataSets",
    params: {
      paging: false,
      fields: [
        "name",
        "id",
        "organisationUnits(id,name)",
        "periodType",
        "dataSetElements(dataSet,dataElement(id,name,displayName,formName,valueType))",
      ],
    },
  },
};
const MyApp = () => {
  return (
    <div className={classes?.container}>
      <div className={classes?.padding}>Data Quality Audit</div>
      <Divider />
      <DataQuery query={query}>
        {({ error, loading, data, refetch }) => {
          // console.log(data);
          if (loading)
            return (
              <span
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularLoader />
              </span>
            );

          return (
            <>
              <div>
                <Page styles={classes} refetch={refetch} data={data} />
              </div>
            </>
          );
        }}
      </DataQuery>
    </div>
  );
};

export default MyApp;
