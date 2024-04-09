## Author
HISP Malawi.

## Introduction
This progran is developed by HISP Malawi Sotware Development Team in the year 2023.

## Purpose of the program
This program is designed and developed to work as a Data Quality Validation Tool.
The it works is to validate the data in DHIS2 against that rom registers and paper reporting forms.
Users that do the quarterly data quality review will be able to validate using this app that will be installed and run within DHIS2 instance.

## Development Environment Setup
`1`. Docker [Docker installation in ubuntu](https://docs.docker.com/engine/install/ubuntu/)

`2`. You need to have a running dhis2 instance

`3`. D2 installation [DHIS2 app-runtime](https://developers.dhis2.org/docs/tutorials/setup-env)

`4`. Creating a fresh DHIS2 web app [ReactJs version](https://developers.dhis2.org/docs/quickstart/quickstart-web)

## File structure
Code files are available inside src folder

`1`. src/App.js

This is the entry point of the application

`2`. src/Pages

There is an `index.js` file that act as the main layout page of the application

`3`. src/components

This is the folder that comprise with all the pages to be rendered via the `src/App.js` file

## Data structure
We are making use of arry of JSON objects.

DataSet values are retrieved from api resource

    useDataQuery, useDataMutation and useDataEngine
    These hooks are provided by DHIS2 app-runtime

Validation summary is stored and retrieved in/from

    DHIS2 DataStore.

## Algorithms

`1`. DataSets query

Get all dataSets available in the instance by the time the application runs.
This will be used as dataset filtering process. 

`2`. DataSet filter

After getting all the dataset, we need to populate the dataset select field option.

The Datasets that are populated in the select field are filtered based on the the organisation unit that has been selected.

Inorder to filter the Dataset we use the organisation unit id attribute that is part of the dataset object fetched.

This is done in the organisation unit tree onChange function

    dataSets.filter((dataset) => dataset.organisationUnits.some((organisationUnit)
                            => organisationUnit.id === selectedOrgUnit.id))

## DataValueSets

`read`

DataSet values are pulled from DHIS2 using the dataSet ID, period reported and organisation unit reported to.
These are the dataSet values that are presented on the validation form.

`create and update`

Data value for the specific data element in dhis2 is updated only if the value for the DHIS2 in the validation form is diferent from that is available in DHIS2 instance. This condition is checked during onclick button save, if

## Validation

After fetching the dataValueSets. These valueSets populate a table which has columns where a data element name, the field where a value which is found in the paper reporting form is enter,a field where a value from the register is entered, a column where the value entered in DHIS2 is shown, and finaly a column where the validation status, this is whether the validation has passed or not.

`validation algorithm`

When the values from the registers and the reporting form have been enter. A validation algrithm runs which compares the value in the register againt the one in DHIS2 and the one in the reporting form against the one in DHIS2.

        if(registerValue === DHIS2Value && reportValue === DHIS2Value){
            status = 'pass'
        }

`Saving`

After running the validations. A report containing all the values that are entered during the run are saved. This is so, to enable one to be able to do a follow up and resolve the issues that were discovered during the run.

The validation report is saved in the dataStore with the timestamp as the key as follows:

        mutation

        const myMutation = {
            resource: `dataStore/VDT_summaries/${new Date().getTime()}`
            type: 'create'
            data: ({data}) =>({
                 createdAt: new Date().toLocaleString(),
                 dataValues: data
            })
        }

        const [mutate, { error }] = useDataMutation(myMutation)

        button on Click function

        const saveValidation = async (data) => {
            if(data.length > 0){
                await mutate({data})
                if(error){
                    setMessage('Failed to save Summary')
                    setHidden(false)
                }else{
                     setMessage('Saved summary succesifuly')
                     setHidden(false) 
                }
            }else{
               setMessage(''No data validations to save')
               setHidden(false) 
            }
        }
## Validation History/Summary
    The validation history/summary is retrieved from dataStore using the namespace {VDT_summaries} and their timestamps which are used as the key.
    Each summary contains all data elements assigned to that dataSet from the time validation was made.
    A follow up button against each summary is designed to provide a modal with set of data elements both those that passed validation and those failed.

## Commenting and Resolved
After doing a followup and resolving the issues that were noticed during the data validation process one is free to add a comment about what he or she noticed in the commenting section and mark the report with a resolved status. There after the user updates the report in the dataStore as follows

            const myMutation = {
                resource: `dataStore/VDT_summaries/${key}`,
                type: 'update',
                data: ({ data }) => ({
                    createdAt: data.createdAt,
                    comment: data.comment,
                    dataValues: data.dataValues,
                    resolved: data.resolved
                })
            }


            // this has to update the value for the data element or a defined dataSet 
                    let resolvedCount = data?.dataValues?.filter((values) => values.resolved === true || values.Status === 'pass')
                    let resolvedCountNoIssue = data?.dataValues?.filter((values) => (values.resolved === undefined && values.Status === 'pass'))

                    if (resolvedCountNoIssue?.length === data?.dataValues?.length) {
                        data.comment = comment
                        data.resolved = undefined
                        mutate({ data }).then(res => {
                            if (res.httpStatusCode == 200) {
                                setErrorMessage("Comment submitted successfully")
                                props.refetch()
                                setHidden(false)
                                setOpen(false)
                            }
                        }).catch(e => {
                            setErrorMessage("Error: server error occured!")
                        })
                        if (!error) {
                            props.refetch()
                            setHidden(false)
                            setOpen(false)
                        }
                    } else {
                        if (resolvedCount?.length === data?.dataValues?.length) {
                            
                            data.comment = comment
                            data.resolved = true
                            mutate({ data }).then(res => {
                                if (res.httpStatusCode == 200) {
                                    setErrorMessage("Data element value updated successully!")
                                    props.refetch()
                                    setHidden(false)
                                    setOpen(false)
                                }
                            }).catch(e => {
                                setErrorMessage("Error: server error occured!")
                            })
                            if (!error) {
                                props.refetch()
                                setHidden(false)
                                setOpen(false)
                            }
                        } else {
                            setHidden(false)
                            setErrorMessage("Make sure all issues are resolved before you mark the summary as resolved!")
                        }
                    }


