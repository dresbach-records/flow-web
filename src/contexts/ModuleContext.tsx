import React, { createContext, useContext, useMemo } from 'react';

export const FLOW_MODULES = ['AUTH','SOCIAL','FEED','VIDEO','SHORTS','STORIES','LIVE','MESSAGING','COMMUNITIES','CREATOR','SHOP','SELLERS','ORDERS','PAYMENTS','REWARDS','ADS','MODERATION','REPORTS','NOTIFICATIONS','SEARCH','ANALYTICS','CMS','ADMIN'] as const;
export type FlowModule = typeof FLOW_MODULES[number];
const ModuleContext = createContext<Record<FlowModule, boolean>>({} as Record<FlowModule, boolean>);
export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const modules = useMemo(() => Object.fromEntries(FLOW_MODULES.map(m => [m, true])) as Record<FlowModule, boolean>, []);
  return <ModuleContext.Provider value={modules}>{children}</ModuleContext.Provider>;
}
export function useModule(name: FlowModule) { return useContext(ModuleContext)[name]; }
