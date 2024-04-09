import {
  AlertBar,
  Box,
  Button,
  ButtonStrip,
  Checkbox,
  Card,
  Field,
  FieldSet,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Table,
  TableBody,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  TextArea,
} from "@dhis2/ui";
import React, { useState, useEffect } from "react";
import FollowValidationTableRow from "./follwValidationTableRow";
import { useDataEngine, useDataMutation } from "@dhis2/app-runtime";

export default function FollowValidation(props) {
  const key = props.storeValue.key;
  const categoryOptionCombo = props?.categoryOptionCombos;

  const myMutation = {
    resource: `dataStore/VDT_summaries/${key}`,
    type: "update",
    data: ({ data }) => ({
      createdAt: data.createdAt,
      comment: data.comment,
      dataValues: data.dataValues,
      resolved: data.resolved,
    }),
  };

  const [open, setOpen] = useState(false);
  const [hide, setHidden] = useState(true);
  const engine = useDataEngine();
  const [comment, setComment] = useState();
  const [mutate, { error }] = useDataMutation(myMutation);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [dataValues, setDataValues] = useState(props?.storeValue?.value?.dataValues)

  // controls the opening and closing of the modal
  // toggling the state of a modal from being open to false to true and vice-vesa
  const onClick = (e) => {
    setOpen(!open);
    props?.refetch();
  };

  const markasComplete = (data) => {
    // this has to update the value for the data element or a defined dataSet in dhis2
    let resolvedCount = data?.dataValues?.filter(
      (values) => values.resolved === true || values.Status === "pass"
    );
    let resolvedCountNoIssue = data?.dataValues?.filter(
      (values) => values.resolved === undefined && values.Status === "pass"
    );

    if (resolvedCountNoIssue?.length === data?.dataValues?.length) {
      data.comment = comment;
      data.resolved = undefined;
      mutate({ data })
        .then((res) => {
          if (res.httpStatusCode == 200) {
            setMessageType("success");
            setErrorMessage("Comment submitted successfully");
            props.refetch();
            setHidden(false);
            setOpen(false);
          }
        })
        .catch((e) => {
          setMessageType("warning");
          setErrorMessage("Error: server error occured!");
        });
      if (!error) {
        props.refetch();
        setHidden(false);
        setOpen(false);
      }
    } else {
      if (resolvedCount?.length === data?.dataValues?.length) {
        data.comment = comment;
        data.resolved = true;
        mutate({ data })
          .then((res) => {
            if (res.httpStatusCode == 200) {
              setMessageType("success");
              setErrorMessage("Data element value updated successully!");
              props.refetch();
              setHidden(false);
              setOpen(false);
            }
          })
          .catch((e) => {
            setMessageType("warning");
            setErrorMessage("Error: server error occured!");
          });
        if (!error) {
          props.refetch();
          setHidden(false);
          setOpen(false);
        }
      } else {
        setHidden(false);
        setMessageType("warning");
        setErrorMessage(
          "Make sure all issues are resolved before you mark the summary as resolved!"
        );
      }
    }
  };

  const dataElementsFilter = (id, data) => {
    const optName = categoryOptionCombo?.filter(
      (combo) => combo.id === data?.categoryOptionCombo
    );

    const attrName = categoryOptionCombo?.filter(
      (attribute) => attribute.id === data?.attributeOptionCombo
    )

    // returning a data element that matches the data element id passed as a parameter
    let name = props?.dataElements?.filter(
      (dateElement) => dateElement.id === id
    )[0].name;
    if (optName.length > 0 || attrName.length > 0) {
      let catName = optName[0].name;
      let attrname = attrName[0].name
      console.log(catName)
      return `${attrname === 'default' || attrname === undefined ? '' : attrname} ${name} ${catName === "default" || catName === undefined ? '' : catName}`;
    } else {
      return name;
    }
  };

  const updateDataStore = (data) => {
    if (data?.error == true) {
      setMessageType("warning");
      setHidden(false);
      setErrorMessage(data?.errorMessage);
    } else {
      let entries = props?.entries;
      for (let index = 0; index < entries?.length; index++) {
        const element = entries[index];
        if (element.key == data?.dataStorekey) {
          for (
            let position = 0;
            position < element?.value?.dataValues?.length;
            position++
          ) {
            const dataValues = element?.value?.dataValues[position];
            if (dataValues.dataElement == data?.summaryValues?.dataElement) {
              if (dataValues?.value == data?.dhis2?.value) {
                dataValues.Status = "pass";
                dataValues.resolved = true;
                engine
                  .mutate({
                    resource: `dataStore/VDT_summaries/${element?.key}`,
                    type: "update",
                    data: () => ({
                      createdAt: element?.value?.createdAt,
                      updatedAt: new Date().toLocaleDateString(),
                      dataValues: element?.value?.dataValues,
                    }),
                  })
                  .then((result) => {
                    if (result.httpStatusCode == 200) {
                      props.refetch();
                      setHidden(false);
                      setMessageType("success");
                      setErrorMessage(
                        "Data Element issue resolved successully"
                      );
                    }
                  });
              } else {
                engine
                  .mutate({
                    resource: "dataValueSets",
                    type: "create",
                    data: {
                      dataSet: data?.summaryValues?.dataSet?.id,
                      period: data?.summaryValues?.period,
                      orgUnit: data?.summaryValues?.orgUnit,
                      dataValues: [
                        {
                          attributeOptionCombo: data?.summaryValues?.attributeOptionCombo,
                          dataElement: data?.dhis2?.name,
                          categoryOptionCombo: data?.summaryValues?.categoryOptionCombo,
                          value: data?.dhis2?.value,
                        },
                      ],
                    },
                  })
                  .then((res) => {
                    if (res.httpStatusCode == 200) {
                      dataValues.Status = "pass";
                      dataValues.resolved = true;
                      engine
                        .mutate({
                          resource: `dataStore/VDT_summaries/${element?.key}`,
                          type: "update",
                          data: () => ({
                            createdAt: element?.value?.createdAt,
                            updatedAt: new Date().toLocaleDateString(),
                            dataValues: element?.value?.dataValues,
                          }),
                        })
                        .then((results) => {
                          props.refetch();
                          setHidden(false);
                          setMessageType("success");
                          setErrorMessage(
                            "Data Element issue updated in dhis2 successully"
                          );
                        });
                    }
                  })
                  .catch((e) => { });
              }
            }
          }
        } else {
        }
      }
    }
  };

  const filteringWithoutValidation = (dataValues) => {
    return dataValues.filter((object) => object.Register !== undefined || object.Report !== undefined)
  }

  useEffect(() => {
    setDataValues(filteringWithoutValidation(dataValues))
  }, [])

  return (
    <div>
      <div>
        <ButtonStrip>
          <Button small primary onClick={onClick}>
            Follow
          </Button>
        </ButtonStrip>
        {open && (
          <Modal fluid position="middle">
            <ModalTitle>
              <p style={{ fontSize: 16 }}>
                {props?.storeValue?.value?.dataValues[0]?.dataSet?.name}
              </p>
              <p style={{ fontSize: 12, color: "gray" }}>
                (
                {
                  props?.orgUnits?.filter(
                    (orgUnit) =>
                      orgUnit.id ==
                      props?.storeValue?.value?.dataValues[0]?.orgUnit
                  )[0].name
                }
                ) (
                {props?.storeValue?.value?.dataValues[0]?.period?.split("T")[0]}
                )
              </p>
            </ModalTitle>
            <ModalContent>
              <Box>
                {
                  props.numberFailed == 0 ||
                    props.storeValue.value.comment !== undefined ? (
                    <p style={{ fontSize: 12, color: "gray" }}>
                      {props.storeValue.value?.comment}
                    </p>
                  ) : (
                    ""
                  )
                }
                <Table>
                  <TableHead>
                    <TableRowHead>
                      <TableCellHead>DataElement</TableCellHead>
                      <TableCellHead>Register</TableCellHead>
                      <TableCellHead>Report Form</TableCellHead>

                      <TableCellHead>DHIS2</TableCellHead>
                      <TableCellHead>Edit / Save</TableCellHead>
                    </TableRowHead>
                  </TableHead>
                  <TableBody>
                    {dataValues.map((data, key) => {
                      return (
                        <FollowValidationTableRow
                          styles={props?.styles}
                          dataStorekey={props?.storeValue?.key}
                          summaryValues={data}
                          key={key}
                          name={dataElementsFilter(data?.dataElement, data)}
                          updateDataStore={updateDataStore}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              <br />
              <Box>
                {props.storeValue.value?.resolved === true ||
                  props.storeValue.value?.comment !== undefined ? (
                  <></>
                ) : (
                  <Box height="200">
                    <Card>
                      <Field label="Comment">
                        <TextArea
                          name="comment"
                          resize="none"
                          onChange={(e) => {
                            setComment(e.value);
                          }}
                          placeholder="Comments can be saved when all issues have been solved"
                        />
                      </Field>
                    </Card>
                  </Box>
                )}
              </Box>
            </ModalContent>

            <ModalActions>
              <ButtonStrip end>
                <Button small onClick={onClick} secondary>
                  Cancel
                </Button>
                {props.storeValue.dataValues?.filter(
                  (values) => values?.Status == "fail"
                )?.length === 0 ||
                  props.storeValue.value?.comment !== undefined ? (
                  <></>
                ) : (
                  <Button
                    small
                    disabled={
                      comment === undefined ||
                        comment.length === 0 ||
                        props.storeValue.dataValues?.filter(
                          (values) => values?.Status == "fail"
                        )?.length === 0
                        ? true
                        : false
                    }
                    onClick={() => {
                      markasComplete(props.storeValue.value);
                    }}
                    primary
                  >
                    Comment
                  </Button>
                )}
              </ButtonStrip>
            </ModalActions>
          </Modal>
        )}
      </div>
    </div>
  );
}
