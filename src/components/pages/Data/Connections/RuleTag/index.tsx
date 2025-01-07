import { Tag, TagTypeEnum } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { TableCellLayout } from "@fluentui/react-components";
import { type RuleDetailItem, RULE_POLICY } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";

function RuleCell({ value }: Readonly<{ value: RuleDetailItem }>) {
  const { t } = useTranslation();

  let content = (
    <Tag type={TagTypeEnum.Warning} value={t(TRANSLATION_KEY.DIRECT)} />
  );

  if (value.policy === RULE_POLICY.Proxy) {
    content = <Tag type={TagTypeEnum.Info} value={t(TRANSLATION_KEY.PROXY)} />;
  }
  if (value.policy === RULE_POLICY.Reject) {
    content = (
      <Tag type={TagTypeEnum.Error} value={t(TRANSLATION_KEY.REJECT)} />
    );
  }

  return <TableCellLayout truncate>{content}</TableCellLayout>;
}

export default RuleCell;
