import React, { useState } from "react";
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
import { RelativePeriods } from "../../../services/relativePeriods";
import { Periods } from "../../../services/fixedPeriods";
import periodsSelectedController from "../../../services/periods.service";

const relativePeriodtypes = [
  {
    name: "Days",
  },
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
const fixedPeriods = [
  { name: "Daily", isoDuration: "P1D", isoFormat: "yyyyMMdd" },
  { name: "Weekly", isoDuration: "P7D", isoFormat: "yyyyWn" },
  { name: "WeeklyWednesday", isoDuration: "P7D", isoFormat: "yyyyWedWn" },
  { name: "WeeklyThursday", isoDuration: "P7D", isoFormat: "yyyyThuWn" },
  { name: "WeeklySaturday", isoDuration: "P7D", isoFormat: "yyyySatWn" },
  { name: "WeeklySunday", isoDuration: "P7D", isoFormat: "yyyySunWn" },
  { name: "BiWeekly", isoDuration: "P14D", isoFormat: "yyyyBiWn" },
  { name: "Monthly", isoDuration: "P1M", isoFormat: "yyyyMM" },
  { name: "BiMonthly", isoDuration: "P2M", isoFormat: "yyyyMMB" },
  { name: "Quarterly", isoDuration: "P3M", isoFormat: "yyyyQn" },
  { name: "SixMonthly", isoDuration: "P6M", isoFormat: "yyyySn" },
  { name: "SixMonthlyApril", isoDuration: "P6M", isoFormat: "yyyyAprilSn" },
  { name: "SixMonthlyNov", isoDuration: "P6M", isoFormat: "yyyyNovSn" },
  { name: "Yearly", isoDuration: "P1Y", isoFormat: "yyyy" },
  { name: "FinancialApril", isoDuration: "P1Y", isoFormat: "yyyyApril" },
  { name: "FinancialJuly", isoDuration: "P1Y", isoFormat: "yyyyJuly" },
  { name: "FinancialOct", isoDuration: "P1Y", isoFormat: "yyyyOct" },
  { name: "FinancialNov", isoDuration: "P1Y", isoFormat: "yyyyNov" },
];

export default function PeriodsLayout(props) {
  const [year, setValue] = useState(new Date().getFullYear());
  const [periodType, setPeriodType] = useState("Months");
  const [periodTypes, setPeriodTypes] = useState(relativePeriodtypes);

  const tabs = [
    { id: 1, name: "Relative periods" },
    { id: 2, name: "Fixed periods" },
  ];
  const [tab, setTab] = useState(1);

  return (
    <div>
      <Field label="" className={`${props?.styles?.marginBottom}`}>
        <TabBar>
          {tabs?.map((tabIndex, key) => {
            return (
              <Tab
                className="tabs"
                key={key}
                onClick={() => {
                  setTab(tabIndex?.id);
                  if (tabIndex?.id == 1) {
                    setPeriodType("Months");
                    props?.setOptionsData(RelativePeriods.GetMonthly());
                    setPeriodTypes(relativePeriodtypes);
                  } else {
                    setPeriodTypes(fixedPeriods);
                    setPeriodType("Monthly");
                    props?.setOptionsData(
                      Periods?.GetMonthly(new Date().getFullYear())
                    );
                  }
                }}
                selected={tab === tabIndex?.id}
              >
                {tabIndex?.name}
              </Tab>
            );
          })}
        </TabBar>

        <div className={`${props?.styles?.mgTop}`}>
          <Field label="Period type">
            <SingleSelect
              className="select"
              onChange={(e) => {
                setPeriodType(e.selected);
                props?.setOptionsData(
                  periodsSelectedController(e.selected, year)
                );
              }}
              placeholder="--select year--"
              filterable
              noMatchText="No match found"
              selected={periodType}
            >
              {periodTypes?.map((periodTyp, index) => {
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
          {tab === 2 && (
            <Field label="Year">
              <Input
                name="year"
                type="number"
                value={year}
                onChange={(e) => {
                  setValue(e?.value);
                  props?.setOptionsData(
                    periodsSelectedController(periodType, e?.value)
                  );
                }}
                placeholder="Register value"
              />
            </Field>
          )}
        </div>
      </Field>
    </div>
  );
}
