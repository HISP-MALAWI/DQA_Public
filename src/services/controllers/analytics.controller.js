let controllers = {
  analytics: (analyticsData, rows) => {
    let indicatorName = "";
    let orgUnitName = "";
    let period = "";
    let itemsKeys = Object.keys(analyticsData?.data?.metaData?.items);
    indicatorName =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == rows[0])[0]
      ]?.name;
    orgUnitName =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == rows[1])[0]
      ]?.name;
    period =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == rows[2])[0]
      ]?.name;
    return {
      indicatorName,
      orgUnitName,
      period,
    };
  },

  dimensions: (analyticsData, dx) => {
    let indicatorName = "";
    let itemsKeys = analyticsData?.data?.metaData?.dimensions?.dx;
    indicatorName =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == dx)[0]
      ]?.name;
    //   console.log(indicatorName);
    return indicatorName;
  },

  periods: (analyticsData, pe) => {
    let period = "";
    let itemsKeys = analyticsData?.data?.metaData?.dimensions?.pe;
    period =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == pe)[0]
      ]?.name;
    return period;
  },

  orgUnits: (analyticsData, ou) => {
    let orgUnit = "";
    let itemsKeys = analyticsData?.data?.metaData?.dimensions?.ou;
    orgUnit =
      analyticsData?.data?.metaData?.items[
        itemsKeys?.filter((item) => item == ou)[0]
      ]?.name;
    return orgUnit;
  },

  dataValueFilterByPeriod: (analyticsData, ou, dx) => {
    let value = "";
    analyticsData?.data?.rows?.map((data) => {
      
      if (data[0] == dx && data[1] == ou) {
        value = data[3];
      }
    });
    return value;
  },

  dataValueFilterByOrgUnit: (analyticsData, pe, dx) => {
    let value = "";
    analyticsData?.data?.rows?.map((data) => {
      if (data[0] == dx && data[2] == pe) {
        value = data[3];
      }
    });
    return value;
  },
  dataValueFilterByIndicator: (analyticsData, pe, org) => {
    let value = "";
    analyticsData?.data?.rows?.map((data) => {
      if (data[1] == org && data[2] == pe) {
        value = data[3];
      }
    });
    return value;
  },
};

module.exports = { controllers };
