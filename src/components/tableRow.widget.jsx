import React, { useEffect, useState } from "react";
import {
  Input,
  InputField,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@dhis2/ui";

export default function Tablelow(props) {
  // props for dataSetValues reported in data entry app
  const dataSetValues = props?.data;
  // data element name from the props
  const dataElementName = props?.name;

  const [reportEqual, setReportEqual] = useState();
  const [registerEqual, setRegisterEqual] = useState();
  const [message, setMessage] = useState();
  const [register, setRegister] = useState();
  const [report, setReport] = useState();

  // initialising the status for whether the validation passed or failed
  const status = {
    PASS: "pass",
    FAIL: "fail",
  };

  // modifying status for that specific dataSetValue
  const validationFun = () => {
    if (reportEqual && registerEqual) {
      setMessage(status.PASS);
      dataSetValues.Status = status.PASS;
    } else {
      dataSetValues.Status = status.FAIL;
      setMessage(status.FAIL);
    }
  };

  useEffect(() => {
    if (registerEqual !== undefined && reportEqual !== undefined) {
      validationFun();
    }
  }, [reportEqual, registerEqual]);

  return (
    <TableRow>
      <TableCell>{dataElementName}</TableCell>
      <TableCell>
        <Input
          name="Register"
          type="text"
          onChange={(e) => {
            dataSetValues.Register = e.value;
            dataSetValues.dataSet = props?.dataSet;
            setRegister(e.value);
            if (
              e.value === dataSetValues.value ||
              e.value === dataSetValues.Report
            ) {
              setRegisterEqual(true);
            } else {
              setRegisterEqual(false);
            }
          }}
          placeholder="Register value"
        />
      </TableCell>
      <TableCell>
        <Input
          name="Report"
          type="text"
          onChange={(e) => {
            dataSetValues.Report = e.value;
            dataSetValues.dataSet = {
              id: props?.dataSet.id,
              periodType: props?.dataSet?.periodType,
              name: props?.dataSet?.name,
            };
            setReport(e.value);
            if (
              e.value === dataSetValues.value ||
              e.value === dataSetValues.Register
            ) {
              setReportEqual(true);
            } else {
              setReportEqual(false);
            }
          }}
          placeholder="Paper Report Value"
        />
      </TableCell>
      <TableCell>{dataSetValues.value}</TableCell>
      <TableCell>{message === undefined ? null : message}</TableCell>
    </TableRow>
  );
}
