import RuleTable from "@/components/pages/Rules/RuleTable";
import { CUSTOMIZED_RULE_ID } from "@/utils/constants";
import { Tab, TabList } from "@fluentui/react-components";
import { getRules } from "lux-js-sdk";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

export default function Rules() {
  const [selectedValue, setSelectedValue] =
    useState<string>(CUSTOMIZED_RULE_ID);
  const { t } = useTranslation();
  const [ruleIds, setRuleIds] = useState<string[]>([]);

  useEffect(() => {
    getRules().then((res) => {
      const ids = res.rules.map((item) => item.id);
      setRuleIds([CUSTOMIZED_RULE_ID, ...ids]);
    });
  }, []);

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={selectedValue}
        onTabSelect={(event, data) => {
          setSelectedValue(data.value as string);
        }}
      >
        {ruleIds.map((ruleId) => (
          <Tab id={ruleId} value={ruleId} key={ruleId}>
            {t(ruleId)}
          </Tab>
        ))}
      </TabList>
      <RuleTable id={selectedValue} />
    </div>
  );
}
