import { useTranslation } from "react-i18next";
import React from "react";
import { ConnRuleEnum } from "lux-js-sdk";
import { Tag, TagTypeEnum } from "../../../Core";
import { TRANSLATION_KEY } from "../../../../i18n/locales/key";

function RuleCell({ value }: { value: number }) {
  const { t } = useTranslation();

  if (value === ConnRuleEnum.Proxy) {
    return <Tag type={TagTypeEnum.Info} value={t(TRANSLATION_KEY.PROXY)} />;
  }
  return <Tag type={TagTypeEnum.Warning} value={t(TRANSLATION_KEY.DIRECT)} />;
}

export default RuleCell;
