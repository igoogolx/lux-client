interface Item {
  proxy: string[];
  bypass: string[];
}

export interface Ip {
  subnet: Item;
  domain: Item;
  region: Item;
  defaultProxy: boolean;
}
