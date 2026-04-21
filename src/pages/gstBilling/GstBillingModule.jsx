import React, { useState, useEffect, useRef } from "react";
import useDropdownControl from "../../hooks/useDropdownControl";
import Swal from "sweetalert2";
import { exportToPDF } from "../../utils/pdfExport";
import {
  FiPlus,
  FiTrash2,
  FiDownload,
  FiArrowLeft,
  FiClock,
  FiEye,
  FiSearch,
  FiSettings,
  FiSave,
  FiEdit2,
  FiCheck,
  FiX,
  FiChevronDown
} from "react-icons/fi";
import { getItem, createItem, updateItem, deleteItem } from "../../api/FetchItem";
import Dropdown from "../../Components/common/formDropDown/DropDown";
import toast from "react-hot-toast";
import {
  getBranchBills,
  getInvoiceSetup,
  createInvoiceSetup,
  createBranchBill,
  updateBranchBill,
  updateInvoiceSetup,
  deleteInvoiceSetup,
  getPartyInformation,
  createPartyInformation,
  updatePartyInformation,
  deletePartyInformation,
  getGlobalConfig,
  updateGlobalConfig,
} from "../../api/GstBillingApis";

const DEFAULT_SETTINGS = {
  defaultHsn: "996331",
  defaultGstPct: 5,
  availableGstPcts: [0, 5, 12, 18, 28],
  availableGstPctsString: "0, 5, 12, 18, 28",
  branches: [],
  parties: [],
};

const toSequenceNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const buildPartyPrefix = (name = "") => {
  const initials = name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 4);

  return `${initials || "PTY"}26-`;
};

const normalizeBranch = (branch = {}, index = 0) => ({
  id: String(branch.id || `BR_${index + 1}`),
  name: branch.name || `Branch ${index + 1}`,
  address: branch.address || "",
  gstNo: branch.gstNo || "",
  prefix: branch.prefix || `BR${index + 1}26-`,
  startFrom: toSequenceNumber(branch.startFrom, 1),
  bank_details: branch.bank_details || {
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: ""
  }
});

const mapApiBranch = (branch = {}, index = 0) => ({
  id: String(branch.id || branch.pk || branch.branch_id || branch.invoice_setup_id || `BR_${index + 1}`),
  name: branch.branch_name || branch.name || `Branch ${index + 1}`,
  address: branch.address || "",
  gstNo: branch.gst_number || branch.gst_no || branch.gstNo || "",
  prefix: branch.prefix || `BR${index + 1}26-`,
  startFrom: toSequenceNumber(branch.start_from || branch.startFrom || 1),
  bank_details: branch.bank_details || {
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: ""
  }
});

const extractBranchListFromResponse = (response) => {
  const payload = response?.data;
  const rawData = payload?.data ?? payload;

  if (Array.isArray(rawData?.results)) return rawData.results;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(rawData)) return rawData;
  if (rawData && typeof rawData === "object") return [rawData];
  return [];
};

const formatBranches = (data) => extractBranchListFromResponse(data).map(mapApiBranch);

const formatParties = (data) => {
  if (!data) return [];
  const list = data?.data?.results || data?.data?.data || (Array.isArray(data?.data) ? data.data : []);
  if (!Array.isArray(list)) return [];
  return list.map((p) => ({
    id: p.id || p.pk || p.party_id || p.party_information_id,
    name: p.party_name || p.name || "Party",
    code: p.party_code || p.code || "",
    gstNo: p.party_gst_no || p.gst_no || p.gstNo || "",
    prefix: p.invoice_prefix || p.prefix || "",
    startFrom: toSequenceNumber(p.next_sequence_no || p.start_from || p.startFrom || 1),
  }));
};

const normalizeParty = (party = {}, index = 0) => ({
  id: String(party.id || `PTY_${index + 1}`),
  name: party.name || `Party ${index + 1}`,
  code: party.code || "",
  gstNo: party.gstNo || "",
  prefix: party.prefix || buildPartyPrefix(party.name),
  startFrom: toSequenceNumber(party.startFrom, 1),
});

const normalizeSettings = (rawSettings = {}) => {
  const branchSource = Array.isArray(rawSettings.branches) ? rawSettings.branches : [];
  const partySource = Array.isArray(rawSettings.parties) ? rawSettings.parties : [];

  const parsedGstPct = Number(rawSettings.defaultGstPct);

  let parsedAvailableGst = Array.isArray(rawSettings.availableGstPcts)
    ? rawSettings.availableGstPcts
    : DEFAULT_SETTINGS.availableGstPcts;

  if (typeof rawSettings.availableGstPctsString === "string") {
    const parsed = rawSettings.availableGstPctsString
      .split(",")
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));
    if (parsed.length > 0) {
      parsedAvailableGst = parsed;
    }
  }

  // Deduplicate array
  parsedAvailableGst = [...new Set(parsedAvailableGst)];

  return {
    defaultHsn: rawSettings.defaultHsn || DEFAULT_SETTINGS.defaultHsn,
    defaultGstPct: Number.isFinite(parsedGstPct)
      ? parsedGstPct
      : DEFAULT_SETTINGS.defaultGstPct,
    availableGstPcts: parsedAvailableGst,
    availableGstPctsString: typeof rawSettings.availableGstPctsString === "string"
      ? rawSettings.availableGstPctsString
      : parsedAvailableGst.join(", "),
    globalConfigId: rawSettings.globalConfigId || 1,
    branches: branchSource.map(normalizeBranch),
    parties: partySource.map(normalizeParty),
  };
};

const isNewBranch = (id) => {
  if (typeof id === "number") return false;
  if (typeof id === "string" && id.startsWith("BR_")) return true;
  return false;
};

const isNewParty = (id) => {
  if (typeof id === "number") return false;
  if (typeof id === "string" && id.startsWith("PTY_")) return true;
  return false;
};

