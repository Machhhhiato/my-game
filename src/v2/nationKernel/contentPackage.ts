import type { DevelopmentStage, KernelId, NationKernelState, OperationKind, OperationPrerequisites, OperationState } from './types';

/**
 * 内容包不能直接写入某个存档的城市、舰队或对手 ID。
 * 它只声明自己需要哪些“角色”；存档/世界生成器再把角色绑定到实际实体。
 */
export type ContentRoleEntityKind = 'polity' | 'city' | 'fleet' | 'relation';
export type ContentRoleBindings<TRole extends string = string> = Record<TRole, KernelId>;

export interface ContentRoleRequirement<TRole extends string = string> {
  role: TRole;
  entity: ContentRoleEntityKind;
  description: string;
}

export interface ContentOperationPresentation {
  id: KernelId;
  kind: OperationKind;
  title: string;
  summary: string;
  outcome: string;
  staffRequired: number;
  workRequired: number;
  durationDays?: number;
  prerequisites?: OperationPrerequisites;
}

export interface NationContentPackage<TRole extends string = string> {
  id: KernelId;
  stage: DevelopmentStage;
  roleRequirements: readonly ContentRoleRequirement<TRole>[];
  operationDefinitions: (bindings: ContentRoleBindings<TRole>) => readonly ContentOperationPresentation[];
  createOperations: (bindings: ContentRoleBindings<TRole>) => Record<KernelId, OperationState>;
}

export interface ContentPackageInstallResult {
  ok: boolean;
  errors: string[];
  operations: Record<KernelId, OperationState>;
}

function entityExists(state: NationKernelState, entity: ContentRoleEntityKind, id: KernelId): boolean {
  switch (entity) {
    case 'polity': return state.polities[id] != null;
    case 'city': return state.cities[id] != null;
    case 'fleet': return state.fleets[id] != null;
    case 'relation': return state.relations[id] != null;
  }
}

/**
 * 在把内容写入动态存档前，先验证所有角色都指向正确类型的实体，
 * 并阻止两个内容包静默覆盖同一条运行中的操作。
 */
export function installContentPackage<TRole extends string>(
  state: NationKernelState,
  contentPackage: NationContentPackage<TRole>,
  bindings: ContentRoleBindings<TRole>,
): ContentPackageInstallResult {
  const errors: string[] = [];
  for (const requirement of contentPackage.roleRequirements) {
    const id = bindings[requirement.role];
    if (id == null || id === '') {
      errors.push(`${contentPackage.id}: missing role ${requirement.role}`);
    } else if (!entityExists(state, requirement.entity, id)) {
      errors.push(`${contentPackage.id}: role ${requirement.role} must reference an existing ${requirement.entity}`);
    }
  }
  if (errors.length > 0) return { ok: false, errors, operations: {} };

  const operations = contentPackage.createOperations(bindings);
  for (const operationId of Object.keys(operations)) {
    if (state.operations[operationId] != null) errors.push(`${contentPackage.id}: duplicate operation ${operationId}`);
  }
  return { ok: errors.length === 0, errors, operations: errors.length === 0 ? operations : {} };
}
