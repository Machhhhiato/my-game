import { textAutomationUnlocked } from './simulation';
import type { ReserveId, TextIdleState } from './types';

const RESERVE_NAMES: Record<ReserveId, string> = {
  water: '饮水',
  food: '食物',
  repair: '维修',
};

export interface TextPlaytestStep {
  label: string;
  complete: boolean;
}

export interface TextPlaytestGuidance {
  tone: 'danger' | 'progress' | 'complete';
  title: string;
  summary: string;
  nextAction: string;
  steps: TextPlaytestStep[];
}

/**
 * 首阶段的玩家指引只读取稳定运行时事实；它不依赖剧情名称、内容 ID 或 UI 页面。
 * 后续战役可替换门槛，但仍复用“状态—下一步—阶段检查”的呈现契约。
 */
export function textPlaytestGuidance(state: TextIdleState): TextPlaytestGuidance {
  const safeReserves = (Object.keys(state.reserves) as ReserveId[]).every((reserve) => state.reserves[reserve] >= 10);
  const firstFacility = state.completedProjects.length >= 1;
  const establishedFacilities = state.completedProjects.length >= 3;
  const automation = textAutomationUnlocked(state);

  if (state.failure.level === 'lost') {
    const reserve = state.failure.failedReserve == null ? '保障' : RESERVE_NAMES[state.failure.failedReserve];
    return {
      tone: 'danger',
      title: '共同体已失守',
      summary: `${reserve}连续短缺 ${state.failure.shortageDays} 日，现有组织已无法维持日常生活。`,
      nextAction: '本轮试玩已经结束。重新开始后，优先保住耗尽的保障储备。',
      steps: [],
    };
  }

  if (state.failure.level === 'critical' || state.failure.level === 'strained') {
    const reserve = state.failure.failedReserve == null ? '一项保障储备' : RESERVE_NAMES[state.failure.failedReserve];
    return {
      tone: 'danger',
      title: '先处理保障短缺',
      summary: `${reserve}已经耗尽 ${state.failure.shortageDays} 日。再拖延会导致共同体失守。`,
      nextAction: `下达对应的临时征集，并把该项储备恢复到至少 6 天。`,
      steps: [{ label: `${reserve}恢复到 6 天以上`, complete: false }],
    };
  }

  if (state.developmentStage === 'settled') {
    return {
      tone: 'complete',
      title: '稳定聚居已建立',
      summary: '基础供给已能由设施和固定班次持续维持，首阶段试玩目标已经完成。',
      nextAction: '可以继续观察自动运行，或重新开始尝试不同国策与工程顺序。',
      steps: [
        { label: '三项常设工程投用', complete: establishedFacilities },
        { label: '重复工作已接入自动化', complete: automation },
        { label: '三类储备都保持 10 天以上', complete: safeReserves },
      ],
    };
  }

  if (state.developmentStage === 'recovery') {
    return {
      tone: 'progress',
      title: '恢复安顿：把临时维持变成固定供给',
      summary: '共同体暂时脱离失守风险，但仍需要设施、流程和储备余量来承受波动。',
      nextAction: automation ? '继续投用常设工程并留出储备余量。' : '优先完成能减少重复值守的研究与设施。',
      steps: [
        { label: '投用第一项供给工程', complete: firstFacility },
        { label: '投用三项常设工程', complete: establishedFacilities },
        { label: '完成自动化研究与配套设施', complete: automation },
        { label: '三类储备都保持 10 天以上', complete: safeReserves },
      ],
    };
  }

  return {
    tone: 'progress',
    title: '生存应急：先维持，再建立第一套供给设施',
    summary: '临时征集只能争取时间；探索带回线索和候选地，研究与工程才能开始。',
    nextAction: state.research.id ? '让当前研究完成；工程解锁后先积累建设物资。' : state.discoveries.length === 0 ? '先选择一个方向派出勘察队，带回第一项研究线索。' : '选择已经获得线索的保障研究，优先解锁第一项供给工程。',
    steps: [
      { label: '完成一项保障研究', complete: state.completedTechs.length >= 1 },
      { label: '投用第一项供给工程', complete: firstFacility },
      { label: '三类储备都保持 6 天以上', complete: (Object.keys(state.reserves) as ReserveId[]).every((reserve) => state.reserves[reserve] >= 6) },
    ],
  };
}
