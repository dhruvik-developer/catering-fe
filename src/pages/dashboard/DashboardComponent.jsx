/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiHome,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";

// Parse the dd-mm-yyyy / yyyy-mm-dd date strings the API hands back. Same
// shape the Header dropdown and Calendar pages use; kept local so this file
// has no cross-page coupling.
const parseEventDate = (str) => {
  if (!str) return null;
  const ddmmyyyy = String(str).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (ddmmyyyy) {
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  }
  const yyyymmdd = String(str).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (yyyymmdd) {
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  }
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getActiveEventDate = (order) => {
  const sessionDate = order?.sessions?.[0]?.event_date;
  return sessionDate || order?.event_date || null;
};

const formatDateLabel = (date) =>
  date
    ? date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const isCompletedStatus = (status) => {
  const s = String(status || "").toLowerCase();
  return s === "done" || s === "completed";
};

const isCancelledStatus = (status) => {
  const s = String(status || "").toLowerCase();
  return s === "cancelled";
};

const StatCard = ({ icon, label, value, accent, sub }) => (
  <Card
    sx={{
      p: 2.5,
      borderRadius: 3,
      border: "1px solid var(--app-border)",
      boxShadow: "var(--app-shadow)",
      bgcolor: "background.paper",
      flex: 1,
      minWidth: 220,
    }}
  >
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: `${accent}22`,
          color: accent,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {value}
        </Typography>
        {sub ? (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  </Card>
);

// One row in a list of events. Whole row is clickable; click hands the id
// back to the controller which routes to /view-order-details/:id.
const EventRow = ({ order, onClick, dayLabel, accent = "primary" }) => {
  const eventDate = parseEventDate(getActiveEventDate(order));
  const sessionCount = order?.sessions?.length || 0;
  const venue =
    order?.sessions?.[0]?.venue_name ||
    order?.venue_name ||
    order?.address ||
    "";
  const customer = order?.customer_name || order?.name || "Unnamed event";

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onClick(order.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(order.id);
        }
      }}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid var(--app-border)",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        bgcolor: "background.paper",
        transition: "background-color 120ms, border-color 120ms",
        "&:hover": {
          bgcolor: "var(--color-primary-soft)",
          borderColor: "var(--color-primary-border)",
        },
        "&:focus-visible": {
          outline: "2px solid var(--color-primary)",
          outlineOffset: 2,
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: "var(--color-primary-border)",
          color: "primary.main",
          width: 40,
          height: 40,
          fontSize: "0.95rem",
          fontWeight: 700,
        }}
      >
        {customer.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
          {customer}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 0.25, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <FiCalendar size={12} />
            <Typography variant="caption" color="text.secondary">
              {formatDateLabel(eventDate)}
            </Typography>
          </Stack>
          {sessionCount > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <FiClipboard size={12} />
              <Typography variant="caption" color="text.secondary">
                {sessionCount} session{sessionCount !== 1 ? "s" : ""}
              </Typography>
            </Stack>
          )}
          {venue && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <FiMapPin size={12} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {venue}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
      {dayLabel && (
        <Chip
          size="small"
          label={dayLabel}
          color={accent}
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      )}
    </Box>
  );
};

const EmptyState = ({ icon, title, hint }) => (
  <Box sx={{ py: 5, textAlign: "center", color: "text.disabled" }}>
    {icon}
    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
      {title}
    </Typography>
    {hint && <Typography variant="caption">{hint}</Typography>}
  </Box>
);

