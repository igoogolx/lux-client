import React, { useState } from "react";
import { Caption1, Subtitle2 } from "@fluentui/react-components";
import { useSelector } from "react-redux";
import styles from "../../index.module.css";
import { RootState } from "../../../../../reducers";
import { MenuItemProps } from "../../../../Core";
import EditItemWithSelectDialog, {
  DnsTypeEnum,
} from "../../../../Core/EditItemWithSelectDialog";

type EditDnsItemProps = {
  items: MenuItemProps[];
  value: string;
  type: DnsTypeEnum;
  onSubmit: (data: { value: string; type: DnsTypeEnum }) => void;
  title: string;
  desc: string;
};

export default function EditDnsItem(props: EditDnsItemProps) {
  const { items, value, onSubmit, title, desc, type } = props;
  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

  return (
    <div className={styles.cardItem}>
      <div className={styles.desc}>
        <Subtitle2>{title}</Subtitle2>
        <Caption1>{desc}</Caption1>
      </div>
      <EditItemWithSelectDialog
        title={title}
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={(value) => {
          onSubmit(value);
        }}
        value={value}
        disabled={isStarted}
        selectorItems={items}
        type={type}
      />
    </div>
  );
}
