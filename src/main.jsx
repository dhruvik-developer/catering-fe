import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import ThemeBridge from "./theme/ThemeBridge";
import App from "./App";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeBridge>
        <App />
      </ThemeBridge>
    </Provider>
  </QueryClientProvider>
);
