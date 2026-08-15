// ============ 核心类型定义 ============

export type ResourceId =
  | 'wood'       // 木材
  | 'steel'      // 钢铁
  | 'components' // 零件
  | 'food'       // 食物
  | 'herbal'     // 草药
  | 'rp'         // 研究点
  | 'alloy'      // 合金(第二幕)
  | 'fuel';      // 燃料(第二幕)

export type Resources = Record<ResourceId, number>;

export type SkillId =
  | 'build'     // 建造
  | 'mine'      // 采矿
  | 'farm'      // 种植
  | 'craft'     // 手工
  | 'cook'      // 烹饪
  | 'research'  // 智力
  | 'combat'    // 战斗
  | 'medic';    // 医疗

export type Skills = Record<SkillId, number>;

export type TraitId =
  | 'industrious' // 勤勉
  | 'smart'       // 聪慧
  | 'tough'       // 坚韧
  | 'lazy'        // 懒惰
  | 'glutton'     // 贪吃
  | 'brave'       // 勇敢
  | 'optimist'    // 乐观
  | 'sickly';     // 体弱

export interface TraitDef {
  id: TraitId;
  name: string;
  desc: string;
}

export type ColonistState =
  | 'idle' | 'walk' | 'work' | 'eat' | 'sleep'
  | 'recreate' | 'broken' | 'heal' | 'dead';

export interface Colonist {
  id: string;
  name: string;
  traits: TraitId[];
  skills: Skills;
  needs: { food: number; rest: number; recreation: number; comfort: number };
  mood: number;
  hp: number;
  state: ColonistState;
  /** 当前 tile 坐标(浮点, 用于插值渲染) */
  x: number; y: number;
  /** 上一 tick 坐标(渲染插值用) */
  px: number; py: number;
  /** 移动目标 */
  target: { x: number; y: number } | null;
  /** 当前工作/活动: 建筑 id 或活动名 */
  job: string | null;
  /** 状态持续到 elapsed(秒) */
  until: number;
  /** 精神崩溃冷却到 elapsed */
  breakCd: number;
  /** 生成顺序 */
  seq: number;
}

export type BuildingTypeId =
  | 'shelter'    // 避难所(床)
  | 'farm'       // 农田
  | 'woodcutter' // 伐木场
  | 'mine'       // 矿场
  | 'kitchen'    // 厨房
  | 'workshop'   // 车间
  | 'research'   // 研究台
  | 'solar'      // 太阳能板
  | 'turret'     // 炮塔
  | 'medbay'     // 医疗站
  | 'armory'     // 军械所(持续产出防御)
  | 'launchpad'; // 火箭发射台

export interface Building {
  id: string;
  type: BuildingTypeId;
  x: number; y: number; // tile 左上角
  w: number; h: number;
  hp: number;
  workerId: string | null;
  /** 建造完成时间 elapsed */
  builtAt: number;
}

export type TechLineId =
  | 'survival' | 'industry' | 'military' | 'robot' | 'space'   // 第一幕
  | 'orbit' | 'resource' | 'automation' | 'energy' | 'fleet'    // 第二幕
  | 'physics' | 'society' | 'engineering';                      // 第三幕(三色卡池)

export type Era = 'colony' | 'solar' | 'galaxy';

export interface TechDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  req: string[];
  icon: string;
  line: TechLineId;
  era: Era;
}

export interface ResearchState {
  current: string | null;
  progress: number;
  done: string[];
}

export interface Modifier {
  id: string;
  name: string;
  icon: string;
  until: number; // elapsed 秒
}

export type LogKind = 'event' | 'info' | 'good' | 'bad' | 'warn';

export interface LogEntry {
  id: number;
  t: number;          // 游戏内时间(秒)
  realT: number;      // 现实时间戳(毫秒)
  kind: LogKind;
  icon: string;
  title: string;
  text: string;
}

export interface PendingChoice {
  id: number;
  eventId: string;
  title: string;
  text: string;
  options: { label: string }[];
  expiresAt: number; // elapsed 秒
}

export interface OfflineInfo {
  seconds: number;
  gained: Partial<Resources>;
}

// ============ 太空计划(第一幕→第二幕衔接) ============
export type MissionId =
  | 'sounding1' | 'sounding2' | 'sounding3'
  | 'satellite' | 'lifeorbit' | 'crewed1' | 'eva' | 'docking'
  | 'stationCore' | 'stationLab' | 'stationHab' | 'stationPower'
  | 'dockyard' | 'spaceElevator'
  | 'shipDrive' | 'shipFuel' | 'shipCrew' | 'shipCommand';

export interface MissionDef {
  id: MissionId;
  name: string;
  icon: string;
  /** 真实任务参考(文案打磨用) */
  desc: string;
  req: MissionId[];
  techReq?: string[];
  /** 是否需要火箭发射台建筑 */
  needLaunchpad?: boolean;
  cost: Partial<Resources>;
  /** 基础成功率(0-1),叠加可靠性加成 */
  baseChance: number;
  /** 成功奖励描述 */
  reward: string;
  /** 成功日志 */
  logGood: string;
}

export interface SpaceState {
  done: MissionId[];
  reliability: number;   // 0-100
  failures: number;
  totalLaunches: number;
  nextLaunchAt: number;  // 冷却到 elapsed 秒
}

