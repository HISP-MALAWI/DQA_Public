import { DataQuery } from "@dhis2/app-runtime";
import React, { useState, useEffect } from "react";
import TabsWidget from "../components/tab.widget";
import { CircularLoader } from "@dhis2/ui";

export default function Page(props) {
  return (
    <div>
      <TabsWidget
        styles={props?.styles}
        refetch={props?.refetch}
        dataStore={props?.data?.dataStore}
        dataSets={props?.data?.dataSets}
        categoryOptionCombos={
          props?.data?.categoryOptionCombo?.categoryOptionCombos
        }
        periodTypes={props?.data?.periodTypes?.periodTypes}
        orgUnits={props?.data?.organisationUnits?.organisationUnits}
        events={props?.data?.events?.events}
        indicators={props?.data?.indicators?.indicators}
        dataElements={props?.data?.dataElements?.dataElements}
      />
    </div>
  );
}
