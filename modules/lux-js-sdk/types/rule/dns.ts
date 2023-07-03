interface Item {
  address: string;
  domains: string[];
}

export interface Dns {
  local: Item;
  remote: Item;
}
