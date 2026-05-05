/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiDollarSign,
  FiHome,
  FiMapPin,
  FiPlusCircle,
  FiTrendingUp,
  FiUsers,
  FiXCircle,
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

const formatLongDate = (date) =>
  date
    ? date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

const buildGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

const lowerStatus = (status) => String(status || "").toLowerCase();

const isCompletedStatus = (status) => {
  const s = lowerStatus(status);
  return s === "done" || s === "completed";
};

const isCancelledStatus = (status) => lowerStatus(status) === "cancelled";

// Map status string → MUI chip color so all the status pills agree.
const statusChipMeta = (status) => {
  const s = lowerStatus(status);
  if (s === "done" || s === "completed")
    return { label: "Completed", color: "success" };
  if (s === "cancelled") return { label: "Cancelled", color: "error" };
  if (s === "confirmed" || s === "confirm")
    return { label: "Confirmed", color: "primary" };
  if (s === "pending") return { label: "Pending", color: "warning" };
  if (s === "in_progress" || s === "ongoing")
    return { label: "In progress", color: "info" };
  if (!s) return null;
  return { label: status, color: "default" };
};

// Stat tile — vivid accent ring on hover so the cards feel reactive.
const StatCard = ({ icon, label, value, accent, sub, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: 3,
      border: "1px solid var(--app-border)",
      boxShadow: "var(--app-shadow)",
      bgcolor: "background.paper",
      flex: 1,
      minWidth: 220,
      cursor: onClick ? "pointer" : "default",
      transition:
        "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
      "&:hover": onClick
        ? {
            transform: "translateY(-3px)",
            boxShadow: "0 18px 36px -22px rgba(15, 23, 42, 0.35)",
            borderColor: accent,
          }
        : undefined,
    }}
  >
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: `${accent}1f`,
          color: accent,
          width: 52,
          height: 52,
          boxShadow: `inset 0 0 0 1px ${accent}33`,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}
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

const EventRow = ({ order, onClick, dayLabel, accent = "primary" }) => {
  const eventDate = parseEventDate(getActiveEventDate(order));
  const sessionCount = order?.sessions?.length || 0;
  const venue =
    order?.sessions?.[0]?.venue_name ||
    order?.venue_name ||
    order?.address ||
    "";
  const customer = order?.customer_name || order?.name || "Unnamed event";
  const eventTime =
    order?.sessions?.[0]?.event_time || order?.event_time || "";
  const statusMeta = statusChipMeta(order?.status);

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
        position: "relative",
        p: 1.75,
        pl: 2,
        borderRadius: 2,
        border: "1px solid var(--app-border)",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        bgcolor: "background.paper",
        overflow: "hidden",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: `${accent}.main`,
          opacity: 0.85,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 30px -22px rgba(15, 23, 42, 0.35)",
          borderColor: `${accent}.light`,
          bgcolor: "var(--color-primary-soft)",
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
          width: 44,
          height: 44,
          fontSize: "1rem",
          fontWeight: 700,
        }}
      >
        {customer.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "text.primary" }}
            noWrap
          >
            {customer}
          </Typography>
          {statusMeta && (
            <Chip
              size="small"
              label={statusMeta.label}
              color={statusMeta.color}
              variant="outlined"
              sx={{
                height: 20,
                "& .MuiChip-label": {
                  px: 0.75,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                },
              }}
            />
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mt: 0.5, flexWrap: "wrap", color: "text.secondary" }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <FiCalendar size={12} />
            <Typography variant="caption">
              {formatDateLabel(eventDate)}
              {eventTime ? ` • ${eventTime}` : ""}
            </Typography>
          </Stack>
          {sessionCount > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <FiClipboard size={12} />
              <Typography variant="caption">
                {sessionCount} session{sessionCount !== 1 ? "s" : ""}
              </Typography>
            </Stack>
          )}
          {venue && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <FiMapPin size={12} />
              <Typography variant="caption" noWrap>
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
          sx={{ fontWeight: 700, letterSpacing: 0.2 }}
        />
      )}
      <Box
        sx={{
          color: "text.disabled",
          display: "flex",
          alignItems: "center",
          opacity: 0,
          transform: "translateX(-4px)",
          transition: "opacity 160ms ease, transform 160ms ease",
          ".MuiBox-root:hover > &, [role='button']:hover > &": {
            opacity: 1,
            transform: "translateX(0)",
          },
        }}
      >
        <FiArrowRight size={16} />
      </Box>
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
          bgcolor: `${color}1f`,
          color,
          width: 40,
          height: 40,
          boxShadow: `inset 0 0 0 1px ${color}33`,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
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

