import { type ReactNode } from "react";

import { PasswordWidget } from "@/components/Core";
import {
  EDIT_PROXY_MODAL_MODE,
  EditProxyModal,
} from "@/components/Modal/Proxy/EditProxyModal";
import {
  ENCRYPTION_METHODS,
  SHADOWSOCKS_PLUGIN,
} from "@/components/Modal/Proxy/EditShadowsocksModal/constant.ts";
import { formatSchemaMapStringField } from "@/utils/form.ts";
import type { UiSchema } from "@rjsf/utils";
import { ProxyTypeEnum, type Shadowsocks } from "lux-js-sdk";
import { schema } from "@/components/Modal/Proxy/schema";

const uiSchema: UiSchema = {
  password: {
    "ui:widget": PasswordWidget,
    "ui:autocomplete": "off",
  },
};

type EditShadowsocksModalProps = {
  onClose: () => void;
  initialValue?: Shadowsocks;
  isSelected?: boolean;
};

const INIT_DATA: Shadowsocks = {
  type: ProxyTypeEnum.Shadowsocks,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
  cipher: ENCRYPTION_METHODS[0] as Shadowsocks["cipher"],
};

export function EditShadowsocksModal(
  props: EditShadowsocksModalProps,
): ReactNode {
  const { initialValue, isSelected, onClose } = props;

  const formatFormData = (formData: Record<string, never>) => {
    if (formData["plugin"] === SHADOWSOCKS_PLUGIN.V2RAY) {
      return formatSchemaMapStringField(formData, "plugin-opts.headers");
    }

    return formData;
  };

  const mode = initialValue
    ? EDIT_PROXY_MODAL_MODE.EDIT
    : EDIT_PROXY_MODAL_MODE.ADD;

  return (
    <EditProxyModal
      onClose={onClose}
      initialValue={initialValue || INIT_DATA}
      schema={schema}
      uiSchema={uiSchema}
      isSelected={isSelected}
      mode={mode}
      formatFormData={formatFormData}
    />
  );
}
