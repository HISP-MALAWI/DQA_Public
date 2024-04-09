import {
  DataQuery,
  useDataMutation,
  useDataQuery,
  useDataEngine,
} from "@dhis2/app-runtime";
import React, { useEffect, useState } from "react";
import TableWidget from "./table.widget";
import { Box, Button, ButtonStrip, Card, Divider, Field, Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Table, TableBody, TableCellHead, TableHead, TableRowHead, Transfer } from "@dhis2/ui";

export default function ValidationWidget(props) {
  // initialising parameters to be used in the query
  const orgUnit = props?.parameters?.orgUnit;
  const period = props?.parameters?.period;
  const dataSet = props?.parameters?.dataSet;

  
  // parameters are organisation unit, period and dataSetId
  const query = {
    dataValueSets: {
      resource: "dataValueSets",
      params: {
        orgUnit: orgUnit?.id,
        period: period,
        dataSet: dataSet?.id,
      },
    },
  };

  
  // DHIS2 DataProvider that provide query and mutation classes
  const engine = useDataEngine();

  // requesting dataValueSets from DHIS2
  const { loading, error, data, refetch } = useDataQuery(query);

  const [open, setOpen] = useState(false)
  const [Data,setData] = useState(data)
  var selectData = data
  const [selectedDataElements, setDataElements] = useState([])
  const [selectedCOmbination, setSelectedCombo] = useState([])
  const [attrCombo, setAttrCombo] = useState([])
  const [dataElements,setDataValueElements] = useState([])
  
  // return all dataValueSets for the given parameters  
  const filterAttriButeOptions = (categoryCombinations,dataValues) =>{
    const attrID = []
    dataValues?.filter((dataValue) => attrID.push(dataValue?.attributeOptionCombo))
    const uniqID = _.uniq(attrID)
    const interSection =  categoryCombinations.filter(object => uniqID.includes(object.id) )
    console.log(interSection)
    return interSection
  }

  const dataValueElements = (dataElements,dataValues) =>{
    let dataValueElementID = []
    let dataElementss = []
    dataElements?.map((object) => dataElementss.push(object.dataElement))
    dataValues?.map((object)=> dataValueElementID.push(object.dataElement))
    let finalArr = []
    dataElementss.map(object => finalArr.push({label : object.name,value  : object.id}))
    return finalArr.filter(object => dataValueElementID.includes(object.value))
  }

  useEffect(()=>{
    setData(data?.dataValueSets?.dataValues)
    setAttrCombo(filterAttriButeOptions(props?.categoryOptionCombos,data?.dataValueSets?.dataValues))
    setDataValueElements(dataValueElements(dataSet?.dataSetElements,data?.dataValueSets?.dataValues))
  },[data])


  const getSelected = (e) =>{
    setDataElements(e.selected)
  }
//filtering datavalues based on the selected dataset category combination and data element category combinations
  const update = () =>{
    let values = []
      const dataValues = Data
      if(selectedDataElements.length === 0){
        values = Data

      }else{
        values = dataValues.filter(object => selectedDataElements.includes(object.dataElement))
      }
      if(selectedCOmbination.length !== 0){
        selectData.dataValueSets.dataValues = values.filter(object => selectedCOmbination.includes(object.attributeOptionCombo))
      }else{
        selectData.dataValueSets.dataValues = values
      }
    console.log(selectData.dataValueSets.dataValues)   
    setTimeout(setOpen(false),2000)
  }


  if (error) {
    return (
      <span style={{ fontSize: 16, color: "red", padding: 50 }}>
        Select org, dataset, and period
      </span>
    );
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  // appending or mutating the events by assigning a new validation as an event

  return (
    <div
      className={`${props?.styles?.marginTop} ${props?.styles?.padding} ${props?.styles?.maxWidth}`}
    >
      {data?.dataValueSets?.dataValues?.length > 0 ? (
        <div>
          <Box>
            
            <Button
            className={`${props?.styles.fetchButton} ${props?.styles?.padding}`}
            onClick={()=>setOpen(true)}>
              Filter
            </Button>            
          </Box>
          {open && (
            
          <Modal fluid position="middle">
            <ModalTitle>
              <p style={{ fontSize: 16 }}>
                Data Dimension
              </p>
              
            </ModalTitle>
            <ModalContent>
              <Box className={`${props?.styles?.padding} ${props?.styles?.marginTop}`}>
                <Card>
                <Field label = 'DataSet Category Combinations'>
                  <SingleSelect
                  className='select'
                  placeholder = '--select DataSet Categories--'
                  filterable
                  onChange = {(e)=>{
                    setSelectedCombo(e.selected)
                  }}
                  selected={selectedCOmbination}
                  noMatchText="No match found"
                >
                  {attrCombo?.length > 0 ?
                   attrCombo?.map((combo,key)=> {             
                    return(
                    <SingleSelectOption
                    key={key}
                    label={combo.name}
                    value={combo.id}
                    />
                   )
                    }
                    ) : 
                    <span className={` ${props?.styles?.padding}`}> No Dataset Categories</span>}
                    </SingleSelect>
                </Field>
                <Field label='Data elements'>
                  <Transfer
                  filterable
                  height='300px'
                  onChange={getSelected}
                  selected={selectedDataElements}
                  options={ dataElements }
                  selectedEmptyComponent={<p style={{ textAlign: 'center', fontSize: "14px", color: "gray" }}>Select Data Elements To review <br /> Only Data elements with Data values are available</p>}
                  />
                </Field>
                </Card>                
                </Box>
              <br />              
            </ModalContent>

            <ModalActions>
              <ButtonStrip end>
                <Button  onClick={()=> setOpen(false)} secondary>
                  Hide
                </Button>
                <Button  primary onClick={update} >
                  Update
                  </Button>                
              </ButtonStrip>
            </ModalActions>
          </Modal>
        )}
        <Divider dense />
        <TableWidget
          styles={props?.styles}
          ondataStoreSave={props?.ondataStoreSave}
          data={selectData}
          key={selectData?.dataValueSets?.dataValues?.length}
          dataSet={dataSet}
          dataSetElements={dataSet?.dataSetElements}
          categoryOptionCombos={props?.categoryOptionCombos}
          program={props?.program}
          getEvent={props?.getEvent}
          />
        </div>
      ) : (
        <p style={{ fontSize: "20px" }}>No data found...</p>
      )}
    </div>
  );
}
