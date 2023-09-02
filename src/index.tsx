import "./i18n";
import * as React from "react";
import { useMemo, useState } from "react";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";
import { init } from "lux-js-sdk";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { getHubAddress, stringAddress } from "./utils/hubAddress";
import { ThemeContext, ThemeEnum } from "./utils/theme";
import { App } from "./App";
import { store } from "./reducers";

const hubAddress = getHubAddress();
init(stringAddress(hubAddress));

function Root() {
  const [theme, setTheme] = useState(ThemeEnum.Light);
  const themeContextValue = useMemo(() => ({ setTheme, theme }), [theme]);
  return (
    <Provider store={store}>
      <Router>
        <ThemeContext.Provider value={themeContextValue}>
          <FluentProvider
            theme={theme === ThemeEnum.Light ? webLightTheme : webDarkTheme}
            style={{ width: "100%" }}
          >
            <App />
          </FluentProvider>
        </ThemeContext.Provider>
      </Router>
    </Provider>
  );
}

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
root.render(<Root />);
