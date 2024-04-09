import { Box, Field, Input, SingleSelect, SingleSelectOption, Tab, TabBar } from "@dhis2/ui";
import React, { useEffect,useState } from "react";

export default function LeftHeader(props){
    const tabs = [
        {id:1, name : 'Relative Periods'},
        {id:2, name : 'Fixed Periods'}
    ]

    const [tab,setTab] = useState(1)
    const [year,setYear] = useState(props?.year)
    const [selectedPeriod, setPeriod] = useState(props?.period)
    return (
        <div className={`${props?.styles?.marginTop}`}>
        <Box>
        <div>
        <TabBar>
            {tabs?.map((tabIndex,key)=>{
                return (
                    <Tab
                  className="tabs"
                  key={key}
                  onClick={() => {
                    props?.setRelative(tabIndex?.id === 1)                    
                    setTab(tabIndex?.id)
                  }}
                  selected={tab === tabIndex?.id}
                >
                  {tabIndex?.name}
                </Tab>
                )
            })}
        </TabBar>
        {tab === 1 ? 
        <div className={`${props?.styles?.marginTop} ${props?.styles?.marginBottom}`} >
        <Field label="Period Types">
            <SingleSelect
            className='select'
            onChange ={(e)=>{
                props?.setPeriod(e.selected)
                setPeriod(e.selected)
            }}
            placeholder= 'Select period'
            selected={selectedPeriod}
            >
                {props?.periodType?.map((periodTyp, index) => {
                return (
                  <SingleSelectOption
                    key={index}
                    label={periodTyp?.name}
                    value={periodTyp?.name}
                  />
                );
              })}

            </SingleSelect>
        </Field>
        </div> : <div className={`${props?.styles?.Row}`} >
        <Field label="Period Types">
            <SingleSelect
            className='select'
            onChange ={(e)=>{
              props?.setPeriod(e.selected)
                setPeriod(e.selected)
            }}
            placeholder= 'period'
            selected={selectedPeriod}
            >
                {props?.periodType?.map((periodTyp, index) => {
                return (
                  <SingleSelectOption
                    key={index}
                    label={periodTyp?.name}
                    value={periodTyp?.name}
                  />
                );
              })}

            </SingleSelect>
        </Field>
        <Field label="Year">
        <Input
                name="year"
                type="number"
                value={year}
                onChange={(e) => {
                  props?.setPeriods(e.value)
                  setYear(e.value)
                }}
              />
        </Field>
        </div>}
        </div>
        </Box>
        </div>
    )
}