const getDefaultReferencePeriod = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const format = (d) =>
    `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;

  return `${format(firstDay)} TO ${format(lastDay)}`;
};

const parseDisplayDateToIso = (value = "") => {
  const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const parseReferencePeriod = (value = "") => {
  const [startText = "", endText = ""] = value.split(/\s+TO\s+/i);
  const start = parseDisplayDateToIso(startText);
  const end = parseDisplayDateToIso(endText);

  if (!start || !end) {
    return null;
  }

  return { start, end };
};

const toApiId = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const extractListFromApiResponse = (response) => {
  const payload = response?.data;
  const rawData = payload?.data ?? payload;

  if (Array.isArray(rawData?.results)) return rawData.results;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(rawData)) return rawData;
  if (rawData && typeof rawData === "object") return [rawData];
  return [];
};

const formatIsoDateToDisplay = (value = "") => {
  const normalized = String(value).split("T")[0];
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return normalized || "-";
  }

  const [, year, month, day] = match;
  return `${day}-${month}-${year}`;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatHistoryBill = (bill = {}) => {
  const branch = bill.branch || {};
  const party = bill.party || {};
  const items = Array.isArray(bill.items)
    ? bill.items.map((item, index) => ({
        id: item.id || item.pk || `${bill.id || "bill"}-item-${index + 1}`,
        itemId: String(
          item.branch_item ||
            item.branch_item_id ||
            item.branchItem ||
            item.branch_item_details?.id ||
            item.branch_item_detail?.id ||
            item.branch_item_obj?.id ||
            item.branch_item_data?.id ||
            ""
        ),
        itemName:
          item.item_name ||
          item.branch_item_name ||
          item.branch_item_details?.name ||
          item.branch_item_detail?.name ||
          item.branch_item_obj?.name ||
          item.branch_item_data?.name ||
          item.branch_item?.name ||
          item.name ||
          "-",
        qty: toNumber(item.quantity || item.qty),
        rate: toNumber(
          item.rate ||
            item.branch_item_rate ||
            item.branch_item_details?.rate ||
            item.branch_item_detail?.rate ||
            item.branch_item_obj?.rate ||
            item.branch_item_data?.rate ||
            item.branch_item?.rate
        ),
        gstPct: toNumber(item.gst_percentage || item.gstPct),
        inclusive:
          item.is_rate_inclusive === true ||
          item.is_rate_inclusive === "true" ||
          item.inclusive === true ||
          item.inclusive === "true",
        taxable: toNumber(item.taxable_amount || item.taxable),
        sgst: toNumber(item.sgst_amount || item.sgst),
        cgst: toNumber(item.cgst_amount || item.cgst),
        amount: toNumber(item.total_amount || item.amount),
      }))
    : [];

  const computedTotals = items.reduce(
    (acc, item) => {
      acc.taxable += item.taxable;
      acc.sgst += item.sgst;
      acc.cgst += item.cgst;
      acc.amount += item.amount;
      return acc;
    },
    { taxable: 0, sgst: 0, cgst: 0, amount: 0 }
  );

  const referenceStart = bill.reference_period_start || bill.referencePeriodStart || "";
  const referenceEnd = bill.reference_period_end || bill.referencePeriodEnd || "";

  return {
    id: bill.id || bill.pk || Date.now().toString(),
    invoiceNumber: bill.invoice_number || bill.invoiceNumber || bill.bill_number || `BILL-${bill.id || ""}`,
    invoiceDate: bill.invoice_date || bill.invoiceDate || bill.date || bill.created_at?.split("T")[0] || "",
    date: bill.invoice_date || bill.invoiceDate || bill.date || bill.created_at?.split("T")[0] || "",
    partyName: bill.party_name || party.party_name || party.name || "-",
    partyGst: bill.party_gst_no || bill.partyGst || party.party_gst_no || party.gst_no || party.gstNo || "-",
    partyCode: bill.party_code || bill.partyCode || party.party_code || party.code || "",
    branchName: bill.branch_name || branch.branch_name || branch.name || "-",
    branchAddress: bill.branch_address || branch.address || "-",
    branchGst: bill.branch_gst_no || branch.gst_number || branch.gst_no || branch.gstNo || "-",
    branchBankDetails: bill.branch_bank_details || branch.bank_details || null,
    hsnCode: bill.hsn_code || bill.hsnCode || DEFAULT_SETTINGS.defaultHsn,
    orderNo: bill.order_number || bill.orderNo || "N/A",
    orderDate: bill.order_date || bill.orderDate || "",
    refText: bill.refrance || (
      referenceStart && referenceEnd
        ? `${formatIsoDateToDisplay(referenceStart)} TO ${formatIsoDateToDisplay(referenceEnd)}`
        : ""
    ),
    note: bill.notes || bill.note || "",
    items,
    totals: {
      taxable: toNumber(bill.taxable_amount || bill.total_taxable || bill.taxable_total || computedTotals.taxable),
      sgst: toNumber(bill.sgst_amount || bill.total_sgst || computedTotals.sgst),
      cgst: toNumber(bill.cgst_amount || bill.total_cgst || computedTotals.cgst),
      amount: toNumber(bill.grand_total || bill.total_amount || bill.final_amount || bill.rounded_total || computedTotals.amount),
    },
    roundedTotal: toNumber(bill.grand_total || bill.total_amount || bill.final_amount || bill.rounded_total || computedTotals.amount),
    roundOffAmount: toNumber(bill.round_off || bill.roundOff),
    raw: bill,
  };
};

const createEmptyInvoiceItem = (defaultGstPct) => ({
  id: Date.now(),
  itemId: "",
  itemName: "",
  qty: 1,
  rate: 0,
  gstPct: defaultGstPct,
  inclusive: false,
  taxable: 0,
  sgst: 0,
  cgst: 0,
  amount: 0,
});

const GstBillingModule = () => {
  const [view, setView] = useState("form"); // "form" | "preview" | "settings" | "history"

  const [savedBills, setSavedBills] = useState([]);
  const [viewingHistoryBill, setViewingHistoryBill] = useState(null);
  const [editingBillId, setEditingBillId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [settingsLoading, setSettingsLoading] = useState(true);

  // Initialize with empty defaults — API data will populate
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [settingsDraft, setSettingsDraft] = useState(settings);

  const [branchModalInfo, setBranchModalInfo] = useState({ isOpen: false, isNew: false, index: null, data: null, showBankDetails: false });
  const [partyModalInfo, setPartyModalInfo] = useState({ isOpen: false, isNew: false, index: null, data: null });
  const [itemModalInfo, setItemModalInfo] = useState({ isOpen: false, isNew: false, index: null, data: null });
  // Party search combobox — fully controlled via useDropdownControl
  const {
    isOpen: showPartyDropdown,
    open: openPartyDropdown,
    close: closePartyDropdown,
    toggle: togglePartyDropdown,
    containerRef: partyDropdownRef,
  } = useDropdownControl();
  const [partySearchQuery, setPartySearchQuery] = useState("");
  const [itemsManagementList, setItemsManagementList] = useState([]);
  const [itemsManagementBranch, setItemsManagementBranch] = useState("all");

  useEffect(() => {
    if (view === "settings") {
      const fetchManagementItems = async () => {
        try {
          const params = itemsManagementBranch === "all" ? {} : { branch: itemsManagementBranch };
          const response = await getItem(params);
          const list = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
          if (Array.isArray(list)) {
            setItemsManagementList(list);
          }
        } catch (err) {
          console.error("Failed initial items management fetch", err);
        }
      };
      fetchManagementItems();
    }
  }, [view, itemsManagementBranch]);

  useEffect(() => {
    if (view !== "history") {
      return;
    }

    const fetchBillHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await getBranchBills();
        setSavedBills(extractListFromApiResponse(response).map(formatHistoryBill));
      } catch (error) {
        console.error("Failed to fetch branch bill history", error);
        setSavedBills([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchBillHistory();
  }, [view]);

  const [historySearch, setHistorySearch] = useState("");

  // Form State
  const [branchId, setBranchId] = useState("");
  const [partyId, setPartyId] = useState("");
  const branch =
    settings.branches.find((b) => b.id === branchId) ||
    settings.branches[0] ||
    null;

  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [refText, setRefText] = useState("");
  const [note, setNote] = useState("");
  const [partyName, setPartyName] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [partyGst, setPartyGst] = useState("");
  const [isSavingBill, setIsSavingBill] = useState(false);
  const [hsnCode, setHsnCode] = useState(settings.defaultHsn);
  const selectedParty =
    settings.parties.find((party) => party.id === partyId) ||
    settings.parties.find(
      (party) => party.name.toLowerCase() === partyName.trim().toLowerCase()
    ) ||
    null;
  const invoiceSeriesOwner = selectedParty || branch;
  const invoiceNumber = `${invoiceSeriesOwner?.prefix || ""}${String(
    invoiceSeriesOwner?.startFrom || 1
  ).padStart(3, "0")}`;

  // Items for the selected branch
  const [branchItems, setBranchItems] = useState([]);

  useEffect(() => {
    const fetchItemsForBranch = async () => {
      if (!branchId) {
        setBranchItems([]);
        return;
      }
      try {
        const response = await getItem({ branch: branchId });
        const list = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
        if (Array.isArray(list)) {
          setBranchItems(list.map(itm => ({
            id: itm.id || itm.pk,
            name: itm.name,
            rate: parseFloat(itm.rate) || 0
          })));
        } else {
          setBranchItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch branch items", err);
        setBranchItems([]);
      }
    };
    fetchItemsForBranch();
  }, [branchId]);

  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        const [invoiceRes, partyRes, configRes] = await Promise.all([
          getInvoiceSetup().catch(() => null),
          getPartyInformation().catch(() => null),
          getGlobalConfig().catch(() => null),
        ]);

        const apiBranches = formatBranches(invoiceRes);
        const apiParties = formatParties(partyRes);

        let apiGlobalConfig = {};
        if (configRes?.data?.results?.length > 0) {
          apiGlobalConfig = configRes.data.results[0];
        } else if (configRes?.data?.data && !Array.isArray(configRes.data.data)) {
          apiGlobalConfig = configRes.data.data;
        } else if (configRes?.data?.length > 0) {
          apiGlobalConfig = configRes.data[0];
        } else if (configRes?.data?.id) {
          apiGlobalConfig = configRes.data;
        }

        setSettings((prev) => {
          const newSettings = normalizeSettings({
            ...prev,
            defaultHsn: apiGlobalConfig.default_hsn_code || apiGlobalConfig.default_hsn || prev.defaultHsn,
            defaultGstPct: apiGlobalConfig.default_gst_percentage || apiGlobalConfig.default_gst_pct || prev.defaultGstPct,
            availableGstPctsString: apiGlobalConfig.available_gst_percentages || apiGlobalConfig.available_gst_pcts || prev.availableGstPctsString,
            globalConfigId: apiGlobalConfig.id || prev.globalConfigId || 1,
            branches: apiBranches,
            parties: apiParties,
          });
          setSettingsDraft(newSettings);
          if (apiBranches.length > 0) {
            setBranchId(apiBranches[0].id);
          }
          return newSettings;
        });
      } catch (error) {
        console.error("Error fetching GST module settings from API", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchApiSettings();
  }, []);

  useEffect(() => {
    if (!settings.branches.some((candidate) => candidate.id === branchId)) {
      setBranchId(settings.branches[0]?.id || "");
    }
  }, [branchId, settings.branches]);

  useEffect(() => {
    if (!partyId) {
      return;
    }

    if (!settings.parties.some((candidate) => candidate.id === partyId)) {
      setPartyId("");
    }
  }, [partyId, settings.parties]);

  useEffect(() => {
    if (!selectedParty) {
      return;
    }

    setPartyId(selectedParty.id);
    setPartyName(selectedParty.name);
    setPartyCode(selectedParty.code || "");
    setPartyGst(selectedParty.gstNo || "");
  }, [selectedParty]);

  const [items, setItems] = useState([createEmptyInvoiceItem(settings.defaultGstPct)]);

  const invoiceRef = useRef(null);

  // Recalculate whenever items change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === "itemId") {
      const selectedItemObj = branchItems.find(i => String(i.id) === String(value));
      if (selectedItemObj) {
        updatedItems[index].itemId = value;
        updatedItems[index].itemName = selectedItemObj.name;
        updatedItems[index].rate = selectedItemObj.rate;
      }
    } else {
      updatedItems[index][field] = value;
    }

    // Trigger recalculation for the modified item
    const item = updatedItems[index];
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gstPct = parseFloat(item.gstPct) || 0;

    let taxable = 0;
    let sgst = 0;
    let cgst = 0;
    let amount = 0;

    if (item.inclusive) {
      amount = qty * rate;
      taxable = amount / (1 + gstPct / 100);
      const taxTotal = amount - taxable;
      sgst = taxTotal / 2;
      cgst = taxTotal / 2;
    } else {
      taxable = qty * rate;
      const taxTotal = taxable * (gstPct / 100);
      sgst = taxTotal / 2;
      cgst = taxTotal / 2;
      amount = taxable + taxTotal;
    }

    item.taxable = taxable;
    item.sgst = sgst;
    item.cgst = cgst;
    item.amount = amount;

    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      createEmptyInvoiceItem(settings.defaultGstPct),
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
    }
  };

  const totals = items.reduce(
    (acc, curr) => {
      acc.taxable += curr.taxable;
      acc.sgst += curr.sgst;
      acc.cgst += curr.cgst;
      acc.amount += curr.amount;
      return acc;
    },
    { taxable: 0, sgst: 0, cgst: 0, amount: 0 }
  );

  const roundedTotal = Math.round(totals.amount);
  const roundOffAmount = roundedTotal - totals.amount;

  const handlePartySelect = (e) => {
    const selectedName = e.target.value;
    setPartyName(selectedName);

    const normalizedName = selectedName.trim().toLowerCase();
    const party = settings.parties.find(
      (candidate) => candidate.name.toLowerCase() === normalizedName
    );

    if (party) {
      setPartyId(party.id);
      setPartyCode(party.code);
      setPartyGst(party.gstNo);
      return;
    }

    setPartyId("");
  };

  const downloadPdf = async () => {
    const pInvNum = viewingHistoryBill ? viewingHistoryBill.invoiceNumber : invoiceNumber;
    await exportToPDF(
      "pdf-content",
      `Invoice_${pInvNum}.pdf`,
      toast
    );
  };

  const resetInvoiceForm = () => {
    const today = new Date().toISOString().split("T")[0];
    const defaultGstPct = settings.defaultGstPct || DEFAULT_SETTINGS.defaultGstPct;

    setInvoiceDate(today);
    setOrderNo("");
    setOrderDate(today);
    setRefText("");
    setNote("");
    setPartyName("");
    setPartyId("");
    setPartyCode("");
    setPartyGst("");
    setPartySearchQuery("");
    closePartyDropdown();
    setViewingHistoryBill(null);
    setEditingBillId(null);
    setHsnCode(settings.defaultHsn || DEFAULT_SETTINGS.defaultHsn);
    setItems([createEmptyInvoiceItem(defaultGstPct)]);
  };

  const handleEditBill = (bill) => {
    setEditingBillId(bill.id);
    
    const rawBranch = bill.raw.branch;
    const branchIdToSet = rawBranch && typeof rawBranch === 'object' ? String(rawBranch.id || rawBranch.pk) : String(rawBranch || bill.raw.branch_id || "");
    setBranchId(branchIdToSet);

    const rawParty = bill.raw.party;
    const partyIdToSet = rawParty && typeof rawParty === 'object' ? String(rawParty.id || rawParty.pk) : String(rawParty || bill.raw.party_id || "");
    setPartyId(partyIdToSet);
    setInvoiceDate(bill.invoiceDate || bill.date || new Date().toISOString().split("T")[0]);
    setOrderNo(bill.orderNo !== "N/A" ? bill.orderNo : "");
    setOrderDate(bill.orderDate || new Date().toISOString().split("T")[0]);
    setRefText(bill.refText || "");
    setNote(bill.note || "");
    setPartyName(bill.partyName || "");
    setPartyCode(bill.partyCode || "");
    setPartyGst(bill.partyGst || "");
    setHsnCode(bill.hsnCode || settings.defaultHsn);
    
    if (bill.items && bill.items.length > 0) {
      const formattedItems = bill.items.map(item => ({
        id: Date.now() + Math.random(),
        itemId: item.itemId,
        itemName: item.itemName,
        qty: item.qty,
        rate: item.rate,
        gstPct: item.gstPct,
        inclusive: item.inclusive,
        taxable: item.taxable,
        sgst: item.sgst,
        cgst: item.cgst,
        amount: item.amount
      }));
      setItems(formattedItems);
    } else {
      setItems([createEmptyInvoiceItem(settings.defaultGstPct)]);
    }
    
    setView("form");
  };

  const handleSaveBill = async () => {
    const apiBranchId = toApiId(branchId || branch?.id);
    const apiPartyId = toApiId(partyId || selectedParty?.id);
    const referencePeriod = parseReferencePeriod(refText);
    const sanitizedItems = items.filter((item) => item.itemId || item.itemName || item.qty);

    if (!apiBranchId) {
      toast.error("Please select a valid branch before saving the bill.");
      return;
    }

    if (!apiPartyId) {
      toast.error("Please select a saved party before saving the bill.");
      return;
    }

    // Note: Reference period validation is now removed to allow arbitrary text format as requested.
    // If it's a valid date range, it will be parsed for the backend start/end dates.
    // If not, it will still show up on the PDF/Preview as raw text.
    if (refText.trim() && !referencePeriod) {
      // Logic continues, but we don't block saving anymore.
    }

    if (sanitizedItems.length === 0) {
      toast.error("Add at least one invoice item before saving.");
      return;
    }

    const invalidItem = sanitizedItems.find((item) => {
      const apiItemId = toApiId(item.itemId);
      const quantity = parseFloat(item.qty);
      return !apiItemId || !Number.isFinite(quantity) || quantity <= 0;
    });

    if (invalidItem) {
      toast.error("Each invoice row needs a valid item and quantity before saving.");
      return;
    }

    const payload = {
      branch: apiBranchId,
      party: apiPartyId,
      invoice_date: invoiceDate,
      order_number: orderNo?.trim() || "N/A",
      order_date: orderDate || null,
      hsn_code: hsnCode?.trim() || settings.defaultHsn || DEFAULT_SETTINGS.defaultHsn,
      reference_period_start: referencePeriod?.start || null,
      reference_period_end: referencePeriod?.end || null,
      refrance: refText?.trim() || null,
      round_off: roundOffAmount.toFixed(2),
      notes: note?.trim() || "",
      items: sanitizedItems.map((item) => ({
        branch_item: toApiId(item.itemId),
        quantity: String(parseFloat(item.qty)),
        rate: (parseFloat(item.rate) || 0).toFixed(2),
        gst_percentage: String(parseFloat(item.gstPct) || 0),
        is_rate_inclusive: Boolean(item.inclusive),
      })),
    };

    try {
      setIsSavingBill(true);
      if (editingBillId) {
        await updateBranchBill(editingBillId, payload);
        toast.success("Bill updated successfully!");
        setEditingBillId(null);
        resetInvoiceForm();
        setView("history");
      } else {
        await createBranchBill(payload);
        resetInvoiceForm();
        toast.success("Bill saved successfully!");
        setView("form");
      }
    } catch (error) {
      console.error("Failed to save branch bill", error);
    } finally {
      setIsSavingBill(false);
    }
  };

  // --- SETTINGS VIEW --- //
  if (view === "settings") {
    const saveGlobalSettingsHandler = async () => {
      try {
        const globalConfigId = settingsDraft.globalConfigId || 1;
        const configData = {
          default_hsn_code: settingsDraft.defaultHsn,
          available_gst_percentages: settingsDraft.availableGstPctsString,
          default_gst_percentage: settingsDraft.defaultGstPct,
          default_hsn: settingsDraft.defaultHsn,
          available_gst_pcts: settingsDraft.availableGstPctsString,
          default_gst_pct: settingsDraft.defaultGstPct,
        };
        await updateGlobalConfig(globalConfigId, configData);

        const newSettings = normalizeSettings({ ...settings, defaultHsn: settingsDraft.defaultHsn, availableGstPctsString: settingsDraft.availableGstPctsString, defaultGstPct: settingsDraft.defaultGstPct });
        setSettings(newSettings);
        toast.success("Global config saved successfully!");
      } catch (configErr) {
        console.error("Error updating global config:", configErr);
        toast.error("Global config could not be updated.");
      }
    };

    const handleEditBranchClick = (index) => {
      setBranchModalInfo({
        isOpen: true,
        isNew: false,
        index,
        data: { ...settingsDraft.branches[index] },
        showBankDetails: !!(settingsDraft.branches[index].bank_details && settingsDraft.branches[index].bank_details.bank_name)
      });
    };

    const handleAddBranchClick = () => {
      setBranchModalInfo({
        isOpen: true,
        isNew: true,
        index: settingsDraft.branches.length,
        showBankDetails: false,
        data: {
          id: `BR_${Date.now()}`,
          name: "",
          address: "",
          gstNo: "",
          prefix: "NEW26-",
          startFrom: 1,
          bank_details: {
            bank_name: "",
            account_number: "",
            ifsc_code: "",
            account_holder_name: ""
          }
        }
      });
    };

    const handleSaveBranchModal = async () => {
      const { isNew, data, index } = branchModalInfo;

      try {
        const branchPayload = {
          branch_name: data.name,
          address: data.address,
          gst_number: data.gstNo || null,
          bank_details: data.bank_details || null,
          is_active: true,
        };

        if (isNew || isNewBranch(data.id)) {
          // POST only the new branch
          await createInvoiceSetup({ branches: [branchPayload] });
        } else {
          // PUT to update existing branch
          await updateInvoiceSetup(data.id, branchPayload);
        }

        // Re-fetch all branches from API to get the complete list
        const freshBranchRes = await getInvoiceSetup().catch(() => null);
        const allBranches = extractBranchListFromResponse(freshBranchRes).map(mapApiBranch);

        const newSettingsDraft = { ...settingsDraft, branches: allBranches };
        const normalizedDraft = normalizeSettings(newSettingsDraft);

        setSettings(normalizedDraft);
        setSettingsDraft(normalizedDraft);

        toast.success(isNew ? "Branch created successfully!" : "Branch updated successfully!");
        setBranchModalInfo({ isOpen: false, isNew: false, index: null, data: null, showBankDetails: false });
      } catch (err) {
        toast.error("Failed to save branch.");
        console.error(err);
      }
    };

    const handleDeleteBranchClick = async (index) => {
      const b = settingsDraft.branches[index];

      const result = await Swal.fire({
        title: "Are you sure you want to delete this branch record?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c2272d",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        try {
          if (!isNewBranch(b.id)) {
            await deleteInvoiceSetup(b.id);
          }

          // Re-fetch all branches from API
          const freshBranchRes = await getInvoiceSetup().catch(() => null);
          const allBranches = formatBranches(freshBranchRes);

          const newSettingsDraft = { ...settingsDraft, branches: allBranches };
          const normalizedDraft = normalizeSettings(newSettingsDraft);

          setSettings(normalizedDraft);
          setSettingsDraft(normalizedDraft);
          toast.success("Branch deleted successfully!");
        } catch (err) {
          toast.error("Failed to delete branch.");
          console.error(err);
        }
      }
    };

    const handleEditPartyClick = (index) => {
      setPartyModalInfo({
        isOpen: true,
        isNew: false,
        index,
        data: { ...settingsDraft.parties[index] }
      });
    };

    const handleAddPartyClick = () => {
      setPartyModalInfo({
        isOpen: true,
        isNew: true,
        index: settingsDraft.parties.length,
        data: {
          id: `PTY_${Date.now()}`,
          name: "",
          code: "",
          gstNo: "",
          prefix: buildPartyPrefix("New Party"),
          startFrom: 1,
        }
      });
    };

    const handleSavePartyModal = async () => {
      const { isNew, data, index } = partyModalInfo;
      const apiData = {
        party_name: data.name,
        party_code: data.code,
        party_gst_no: data.gstNo,
        invoice_prefix: data.prefix,
        next_sequence_no: data.startFrom,
        is_active: true,
      };

      try {
        if (isNew || isNewParty(data.id)) {
          await createPartyInformation(apiData);
        } else {
          await updatePartyInformation(data.id, apiData);
        }

        // Re-fetch all parties from API to get the complete list
        const freshPartyRes = await getPartyInformation().catch(() => null);
        const allParties = formatParties(freshPartyRes);

        const newSettingsDraft = { ...settingsDraft, parties: allParties };
        const normalizedDraft = normalizeSettings(newSettingsDraft);

        setSettings(normalizedDraft);
        setSettingsDraft(normalizedDraft);

        toast.success(isNew ? "Party created successfully!" : "Party updated successfully!");
        setPartyModalInfo({ isOpen: false, isNew: false, index: null, data: null });
      } catch (err) {
        toast.error("Failed to save party.");
        console.error(err);
      }
    };

    const handleDeletePartyClick = async (index) => {
      const p = settingsDraft.parties[index];

      const result = await Swal.fire({
        title: "Are you sure you want to delete this party record?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c2272d",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        try {
          if (!isNewParty(p.id)) {
            await deletePartyInformation(p.id);
          }

          // Re-fetch all parties from API
          const freshPartyRes = await getPartyInformation().catch(() => null);
          const allParties = formatParties(freshPartyRes);

          const newSettingsDraft = { ...settingsDraft, parties: allParties };
          const normalizedDraft = normalizeSettings(newSettingsDraft);

          setSettings(normalizedDraft);
          setSettingsDraft(normalizedDraft);
          toast.success("Party deleted successfully!");
        } catch (err) {
          toast.error("Failed to delete party.");
          console.error(err);
        }
      }
    };

    const fetchAllItemsManagement = async () => {
      try {
        const params = itemsManagementBranch === "all" ? {} : { branch: itemsManagementBranch };
        const response = await getItem(params);
        const list = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
        if (Array.isArray(list)) {
          setItemsManagementList(list);
        }
      } catch (err) {
        console.error("Failed to fetch items for management", err);
      }
    };

    const handleEditItemClick = (item) => {
      setItemModalInfo({
        isOpen: true,
        isNew: false,
        data: {
          id: item.id || item.pk,
          name: item.name,
          rate: item.rate,
          branch: item.branch?.id || item.branch
        }
      });
    };

    const handleAddItemClick = () => {
      setItemModalInfo({
        isOpen: true,
        isNew: true,
        data: {
          name: "",
          rate: "",
          branch: branchId || (settings.branches[0]?.id || "")
        }
      });
    };

    const handleSaveItemModal = async () => {
      const { isNew, data } = itemModalInfo;
      const payload = {
        name: data.name,
        rate: data.rate,
        branch: data.branch
      };

      try {
        if (isNew) {
          await createItem(payload);
        } else {
          await updateItem(data.id, payload);
        }

        await fetchAllItemsManagement();
        // Also refresh the form items if the branch matches
        const bId = data.branch;
        if (String(bId) === String(branchId)) {
          const response = await getItem({ branch: branchId });
          const list = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
          setBranchItems(list.map(itm => ({ id: itm.id || itm.pk, name: itm.name, rate: parseFloat(itm.rate) || 0 })));
        }

        setItemModalInfo({ isOpen: false, isNew: false, data: null });
      } catch (err) {
        console.error("Failed to save item", err);
      }
    };

    const handleDeleteItemClick = async (item) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete item "${item.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c2272d",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        try {
          await deleteItem(item.id || item.pk);
          await fetchAllItemsManagement();
          // Refresh form items if branch matches
          const bId = item.branch?.id || item.branch;
          if (String(bId) === String(branchId)) {
            const response = await getItem({ branch: branchId });
            const list = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
            setBranchItems(list.map(itm => ({ id: itm.id || itm.pk, name: itm.name, rate: parseFloat(itm.rate) || 0 })));
          }
        } catch (err) {
          console.error("Failed to delete item", err);
        }
      }
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Module Settings</h1>
              <p className="text-gray-500 text-sm mt-1">Configure your invoice formats and defaults.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSettingsDraft(settings);
                  setView("form");
                }}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-md"
              >
                <FiArrowLeft className="mr-2" /> Back to Invoice
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg px-4 py-3 text-sm">
            Invoice number series is now controlled by the selected party. Branch settings are only used for the seller name, address, and GST details.
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-700">Global Configurations</h2>
              <button
                onClick={saveGlobalSettingsHandler}
                className="flex items-center text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded transition shadow-sm"
              >
                <FiSave className="mr-1" /> Save Global
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default HSN Code</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase"
                  value={settingsDraft.defaultHsn}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      defaultHsn: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available GST % (Comma separated)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={settingsDraft.availableGstPctsString}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        availableGstPctsString: e.target.value,
                      })
                    }
                    placeholder="e.g. 0, 5, 12, 18, 28"
                  />
                  <p className="text-xs text-gray-400 mt-1">These will appear as dropdown options in the invoice table.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default GST Percentage</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={settingsDraft.defaultGstPct}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        defaultGstPct: parseFloat(e.target.value) || 0,
                      })
                    }
                  >
                    {(!settingsDraft.availableGstPcts || !settingsDraft.availableGstPcts.includes(settingsDraft.defaultGstPct)) && (
                      <option value={settingsDraft.defaultGstPct}>{settingsDraft.defaultGstPct}% (Not in list)</option>
                    )}
                    {settingsDraft.availableGstPcts?.map((pct) => (
                      <option key={pct} value={pct}>{pct}%</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-700">Branch Details</h2>
                <p className="text-sm text-gray-500 mt-1">Branch settings are used only for seller details on the invoice.</p>
              </div>
              <button
                onClick={handleAddBranchClick}
                className="flex items-center text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-md transition"
              >
                <FiPlus className="mr-2" /> Add Branch
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr className="text-gray-600 text-xs uppercase border-b border-gray-200">
                    <th className="p-3 font-semibold w-1/4">Branch Name</th>
                    <th className="p-3 font-semibold w-2/5">Address</th>
                    <th className="p-3 font-semibold w-1/4">GST Number</th>
                    <th className="p-3 font-semibold text-right w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settingsDraft.branches.map((b, i) => {
                    return (
                      <tr key={b.id || i} className="hover:bg-gray-50/50 bg-white transition-colors">
                        <td className="p-3 align-top font-medium text-gray-800 break-words">{b.name}</td>
                        <td className="p-3 align-top text-sm text-gray-600 break-words">{b.address}</td>
                        <td className="p-3 align-top text-sm font-mono text-gray-600">{b.gstNo}</td>
                        <td className="p-3 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditBranchClick(i)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition" title="Edit"><FiEdit2 size={16} /></button>
                            <button onClick={() => handleDeleteBranchClick(i)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition" title="Delete"><FiTrash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-700">Party Master & Invoice Series</h2>
                <p className="text-sm text-gray-500 mt-1">Each party keeps its own invoice prefix and running number.</p>
              </div>
              <button
                onClick={handleAddPartyClick}
                className="flex items-center text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-md transition"
              >
                <FiPlus className="mr-2" /> Add Party
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr className="text-gray-600 text-xs uppercase border-b border-gray-200">
                    <th className="p-3 font-semibold min-w-[250px]">Party Name & Code</th>
                    <th className="p-3 font-semibold min-w-[180px]">GST Number</th>
                    <th className="p-3 font-semibold min-w-[120px]">Prefix</th>
                    <th className="p-3 font-semibold min-w-[100px]">Next Seq</th>
                    <th className="p-3 font-semibold text-right w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settingsDraft.parties.map((party, index) => {
                    return (
                      <tr key={party.id || index} className="hover:bg-gray-50/50 bg-white transition-colors">
                        <td className="p-3 align-top">
                          <div className="font-semibold text-gray-800 uppercase">{party.name}</div>
                          <div className="text-xs text-gray-500 mt-1 uppercase">Code: {party.code || "-"}</div>
                        </td>
                        <td className="p-3 align-top text-sm font-mono text-gray-600 uppercase">{party.gstNo}</td>
                        <td className="p-3 align-top text-sm font-mono text-gray-600 uppercase">{party.prefix}</td>
                        <td className="p-3 align-top text-sm font-mono text-gray-600 relative group">
                          {party.startFrom}
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded shadow-lg z-20">
                            Next infoice preview: {party.prefix}{String(toSequenceNumber(party.startFrom, 1)).padStart(3, "0")}
                          </div>
                        </td>
                        <td className="p-3 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditPartyClick(index)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition" title="Edit"><FiEdit2 size={16} /></button>
                            <button onClick={() => handleDeletePartyClick(index)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition" title="Delete"><FiTrash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-700">Items Master</h2>
                <p className="text-sm text-gray-500 mt-1">Manage items and their rates for each branch.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Filter Branch:</label>
                  <select
                    className="border border-gray-200 rounded-md py-1 px-2 text-sm focus:ring-2 focus:ring-purple-200 outline-none bg-white font-medium text-gray-700 transition"
                    value={itemsManagementBranch}
                    onChange={(e) => setItemsManagementBranch(e.target.value)}
                  >
                    <option value="all">All Branches</option>
                    {settings.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddItemClick}
                  className="flex items-center text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-md transition"
                >
                  <FiPlus className="mr-2" /> Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-gray-50 window-shadow z-10 shadow-sm">
                  <tr className="text-gray-600 text-xs uppercase border-b border-gray-200">
                    <th className="p-3 font-semibold">Item Name</th>
                    <th className="p-3 font-semibold">Branch</th>
                    <th className="p-3 font-semibold text-right">Rate (₹)</th>
                    <th className="p-3 font-semibold text-right w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itemsManagementList.map((item, idx) => {
                    const bId = item.branch?.id || item.branch;
                    const b = settings.branches.find(br => String(br.id) === String(bId));
                    return (
                      <tr key={item.id || idx} className="hover:bg-gray-50/50 bg-white transition-colors">
                        <td className="p-3 font-medium text-gray-800 uppercase">{item.name}</td>
                        <td className="p-3 text-sm text-gray-600">{b?.name || "Unknown Branch"}</td>
                        <td className="p-3 text-right text-sm font-bold text-purple-700">₹{parseFloat(item.rate).toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditItemClick(item)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition" title="Edit"><FiEdit2 size={16} /></button>
                            <button onClick={() => handleDeleteItemClick(item)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition" title="Delete"><FiTrash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {itemsManagementList.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 italic">No items found in items master.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals rendered at the end of the page body for high z-index stacking */}
        {branchModalInfo.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">{branchModalInfo.isNew ? "Add New Branch" : "Edit Branch Details"}</h3>
                <button onClick={() => setBranchModalInfo({ isOpen: false, isNew: false, index: null, data: null, showBankDetails: false })} className="text-gray-400 hover:text-gray-600 transition"><FiX size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Branch Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition" value={branchModalInfo.data.name} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} placeholder="Enter branch name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <textarea rows="3" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none" value={branchModalInfo.data.address} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, address: e.target.value } }))} placeholder="Enter full address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase font-mono" value={branchModalInfo.data.gstNo} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, gstNo: e.target.value } }))} placeholder="22AAAAA0000A1Z5" />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setBranchModalInfo(p => ({ ...p, showBankDetails: !p.showBankDetails }))}
                    className="text-purple-600 text-sm font-semibold flex items-center hover:text-purple-800 transition"
                  >
                    {branchModalInfo.showBankDetails ? "- Hide Bank Details" : "+ Add Bank Details"}
                  </button>

                  {branchModalInfo.showBankDetails && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm" value={branchModalInfo.data.bank_details?.bank_name || ""} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, bank_details: { ...(p.data.bank_details || {}), bank_name: e.target.value } } }))} placeholder="e.g. Bank of Baroda" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number</label>
                        <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm font-mono" value={branchModalInfo.data.bank_details?.account_number || ""} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, bank_details: { ...(p.data.bank_details || {}), account_number: e.target.value } } }))} placeholder="Account Number" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">IFSC Code</label>
                        <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm font-mono uppercase" value={branchModalInfo.data.bank_details?.ifsc_code || ""} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, bank_details: { ...(p.data.bank_details || {}), ifsc_code: e.target.value } } }))} placeholder="IFSC Code" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm uppercase" value={branchModalInfo.data.bank_details?.account_holder_name || ""} onChange={(e) => setBranchModalInfo(p => ({ ...p, data: { ...p.data, bank_details: { ...(p.data.bank_details || {}), account_holder_name: e.target.value } } }))} placeholder="Account Holder Name" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setBranchModalInfo({ isOpen: false, isNew: false, index: null, data: null, showBankDetails: false })} className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">Cancel</button>
                <button onClick={handleSaveBranchModal} className="px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center shadow-md transition"><FiSave className="mr-2" /> Save Branch</button>
              </div>
            </div>
          </div>
        )}

        {partyModalInfo.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">{partyModalInfo.isNew ? "Add New Party" : "Edit Party Details"}</h3>
                <button onClick={() => setPartyModalInfo({ isOpen: false, isNew: false, index: null, data: null })} className="text-gray-400 hover:text-gray-600 transition"><FiX size={24} /></button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Party Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase" value={partyModalInfo.data.name} onChange={(e) => {
                    const val = e.target.value;
                    const nextPrefix = partyModalInfo.data.prefix === buildPartyPrefix(partyModalInfo.data.name) ? buildPartyPrefix(val) : partyModalInfo.data.prefix;
                    setPartyModalInfo(p => ({ ...p, data: { ...p.data, name: val, prefix: nextPrefix } }));
                  }} placeholder="Entity Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Party Code</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase" value={partyModalInfo.data.code} onChange={(e) => setPartyModalInfo(p => ({ ...p, data: { ...p.data, code: e.target.value } }))} placeholder="e.g. 1522" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase font-mono" value={partyModalInfo.data.gstNo} onChange={(e) => setPartyModalInfo(p => ({ ...p, data: { ...p.data, gstNo: e.target.value } }))} placeholder="..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Prefix</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase font-mono" value={partyModalInfo.data.prefix} onChange={(e) => setPartyModalInfo(p => ({ ...p, data: { ...p.data, prefix: e.target.value } }))} placeholder="PRE-" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Next Sequence No.</label>
                  <input type="number" min="1" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition font-mono" value={partyModalInfo.data.startFrom} onChange={(e) => setPartyModalInfo(p => ({ ...p, data: { ...p.data, startFrom: toSequenceNumber(e.target.value, 1) } }))} />
                  <p className="text-[10px] text-gray-400 mt-1">Preview: {partyModalInfo.data.prefix}{String(toSequenceNumber(partyModalInfo.data.startFrom, 1)).padStart(3, "0")}</p>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setPartyModalInfo({ isOpen: false, isNew: false, index: null, data: null })} className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">Cancel</button>
                <button onClick={handleSavePartyModal} className="px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center shadow-md transition"><FiSave className="mr-2" /> Save Party</button>
              </div>
            </div>
          </div>
        )}

        {itemModalInfo.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">{itemModalInfo.isNew ? "Add New Item" : "Edit Item"}</h3>
                <button onClick={() => setItemModalInfo({ isOpen: false, isNew: false, data: null })} className="text-gray-400 hover:text-gray-600 transition"><FiX size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase"
                    value={itemModalInfo.data.name}
                    onChange={(e) => setItemModalInfo(p => ({ ...p, data: { ...p.data, name: e.target.value } }))}
                    placeholder="e.g. PIZZA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Rate (Price)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={itemModalInfo.data.rate}
                    onChange={(e) => setItemModalInfo(p => ({ ...p, data: { ...p.data, rate: e.target.value } }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
                  <select
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                    value={itemModalInfo.data.branch}
                    onChange={(e) => setItemModalInfo(p => ({ ...p, data: { ...p.data, branch: e.target.value } }))}
                  >
                    <option value="">Select Branch</option>
                    {settings.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setItemModalInfo({ isOpen: false, isNew: false, data: null })} className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">Cancel</button>
                <button onClick={handleSaveItemModal} className="px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center shadow-md transition"><FiSave className="mr-2" /> Save Item</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PREVIEW VIEW --- //
  if (view === "preview") {
    // Override directly from active state or history viewing state
    const pData = viewingHistoryBill || {
      branchName: branch?.name || "-",
      branchAddress: branch?.address || "-",
      branchGst: branch?.gstNo || "-",
      branchBankDetails: branch?.bank_details || null,
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      partyName: partyName,
      partyGst: partyGst,
      hsnCode: hsnCode,
      partyCode: partyCode,
      orderNo: orderNo,
      orderDate: orderDate,
      refText: refText,
      note: note,
      items: items,
      totals: totals,
      roundedTotal: roundedTotal,
      roundOffAmount: roundOffAmount,
    };

    return (
      <div className="p-4 bg-[#f8fafc] min-h-screen border-t font-['Inter',_sans-serif]">
        {/* Navigation Bar */}
        <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 no-print">
          <button
            onClick={() => {
              setView(viewingHistoryBill ? "history" : "form");
              setViewingHistoryBill(null);
            }}
            className="flex items-center text-slate-600 hover:text-indigo-600 transition-all font-semibold px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            <FiArrowLeft className="mr-2" /> {viewingHistoryBill ? "Back to History" : "Back to Edit"}
          </button>
          <div className="flex gap-4">
            {!viewingHistoryBill && (
              <button
                onClick={handleSaveBill}
                disabled={isSavingBill}
                className="flex items-center bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
              >
                <FiSave className="mr-2" /> {isSavingBill ? "Saving..." : (editingBillId ? "Save Changes" : "Save Bill")}
              </button>
            )}
            <button
              onClick={downloadPdf}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              <FiDownload className="mr-2" /> Download Direct PDF
            </button>
          </div>
        </div>

        {/* PDF CONTENT AREA */}
        <div className="flex justify-center py-4 px-2 overflow-x-auto">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            #pdf-content {
              font-family: 'Inter', sans-serif !important;
            }
            .pdf-mode .no-print { display: none !important; }
            
            @media print {
              #pdf-content {
                box-shadow: none !important;
                margin: 0 !important;
              }
            }
          `}</style>

          <div
            id="pdf-content"
            ref={invoiceRef}
            className="bg-white relative shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-10 print:m-0 print:shadow-none flex flex-col"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "10mm 15mm",
              boxSizing: "border-box",
              color: "#1e293b",
              position: "relative",
            }}
          >
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700"></div>

            {/* Redesigned Unified Header */}
            <div className="flex justify-between items-stretch mb-6 mt-1 min-h-[130px]">
              {/* Left: Branch Info */}
              <div className="flex-[1.5] pr-10 flex flex-col justify-center">
                <h1 className={`${pData.branchName.length > 25 ? 'text-[34px]' : 'text-[50px]'} font-black text-slate-900 tracking-tight mb-3 uppercase break-words leading-[1.05] drop-shadow-sm`}>
                  {pData.branchName}
                </h1>
                <div className="text-[13px] text-slate-500 font-medium space-y-2">
                  <p className="flex items-start max-w-[420px] leading-relaxed">
                    <span className="opacity-70 mr-1.5 mt-1 text-[10px]">📍</span> {pData.branchAddress}
                  </p>
                  <p className="flex items-center">
                    <span className="font-bold text-slate-700 mr-2 uppercase tracking-widest text-[9px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">GSTIN</span> {pData.branchGst}
                  </p>
                </div>
              </div>

              {/* Right: Tax Invoice Details Grid */}
              <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200/60 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start mb-4 transition-all gap-2 flex-wrap">
                  <div className="bg-indigo-700 text-white px-4 py-1.5 rounded-md shadow-md shrink-0">
                    <h2 className="text-[10px] font-black tracking-[0.25em] uppercase m-0 leading-none">TAX INVOICE</h2>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right shrink-0">
                    ORDER NO. <span className="text-slate-500">{pData.orderNo || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Invoice No.</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{pData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Order Date</p>
                    <p className="text-sm font-black text-slate-700 uppercase">
                      {pData.orderDate ? pData.orderDate.split("-").reverse().join("-") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-sm font-black text-slate-700">
                      {pData.invoiceDate ? pData.invoiceDate.split("-").reverse().join("-") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">HSN Code</p>
                    <p className="text-sm font-black text-slate-700 uppercase">{pData.hsnCode || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info Section */}
            <div className="mb-6">
              <h3 className="text-[11px] font-black text-indigo-700 uppercase tracking-[0.2em] mb-3 pb-1.5 border-b border-indigo-100 items-center gap-2 flex">
                <span className="w-1 h-3.5 bg-indigo-600 rounded"></span>
                Client Information
              </h3>
              <div className="grid grid-cols-[40%_60%] gap-4 px-2">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Bill To</p>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 leading-none break-words">{pData.partyName || "CASH INVOICE"}</p>
                  <div className="text-sm text-slate-600 font-medium pt-1">
                    {pData.partyGst ? (
                      <p className="flex items-center gap-2">
                        <span className="bg-white border border-slate-200 text-[9px] px-2 py-0.5 rounded-md font-black text-slate-500 tracking-wider">GSTIN</span>
                        <span className="font-bold text-indigo-700 font-mono text-base tracking-tight">{pData.partyGst}</span>
                      </p>
                    ) : <p className="text-xs text-slate-400 italic">No GST Details</p>}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-[30%_70%] items-center overflow-hidden">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Party Code</p>
                      <p className="text-base font-black text-slate-700 uppercase leading-none">{pData.partyCode || "N/A"}</p>
                    </div>
                    {pData.refText && (
                      <div className="text-right border-l border-slate-200 pl-4 ml-4">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Reference Period</p>
                        <p className="text-xs font-bold text-slate-600 uppercase leading-tight break-words">{pData.refText}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:overflow-visible">
              <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr className="bg-indigo-700 text-white">
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-center w-[5%] border-r border-white/10">#</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] w-[25%] border-r border-white/10">Item Name</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-center w-[8%] border-r border-white/10">Qty</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-right w-[10%] border-r border-white/10">Rate</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-center w-[8%] border-r border-white/10">GST%</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-right w-[12%] border-r border-white/10">Taxable</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-right w-[10%] border-r border-white/10">SGST</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-right w-[10%] border-r border-white/10">CGST</th>
                    <th className="py-2.5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-right w-[13%] border-r border-white/10">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {pData.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors h-[38px] page-break-inside-avoid">
                      <td className="px-4 text-center font-bold text-slate-400 border-r border-slate-100">{index + 1}</td>
                      <td className="px-4 font-black text-slate-800 uppercase border-r border-slate-100 whitespace-normal break-words leading-tight">{item.itemName}</td>
                      <td className="px-4 text-center font-extrabold text-slate-700 border-r border-slate-100">{item.qty}</td>
                      <td className="px-4 text-right font-bold text-slate-600 border-r border-slate-100">₹{parseFloat(item.rate).toFixed(2)}</td>
                      <td className="px-4 text-center font-bold text-slate-600 border-r border-slate-100">{item.gstPct}%</td>
                      <td className="px-4 text-right font-bold text-slate-700 border-r border-slate-100">₹{parseFloat(item.taxable).toFixed(2)}</td>
                      <td className="px-4 text-right font-medium text-slate-500 border-r border-slate-100">₹{parseFloat(item.sgst).toFixed(2)}</td>
                      <td className="px-4 text-right font-medium text-slate-500 border-r border-slate-100">₹{parseFloat(item.cgst).toFixed(2)}</td>
                      <td className="px-4 text-right font-black text-indigo-700 bg-indigo-50/50">₹{parseFloat(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                  {/* Fill padding rows if items are few to maintain size */}
                  {pData.items.length < 5 && Array.from({ length: 5 - pData.items.length }).map((_, i) => (
                    <tr key={`pad-${i}`} className="bg-transparent h-[38px] border-b border-slate-50/50 last:border-0">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className={`${j < 8 ? "border-r border-slate-50/50" : ""} ${j === 8 ? "bg-indigo-50/30" : ""}`}></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Section: Summary & Details */}
            <div className="flex justify-between items-start gap-12 mt-auto pb-4 page-break-inside-avoid">
              {/* Left: Notes & Bank Details */}
              <div className="flex-1 space-y-4">
                {/* Notes Card */}
                {pData.note && (
                  <div className="bg-amber-50 rounded-xl p-3 border-l-4 border-amber-400">
                    <h4 className="text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1">Notes / Terms</h4>
                    <p className="text-[10px] text-amber-900 font-medium leading-tight italic">{pData.note}</p>
                  </div>
                )}

                {/* Bank Details Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-[9px] font-black text-indigo-700 uppercase tracking-widest mb-2 pb-1 border-b border-indigo-100">Bank Details</h4>
                  {pData.branchBankDetails && pData.branchBankDetails.bank_name ? (
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Bank Name</p>
                        <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{pData.branchBankDetails.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">A/C Number</p>
                        <p className="text-[10px] font-black text-slate-800 tracking-wider uppercase leading-none">{pData.branchBankDetails.account_number}</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">IFSC Code</p>
                        <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{pData.branchBankDetails.ifsc_code}</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Acc. Holder</p>
                        <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{pData.branchBankDetails.account_holder_name}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400 italic">No Bank Details Provided</p>
                  )}
                </div>
              </div>

              {/* Right: Detailed Summary */}
              <div className="w-[280px] flex flex-col gap-2">
                <div className="space-y-1.5 px-2">
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Taxable Amount</span>
                    <span className="font-extrabold text-slate-700">₹{pData.totals.taxable.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Output SGST Total</span>
                    <span className="font-extrabold text-slate-700">+ ₹{pData.totals.sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Output CGST Total</span>
                    <span className="font-extrabold text-slate-700">+ ₹{pData.totals.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] items-center border-t border-slate-100 mt-1 pt-1.5">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Round Off</span>
                    <span className={`font-extrabold ${pData.roundOffAmount >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {pData.roundOffAmount >= 0 ? "+" : ""}₹{Math.abs(pData.roundOffAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-700 text-white rounded-xl p-3 shadow-inner mt-1 flex flex-col items-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 opacity-80">Final Payable Amount</p>
                  <div className="text-2xl font-black flex items-start">
                    <span className="text-sm mt-0.5 mr-0.5">₹</span>
                    <span className="tracking-tight">{pData.roundedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pinned Section */}
            <div className="mt-2 pt-2 border-t border-slate-100 page-break-inside-avoid">
              {/* Signatures Area */}
              <div className="flex justify-between items-end px-4 mb-4">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-40 border-b-2 border-slate-200"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiver&apos;s Signature</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`
                        ${pData.branchName.length > 40 ? 'text-[12px]' : pData.branchName.length > 20 ? 'text-[14px]' : 'text-base'} 
                        text-indigo-900/20 font-serif italic mb-2 pointer-events-none select-none uppercase 
                        font-black tracking-widest text-center break-words max-w-[260px] leading-tight
                      `}>
                    {pData.branchName}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-48 border-b-2 border-indigo-600"></div>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mt-2">Authorized Signatory</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-indigo-900 rounded-xl py-3 px-6 text-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-indigo-900 to-indigo-800 opacity-50"></div>
                <p className="text-white text-[10px] font-black tracking-[0.1em] uppercase relative z-10 leading-relaxed max-w-[95%] mx-auto flex items-center justify-center flex-wrap gap-y-1">
                  <span>Thank you for choosing</span>
                  <span className="text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 ml-2 shadow-sm whitespace-normal text-center text-[11px]">
                    {pData.branchName}
                  </span>
                </p>
                <p className="text-[7px] text-white/40 mt-1 relative z-10 uppercase tracking-tight">This is a system generated tax invoice and does not require a physical signature.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- HISTORY VIEW --- //
  if (view === "history") {
    const filteredBills = savedBills.filter(bill => {
      if (!historySearch.trim()) return true;
      const q = historySearch.toLowerCase();
      return (
        (bill.invoiceNumber || "").toLowerCase().includes(q) ||
        (bill.partyName || "").toLowerCase().includes(q) ||
        (bill.branchName || "").toLowerCase().includes(q) ||
        (bill.date || "").includes(q)
      );
    });

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Saved Invoices History</h1>
              <p className="text-gray-500 text-sm mt-1">Review bills saved from the backend history.</p>
            </div>
            <button
              onClick={() => {
                setViewingHistoryBill(null);
                setView("form");
              }}
              className="flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all gap-2"
            >
              <FiArrowLeft size={18} /> Back to Form
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Invoice No, Party Name, Branch, or Date..."
              className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-purple-200 outline-none shadow-sm transition placeholder-gray-400"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {historyLoading ? (
              <div className="p-10 text-center text-gray-500 font-medium">
                Loading saved invoices...
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="p-10 text-center text-gray-500 font-medium">
                {savedBills.length === 0
                  ? "No saved invoices found yet."
                  : `No invoices match "${historySearch}".`}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                      <th className="p-4 font-semibold whitespace-nowrap">Invoice No</th>
                      <th className="p-4 font-semibold whitespace-nowrap">Party Name</th>
                      <th className="p-4 font-semibold whitespace-nowrap">Branch</th>
                      <th className="p-4 font-semibold text-right whitespace-nowrap">Amount (₹)</th>
                      <th className="p-4 font-semibold text-center whitespace-nowrap min-w-[150px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {filteredBills.map(bill => (
                      <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-600 font-medium">{formatIsoDateToDisplay(bill.date)}</td>
                        <td className="p-4 font-bold text-gray-800">{bill.invoiceNumber}</td>
                        <td className="p-4 text-gray-600 uppercase font-semibold">{bill.partyName}</td>
                        <td className="p-4 text-gray-500">{bill.branchName}</td>
                        <td className="p-4 text-right font-bold text-purple-700">{bill.roundedTotal.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex flex-col items-stretch gap-2 w-full max-w-[110px] mx-auto">
                            <button
                              className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-2 text-xs font-semibold rounded-md transition inline-flex items-center justify-center shadow-sm whitespace-nowrap"
                              onClick={() => handleEditBill(bill)}
                            >
                              <FiEdit2 className="mr-1.5 shrink-0" size={14} /> Edit
                            </button>
                            <button
                              className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3 py-2 text-xs font-semibold rounded-md transition inline-flex items-center justify-center shadow-sm whitespace-nowrap"
                              onClick={() => {
                                setViewingHistoryBill(bill);
                                setView("preview");
                              }}
                            >
                              <FiEye className="mr-1.5 shrink-0" size={14} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- FORM VIEW --- //
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create GST Invoice</h1>
            <p className="text-gray-500 text-sm mt-1">Fill in the details below to generate an invoice.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setViewingHistoryBill(null);
                setView("history");
              }}
              className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-all gap-2 border border-blue-200"
            >
              <FiClock size={18} /> History
            </button>
            <button
              onClick={() => {
                setSettingsDraft(settings);
                setView("settings");
              }}
              className="flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all gap-2"
            >
              <FiSettings size={18} /> Settings
            </button>
            <button
              onClick={() => {
                setViewingHistoryBill(null);
                setView("preview");
              }}
              className="flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md transition-all gap-2"
            >
              <FiEye size={18} /> Review & Generate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Setup Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">Invoice Setup</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 pr-10 appearance-none focus:ring-2 focus:ring-purple-200 outline-none transition bg-white cursor-pointer"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                  >
                    {settings.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <FiChevronDown />
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order No (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-001"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Period (Ref)</label>
                <input
                  type="text"
                  placeholder="e.g. 01-01-2026 TO 31-01-2026"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={refText}
                  onChange={(e) => setRefText(e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  rows="3"
                  placeholder="Enter note"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Party Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">Party Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Party Name</label>
                <div className="relative" ref={partyDropdownRef}>
                  <input
                    className="w-full border border-gray-300 rounded-md p-2 pl-9 pr-10 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase"
                    value={partyName}
                    autoComplete="off"
                    onChange={(e) => {
                      const val = e.target.value;
                      setPartyName(val);
                      setPartySearchQuery(val);
                      openPartyDropdown();
                      const p = settings.parties.find(p => p.name.toLowerCase() === val.toLowerCase());
                      if (p) {
                        setPartyId(p.id); setPartyCode(p.code || ""); setPartyGst(p.gstNo || "");
                      } else {
                        if (partyId) { setPartyId(""); setPartyCode(""); setPartyGst(""); }
                      }
                    }}
                    onFocus={() => { setPartySearchQuery(""); openPartyDropdown(); }}
                    placeholder="Search or enter party name"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => { setPartySearchQuery(""); togglePartyDropdown(); }}
                    tabIndex="-1"
                  >
                    <FiChevronDown />
                  </button>

                  {showPartyDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {settings.parties.filter(p => !partySearchQuery || p.name.toLowerCase().includes(partySearchQuery.toLowerCase())).length > 0 ? (
                        settings.parties.filter(p => !partySearchQuery || p.name.toLowerCase().includes(partySearchQuery.toLowerCase())).map(p => (
                          <div
                            key={p.id}
                            tabIndex="0"
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setPartyName(p.name);
                              setPartySearchQuery("");
                              setPartyId(p.id); setPartyCode(p.code || ""); setPartyGst(p.gstNo || "");
                              closePartyDropdown();
                            }}
                          >
                            <div className="font-semibold uppercase text-gray-800">{p.name}</div>
                            {p.gstNo && <div className="text-[10px] text-gray-500 font-mono mt-0.5">GST: {p.gstNo}</div>}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-md text-center italic">
                          No saved parties match &quot;{partySearchQuery}&quot;. A new generic invoice will be generated.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p
                  className={`mt-2 text-xs ${selectedParty ? "text-emerald-600" : "text-amber-600"
                    }`}
                >
                  Invoice No. will use: <span className="font-semibold">{invoiceNumber}</span>
                  {selectedParty
                    ? " from the selected party series."
                    : " from the branch fallback until you select a saved party."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party GST No</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase"
                    value={partyGst}
                    onChange={(e) => setPartyGst(e.target.value)}
                    placeholder="24XXXXX..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party Code</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-200 outline-none transition uppercase"
                    value={partyCode}
                    onChange={(e) => setPartyCode(e.target.value)}
                    placeholder="-"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Selection Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-700">Invoice Items</h2>
            <button
              onClick={addItemRow}
              className="flex items-center text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded transition"
            >
              <FiPlus className="mr-1" /> Add Row
            </button>
          </div>
          <div className="overflow-visible min-h-[300px]">
            <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr className="bg-gray-100/50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-3 border-b font-semibold w-12 text-center">#</th>
                  <th className="p-3 border-b font-semibold w-64">Item Name</th>
                  <th className="p-3 border-b font-semibold w-24">Qty</th>
                  <th className="p-3 border-b font-semibold w-32">Rate (₹)</th>
                  <th className="p-3 border-b font-semibold w-24">GST %</th>
                  <th className="p-3 border-b font-semibold w-24 text-right">Taxable</th>
                  <th className="p-3 border-b font-semibold w-24 text-right">Tax (₹)</th>
                  <th className="p-3 border-b font-semibold w-32 text-right">Total (₹)</th>
                  <th className="p-3 border-b font-semibold w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 text-center text-gray-500 font-medium">{index + 1}</td>
                    <td className="p-3 w-64 align-top">
                      <Dropdown
                        options={branchItems}
                        selectedValue={item.itemId}
                        selectedLabel={item.itemName}
                        onChange={(val) => handleItemChange(index, "itemId", val)}
                        placeholder="Search Items"
                        isSearchable={true}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        className="w-full border-gray-300 rounded p-1.5 border focus:ring-2 focus:ring-purple-200 outline-none text-center"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, "qty", parseFloat(e.target.value) || "")}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          min="0"
                          className="w-full border-gray-300 rounded p-1.5 border focus:ring-2 focus:ring-purple-200 outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value) || "")}
                        />
                        <label className="flex items-center text-[10px] text-gray-500 justify-end cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-1 rounded text-purple-600 focus:ring-purple-500"
                            checked={item.inclusive}
                            onChange={(e) => handleItemChange(index, "inclusive", e.target.checked)}
                          />
                          Rate is Inclusive
                        </label>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="relative flex items-center">
                        <select
                          className="w-full border-gray-300 rounded p-1.5 pr-6 border appearance-none focus:ring-2 focus:ring-purple-200 outline-none text-center bg-white cursor-pointer text-xs"
                          value={item.gstPct}
                          onChange={(e) => handleItemChange(index, "gstPct", parseFloat(e.target.value) || 0)}
                        >
                          {(!settings.availableGstPcts || !settings.availableGstPcts.includes(item.gstPct)) && (
                            <option value={item.gstPct}>{item.gstPct}%</option>
                          )}
                          {settings.availableGstPcts?.map((pct) => (
                            <option key={pct} value={pct}>{pct}%</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center pr-1 text-gray-500">
                          <FiChevronDown size={14} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium text-gray-700 bg-gray-50/50">
                      {item.taxable.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-gray-600 flex flex-col justify-center items-end bg-gray-50/50">
                      <span className="font-medium text-xs">{(item.sgst + item.cgst).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400">({item.sgst.toFixed(2)} + {item.cgst.toFixed(2)})</span>
                    </td>
                    <td className="p-3 text-right font-bold text-gray-800 bg-purple-50/30">
                      {item.amount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeItemRow(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove Row"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxable Amount:</span>
                <span className="font-medium">₹ {totals.taxable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>CGST:</span>
                <span className="font-medium">₹ {totals.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>SGST:</span>
                <span className="font-medium">₹ {totals.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 border-t pt-2 border-gray-200">
                <span>Round Off:</span>
                <span className="font-medium"> {roundOffAmount > 0 ? "+" : ""}{roundOffAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2 border-gray-300">
                <span>Grand Total:</span>
                <span className="text-purple-700">₹ {roundedTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setView("preview")}
                className="w-full mt-4 flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded font-medium shadow transition-all gap-2"
              >
                <FiEye size={18} /> {editingBillId ? "Review & Save Changes" : "Review Invoice"}
              </button>
              {editingBillId && (
                <button
                  onClick={handleSaveBill}
                  disabled={isSavingBill}
                  className="w-full mt-2 flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded font-medium shadow transition-all gap-2"
                >
                  <FiSave size={18} /> {isSavingBill ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GstBillingModule;
