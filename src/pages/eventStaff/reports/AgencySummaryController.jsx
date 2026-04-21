import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getAgencySummary } from "../../../api/EventStaffApis";
import AgencySummaryComponent from "./AgencySummaryComponent";

function AgencySummaryController() {
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);

  const fetchSummary = async () => {
    try {
      const response = await getAgencySummary();
      if (response?.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setSummaryData(data);
      } else {
        toast.error("Failed to fetch agency summary report");
      }
    } catch (error) {
      toast.error("Error fetching report data");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSummary();
      hasFetched.current = true;
    }
  }, []);

  return <AgencySummaryComponent loading={loading} summaryData={summaryData} />;
}

export default AgencySummaryController;
