import { createContext } from "react";

const SensitiveInfoModeContext = createContext({
  enabled: false,
});

export default SensitiveInfoModeContext;
