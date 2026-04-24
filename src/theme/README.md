# Theme & MUI migration

This directory is the bridge between the app's Redux theme state and the MUI
ThemeProvider. Keep the wiring thin — if a new piece of theme state is needed,
add it to the Redux slice first (so every consumer reads from the same source)
and only then extend the theme factory.

## Flow

1. `App.jsx` fetches the business profile and dispatches
   `setPrimaryColor(hex)` from [`src/redux/themeSlice.js`](../redux/themeSlice.js).
2. [`ThemeBridge.jsx`](./ThemeBridge.jsx) subscribes to `state.theme`,
   calls [`createAppTheme`](./createAppTheme.js), and wraps children in an MUI
   `ThemeProvider`.
3. The same effect mirrors the primary color (and its `contrastText`) to the
   `--color-primary` / `--color-primary-contrast` CSS custom properties. Any
   page still on Tailwind continues to work unchanged during the migration.

## Migrating a page to MUI

Pattern used in [`src/pages/allOrder/AllOrderComponent.jsx`](../pages/allOrder/AllOrderComponent.jsx):

- Replace page-level wrapper divs with `<Paper>` or `<Box>`.
- Headers: `Stack` + `Typography` + `Avatar`/`Box` for the icon tile.
- Buttons: `<Button variant="outlined|contained" color="primary|error">`.
  Use `startIcon` for react-icons.
- Cards/list items: `<Card>` + `<CardContent>` + `<CardActions>`.
- Form inputs: `<TextField>` with `InputAdornment` for leading/trailing icons.
- Date range picker: keep `react-datepicker` for now, wrap it in a `<Box>`
  whose `sx` styles the bare `input` to match MUI. MUI X's free
  `DateRangePicker` is Pro-only, so switching is a separate decision.
- Responsive hide/show: `useMediaQuery(theme.breakpoints.up("md"))` instead
  of Tailwind `md:` classes.

## What NOT to change

- **Controllers** (`*Controller.jsx`) — business logic, API calls, hook usage,
  effect timing. Only the Component below them is rewritten.
- **React Query hooks** in `src/hooks/*` — data layer stays identical.
- **Existing primitives** (`EmptyState`, `Loader`, `FormModal`) — already
  theme-aware via the CSS variables and render fine alongside MUI. No need to
  re-implement them unless you're doing that file deliberately.

## Reading the theme elsewhere

```jsx
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

function Example() {
  const theme = useTheme();                              // MUI palette, shape, spacing
  const primary = useSelector((s) => s.theme.primaryColor);  // raw hex, rarely needed
  return <Box bgcolor="primary.main" color="primary.contrastText" />;
}
```

## Dark mode

Wired but not exposed yet. Dispatch `setMode('dark' | 'light')` or
`toggleMode()` from [`themeSlice`](../redux/themeSlice.js) to flip. Add a
toggle UI wherever you want the user to control it.

## Migration status

- [x] MUI installed + theme provider wired
- [x] Redux `theme` and `ui` slices
- [x] Pilot page: AllOrder list view
- [ ] Quotation, Invoice, Payment History, Expense
- [ ] Vendor, Staff, User, Permissions
- [ ] Dish multi-step form, Edit Dish
- [ ] Category, Stock, Ground management
- [ ] View Ingredient, View Order Details
- [ ] PDF pages (probably leave as-is; they're screen-only render targets)
- [ ] Sidebar + Header (AppBar + Drawer using Redux `ui.sidebarOpen`)