// ============ 方向自治系统 ============
export type DirectionId = 'survival' | 'balanced' | 'science' | 'industry' | 'military' | 'space';

export interface DirectionDef {
  id: DirectionId;
  name: string;
  icon: string;
  desc: string;
  /** 岗位权重乘数(建筑类型或 'research') */
  jobMult: Partial<Record<BuildingTypeId, number>> & { research?: number };
  /** 研究偏好: 科技线权重 */
  techPref: Partial<Record<TechLineId, number>>;
  /** 自动建造优先级 */
  buildQueue: BuildingTypeId[];
  /** 军事姿态 */
  stance: 'fight' | 'defend' | 'hide';
  /** 储备目标(自适应经济阈值覆盖) */
  stockTargets?: Partial<Record<ResourceId, number>>;
}

// ============ 第一幕: 全球争霸 ============
export type TerrainId = 'ocean' | 'coast' | 'plains' | 'forest' | 'mountain' | 'desert' | 'river' | 'ice';

export type WorldResource = 'wood' | 'steel' | 'food' | 'none';

export interface WorldTile {
  x: number; y: number;
  terrain: TerrainId;
  resource: WorldResource;
  fertile: number;          // 0-1 肥沃度
  ownerId: string | null;   // 归属势力
  settled: boolean;         // 是否有据点
}

export type FactionAttitude = 'hostile' | 'neutral' | 'friendly' | 'ally' | 'dead';

export interface Faction {
  id: string;
  name: string;
  color: string;
  relation: number;         // 与玩家关系 -100~100
  military: number;         // 军力
  attitude: FactionAttitude;
  alive: boolean;
}

export interface Settlement {
  id: string;
  name: string;
  x: number; y: number;
  factionId: string;
  level: number;            // 1-5(图标演化)
  population: number;
}

export interface Road {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  level: number;            // 1-4(泥地/石砖/混凝土/铁路)
}

export interface WorldState {
  w: number;
  h: number;
  tiles: WorldTile[][];
  factions: Faction[];
  settlements: Settlement[];
  roads: Road[];
  /** 玩家已探索视野 */
  reveal: boolean[][];
  /** 玩家势力 id */
  playerId: string;
  /** 是否已统一全球 */
  unified: boolean;
}

// ============ 第二幕: 母星系 ============
export type PlanetType = 'rocky' | 'gas' | 'ice' | 'asteroid' | 'lush';

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  orbitRadius: number;   // 轨道半径(渲染像素)
  orbitSpeed: number;    // 公转角速度(弧度/秒)
  angle: number;         // 当前角度
  size: number;          // 渲染半径
  color: string;
  colony: boolean;       // 是否有地面殖民地(第一幕母星)
}

export type StationKind = 'station' | 'mine' | 'refinery' | 'dock';

export interface OrbitalStation {
  id: string;
  kind: StationKind;
  name: string;
  planetId: string | null; // 挂靠行星(null = 深空)
  level: number;
}

export type ShipClass = 'corvette' | 'destroyer' | 'cruiser' | 'battleship' | 'titan' | 'colossus';

export interface Ship {
  id: string;
  name: string;
  cls: ShipClass;
  power: number;
  hp: number;
}

export interface Fleet {
  id: string;
  name: string;
  ships: Ship[];
  x: number; y: number;  // 星系坐标(渲染)
}

export interface SolarState {
  starName: string;
  planets: Planet[];
  stations: OrbitalStation[];
  fleets: Fleet[];
}

// ============ 第三幕: 银河时代 ============
export interface StarSystem {
  id: string;
  name: string;
  x: number; y: number; // 银河坐标(0-1000)
  links: string[];      // 超空间航道连接的系统 id
  owned: boolean;       // 是否受玩家控制
}

export interface GalaxyState {
  systems: StarSystem[];
  homeId: string;
  /** 天灾危机 */
  crisis: { active: boolean; strength: number; won: boolean };
}

export interface GameState {
  version: number;
  seed: number;
  startedAt: number;   // 真实时间戳
  elapsed: number;      // 已模拟游戏秒
  lastTickReal: number; // 上次保存的真实时间戳
  speed: 0 | 1 | 2 | 4;
  gameOver: boolean;
  launched: boolean;
  /** 时代: 殖民地 / 母星系 */
  era: Era;
  /** 当前方向 */
  direction: DirectionId;
  /** 玩家锁定的研究目标(可选干预, null = 由方向驱动自动选) */
  lockedTech: string | null;
  /** 太空计划进度 */
  space: SpaceState;
  /** 第一幕全球争霸状态 */
  world: WorldState;
  /** 第二幕星系状态 */
  solar: SolarState;
  /** 第三幕银河状态 */
  galaxy: GalaxyState;
  resources: Resources;
  colonists: Colonist[];
  buildings: Building[];
  research: ResearchState;
  modifiers: Modifier[];
  log: LogEntry[];
  pendingChoice: PendingChoice | null;
  nextEventAt: number;  // elapsed
  dayPhase: number;     // 0..1 视觉昼夜
  seq: number;          // id 序列
  stats: Record<string, number>;
  offlineInfo: OfflineInfo | null;
}
