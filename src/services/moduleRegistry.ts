 v0/flow-db-structure
import { DEFAULT_MODULE_STATES, FLOW_MODULES, type ModuleState } from '../core/modules/ModuleRegistry';

export type PlatformModule = (typeof FLOW_MODULES)[number]['key'];
export const moduleRegistry = Object.fromEntries(FLOW_MODULES.map((module) => [module.key, module]));
export function getModule(key: PlatformModule) { return moduleRegistry[key]; }
export function isModuleEnabled(key: PlatformModule, states: Record<string, ModuleState> = DEFAULT_MODULE_STATES) { return states[key] === 'enabled'; }
export type { ModuleState };

export {
	FLOW_MODULES as moduleRegistry,
	DEFAULT_MODULE_STATES,
	getModule,
	isModuleEnabled,
	type FlowModuleDefinition as PlatformModule,
	type ModuleState,
} from '../core/modules/ModuleRegistry';
 main
