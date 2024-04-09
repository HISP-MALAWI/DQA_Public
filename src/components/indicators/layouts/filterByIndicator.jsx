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

// this returns analytics for indicators with the following params
//     multiple periods
//     one indicator
//     multiple organisation units
export default function FilterByIndicatorLayout({data}) {
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
          {data?.data?.metaData?.dimensions?.dx?.map((dd, k) => {
            return (
              <TableRowHead key={k}>
                <TableCellHead  colSpan="1">
                  Indicator: {controllers.dimensions(data, dd)}
                </TableCellHead>
                <TableCellHead colSpan="8" />
              </TableRowHead>
            );
          })}
          <TableRowHead>
            <TableCellHead>Organisation Units</TableCellHead>
            {data?.data?.metaData?.dimensions?.pe?.map((pe, key) => {
              return (
                <TableCellHead key={key}>
                  {controllers.periods(data, pe)}
                </TableCellHead>
              );
            })}
          </TableRowHead>
        </TableHead>
        <TableBody>
          {data?.data?.metaData?.dimensions?.ou?.map((org, key) => {
            return (
              <TableRow key={key}>
                <TableCell>{controllers.orgUnits(data, org)}</TableCell>
                {data?.data?.metaData?.dimensions?.pe?.map((pe, k) => {
                  return (
                    <TableCell key={k}>
                      {controllers.dataValueFilterByIndicator(data, pe, org)}
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
