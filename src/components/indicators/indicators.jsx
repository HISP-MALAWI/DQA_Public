import {
  Box,
  Button,
  ButtonStrip,
  Card,
  Field,
  Legend,
  Modal,
  Divider,
  ModalActions,
  ModalContent,
  ModalTitle,
  NoticeBox,
  OrganisationUnitTree,
  Radio,
  CircularLoader,
  Layer,
  Center,
} from "@dhis2/ui";
import React, { useState, useEffect, useRef } from "react";
import IndicatorsWidget from "./indicatorsTransfer";
import PeriodsWidget from "./periodsTransfer";
import { useDataEngine } from "@dhis2/app-runtime";
import html2canvas from "html2canvas";
import FilterByPeriodLayout from "./layouts/filterByPeriod";
import FilterByOrgUnitLayout from "./layouts/filterByOrgUnit";
import FilterByIndicatorLayout from "./layouts/filterByIndicator";
import jsPDF from "jspdf";

export default function Indicators(props) {
  const downloadRef = useRef();
  const doc = new jsPDF({
    format: "a1",
    unit: "px",
  });
  doc.setFont("Inter-Regular", "normal");
  doc.setFontSize(6);

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading,setLoading] = useState(false)

  const [checkedLayout, setCheckedLayout] = useState({
    layout1: false,
    layout2: false,
    layout3: false,
  });

  const [openPeriods, setOpenPeriods] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(undefined);
  const [selectedDataDimensions, setSelectedIndicator] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [message, setMessage] = useState(
    "Select the organization unit(s), indicator(s) and period(s)"
  );
  const orgUnitLevels = (orgs) => {
    let orgsList = [];

    orgs?.map((org) => {
      org?.level == 1 ? orgsList?.push(org?.id) : "";
    });
    return orgsList;
  };
  const analystisQuery = {
    analytics: {
      resource: "analytics",
      params: ({ dataDimension, orgUnit, period }) => ({
        dimension: `dx:${dataDimension},ou:${orgUnit},pe:${period}`,
      }),
    },
  };
  const engine = useDataEngine();
  const orgs = (org) => {
    let orgList = [];
    if (org?.length > 0) {
      org?.map((orgId) => {
        orgList?.push(orgId?.split("/")[orgId?.split("/")?.length - 1]);
      });
    }
    return orgList;
  };
  const getAnalyticsData = () => {
    setLoading(true)
    if (
      selectedDataDimensions == null ||
      selectedDataDimensions == undefined ||
      selectedDataDimensions?.length < 0 ||
      selectedDataDimensions == "" ||
      selected?.selected == null ||
      selected?.selected == undefined ||
      selected?.selected?.length < 0 ||
      selected?.selected == "" ||
      selectedPeriod == null ||
      selectedPeriod == undefined ||
      selectedPeriod?.length < 0 ||
      selectedPeriod == ""
    ) {
      setLoading(false)
    } else {
      engine
        .query(analystisQuery, {
          variables: {
            dataDimension: selectedDataDimensions?.join(";"),
            orgUnit: orgs(selected?.selected)?.join(";"),
            period: selectedPeriod?.join(";"),
          },
        })
        .then((res) => {
          setAnalyticsData({
            data: res?.analytics,
          });
          setLoading(false)
        });
    }
  };

  const downloadReport = () => {
    doc.oriantation = "landscape";
    doc.html(downloadRef.current, {
      async callback(doc) {
        await doc.save("validation");
      },
    });
  };

  return (
    <div>
      <div className={`${props?.styles.LayoutBox}`}>
        <Box className={`${props?.styles.sideNav} ${props?.styles.backgroud}`}>
          <Field label="Organization units">
            <OrganisationUnitTree
              name="Root org unit"
              onChange={(selectedOrgUnits) => {
                setSelected(selectedOrgUnits);
              }}
              roots={orgUnitLevels(props?.orgUnits)}
              singleSelection={false}
              selected={selected?.selected}
              hideMemberCount={false}
              onSelectClick={(orgUnit) => {}}
            />
          </Field>
        </Box>

        <Box
          className={`${props?.styles?.indicatorsPeriods} ${props?.styles?.padding}`}
        >
          <Card
            className={`${props?.styles?.marginTop} ${props?.styles?.padding}`}
          >
            <div className={`${props?.styles?.padding}`}>
              {/* button triggers for indicators anda periods modal */}
              <ButtonStrip start>
                
                <Button onClick={() => setOpen(!open)} primary>
                  Data
                </Button>
                <Button onClick={() => setOpenPeriods(!openPeriods)} primary>
                  Period
                </Button>
                <Button onClick={() => getAnalyticsData()} primary>
                  Update
                </Button>
                {selected?.selected?.length == 0 ||
                analyticsData == null ||
                analyticsData == undefined ||
                analyticsData == "" ||
                analyticsData?.data?.metaData?.dimensions?.pe?.length == 0 ||
                analyticsData?.data?.metaData?.dimensions?.ou?.length == 0 ||
                analyticsData?.data?.metaData?.dimensions?.dx?.length == 0 ? (
                  <Button onClick={() => {}} primary disabled>
                    Download
                  </Button>
                ) : (
                  <Button onClick={downloadReport} primary>
                    Download
                  </Button>
                )}
              </ButtonStrip>
            </div>
            <Divider />
            <div className="" ref={downloadRef}>
              {analyticsData !== undefined && selected?.selected?.length > 0 ? (
                <Box className={`${props?.styles?.indicatorValues}`}>
                  {analyticsData?.data?.metaData?.dimensions?.pe?.length == 1 &&
                  analyticsData?.data?.metaData?.dimensions?.ou?.length >= 1 &&
                  analyticsData?.data?.metaData?.dimensions?.dx?.length >= 1 ? (
                    <FilterByPeriodLayout data={analyticsData} />
                  ) : analyticsData?.data?.metaData?.dimensions?.pe?.length >
                      1 &&
                    analyticsData?.data?.metaData?.dimensions?.dx?.length > 1 &&
                    analyticsData?.data?.metaData?.dimensions?.ou?.length ==
                      1 ? (
                    <FilterByOrgUnitLayout data={analyticsData} />
                  ) : analyticsData?.data?.metaData?.dimensions?.pe?.length >
                      1 &&
                    analyticsData?.data?.metaData?.dimensions?.ou?.length > 1 &&
                    analyticsData?.data?.metaData?.dimensions?.dx?.length ==
                      1 ? (
                    <FilterByIndicatorLayout data={analyticsData} />
                  ) : analyticsData?.data?.metaData?.dimensions?.pe?.length >
                      1 &&
                    analyticsData?.data?.metaData?.dimensions?.dx?.length ==
                      1 &&
                    analyticsData?.data?.metaData?.dimensions?.ou?.length ==
                      1 ? (
                    <FilterByOrgUnitLayout data={analyticsData} />
                  ) : (
                    <Box className={`${props?.styles?.indicatorValuesWarning}`}>
                      <NoticeBox title="Data too large to display">
                        <Legend required>Please filter(organization units,periods,or indicators) or Use data visualizer app</Legend>
                      </NoticeBox>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box className={`${props?.styles?.indicatorValuesWarning}`}>
                  <NoticeBox title="No data available">
                    <Legend required>{message}</Legend>
                  </NoticeBox>
                </Box>
              )}
            </div>
          </Card>

          {/* modal for indicators */}
          {open && (
            <Modal large>
              <ModalTitle>Indicators</ModalTitle>
              <ModalContent>
                <IndicatorsWidget
                  indicators={props?.indicators}
                  selectedIndicator={setSelectedIndicator}
                />
              </ModalContent>
              <ModalActions>
                <ButtonStrip end>
                  <Button onClick={() => setOpen(!open)} secondary>
                    Hide
                  </Button>
                  <Button
                    onClick={() => {
                      getAnalyticsData();
                      setOpen(!open);
                    }}
                    primary
                  >
                    Update
                  </Button>
                </ButtonStrip>
              </ModalActions>
            </Modal>
          )}

          {/* modal for period */}
          {openPeriods && (
            <Modal large>
              <ModalTitle>Periods</ModalTitle>
              <ModalContent>
                <PeriodsWidget
                  periodTypes={props?.periodTypes}
                  styles={props?.styles}
                  periods={selectedPeriod}
                  selectedPeriod={setSelectedPeriod}
                />
                <Divider />
                {/* <Box>
                  {selectedPeriod?.length > 0
                    ? `${selectedPeriod?.length} selected periods`
                    : ""}
                </Box> */}
              </ModalContent>
              <ModalActions>
                <ButtonStrip end>
                  <Button
                    onClick={() => setOpenPeriods(!openPeriods)}
                    secondary
                  >
                    Hide
                  </Button>
                  <Button
                    onClick={() => {
                      getAnalyticsData();
                      setOpenPeriods(!openPeriods);
                    }}
                    primary
                  >
                    Update
                  </Button>
                </ButtonStrip>
              </ModalActions>
            </Modal>
          )}
          {/** modal for loading */
            loading && (
              <Layer translucent>
                <Center>
                  <CircularLoader />
                </Center>
              </Layer>
            )
          }
        </Box>
      </div>
    </div>
  );
}
