export type FlowStoreState = {
  authenticated: boolean;
  adminAuthenticated: boolean;
};

export const initialFlowStore: FlowStoreState = {
  authenticated: false,
  adminAuthenticated: false,
};

// Keep global client state here. Feature-local state stays inside feature hooks/components.
