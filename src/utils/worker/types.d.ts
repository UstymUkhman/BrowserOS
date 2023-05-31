type EventData = { callback: Callback, params?: EventParams };
type EventParams = Record<string, unknown>;
type Callback = (data: unknown) => void;
