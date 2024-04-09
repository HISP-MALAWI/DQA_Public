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
//     multiple indicators
//     one organisation unit
export default function FilterByOrgUnitLayout({data}) {
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
          {data?.data?.metaData?.dimensions?.ou?.map((dd, k) => {
            return (
              <TableRowHead key={k}>
                <TableCellHead  colSpan="1">
                  Org Unit: {controllers.orgUnits(data, dd)}
                </TableCellHead>
                <TableCellHead colSpan="8" />
              </TableRowHead>
            );
          })}
          <TableRowHead>
            <TableCellHead>Periods</TableCellHead>
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
          {data?.data?.metaData?.dimensions?.pe?.map((perio, key) => {
            return (
              <TableRow key={key}>
                <TableCell>{controllers.periods(data, perio)}</TableCell>
                {data?.data?.metaData?.dimensions?.dx?.map((dx, k) => {
                  return (
                    <TableCell key={k}>
                      {controllers.dataValueFilterByOrgUnit(data, perio, dx)}
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
