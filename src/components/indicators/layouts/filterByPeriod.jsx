import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import React, { useEffect } from "react";
import { controllers } from "../../../services/controllers/analytics.controller";

export default function FilterByPeriodLayout({ data }) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead colSpan="1">
              Indicators 
            </TableCellHead>
            <TableCellHead colSpan="8" />
          </TableRowHead>
          {data?.data?.metaData?.dimensions?.pe?.map((dd, k) => {
            return (
              <TableRowHead key={k}>
                <TableCellHead  colSpan="1">
                  Period: {controllers.periods(data, dd)}
                </TableCellHead>
                <TableCellHead colSpan="8" />
              </TableRowHead>
            );
          })}
          <TableRowHead>
            <TableCellHead>Organisation Units</TableCellHead>
            {data?.data?.metaData?.dimensions?.dx?.map((dx, key) => {
              return (
                <TableCellHead key={key}>
                  {controllers.dimensions(data, dx)}
                </TableCellHead>
              );
            })}
          </TableRowHead>
        </TableHead>
        <TableBody>
          {data?.data?.metaData?.dimensions?.ou?.map((orgUn, key) => {
            return (
              <TableRow key={key}>
                <TableCell>{controllers.orgUnits(data, orgUn)}</TableCell>
                {data?.data?.metaData?.dimensions?.dx?.map((dx, k) => {
                  return (
                    <TableCell key={k}>
                      {controllers.dataValueFilterByPeriod(data, orgUn, dx)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
