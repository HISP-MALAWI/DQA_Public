import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Input,
  SingleSelect,
  SingleSelectOption,
  Tab,
  TabBar,
  Transfer,
} from "@dhis2/ui";
import { Periods } from "../../services/fixedPeriods";
import periodsSelectedController from "../../services/periods.service";
import { RelativePeriods } from "../../services/relativePeriods";
import LeftHeader from "./layouts/Widget/header.widget";
import Period from "../../services/controllers/getPeriod";

const relativePeriodtypes = [
  {
    name: "Weeks",
  },
  {
    name: "Bi-weeks",
  },
  {
    name: "Months",
  },
  {
    name: "Bi-months",
  },
  {
    name: "Quarters",
  },
  {
    name: "Six-months",
  },
  {
    name: "Financial Years",
  },
  {
    name: "Years",
  },
];
const periIod = new Period()
export default function PeriodsWidget(props) {
  const [selectedDimensions, setselectedDimensions] = useState([]);
  const [filterTerm,setFilter] = useState('')
  const [year, setValue] = useState(new Date().getFullYear());
  const [periodType, setPeriodType] = useState("Months");
  const [periodTypes, setPeriodTypes] = useState(relativePeriodtypes);
  const [relative,setRelative] = useState(true)
  const [periodOption,setPeriodOtpions] = useState([...periIod.relativePeriod(), ...periIod.fixedPeriod(year)])
  
  const setPeriods = (year) =>{
    setValue(year)
    let Periods = periodOption
    Periods.push(...periIod.fixedPeriod(year))
    setPeriodOtpions(_.uniqBy(Periods,'value'))
  }
  const filterCallback = (options,filter)=>{
    if(relative){
        const opt = options.filter(
          (object)=> object?.dimension === 'relative' && object.type === periodType,)
          return opt
          
    }else{
      const opt = options.filter(
        (object)=> object.dimension === undefined && object.type === periodType
      )
      if(periodType === 'Years'){
        return opt
      }else{
        return opt.filter((object) => object.label.includes(year))
      }
      }
    }
   return (
    <div style={{ padding: "10px", width: "700px" }}>
      <Transfer
        leftHeader={<LeftHeader styles={props?.styles} periodOption={periodOption} periodType={periodTypes} period={periodType} setPeriod={setPeriodType} setPeriodOtpions={setPeriodOtpions} year={year} setRelative={setRelative} setPeriods={setPeriods}/>}
        height="400px"
        filterable
        hideFilterInput
        onChange={(e) => {
          props?.selectedPeriod(e.selected)
          setselectedDimensions(e.selected)          
        }}
        searchTerm={filterTerm}
        onFilterChange={(Value)=>{setFilter(Value)}}
        filterCallback={filterCallback}
        options={periodOption}
        selected={selectedDimensions}
        selectedEmptyComponent={
          <p style={{ textAlign: "center", fontSize: "14px", color: "gray" }}>
            You have not selected anything yet...
            <br />
          </p>
        }
      />
    </div>
  );
}
