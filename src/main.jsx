import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import ThemeBridge from "./theme/ThemeBridge";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./i18n";

// Bare localhost has no tenant/admin scope, so the app has no business profile
// to load. Redirect to admin.localhost so the platform admin UI mounts instead.
// Tenant subdomains (e.g. tenant1.localhost) are left alone.
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const { protocol, port, pathname, search, hash } = window.location;
  const portSuffix = port ? `:${port}` : "";
  window.location.replace(
    `${protocol}//admin.localhost${portSuffix}${pathname}${search}${hash}`
  );
}

// --- Google Translate × React reconciler interop ---
// The Google Translate page widget walks the DOM and replaces text nodes with
// <font> wrappers in-place. React's reconciler keeps a fiber map pointing at
// the original nodes, so on the next render it tries to remove a child that's
// no longer where it expects — and throws NotFoundError on removeChild /
// insertBefore. The patches below turn those mismatches into no-ops so the
// reconciler can recover instead of unmounting the whole tree.
//
// Must run before ReactDOM.createRoot — that's why this lives in main.jsx.
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function patchedRemoveChild(child) {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function patchedInsertBefore(
    newNode,
    referenceNode,
  ) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null);
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeBridge>
        <App />
      </ThemeBridge>
    </Provider>
  </QueryClientProvider>
);
