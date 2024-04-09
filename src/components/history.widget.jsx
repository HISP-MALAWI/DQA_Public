import {
  AlertBar,
  Box,
  Button,
  Chip,
  CircularLoader,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  Tooltip,
} from "@dhis2/ui";
import React, { useState, useEffect } from "react";
import FollowValidation from "./followValidation";

// renders all summaries saved from validation tab
export default function HistoryWidget(props) {
  // initialising the status for whether the validation passed or failed
  const status = {
    PASS: "pass",
    FAIL: "fail",
  };

  const [exists, setExist] = useState(
    props?.dataStore?.filter((store) => store === "VDT_summaries")
  );
  const [hide, setHidden] = useState(true);
  const [message, setMessage] = useState("");
  const entries = props?.dataStoreValues?.dataStore?.entries?.reverse();

  return (
    <div style={{ maxWidth: "100%" }} className={props?.styles?.marginTop}>
      {exists?.length > 0 ? (
        <>
          {entries?.length > 0 ? (
            <Box>
              <Table>
                <TableHead>
                  <TableRowHead>
                    <TableCellHead>Date</TableCellHead>
                    <TableCellHead>Dataset</TableCellHead>
                    <TableCellHead>Failed</TableCellHead>
                    <TableCellHead>Passed</TableCellHead>
                    <TableCellHead>Follow</TableCellHead>
                  </TableRowHead>
                </TableHead>

                <TableBody>
                  {entries.map((storeValue, key) => (
                    <TableRow key={key}>
                      <TableCell>
                        {storeValue?.value?.createdAt?.split(",")[0]}
                      </TableCell>
                      <TableCell>
                        {storeValue?.value?.dataValues[0]?.dataSet?.name}
                      </TableCell>
                      <TableCell>
                        {
                          storeValue?.value?.dataValues?.filter(
                            (values) => values?.Status == status?.FAIL
                          )?.length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          storeValue?.value?.dataValues?.filter(
                            (values) => values?.Status == status?.PASS
                          )?.length
                        }
                      </TableCell>
                      <TableCell>
                        <FollowValidation
                          styles={props?.styles}
                          refetch={props?.refetch}
                          numberFailed={
                            storeValue?.value?.dataValues?.filter(
                              (values) => values?.Status == status?.FAIL
                            )?.length
                          }
                          entries={props?.dataStoreValues?.dataStore?.entries}
                          storeValue={storeValue}
                          dataElements={props?.dataElements}
                          categoryOptionCombos={props?.categoryOptionCombos}
                          orgUnits={props?.orgUnits}
                        />
                      </TableCell>
                      <TableCell>
                        {storeValue?.value?.dataValues?.filter(
                          (values) => values?.Status == status?.FAIL
                        )?.length === 0 ? (
                          <Chip>
                            <Tooltip content={storeValue?.value?.comment}>
                              <span style={{ color: "#0a9708",padding: '10px' }}>Resolved</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#0a9708"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                              </svg>
                            </Tooltip>
                          </Chip>
                        ) : (
                          <>
                            {storeValue?.value?.resolved == undefined &&
                            storeValue?.value?.dataValues?.filter(
                              (values) => values?.Status == status?.PASS
                            )?.length ===
                              storeValue?.value?.dataValues?.length ? (
                              <Chip>
                                <Tooltip content={storeValue?.value?.comment}>
                                  <span style={{ color: "#0a9708" }}>
                                    No issue
                                  </span>{" "}
                                  <svg
                                    fill="#0a9708"
                                    version="1.1"
                                    id="Capa_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="19"
                                    height="19"
                                    viewBox="-62.55 -62.55 542.08 542.08"
                                    space="preserve"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      stroke="#CCCCCC"
                                      strokeWidth="21.682908"
                                    >
                                      {" "}
                                      <g>
                                        {" "}
                                        <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path>{" "}
                                      </g>{" "}
                                    </g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <g>
                                        {" "}
                                        <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path>{" "}
                                      </g>{" "}
                                    </g>
                                  </svg>
                                </Tooltip>
                              </Chip>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
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
          )}
        </>
      ) : (
        <span style={{ fontSize: 17, padding: "10px" }}>
          No validation summaries saved
        </span>
      )}
    </div>
  );
}
