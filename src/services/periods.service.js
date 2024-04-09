import { Periods } from "./fixedPeriods";
import { RelativePeriods } from "./relativePeriods";

const periodsSelectedController = (data, value) => {
  let periods = [];
  if (data == "Monthly") {
    periods = Periods?.GetMonthly(value);
  } else if (data == "Yearly") {
    periods = Periods?.GetYearly(value);
  } else if (data == "Weekly") {
    periods = Periods?.GetWeekly(value);
  } else if (data == "BiWeekly") {
    periods = Periods?.GetBiWeekly(value);
  } else if (data == "BiMonthly") {
    periods = Periods?.GetBiMonthly(value);
  } else if (data == "SixMonthly") {
    periods = Periods?.GetSixMonthly(value);
  } else if (data == "Quarterly") {
    periods = Periods?.GetQuarterly(value);
  }
  else if (data == "Daily") {
    periods = Periods?.GetDaily(value);
  } else if (data == "Days") {
    periods = RelativePeriods?.GetDays();
  }
  else if (data == "Weeks") {
    periods = RelativePeriods?.GetWeekly();
  }else if (data == "Bi-weeks") {
    periods = RelativePeriods?.GetBiWeekly();
  }else if (data == "Months") {
    periods = RelativePeriods?.GetMonthly();
  }else if (data == "Bi-months") {
    periods = RelativePeriods?.GetBiMonthly();
  }else if (data == "Quarters") {
    periods = RelativePeriods?.GetQuarterly();
  }else if (data == "Six-months") {
    periods = RelativePeriods?.GetSixMonthly();
  }else if (data == "Financial Years") {
    periods = RelativePeriods?.GetFinancialYear();
  }else if (data == "Years") {
    periods = RelativePeriods?.GetYearly();
  }
  return periods;
};

export default periodsSelectedController;