const ProgressBlock = ({ label, value, total, color, sub }) => {
  const ratio = total > 0 ? (value / total) * 100 : 0;
  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.75,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box
            sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700 }}
        >
          {value} / {total}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.min(ratio, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: "rgba(15, 23, 42, 0.06)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
          },
        }}
      />
      {sub && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
};

const DashboardComponent = ({
  loading,
  username,
  orders = [],
  onEventClick,
  onQuickAction,
  quickActions = [],
}) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysOut = new Date(today);
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const withDate = orders
      .map((o) => ({
        order: o,
        date: parseEventDate(getActiveEventDate(o)),
      }))
      .filter((entry) => entry.date);

    const todays = [];
    const upcoming = [];
    const thisMonth = [];
    let completed = 0;
    let cancelled = 0;

    withDate.forEach(({ order, date }) => {
      if (date >= startOfMonth && date <= endOfMonth) {
        thisMonth.push(order);
      }
      if (isCancelledStatus(order.status)) {
        cancelled += 1;
        return;
      }
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
      cancelled,
      thisMonthCount: thisMonth.length,
    };
  }, [orders]);

  const dayLabelFor = (order) => {
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

  const greeting = buildGreeting();
  const today = new Date();
  const displayName = username || "there";
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <Stack spacing={3}>
      {/* Hero — greeting band */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 4 },
          borderRadius: 4,
          color: "var(--color-primary-contrast)",
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary), black 25%) 100%)",
          boxShadow: "0 24px 48px -28px rgba(15, 23, 42, 0.55)",
        }}
      >
        {/* Decorative glow */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: -60,
            bottom: -90,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12), rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          sx={{
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "var(--color-primary-contrast)",
                width: 60,
                height: 60,
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(6px)",
              }}
            >
              <FiActivity size={28} />
            </Avatar>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.85,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {formatLongDate(today)}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "var(--color-primary-contrast)",
                }}
              >
                {greeting}, {displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                Tap any event below to jump straight into its details — orders,
                sessions, payments, and assignments live one click away.
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <Chip
              icon={<FiHome />}
              label={`${stats.today.length} today`}
              sx={{
                bgcolor: "rgba(255,255,255,0.16)",
                color: "var(--color-primary-contrast)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "var(--color-primary-contrast)" },
              }}
            />
            <Chip
              icon={<FiClock />}
              label={`${stats.upcoming.length} this week`}
              sx={{
                bgcolor: "rgba(255,255,255,0.16)",
                color: "var(--color-primary-contrast)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "var(--color-primary-contrast)" },
              }}
            />
            <Chip
              icon={<FiCheckCircle />}
              label={`${stats.completed} done`}
              sx={{
                bgcolor: "rgba(255,255,255,0.16)",
                color: "var(--color-primary-contrast)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "var(--color-primary-contrast)" },
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            bgcolor: "background.paper",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              alignItems: "center",
              rowGap: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", pr: 1.5, color: "text.secondary" }}
            >
              <FiPlusCircle size={16} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                Quick actions
              </Typography>
            </Stack>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", sm: "block" }, my: 0.5 }}
            />
            {quickActions.map((action) => (
              <Button
                key={action.key}
                size="small"
                variant="outlined"
                onClick={() => onQuickAction?.(action.to)}
                endIcon={<FiArrowRight size={14} />}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "var(--app-border)",
                  color: "text.primary",
                  bgcolor: "background.paper",
                  px: 1.5,
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    bgcolor: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Stat tiles */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<FiClipboard size={22} />}
          label="Total Events"
          value={stats.total}
          accent="#6366f1"
          sub="All recorded bookings"
          onClick={() => onQuickAction?.("/order-management/all-order")}
        />
        <StatCard
          icon={<FiHome size={22} />}
          label="Happening Today"
          value={stats.today.length}
          accent="#f59e0b"
          sub={
            stats.today.length === 0
              ? "Calm day — prep mode"
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
          sub={
            stats.total > 0 ? `${completionRate}% completion rate` : "No data yet"
          }
        />
      </Box>

      {/* Today + Upcoming + Pulse panel */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
            xl: "1fr 1fr 0.85fr",
          },
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
            hint="Active service today — click any card to open"
            badge={
              <Chip
                size="small"
                label={stats.today.length}
                color={stats.today.length > 0 ? "warning" : "default"}
                sx={{ fontWeight: 800 }}
              />
            }
          />
          <Divider sx={{ mb: 2 }} />
          {stats.today.length === 0 ? (
            <EmptyState
              icon={<FiHome size={32} style={{ opacity: 0.35 }} />}
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
                sx={{ fontWeight: 800 }}
              />
            }
          />
          <Divider sx={{ mb: 2 }} />
          {stats.upcoming.length === 0 ? (
            <EmptyState
              icon={<FiUsers size={32} style={{ opacity: 0.35 }} />}
              title="No upcoming events in the next week"
            />
          ) : (
            <Stack spacing={1.25}>
              {stats.upcoming.slice(0, 8).map((order) => (
                <EventRow
                  key={`upcoming-${order.id}`}
                  order={order}
                  onClick={onEventClick}
                  dayLabel={dayLabelFor(order)}
                  accent="info"
                />
              ))}
            </Stack>
          )}
        </Card>

        {/* Performance pulse — only shows on wider screens (xl breakpoint).
            Gives the dashboard a third "data" panel without forcing every
            viewport to render it. */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
            bgcolor: "background.paper",
            display: { xs: "none", xl: "block" },
          }}
        >
          <SectionHeader
            icon={<FiTrendingUp size={20} />}
            color="#7c3aed"
            title="Pulse"
            hint="Booking health at a glance"
          />
          <Divider sx={{ mb: 2.5 }} />
          <Stack spacing={2.5}>
            <ProgressBlock
              label="Completion rate"
              value={stats.completed}
              total={stats.total || 1}
              color="#10b981"
              sub="Bookings marked done out of all bookings"
            />
            <ProgressBlock
              label="Bookings this month"
              value={stats.thisMonthCount}
              total={stats.total || 1}
              color="#6366f1"
              sub="Share of total falling in the current month"
            />
            <ProgressBlock
              label="Cancellations"
              value={stats.cancelled}
              total={stats.total || 1}
              color="#ef4444"
              sub="Bookings flagged cancelled"
            />
            <Box
              sx={{
                p: 1.75,
                borderRadius: 2,
                bgcolor: "var(--color-primary-soft)",
                border: "1px dashed var(--color-primary-border)",
              }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ alignItems: "center" }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "var(--color-primary)",
                    color: "var(--color-primary-contrast)",
                    width: 36,
                    height: 36,
                  }}
                >
                  <FiDollarSign size={18} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      color: "var(--color-primary)",
                    }}
                  >
                    Tip
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click any card above to drill into bookings, payments, and
                    session-level checklists.
                  </Typography>
                </Box>
              </Stack>
            </Box>
            {stats.cancelled > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  color: "error.main",
                }}
              >
                <FiXCircle size={14} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {stats.cancelled} cancellation
                  {stats.cancelled !== 1 ? "s" : ""} on record
                </Typography>
              </Stack>
            )}
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
};

export default DashboardComponent;
