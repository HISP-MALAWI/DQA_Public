import React, { useEffect, useState } from "react";
import {
  AlertBar,
  Box,
  Button,
  CircularLoader,
  Input,
  InputField,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import Tablelow from "./tableRow.widget";
import { useDataMutation } from "@dhis2/app-runtime";

export default function TableWidget(props) {
  const dataValues = props?.data?.dataValueSets?.dataValues;
  const dataSetElements = props?.dataSetElements;
  const categoryOptionCombos = props?.categoryOptionCombos
  const [loading, setLoading] = useState(false);

  const myMutation = {
    resource: `dataStore/VDT_summaries/${new Date().getTime()}`,
    type: "create",
    data: ({ data }) => ({
      createdAt: new Date().toLocaleString(),
      dataValues: data,
    }),
  };

  const [mutate, { error }] = useDataMutation(myMutation);
  const catCombo = (dataElementID) =>{
    const datValue = dataValues.filter(
      (datavalue) => datavalue?.dataElement === dataElementID
    )
      return datValue
  }
  const filter = (dataValue) => {
    const element = dataSetElements?.filter(
      (element) => element?.dataElement?.id === dataValue?.dataElement
    );
    const attrCombo = categoryOptionCombos.filter((object)=> object.id === dataValue.attributeOptionCombo)
    const catCombo = categoryOptionCombos.filter((object)=> object.id === dataValue.categoryOptionCombo)
    let name =
      element[0]?.dataElement?.formName !== undefined
        ? element[0]?.dataElement?.formName
        : element[0]?.dataElement?.displayName;
    let inputType = element[0]?.dataElement?.valueType;
    if(attrCombo.length > 0){
      name = `${attrCombo[0].name === 'default' ? '' :attrCombo[0].name} ${name}`
    }if(catCombo.length > 0){
      name = `${name} ${catCombo[0].name === 'default' ? '' : catCombo[0].name} `
    }
    return { name, inputType };
  };

  const saveValidation = async () => {
    setLoading(true);
    let data = dataValues;
    if (data?.length > 0) {
      await mutate({ data });
      if (error) {
        props?.getEvent({
          error: true,
          message: "Error failed to save summary",
          hidden: false,
        });
        // props?.setError(true);
        // props?.setMessageSuccess("Error");
        setLoading(false);
        // props.setHidden(true);
      } else {
        props?.getEvent({
          error: false,
          message: "Summary saved successfully",
          hidden: false,
        });
        // props?.setError(false);
        // props?.setHidden(true);
        props?.ondataStoreSave();
        // props?.setMessageSuccess("Success");
        setLoading(false);
      }
    } else {
      props?.getEvent({
        error: true,
        message: "No validation done",
        hidden: false,
      });
      // props?.setMessageSuccess("Error length");
      setLoading(false);
      // props?.setError(true);
      // props?.setHidden(true);
    }
  };

  return (
    <div>
      <Box>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Data Element</TableCellHead>
              <TableCellHead>Register</TableCellHead>
              <TableCellHead>Paper Reporting Form</TableCellHead>
              <TableCellHead>DHIS2</TableCellHead>
              <TableCellHead>Status</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {dataValues?.map((dataValue, index) => {
              return (
                <Tablelow
                  key={index}
                  data={dataValue}
                  name={filter(dataValue)?.name}
                  inputType={filter(dataValue?.dataElement)?.inputType}
                  dataSet={props?.dataSet}
                />
              );
            })}
          </TableBody>
        </Table>
        <Box>
          <Button
            className={`${props?.styles.marginTop}`}
            name="Primary button"
            onClick={saveValidation}
            primary
            value="default"
          >
            {loading ? <CircularLoader small /> : "Save Summary"}
          </Button>
        </Box>
      </Box>
    </div>
  );
}
