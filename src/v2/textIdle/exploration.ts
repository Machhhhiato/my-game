import type { TextExplorationTarget, TextExplorationTargetId } from './types';

/**
 * 探索目标属于战役状态，而非科技/工程目录。每个目标通过稳定地理引用留下
 * 可回接空间层的证据；当前文字试玩只读取方向、发现和完成状态。
 */
export let TEXT_EXPLORATION_TARGETS: Record<TextExplorationTargetId, TextExplorationTarget> = {};

export function installExplorationTargets(targets: TextExplorationTarget[]): void {
  TEXT_EXPLORATION_TARGETS = Object.fromEntries(targets.map((target) => [target.id, target])) as Record<TextExplorationTargetId, TextExplorationTarget>;
}
