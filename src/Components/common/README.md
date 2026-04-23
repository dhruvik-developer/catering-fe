# Common UI primitives

Reusable building blocks. Prefer these over ad-hoc Tailwind classes so pages stay visually consistent.

## `Button`

Variants: `primary` (default), `secondary`, `ghost`, `soft`, `danger`, `danger-ghost`.
Sizes: `sm`, `md` (default), `lg`.

```jsx
import Button from "../common/Button";
import { FiPlus } from "react-icons/fi";

<Button leftIcon={<FiPlus size={16} />} onClick={handleAdd}>
  Add Vendor
</Button>

<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
```

Use `loading` for async operations — it shows a spinner and disables the button. Use `fullWidth` in forms.

## `Card`

Padded surface container with the repo's standard radius, border and shadow.

```jsx
import Card from "../common/Card";

<Card padding="md" hoverable>
  ...
</Card>
```

Pass `padding="none"` when the child needs to render edge-to-edge.

## `PageHeader`

Standard page-top header with icon, title, subtitle and an actions slot.

```jsx
import PageHeader from "../common/PageHeader";
import { FiUsers } from "react-icons/fi";

<PageHeader
  icon={<FiUsers size={22} />}
  title="Vendors"
  subtitle={`${vendors.length} registered`}
  actions={<Button leftIcon={<FiPlus />}>Add Vendor</Button>}
  filters={<SearchInput ... />}
/>
```

## `Badge`

Status/label pill.

Variants: `primary`, `success`, `danger`, `warning`, `neutral`.
Sizes: `sm`, `md`.

```jsx
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

## `EmptyState`

Friendly fallback when a list/grid has no data.

```jsx
import EmptyState from "../common/EmptyState";
import { FiClipboard } from "react-icons/fi";

<EmptyState
  icon={<FiClipboard size={24} />}
  title="No Orders Yet"
  message="Orders will appear here once created."
  action={<Button onClick={handleAdd}>Add Order</Button>}
/>
```

## Existing primitives also in this folder

- `FormModal` — mobile-safe modal (full-height with inner scroll on phones).
- `Loader` — animated loader with optional message / fullScreen mode.
- `DeleteConfirmation` — SweetAlert-based confirmation helper.

## When to roll your own

Inline Tailwind classes are still fine for:
- One-off marketing sections or dashboards with a unique look.
- Small icon-only buttons inside tables (2-3 per row).

If you find yourself copy-pasting the same classes more than twice, add a variant here instead.
