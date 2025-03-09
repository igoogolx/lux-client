import { Nav } from "@/components/Nav";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  useRestoreFocusSource,
  useRestoreFocusTarget,
} from "@fluentui/react-components";
import { Dismiss24Regular, NavigationFilled } from "@fluentui/react-icons";
import * as React from "react";
import styles from "./index.module.css";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Overlay Drawer will handle focus by default, but inline Drawers need manual focus restoration attributes, if applicable
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const restoreFocusSourceAttributes = useRestoreFocusSource();

  return (
    <div className={styles.container}>
      <Drawer
        {...restoreFocusSourceAttributes}
        type={"overlay"}
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsOpen(false)}
              />
            }
          ></DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <div className={styles.nav}>
            <Nav
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false);
                }
              }}
            />
          </div>
        </DrawerBody>
      </Drawer>

      <Button
        appearance="transparent"
        {...restoreFocusTargetAttributes}
        icon={<NavigationFilled />}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
};

export default MobileNav;