const SectionHeader = ({ icon, color, title, hint, badge }) => (
  <Stack
    direction="row"
    sx={{
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: `${color}22`,
          color,
          width: 40,
          height: 40,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      </Box>
    </Stack>
    {badge}
  </Stack>
);

const DashboardComponent = ({ loading, orders = [], onEventClick }) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysOut = new Date(today);
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);

    const withDate = orders
      .map((o) => ({
        order: o,
        date: parseEventDate(getActiveEventDate(o)),
      }))
      .filter((entry) => entry.date);

    const todays = [];
    const upcoming = [];
    let completed = 0;

    withDate.forEach(({ order, date }) => {
      if (isCancelledStatus(order.status)) return;
      if (isCompletedStatus(order.status)) {
        completed += 1;
        return;
      }
      const startOfDate = new Date(date);
      startOfDate.setHours(0, 0, 0, 0);

      if (startOfDate.getTime() === today.getTime()) {
        todays.push(order);
      } else if (date > today && date <= sevenDaysOut) {
        upcoming.push(order);
      }
    });

    upcoming.sort((a, b) => {
      const aDate = parseEventDate(getActiveEventDate(a));
      const bDate = parseEventDate(getActiveEventDate(b));
      return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
    });

    return {
      total: orders.length,
      today: todays,
      upcoming,
      completed,
    };
  }, [orders]);

  const todayDayLabel = (order) => {
    const date = parseEventDate(getActiveEventDate(order));
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDate = new Date(date);
    startOfDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
      (startOfDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1) return `In ${diffDays}d`;
    return null;
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader message="Loading dashboard..." />
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header band */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid var(--app-border)",
          background:
            "linear-gradient(135deg, var(--color-primary-soft), rgba(255,255,255,0.6))",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "var(--color-primary)",
                color: "var(--color-primary-contrast)",
                width: 56,
                height: 56,
              }}
            >
              <FiActivity size={26} />
            </Avatar>
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "var(--color-primary)" }}
              >
                Today at a glance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tap any event to jump straight into its details.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
            <Chip
              icon={<FiHome />}
              label={`${stats.today.length} today`}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<FiClock />}
              label={`${stats.upcoming.length} this week`}
              color="info"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Stat tiles */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<FiClipboard size={22} />}
          label="Total Events"
          value={stats.total}
          accent="#6366f1"
          sub="All recorded bookings"
        />
        <StatCard
          icon={<FiHome size={22} />}
          label="Happening Today"
          value={stats.today.length}
          accent="#f59e0b"
          sub={
            stats.today.length === 0
              ? "Calm day"
              : "Check assignments before service"
          }
        />
        <StatCard
          icon={<FiClock size={22} />}
          label="Next 7 Days"
          value={stats.upcoming.length}
          accent="#0ea5e9"
          sub="Excludes today"
        />
        <StatCard
          icon={<FiCheckCircle size={22} />}
          label="Completed"
          value={stats.completed}
          accent="#10b981"
          sub="Marked done"
        />
      </Box>

      {/* Today + upcoming */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
            bgcolor: "background.paper",
          }}
        >
          <SectionHeader
            icon={<FiHome size={20} />}
            color="#d97706"
            title="Today's Events"
            hint="Active service today — click to open"
            badge={
              <Chip
                size="small"
                label={stats.today.length}
                color={stats.today.length > 0 ? "warning" : "default"}
                sx={{ fontWeight: 700 }}
              />
            }
          />
          <Divider sx={{ mb: 2 }} />
          {stats.today.length === 0 ? (
            <EmptyState
              icon={<FiHome size={28} style={{ opacity: 0.4 }} />}
              title="Nothing on the books for today"
              hint="A quiet day — use it to prep for tomorrow."
            />
          ) : (
            <Stack spacing={1.25}>
              {stats.today.map((order) => (
                <EventRow
                  key={`today-${order.id}`}
                  order={order}
                  onClick={onEventClick}
                  dayLabel="Today"
                  accent="warning"
                />
              ))}
            </Stack>
          )}
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
            bgcolor: "background.paper",
          }}
        >
          <SectionHeader
            icon={<FiClock size={20} />}
            color="#0284c7"
            title="Upcoming this Week"
            hint="Bookings within the next 7 days"
            badge={
              <Chip
                size="small"
                label={stats.upcoming.length}
                color={stats.upcoming.length > 0 ? "info" : "default"}
                sx={{ fontWeight: 700 }}
              />
            }
          />
          <Divider sx={{ mb: 2 }} />
          {stats.upcoming.length === 0 ? (
            <EmptyState
              icon={<FiUsers size={28} style={{ opacity: 0.4 }} />}
              title="No upcoming events in the next week"
            />
          ) : (
            <Stack spacing={1.25}>
              {stats.upcoming.slice(0, 8).map((order) => (
                <EventRow
                  key={`upcoming-${order.id}`}
                  order={order}
                  onClick={onEventClick}
                  dayLabel={todayDayLabel(order)}
                  accent="info"
                />
              ))}
            </Stack>
          )}
        </Card>
      </Box>
    </Stack>
  );
};

export default DashboardComponent;
