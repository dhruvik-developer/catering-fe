import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getRules } from "../../../api/FetchRules";
import RuleComponent from "./RuleComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { createRule, updateRule } from "../../../api/PutRules";
import { logError } from "../../../utils/logger";

function RuleController() {
  const isFetched = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ruleData = location.state || {};
  const is_rule = ruleData?.itemData?.rule ?? "";
  const [title, setTitle] = useState("Special Note");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  // Real DB id of the note row, or null if no row exists yet. Drives
  // create-vs-update on save.
  const [noteId, setNoteId] = useState(null);

  const fetchRules = async () => {
    try {
      const res = await getRules();
      if (res?.data?.status) {
        // First-time tenants have no rule row yet — that's expected, not
        // an error. Fall through with an empty list and a default title;
        // the form below seeds one blank input so the user can add the
        // first rule.
        const noteData = Array.isArray(res.data.data)
          ? res.data.data[0]
          : null;
        if (noteData) {
          setNoteId(noteData.id ?? null);
          setTitle(noteData.title || "Special Note");
          const content = Array.isArray(noteData.content)
            ? noteData.content
            : [];
          setRules(content.map((rule) => String(rule).replace(/^•\s*/, "")));
        } else {
          setNoteId(null);
          setRules([]);
        }
      } else {
        toast.error("Unable to fetch rules");
      }
    } catch (error) {
      toast.error("Error fetching rules");
      logError("API Error:", error);
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
    const formattedRules = rules.filter((rule) => rule.trim() !== "");
    if (formattedRules.length === 0) {
      toast.error("Add at least one rule before saving.");
      return;
    }

    // First-time tenants have no row yet, so POST instead of PUT. Update
    // path runs only when we already loaded an existing note id.
    const payload = { content: formattedRules };
    const response = noteId
      ? await updateRule(noteId, payload)
      : await createRule({ ...payload, title });

    if (response?.data?.status) {
      fetchRules();
      navigate("/user");
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
