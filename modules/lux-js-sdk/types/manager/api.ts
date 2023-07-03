export type Start = () => Promise<void>;

export type Stop = () => Promise<void>;

type Status = {
  isStarted: boolean;
};

export type GetStatus = () => Promise<Status>;
