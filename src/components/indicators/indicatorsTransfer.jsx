import React, { useState, useEffect } from "react";
import { Button, Field, Transfer } from "@dhis2/ui";

export default function IndicatorsWidget(props) {
  const [selectedDimensions, setselectedDimensions] = useState([]);

  const getDataDimensions = (e) => {
    setselectedDimensions(e.selected);
    props?.selectedIndicator(e.selected);
  };

  const defaultRenderOption = () => {
    let indicators = [];
    props?.indicators
      ?.filter((indicator) => indicator.id !== undefined)
      ?.map((indicatorValue) => {
        indicators.push({
          label: indicatorValue?.name,
          value: indicatorValue?.id,
        });
      });

    return indicators;
  };

  return (
    <div style={{ padding: "10px", width: "700px" }}>
      <Field
        label="Data Dimension"
        className={`${props?.styles?.marginBottom}`}
      >
        
      </Field>
      <Transfer
        filterable
        height="300px"
        onChange={getDataDimensions}
        options={defaultRenderOption()}
        selected={selectedDimensions}
        selectedEmptyComponent={
          <p style={{ textAlign: "center", fontSize: "14px", color: "gray" }}>
            You have not selected anything yet
            <br />
          </p>
        }
      />
    </div>
  );
}
