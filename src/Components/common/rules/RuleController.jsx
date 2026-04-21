import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getRules } from "../../../api/FetchRules";
import RuleComponent from "./RuleComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { updateRule } from "../../../api/PutRules";

function RuleController() {
  const isFetched = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ruleData = location.state || {};
  const is_rule = ruleData?.itemData?.rule ?? "";
  const [title, setTitle] = useState("Special Note");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    try {
      const res = await getRules();
      if (res?.data?.status) {
        const noteData = res.data.data[0];
        setTitle(noteData.title);
        const cleanedContent = noteData.content.map((rule) =>
          rule.replace(/^•\s*/, "")
        );
        setRules(cleanedContent);
      } else {
        toast.error("Unable to fetch rules");
      }
    } catch (error) {
      toast.error("Error fetching rules");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchRules();
      isFetched.current = true;
    }
  }, []);

  const handleAdd = () => {
    setRules((prevRules) => [...prevRules, ""]);
  };

  const handleRemove = (index) => {
    setRules((prevRules) => {
      if (prevRules.length === 1) return prevRules;
      return prevRules.filter((_, i) => i !== index);
    });
  };

  const handleChange = (index, value) => {
    setRules((prevRules) => {
      const updatedRules = [...prevRules];
      updatedRules[index] = value;
      return updatedRules;
    });
  };

  // Helper Function to add \n in sentence
  // const insertLineBreaks = (text, maxLen) => {
  //     let result = "";
  //     let index = 0;

  //     while (index < text.length) {
  //         result += text.substring(index, index + maxLen);
  //         if (index + maxLen < text.length) {
  //             result += "\n";
  //         }
  //         index += maxLen;
  //     }

  //     return result;
  // };

  const handleSave = async () => {
    const id = 1;
    if (id && rules.length) {
      const formattedRules = rules.filter((rule) => rule.trim() !== "");
      const payload = {
        content: formattedRules,
      };
      const response = await updateRule(id, payload);
      if (response.data.status) {
        fetchRules();
        navigate("/user");
      }
    } else {
      toast.error("Cannot add rule. Missing ID or rules.");
    }
  };

  return (
    <RuleComponent
      navigate={navigate}
      loading={loading}
      title={title}
      rules={rules}
      is_rule={is_rule}
      ruleData={ruleData}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      handleChange={handleChange}
      handleSave={handleSave}
    />
  );
}

export default RuleController;
