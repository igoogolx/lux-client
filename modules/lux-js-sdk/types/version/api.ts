export type VersionRes = {
  version: string;
};

export type GetVersion = () => Promise<VersionRes>;
