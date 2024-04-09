import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, Input, InputField, Table, TableBody, TableCell, TableRow } from '@dhis2/ui'


export default function FollowValidationTableRow(props) {
    // props for events reported as validation summary
    const summaryValues = props?.summaryValues
    // data element name from the props
    const dataElementName = props?.name
    // initialising the status for whether the validation passed or failed
    const status = {
        PASS: "pass",
        FAIL: "fail"
    }
    // control state for the input fields and save or edit button
    const [openInputField, setOpenInputField] = useState(false)
    const [buttonEditSave, setbuttonEditSave] = useState("Edit")
    const [reportEqual, setReportEqual] = useState(false)
    const [registerEqual, setRegisterEqual] = useState(false)
    const [dhis2Equal, setDHIS2Equal] = useState(false)
    const [register, setRegister] = useState()
    const [report, setReport] = useState()
    const [dhis2, setDHIS2] = useState()
    const [errorMessage, setErrorMessage] = useState({
        report: "",
        register: "",
        dhis2: ""
    })


    // latency time to display input fields when edit button is clicked
    // toggle between edit and save button textContent

    const buttonEditToggle = () => {
        setTimeout(() => {
            setOpenInputField(!openInputField)
            setbuttonEditSave("Save")
        }, 600);

        if (!openInputField) {

        } else {
            setTimeout(() => {
                setbuttonEditSave("Edit")
            }, 600);

        }
    }
    const hundleButtonSave = (e) => {
       
        if (registerEqual == true || reportEqual == true || dhis2Equal == true) {
            props?.updateDataStore({
                error: false,
                dhis2,
                dataStorekey: props?.dataStorekey,
                summaryValues
            }
            )
            setTimeout(() => {
                summaryValues.Register = register.value
                summaryValues.Report = report.value
                summaryValues.value = dhis2.value
                setOpenInputField(!openInputField)
                setbuttonEditSave("Edited")
            }, 600);

        } else {

            props?.updateDataStore({
                error: true,
                errorMessage: "Input values are not equal to each other!"
            })

        }

    }

    return (
        <TableRow>
            <TableCell>
                {
                    dataElementName
                }
            </TableCell>
            <TableCell>
                {/* display input field if edit button is clicked */}
                {openInputField && summaryValues?.Status == status.FAIL ? <Box>
                    <Input
                        name={summaryValues?.dataElement}
                        type='text'
                        onChange={(e) => {
                            setRegister({
                                name: e.name,
                                value: e.value
                            })
                            if (isNaN(e.value) == true) {
                                setErrorMessage({
                                    ...errorMessage,
                                    register: "enter numbers only"
                                })
                            } else {
                                setErrorMessage({
                                    ...errorMessage,
                                    register: ""
                                })

                            }

                            if (e?.value === dhis2?.value || e?.value === report?.value) {
                                setRegisterEqual(true)
                            } else {
                                setRegisterEqual(false)
                            }

                        }}
                        placeholder={summaryValues.Register}
                    />
                    <span style={{ color: "red", fontSize: 13 }}>{errorMessage.register}</span>
                </Box> : summaryValues.Register}
            </TableCell>
            <TableCell>
                {/* display input field if edit button is clicked */}
                {openInputField && summaryValues?.Status == status.FAIL ? <Box>
                    <Input
                        name={summaryValues?.dataElement}
                        type='text'
                        onChange={(e) => {
                            setReport({
                                name: e.name,
                                value: e.value
                            })
                            if (isNaN(e.value) == true) {
                                setErrorMessage({
                                    ...errorMessage,
                                    report: "enter numbers only"
                                })
                            } else {
                                setErrorMessage({
                                    ...errorMessage,
                                    report: ""
                                })

                            }

                            if (e?.value === dhis2?.value || e.value === register?.value) {
                                setReportEqual(true)
                            } else {
                                setReportEqual(false)
                            }
                        }}

                        placeholder={summaryValues.Report}
                    />
                    <span style={{ color: "red", fontSize: 13 }}>{errorMessage.report}</span>
                </Box> : summaryValues.Report}
            </TableCell>
            <TableCell>
                {/* display input field if edit button is clicked */}

                {openInputField && summaryValues?.Status == status.FAIL ? <Box>
                    <Input
                        name={summaryValues?.dataElement}
                        type='text'
                        onChange={(e) => {
                            setDHIS2({
                                name: e.name,
                                value: e.value
                            })
                            if (isNaN(e.value) == true) {
                                setErrorMessage(
                                    {
                                        ...errorMessage,
                                        dhis2: "enter numbers only"
                                    })
                            } else {
                                setErrorMessage({
                                    ...errorMessage,
                                    dhis2: ""
                                })

                            }
                            if (e?.value === register?.value || e?.value === report?.value) {
                                setDHIS2Equal(true)
                            } else {
                                setDHIS2Equal(false)
                            }
                        }}
                        placeholder={summaryValues.value}
                    />
                    <span style={{ color: "red", fontSize: 13 }}>{errorMessage?.dhis2}</span>
                </Box> : summaryValues.value}
            </TableCell>
            <TableCell>
                {
                    // alternating button textContent upon onclick event
                    summaryValues?.Status == status.PASS || buttonEditSave == "Edited" ?
                        <Button onClick={buttonEditToggle} disabled success>{buttonEditSave}</Button> : <Button onClick={buttonEditSave == "Edit" || buttonEditSave == "Edited" ? buttonEditToggle : hundleButtonSave}>{buttonEditSave}</Button>
                }
            </TableCell>
            <TableCell>
                {
                    summaryValues.resolved || summaryValues?.Status == status.PASS || buttonEditSave == "Edited" ? <Chip>
                        {summaryValues.resolved ? <span style={{ color: "#0a9708" }}>Resolved</span> : <span style={{ color: "#0a9708" }}>No issue</span>} {summaryValues.resolved !== undefined ? <svg xmlns="http://www.w3.org/2000/svg" fill="#0a9708" width="16" height="16" viewBox="0 0 24 24"><path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" /></svg> : <></>}
                    </Chip> : <></>
                }
            </TableCell>
        </TableRow>
    )
}
