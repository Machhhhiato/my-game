import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/**
 * R5 首阶段内容编译器。
 *
 * 这个文件是“内容源”，而不是 UI 文案生成器：每个条目都会编译出稳定 ID、
 * 依赖、设施出口、地图表现、日供给影响和代价。R6 才替换 playerCopyKey 对应的
 * 玩家可见中文；不得由实现层临时拼接玩家文本。
 */

const root = resolve(process.cwd());
const outDir = resolve(root, 'content/r5/stage-1');

const domains = [
  {
    id: 'water', code: 'w', name: '水土与居住', metric: '民生', anchor: '河谷、泉眼与居住区',
    effect: '扩大安全用水和可恢复土地的覆盖，降低水源与居住风险',
    cost: '会占用劳力和土地，并把上游决策的代价传给下游',
    trunks: [
      ['地表与水线测绘', '取水线与临时居住点'], ['可靠净水', '净水与配水设施'], ['土地恢复', '土地修复与试验田'], ['聚居地供水', '街区供排水网络'], ['流域治理', '跨镇灌排与滞洪设施'],
    ],
    routes: [
      ['泉眼与旧管线定位', '污染源与塌陷带判读', '共同坐标与巡查记录'], ['重力过滤与膜材复用', '消毒、旁路与故障隔离', '配水巡检与维修轮班'], ['表土、堆肥与小田改良', '污染隔离与盐碱控制', '试验田登记与恢复工队'], ['蓄水、配水与排污分区', '消防、漏损与旱季备用', '街区接入与公共维护'], ['灌排、滞洪与用水调度', '洪涝、淤积与上游破坏预防', '跨镇水权与巡河机制'],
    ],
  },
  {
    id: 'food', code: 'f', name: '食物与生物', metric: '民生', anchor: '温室、农地与食品节点',
    effect: '提高食物供给的稳定性与灾后恢复速度', cost: '会争夺用水、热量与劳力，并可能压缩野生环境',
    trunks: [['配给与保藏', '保藏与公共配给点'], ['受控栽培', '温室与营养液设施'], ['种源恢复', '种源库与苗圃'], ['区域食品网', '加工、仓储与交换节点'], ['抗灾农业', '耐逆农田与复种系统']],
    routes: [['干燥、发酵与损耗压缩', '储备轮换与污染剔除', '公平配给与家庭登记'], ['温室水培与高效营养液', '病害隔离与能源备用', '苗圃培训与小型复制棚'], ['选种、繁育与地方品种保存', '检疫、隔离与遗传冗余', '种子借还与公共种源库'], ['加工、交换与多地专长生产', '仓储备份与运输损耗控制', '最低储备与跨镇配给协定'], ['耐逆作物与轮作体系', '霜冻、虫害与洪涝预案', '灾后复种与灾年保种制度']],
  },
  {
    id: 'industry', code: 'i', name: '材料与工务', metric: '工业', anchor: '回收场、工坊与工务站',
    effect: '提高材料可用性、设备修复能力和工业连续性', cost: '会集中危险作业、粉尘与材料分配权',
    trunks: [['废料识别与分拣', '回收与危险拆解设施'], ['测量与互换件', '量具、标准件与校准室'], ['修理工务线', '维修工坊与备件周转'], ['小批量制造', '模具与机加工车间'], ['工业维护体系', '区域检验与计划检修网']],
    routes: [['高价值材料回收', '危险废料隔离与拆解安全', '分类规程与材料账'], ['量具、螺纹与常用标准件', '校准、误差追溯与失效排查', '公共标准件库与培训'], ['拆检、返工与备件周转', '粉尘、工伤与关键停机保护', '工务班组与维修档案'], ['模具、机加工与工具复制', '材料质控与工艺失误隔离', '公共采购与产能共享'], ['计划检修与备件预测', '事故复盘与关键设备冗余', '巡回工务、检验与年检']],
  },
  {
    id: 'energy', code: 'e', name: '能源与公用网', metric: '能源', anchor: '电站、热站与管网节点',
    effect: '扩大稳定能源覆盖与关键服务的可恢复能力', cost: '需要长期维护，并可能将污染、噪声或限电压力集中在局部',
    trunks: [['负荷清查', '计量与关键负荷点'], ['安全微电网', '微电网与配电站'], ['热能与储能', '蓄热、保温与储能设施'], ['分布式供能', '地方发电与接入设施'], ['区域公用网调度', '区域调度与黑启动节点']],
    routes: [['用能计量与错峰', '关键负荷识别与应急切断', '公示限电与用能申诉'], ['小型发电与配电优化', '断路、接地与孤岛运行', '社区维护员与分区保电'], ['蓄热、保温与余热利用', '储能失效、泄漏与冬季备用', '热量服务与共享维护'], ['小水电、风机、沼气等组合', '多源切换与设备抗灾', '地方发电收益和接入规则'], ['预测负荷与跨网调剂', '黑启动、事故隔离与保供顺序', '调度透明、服务承诺与申诉']],
  },
  {
    id: 'logistics', code: 'l', name: '交通与后勤', metric: '后勤', anchor: '道路、渡口、仓储与调度站',
    effect: '缩短物资、人员与救援抵达时间，增加替代通路', cost: '会改变地表、扩大控制半径，也可能暴露护运队',
    trunks: [['地面通路测绘', '路线、路标与巡查点'], ['护运规程', '护运、交接与医疗点'], ['道路与桥渡', '道路、涵洞与桥渡工程'], ['仓储节点网', '分层仓与转运节点'], ['区域调度网', '区域运输与救援调度中心']],
    routes: [['路线分级与最短可行路径', '落石、洪水与伏击风险标注', '路标、公共地图与巡查记录'], ['装载、队形与交接效率', '夜行、撤离、急救与失联处理', '向导、护运与医疗岗位轮换'], ['路基、涵洞、桥梁与重载通行', '水毁、塌方与工程抢修', '养护轮值和通行优先级'], ['分层仓、转运与库存轮换', '分散备份、火灾防护与截断预案', '区域最低储备与账目互认'], ['运输、仓储、救援一体化排程', '危机优先级与替代走廊', '共同时间表和地方执行反馈']],
  },
  {
    id: 'security', code: 'q', name: '军事与安全', metric: '军事能力', anchor: '观察哨、救援站与防卫节点',
    effect: '提高预警、护运、救援和统一防务的反应能力', cost: '会消耗训练与装备，并有权限扩大、误报和伤害平民的风险',
    trunks: [['风险观察哨', '观察哨与风险通报点'], ['护运训练', '训练场与护运装备库'], ['工兵与救援', '工兵、消防与抢修站'], ['区域警戒协作', '联合值守与通报网络'], ['公民防卫体系', '民防、避难与后勤设施']],
    routes: [['视野、传感与定期巡查', '误报校正与哨所自保', '民众上报与险情保护'], ['队形、装备与协同行动', '撤离、伤员救治与纪律边界', '轮训、后备人员与共同演练'], ['排险、架桥、消防与抢修', '大型事故指挥与装备冗余', '志愿救援、专业队与互助协定'], ['联合值守、快速通报与巡逻协同', '情报核验、误报处置与泄密防护', '跨镇值守与事件复盘'], ['民防动员、避难和后勤保障', '权限期限、监督与非战斗人员保护', '训练普及与地方救援接口']],
  },
  {
    id: 'admin', code: 'a', name: '行政与财政', metric: '行政', anchor: '登记点、办事处与公共账目室',
    effect: '使人口、服务、预算和统一调度具备可核对的执行基础', cost: '记录与审查会增加文书负担，也可能造成排斥或权力寻租',
    trunks: [['人口与地点登记', '登记点与服务名册'], ['公共账目', '账目室与公开栏'], ['申诉与裁决', '调解室与巡回听证点'], ['服务预算', '预算室与公共采购节点'], ['区域行政协同', '区域办事处与统计站']],
    routes: [['技能、居住和服务需求登记', '隐私、临时身份与错误更正', '巡回登记和共同名册'], ['供给、工程和劳力账目统一', '审计、损耗追溯与反侵吞', '公示、解释与社区核账'], ['调解、仲裁和损害补偿', '程序期限、证据保护与裁决复核', '巡回听证和普通人代理'], ['维护、建设和救援的长期预算', '财政冲击、欠账和优先级调整', '公共采购、地方反馈与预算公开'], ['统一统计、服务与工程接口', '命令失真、地方例外与执行复核', '有限自治执行与跨区协调']],
  },
  {
    id: 'social', code: 'h', name: '健康与社会', metric: '民生', anchor: '诊疗点、学校、工舍与服务站',
    effect: '扩展健康、居住、照护和迁入安置的基本服务能力', cost: '会提高短期建设和用工成本，并把被忽视的差异暴露出来',
    trunks: [['应急诊疗', '诊疗与转运点'], ['公共卫生', '清洁、排污与卫生点'], ['劳动与居住保护', '工舍、安全装备与托护点'], ['基层服务网', '学校、诊疗与照护站'], ['人口流动与安置', '安置点与跨区服务窗口']],
    routes: [['分诊、基础药物与创伤处理', '传染隔离与医疗物资备用', '医疗员培训与转运网络'], ['饮水、清洁和排污日常化', '疫情追踪、隔离与谣言应对', '居民卫生队和公共检查'], ['工时、工舍与事故补偿', '危险作业、儿童照护与住房抗灾', '劳动代表、检查与申诉'], ['社区学校、诊疗和照护覆盖', '偏远点服务中断与人员轮替', '巡回服务和地方服务委员会'], ['技能匹配、住房和就业接续', '大规模迁移、歧视和资源冲突处理', '跨区安置与代表权安排']],
  },
  {
    id: 'science', code: 's', name: '科学与教育', metric: '科研', anchor: '档案室、实验点、学校与检验机构',
    effect: '提高知识保存、训练、实验和可靠性判断能力', cost: '会抽走熟练劳力，且专业门槛可能形成新的排斥',
    trunks: [['档案可读化', '档案室与图纸修复点'], ['学徒训练', '学徒工坊与训练场'], ['可复现实验', '试验室与样本库'], ['公共技术学校', '技术学校与实践基地'], ['标准与检验机构', '检验所与认证站']],
    routes: [['图纸修复、分类与检索', '危险资料隔离与版本核验', '口述史、公共阅览与资料共享'], ['分级技能、实训与考核', '事故教学、错配纠正与安全底线', '名额、公平入学与巡回师傅'], ['样本、对照、仪器和记录体系', '失败复盘、数据审查与伦理边界', '公开复验和民间经验纳入'], ['多职业课程、教材与实践基地', '教学质量、辍学与资源失衡处理', '偏远教学点和成人教育'], ['材料、食品、建筑和数据认证', '召回、问责与独立复核', '小生产者辅导与公开标准']],
  },
  {
    id: 'frontier', code: 'x', name: '生态与外拓', metric: '生态', anchor: '监测线、修复区与联络站',
    effect: '降低生态损害，并把对外接触、勘探与修复纳入共同规则', cost: '会限制短期开发并引发资源权、边界和收益分配冲突',
    trunks: [['灾害与污染勘察', '监测线与风险图点'], ['污染隔离', '封存、拦截与防护设施'], ['修复方法', '修复区、湿地与工队'], ['邻近聚落接触', '联络站与互助节点'], ['区域勘探协约', '联合勘探与协商设施']],
    routes: [['地质、资源与风险样本', '预警阈值、个人防护与数据核验', '风险通报和受影响者参与'], ['封存、拦截与安全处置', '渗漏监控、人员防护与责任追溯', '受害补偿与社区监督'], ['覆土、植物修复和湿地拦截', '修复失败、二次污染与长期监测', '修复工队与受影响地区就业'], ['贸易、翻译、医疗互助与信息交换', '疾病、欺诈、渗透与接触事故处理', '常驻联络人与共同规则'], ['联合测绘、资源调查与通道共享', '边界争议、资源冲突与协约违约处理', '联合议事、收益分配与退出程序']],
  },
];

// 主干图只保存跨领域父节点；同领域父节点由同领域上一层自动生成。
const crossParents = {
  w: [[], ['i1'], ['f1'], ['e2', 'h2'], ['x3', 'a4']],
  f: [['w1'], ['w2'], ['s2'], ['l3', 'a3'], ['x4']],
  i: [[], ['s1'], ['e2'], ['l3'], ['a4', 'h3']],
  e: [['i1'], ['i2'], ['f2'], ['w4'], ['s4', 'a4']],
  l: [['w1', 'a1'], ['q1'], ['i3'], ['f4', 'a3'], ['e5', 'q4']],
  q: [['l1', 'x1'], ['l2'], ['h2'], ['s3', 'a3'], ['a5', 'h4']],
  a: [['s1'], ['i2'], ['h2'], ['e3'], ['l5', 'x4']],
  h: [['w1', 'a1'], ['w2'], ['a3'], ['s3', 'l4'], ['a5', 'f4']],
  s: [[], ['i2'], ['w3'], ['h3', 'a3'], ['i5', 'a4']],
  x: [['w1', 's1'], ['w2'], ['f3', 's3'], ['l3', 'q3'], ['a5', 'q4']],
};

// 重大突破不仅需要“知道”，还需要已经运行的实体能力。每项为已投用工程 ID；
// 这使港口、道路、检验所、取水设施等能够反过来成为科研的真实门槛。
const engineeringGates = {
  w: [[], ['w1-p05', 'i1-p05'], ['w2-p05', 'f1-p08'], ['w3-p18', 'e2-p05', 'h2-p08'], ['w4-p19', 'x3-p16', 'a4-p19']],
  f: [['w1-p08'], ['w2-p05', 'e1-p07'], ['f2-p11', 's2-p11'], ['f3-p19', 'l3-p14', 'a3-p08'], ['f4-p19', 'x4-p14']],
  i: [[], ['i1-p05', 's1-p11'], ['i2-p18', 'e2-p05'], ['i3-p05', 'l3-p14'], ['i4-p18', 'a4-p19', 'h3-p08']],
  e: [['i1-p05'], ['e1-p05', 'i2-p18'], ['e2-p07', 'f2-p08'], ['e3-p05', 'w4-p08'], ['e4-p19', 's4-p18', 'a4-p19']],
  l: [['w1-p01', 'a1-p08'], ['l1-p05', 'q1-p09'], ['i3-p05', 'i2-p18'], ['l3-p14', 'f4-p07', 'a3-p08'], ['l4-p19', 'e5-p19', 'q4-p14']],
  q: [['l1-p01', 'x1-p01'], ['q1-p08', 'l2-p08'], ['q2-p05', 'h2-p08'], ['q3-p18', 's3-p11', 'a3-p08'], ['q4-p19', 'a5-p19', 'h4-p08']],
  a: [['s1-p11'], ['a1-p08', 'i2-p18'], ['a2-p08', 'h2-p08'], ['a3-p19', 'e3-p05'], ['a4-p19', 'l5-p19', 'x4-p14']],
  h: [['w1-p08', 'a1-p08'], ['h1-p08', 'w2-p05'], ['h2-p08', 'a3-p08'], ['h3-p08', 's3-p11', 'l4-p08'], ['h4-p19', 'a5-p19', 'f4-p08']],
  s: [[], ['s1-p11', 'i2-p18'], ['s2-p11', 'w3-p05'], ['s3-p11', 'h3-p08', 'a3-p08'], ['s4-p18', 'i5-p18', 'a4-p19']],
  x: [['w1-p01', 's1-p01'], ['x1-p09', 'w2-p05'], ['x2-p16', 'f3-p11', 's3-p11'], ['x3-p18', 'l3-p14', 'q3-p18'], ['x4-p19', 'a5-p19', 'q4-p14']],
};

// T2 以后，路线中的“稳定作业”和“跨地点复制”也会要求一项邻域技术。
// 只选阶段一的根能力作为支撑，避免把早期树写成循环锁死。
const routeSupportTech = {
  w: 'i1a3', f: 'w1a5', i: 's1a3', e: 'i1a3', l: 'x1a3',
  q: 'l1a3', a: 's1a3', h: 'w1b3', s: 'i1b3', x: 's1a3',
};

const routeKinds = [
  { id: 'a', class: 'production', stages: ['现场辨识', '小范围试验', '稳定作业', '质量核验', '跨地点复制'], proof: '产出能力证明' },
  { id: 'b', class: 'resilience', stages: ['风险识别', '防护试行', '故障处置', '维护与复核', '跨地点韧性证明'], proof: '韧性能力证明' },
  { id: 'c', class: 'diffusion', stages: ['共同记录', '岗位试行', '常规运行', '公开复核', '跨地点服务证明'], proof: '扩散能力证明' },
];

const refinementKinds = [
  ['quality', '质量校核', '使材料、测量或流程可复验'],
  ['maintenance', '维护边界', '明确巡检、故障隔离与维修责任'],
  ['scale', '规模接口', '让设施能与第二处地点兼容并联'],
  ['public', '公共规则', '把培训、申诉和监督纳入长期服务'],
];

const projectPatterns = [
  ['survey', '现场测量站', '勘察与定线', 'ordinaryNode', '调查队', '建立可复查的地点基线', '施工扰动和临时占地'],
  ['design', '设计与样段', '路线试验', 'ordinaryNode', '工务组', '把方案从纸面变成可检查的试行段', '会占用材料并暴露设计错误'],
  ['camp', '施工营地', '施工准备', 'ordinaryNode', '施工队', '形成可持续施工的补给点', '临时营地会加重周边服务压力'],
  ['intake', '基础作业点', '核心作业', 'cityComposite', '专业工队', '提供首个可持续作业能力', '会集中噪声、粉尘或人流'],
  ['core', '核心设施', '主体建设', 'landmark', '联合工程队', '形成关键公共或生产能力', '建设期资源挤占明显'],
  ['network', '首段网络', '连接与输送', 'ordinaryNode', '线路工队', '把核心能力送到第一批使用者', '线路改变地表并需要维护'],
  ['reserve', '储备与缓冲设施', '储备建设', 'cityComposite', '仓储与维护队', '抵抗短期中断', '储备占用空间和维护预算'],
  ['service', '公共服务点', '服务接入', 'cityComposite', '服务站人员', '让居民能直接获得服务', '服务点会暴露分配不均'],
  ['safety', '安全控制站', '防护建设', 'ordinaryNode', '安全与检验队', '减少事故扩散范围', '会限制部分高风险作业'],
  ['depot', '维护工务站', '维护能力', 'cityComposite', '维修班组', '把故障处理变成常规服务', '需要稳定备件与培训'],
  ['training', '训练与交接中心', '岗位复制', 'cityComposite', '学校与工队', '扩大可独立运行的人员数量', '短期抽走熟练工时'],
  ['extension', '第二节点扩建', '规模扩展', 'ordinaryNode', '区域工程队', '将服务延伸至第二处地点', '会引发新旧地点的资源竞争'],
  ['replica', '远端复制点', '跨区复制', 'ordinaryNode', '巡回工程队', '验证能力可跨地区使用', '远端补给和监管成本更高'],
  ['link', '跨区连接线', '区域连通', 'landmark', '线路与桥渡队', '建立跨区的物资或服务通道', '会改变地方通行和安全格局'],
  ['monitor', '监测与复核站', '长期监测', 'ordinaryNode', '观察与检验队', '持续显示设施与环境的真实状态', '公开数据可能引发问责冲突'],
  ['mitigation', '风险缓解设施', '生态与安全缓解', 'landmark', '修复与防护队', '降低对人群和环境的长期损害', '可能压缩可立即开发的土地'],
  ['recovery', '抢修与恢复点', '灾后恢复', 'ordinaryNode', '救援与工务队', '缩短中断后的恢复时间', '需要保持闲置装备和训练'],
  ['upgrade', '标准化改造', '可靠性升级', 'cityComposite', '检验与改造队', '使既有设施达到统一运行标准', '改造期会造成局部停用'],
  ['interconnect', '区域互联枢纽', '统一调度', 'landmark', '区域联合队', '将多个地点纳入可调配的系统', '中心化失误会扩大影响范围'],
  ['oversight', '公共观察与申诉点', '公共监督', 'cityComposite', '服务委员会', '把使用者反馈接入运行与维护', '处理申诉需要持续行政资源'],
];

const projectRequirement = (code, trunk, index) => {
  const base = `${code}${trunk}`;
  if (index < 4) return [base];
  if (index < 10) return [base, `${base}a3`];
  if (index < 15) return [base, `${base}b4`];
  return [base, `${base}c5`, `${base}r${(index % 4) + 1}`];
};

// R10 只消费显式 runtime 合同：不得在 UI 或模拟里按显示名、ID 字符串或卡片类别猜测数值。
const runtimeMetricByDomain = {
  water: 'livelihood', food: 'livelihood', industry: 'industry', energy: 'energy', logistics: 'logistics',
  security: 'military', admin: 'administration', social: 'livelihood', science: 'research', frontier: 'ecology',
};
const runtimeMetricByPolicyTheme = {
  livelihood: 'livelihood', production: 'industry', governance: 'administration', mobility_security: 'logistics', ecology_frontier: 'ecology',
};
const runtimeMagnitude = { low: 0.18, medium: 0.34, high: 0.52 };
const operationalProjectKinds = new Set(['core', 'network', 'reserve', 'service', 'depot', 'extension', 'replica', 'interconnect']);

function technologyRuntime({ id, tier, class: contentClass, capability, unlocks }) {
  return {
    time: { workDays: 10 + tier * 4 + (contentClass === 'breakthrough' ? 6 : 0), milestones: [25, 50, 75, 100] },
    staffing: { researchers: tier >= 4 ? 3 : 2 },
    demand: { researchLoad: contentClass === 'breakthrough' ? 'high' : contentClass === 'branch' ? 'standard' : 'focused' },
    result: { capability, unlocks, automationEligible: id === 'i1a3' },
  };
}

function projectReserveOutput(domain, kind, magnitude) {
  if (!operationalProjectKinds.has(kind)) return {};
  if (domain === 'water') return { water: magnitude === 'high' ? 0.34 : 0.18 };
  if (domain === 'food') return { food: magnitude === 'high' ? 0.34 : 0.18 };
  if (domain === 'industry') return { repair: magnitude === 'high' ? 0.28 : 0.14 };
  return {};
}

function projectRuntime({ id, domain, tier, kind, magnitude, mapClass, facilityState }) {
  const high = magnitude === 'high';
  return {
    time: { workDays: 16 + tier * 7 + (high ? 8 : 0), milestones: [25, 50, 75, 100] },
    staffing: { builders: high ? 5 : 4 },
    demand: { constructionSupply: 8 + tier * 3 + (high ? 3 : magnitude === 'medium' ? 1 : 0), maintenanceLoad: high ? 'high' : magnitude === 'medium' ? 'medium' : 'low' },
    result: {
      reserveOutput: projectReserveOutput(domain, kind, magnitude),
      metricEffects: { [runtimeMetricByDomain[domain]]: runtimeMagnitude[magnitude] },
      facilityState,
      mapClass,
      automationFacility: id === 'i1-p05',
    },
  };
}

function policyRuntime(theme, version, durationDays) {
  const metricEffects = { [runtimeMetricByPolicyTheme[theme]]: 0.22 };
  if (theme === 'mobility_security') metricEffects.military = 0.12;
  if (theme === 'livelihood') metricEffects.stability = 0.08;
  const administrators = version === 'early' ? 1 : version === 'capable' ? 2 : 3;
  return {
    time: { durationDays, milestones: [100] },
    staffing: { administrators },
    demand: { coordinationLoad: administrators },
    result: { metricEffects, reserveOutput: {}, cooldownDays: Math.max(7, Math.round(durationDays * 0.45)) },
  };
}

function buildTechs() {
  const techs = [];
  for (const domain of domains) {
    domain.trunks.forEach(([name, cluster], index) => {
      const tier = index + 1;
      const id = `${domain.code}${tier}`;
      const localParent = tier === 1 ? [] : [`${domain.code}${tier - 1}`];
      // 每一层主干必须消耗上一层两条路线的“能力证明”，不能只靠上一层主干 ID 直冲。
      const routeProofs = tier === 1 ? [] : [`${domain.code}${tier - 1}a5`, `${domain.code}${tier - 1}b5`];
      const parents = [...localParent, ...routeProofs, ...(crossParents[domain.code][index] ?? [])];
      const trunk = {
        id, domain: domain.id, tier, class: 'breakthrough', name,
        prerequisites: parents, engineeringPrerequisites: engineeringGates[domain.code][index], capability: `首次能够以“${cluster}”处理${domain.name}的阶段性问题`,
        unlocks: { projectCluster: cluster, policyTier: tier, nextTrunk: tier < 5 ? `${domain.code}${tier + 1}` : null },
        consequence: domain.cost, playerCopyKey: `r5.tech.${id}`,
      };
      trunk.runtime = technologyRuntime(trunk);
      techs.push(trunk);
      domain.routes[index].forEach((route, routeIndex) => {
        const routeDef = routeKinds[routeIndex];
        routeDef.stages.forEach((stage, stageIndex) => {
          const branchId = `${id}${routeDef.id}${stageIndex + 1}`;
          const crossSupport = tier > 1 && [2, 4].includes(stageIndex) ? [routeSupportTech[domain.code]] : [];
          const branch = {
            id: branchId, domain: domain.id, tier, class: 'branch', route: routeDef.class,
            name: `${route}：${stage}`,
            prerequisites: [...(stageIndex === 0 ? [id] : [`${id}${routeDef.id}${stageIndex}`]), ...crossSupport],
            engineeringPrerequisites: stageIndex === 4 ? engineeringGates[domain.code][index].slice(0, 1) : [],
            capability: stageIndex === 4 ? `${routeDef.proof}：${route}` : `推进“${route}”至${stage}`,
            unlocks: { projectCluster: cluster, route: routeDef.class, proofFor: stageIndex === 4 ? `${domain.code}${tier + 1}` : null },
            consequence: routeIndex === 0 ? `优先扩大${domain.metric}产出，可能挤占维护与安全投入。` : routeIndex === 1 ? `降低事故与中断风险，但会放慢短期扩张。` : `扩大能力覆盖与参与者，增加协调和公开复核成本。`,
            playerCopyKey: `r5.tech.${branchId}`,
          };
          branch.runtime = technologyRuntime(branch);
          techs.push(branch);
        });
      });
      refinementKinds.forEach(([kind, label, capability], refinementIndex) => {
        const refinementId = `${id}r${refinementIndex + 1}`;
        const refinement = {
          id: refinementId, domain: domain.id, tier, class: 'refinement', refinement: kind,
          name: `${name}：${label}`,
          prerequisites: [id, `${id}${routeKinds[refinementIndex % 3].id}3`],
          engineeringPrerequisites: refinementIndex >= 2 ? engineeringGates[domain.code][index].slice(0, 1) : [],
          capability, unlocks: { projectCluster: cluster, facilityStage: refinementIndex + 2, policyTier: tier },
          consequence: `制度化${name}会提高长期维护和公开责任，不能再把故障留给个别人员承担。`,
          playerCopyKey: `r5.tech.${refinementId}`,
        };
        refinement.runtime = technologyRuntime(refinement);
        techs.push(refinement);
      });
    });
  }
  return techs;
}

function buildProjects() {
  const projects = [];
  for (const domain of domains) {
    domain.trunks.forEach(([trunkName, cluster], trunkIndex) => {
      const tier = trunkIndex + 1;
      projectPatterns.forEach((pattern, patternIndex) => {
        const [kind, suffix, phase, mapClass, crew, effect, cost] = pattern;
        const id = `${domain.code}${tier}-p${String(patternIndex + 1).padStart(2, '0')}`;
        const isStrategic = ['link', 'mitigation', 'interconnect'].includes(kind);
        const securityOrDiplomacy = domain.id === 'security' || domain.id === 'frontier';
        const project = {
          id, domain: domain.id, trunk: `${domain.code}${tier}`, kind,
          name: `${trunkName}·${suffix}`, entity: `${cluster}的${suffix}`,
          location: patternIndex >= 12 ? `跨区${domain.anchor}` : domain.anchor,
          builder: crew, beneficiary: domain.metric,
          prerequisites: projectRequirement(domain.code, tier, patternIndex),
          construction: { phase, facilityState: patternIndex < 4 ? '筹备/试运行' : patternIndex < 11 ? '投用' : '扩建/区域运行' },
          map: { class: mapClass, anchorRule: patternIndex >= 12 ? 'regional-link-or-external-site' : 'settlement-or-nearby-site', assetKey: mapClass === 'landmark' ? `r5-${domain.id}-${kind}` : null },
          effects: { metric: domain.metric, statement: effect, dailyUnit: 'LDU', magnitude: patternIndex < 4 ? 'low' : patternIndex < 14 ? 'medium' : 'high' },
          consequence: `${cost}；${domain.cost}`, strategic: isStrategic || securityOrDiplomacy,
          playerCopyKey: `r5.project.${id}`,
        };
        project.runtime = projectRuntime({ id, domain: project.domain, tier, kind, magnitude: project.effects.magnitude, mapClass, facilityState: project.construction.facilityState });
        projects.push(project);
      });
    });
  }
  return projects;
}

const policyFamilies = [
  ['livelihood', '配给', '井口配给整顿', '公共供给排程', '区域基本供给章程', 'w2', 'f4'],
  ['livelihood', '公共卫生', '饮水与清洁轮值', '街区卫生服务', '区域公共卫生规程', 'h2', 'h4'],
  ['livelihood', '劳动安全', '危险作业临时守则', '工务安全与补偿令', '区域劳动与居住保障', 'h3', 'a5'],
  ['livelihood', '迁入安置', '临时来访登记', '安置与服务接续', '跨区迁入成员章程', 'a1', 'h5'],
  ['production', '工务动员', '紧急维修轮班', '公共工务队列', '区域维护优先级制度', 'i3', 'i5'],
  ['production', '技能培训', '现场师傅带训', '学徒岗位计划', '公共技术教育服务', 's2', 's4'],
  ['production', '材料回收', '回收物交付规则', '危险拆解许可', '区域材料循环条例', 'i1', 'i5'],
  ['production', '能源节制', '关键负荷优先表', '社区分区保电', '区域保供与申诉机制', 'e1', 'e5'],
  ['governance', '账目公开', '公共物资告示', '工程与劳力核账日', '区域预算公开制度', 'a2', 'a4'],
  ['governance', '申诉调解', '配给争议临时调解', '工程损害申诉程序', '巡回裁决与复核制度', 'a3', 'a5'],
  ['governance', '地方协作', '邻里事务会议', '街区服务委员会', '有限自治执行章程', 'a1', 'a5'],
  ['governance', '公共采购', '紧急物资询价', '工务公开采购', '区域公共采购与检验制度', 'a2', 's5'],
  ['mobility_security', '护运', '临时同行护送', '标准护运交接', '区域通道安全服务', 'l2', 'q4'],
  ['mobility_security', '灾害救援', '灾后互助轮班', '专业救援优先序', '区域救援与恢复协定', 'q3', 'l5'],
  ['mobility_security', '巡逻', '风险点巡查', '联合值守规则', '公民防卫监督规程', 'q1', 'q5'],
  ['mobility_security', '基础设施守备', '关键设施看护', '设施故障与破坏响应', '区域关键服务防护制度', 'q2', 'e5'],
  ['ecology_frontier', '流域保护', '取水点不破坏约定', '街区节水与排污规则', '跨镇流域共同规约', 'w3', 'w5'],
  ['ecology_frontier', '污染整治', '污染点临时隔离', '修复工队工作规则', '区域污染责任与补偿制度', 'x2', 'x3'],
  ['ecology_frontier', '勘探协约', '外出勘察登记', '邻近聚落接触准则', '区域勘探收益与退出协约', 'x1', 'x5'],
  ['ecology_frontier', '生态补偿', '施工损害记录', '受影响地块修复承诺', '区域生态补偿与复核规则', 'w3', 'x3'],
];

function buildPolicies() {
  return policyFamilies.flatMap(([theme, family, early, capable, institutional, earlyTech, finalTech], familyIndex) => [
    ['early', early, [earlyTech], 21, '当前聚居地与直接服务对象', '以明确优先序集中有限能力', '挤占未被列入优先序的需求，并需要公开解释', '到期复核、续期或归档', `policy-${String(familyIndex + 1).padStart(2, '0')}-capable`],
    ['capable', capable, [earlyTech, `${earlyTech}-p08`], 45, '聚居地、外拓点与对应服务人员', '把临时规则接入稳定设施和岗位', '增加维护、记录和申诉处理负担', '旧版本自动归档；按绩效转入制度版本或撤销', `policy-${String(familyIndex + 1).padStart(2, '0')}-institutional`],
    ['institutional', institutional, [finalTech, `${finalTech}-p19`], 90, '区域内适用地点；保留现场执行例外申报', '让统一调配拥有长期、可审计的执行接口', '规则过硬会压制现场知识，必须保留复核与例外渠道', '按区域评估续行、修订或废止', null],
  ].map(([version, name, prerequisites, durationDays, target, benefit, cost, endResult, upgradesTo]) => ({
    id: `policy-${String(familyIndex + 1).padStart(2, '0')}-${version}`,
    familyId: `policy-${String(familyIndex + 1).padStart(2, '0')}`,
    theme, family, version, name, prerequisites, durationDays, target, benefit, cost, endResult, upgradesTo,
    runtime: policyRuntime(theme, version, durationDays),
    playerCopyKey: `r5.policy.${familyIndex + 1}.${version}`,
  })));
}

function buildMapManifest(projects) {
  return projects.map((project) => ({
    projectId: project.id,
    mapClass: project.map.class,
    presentation: project.map.class === 'cityComposite' ? '推进通用城市阶段、道路/管网或服务光点；不单独绘制' : project.map.class === 'ordinaryNode' ? '名称旗帜、规模圈和矢量线路；默认不单独绘制' : '独立地标候选：需施工序列与投用季节变体',
    assetFamily: project.map.assetKey,
    terrainRule: project.location,
    perProjectImageCount: 0,
  }));
}

function buildMapAssetFamilies(mapManifest) {
  return [...new Set(mapManifest.map((entry) => entry.assetFamily).filter(Boolean))].map((assetFamily) => ({
    assetFamily,
    appliesToProjectCount: mapManifest.filter((entry) => entry.assetFamily === assetFamily).length,
    scope: '同一设施类型跨地点复用；项目本身仅提供旗帜、规模圈、施工状态与名称。',
    requiredImages: [
      'foundation', 'structure', 'commissioning', 'operational',
      'operational-clear', 'operational-rain', 'operational-snow', 'operational-dust',
    ],
    imageCount: 8,
    status: 'R5 清单冻结；等待 R6 玩家文字与后续地图美术门批准后由 Codex 统一制作。',
  }));
}

function assert(condition, message) { if (!condition) throw new Error(`R5 内容校验失败：${message}`); }

function validate({ techs, projects, policies, mapManifest, mapAssetFamilies }) {
  assert(techs.length === 1000, `科技数量应为 1000，实际 ${techs.length}`);
  assert(projects.length === 1000, `工程数量应为 1000，实际 ${projects.length}`);
  assert(policies.length === 60, `政策版本数量应为 60，实际 ${policies.length}`);
  assert(new Set(techs.map((x) => x.id)).size === techs.length, '科技 ID 重复');
  assert(new Set(projects.map((x) => x.id)).size === projects.length, '工程 ID 重复');
  assert(techs.filter((x) => x.class === 'breakthrough').length === 50, '主干科技不是 50 项');
  assert(techs.filter((x) => x.class === 'branch').length === 750, '分支科技不是 750 项');
  assert(techs.filter((x) => x.class === 'refinement').length === 200, '分级科技不是 200 项');
  for (const domain of domains) assert(techs.filter((x) => x.domain === domain.id).length === 100, `${domain.name} 不是 100 项`);
  const ids = new Set(techs.map((x) => x.id));
  const projectIds = new Set(projects.map((x) => x.id));
  for (const tech of techs) {
    assert(tech.runtime?.time?.workDays > 0 && tech.runtime.time.milestones?.at(-1) === 100 && tech.runtime.staffing?.researchers > 0 && tech.runtime.result?.capability, `${tech.id} 缺少科技运行时字段`);
    for (const prerequisite of tech.prerequisites) assert(ids.has(prerequisite) || prerequisite.includes('基础维护手册'), `${tech.id} 缺少科技前置 ${prerequisite}`);
    for (const prerequisite of tech.engineeringPrerequisites ?? []) assert(projectIds.has(prerequisite), `${tech.id} 缺少工程前置 ${prerequisite}`);
  }
  for (const project of projects) {
    assert(project.location && project.entity && project.builder && project.map.class && project.consequence, `${project.id} 缺少工程硬字段`);
    assert(project.runtime?.time?.workDays > 0 && project.runtime.time.milestones?.at(-1) === 100 && project.runtime.staffing?.builders > 0 && project.runtime.demand?.constructionSupply > 0 && project.runtime.result?.facilityState && project.runtime.result?.mapClass, `${project.id} 缺少工程运行时字段`);
    for (const prerequisite of project.prerequisites) assert(ids.has(prerequisite), `${project.id} 缺少科技前置 ${prerequisite}`);
  }
  // 科研与工程共同构成能力图：科技可以要求设施已投用，工程也会反过来要求科技。
  const reachableTech = new Set();
  const reachableProjects = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const tech of techs) {
      if (!reachableTech.has(tech.id) && tech.prerequisites.every((id) => reachableTech.has(id)) && (tech.engineeringPrerequisites ?? []).every((id) => reachableProjects.has(id))) {
        reachableTech.add(tech.id);
        changed = true;
      }
    }
    for (const project of projects) {
      if (!reachableProjects.has(project.id) && project.prerequisites.every((id) => reachableTech.has(id))) {
        reachableProjects.add(project.id);
        changed = true;
      }
    }
  }
  assert(reachableTech.size === techs.length, `科技工程能力图有 ${techs.length - reachableTech.size} 项不可达科技`);
  assert(reachableProjects.size === projects.length, `科技工程能力图有 ${projects.length - reachableProjects.size} 项不可达工程`);
  const crossRegion = projects.filter((x) => x.location.startsWith('跨区')).length / projects.length;
  const publicOrEcology = projects.filter((x) => ['service', 'safety', 'training', 'monitor', 'mitigation', 'oversight'].includes(x.kind)).length / projects.length;
  const securityOrDiplomacy = projects.filter((x) => x.strategic).length / projects.length;
  assert(crossRegion >= 0.30, `跨区工程比例不足 30%，实际 ${(crossRegion * 100).toFixed(1)}%`);
  assert(publicOrEcology >= 0.20, `公共/生态工程比例不足 20%，实际 ${(publicOrEcology * 100).toFixed(1)}%`);
  assert(securityOrDiplomacy >= 0.15, `安全/外交工程比例不足 15%，实际 ${(securityOrDiplomacy * 100).toFixed(1)}%`);
  assert(new Set(policies.map((x) => x.familyId)).size === 20, '政策家族不是 20 个');
  for (const policy of policies) assert(policy.runtime?.time?.durationDays === policy.durationDays && policy.runtime.staffing?.administrators > 0 && policy.runtime.demand?.coordinationLoad > 0 && policy.runtime.result?.cooldownDays > 0, `${policy.id} 缺少政策运行时字段`);
  for (const familyId of new Set(policies.map((x) => x.familyId))) assert(policies.filter((x) => x.familyId === familyId).length === 3, `${familyId} 没有三个政策版本`);
  assert(mapManifest.length === projects.length, '地图表现清单与工程目录数量不一致');
  assert(mapAssetFamilies.length === 40, `地标资产家族应为 40 个，实际 ${mapAssetFamilies.length}`);
  assert(mapAssetFamilies.every((family) => family.imageCount === 8 && family.appliesToProjectCount === 5), '地标资产复用规格不一致');
  return { crossRegion, publicOrEcology, securityOrDiplomacy };
}

const techs = buildTechs();
const projects = buildProjects();
const policies = buildPolicies();
const mapManifest = buildMapManifest(projects);
const mapAssetFamilies = buildMapAssetFamilies(mapManifest);
const ratios = validate({ techs, projects, policies, mapManifest, mapAssetFamilies });
await mkdir(outDir, { recursive: true });
await Promise.all([
  writeFile(resolve(outDir, 'tech-catalog.json'), `${JSON.stringify(techs, null, 2)}\n`),
  writeFile(resolve(outDir, 'project-catalog.json'), `${JSON.stringify(projects, null, 2)}\n`),
  writeFile(resolve(outDir, 'policy-catalog.json'), `${JSON.stringify(policies, null, 2)}\n`),
  writeFile(resolve(outDir, 'map-asset-manifest.json'), `${JSON.stringify(mapManifest, null, 2)}\n`),
  writeFile(resolve(outDir, 'map-asset-family-manifest.json'), `${JSON.stringify(mapAssetFamilies, null, 2)}\n`),
  writeFile(resolve(outDir, 'summary.json'), `${JSON.stringify({ stage: 'stage-1', technologyCount: techs.length, projectCount: projects.length, policyFamilyCount: 20, policyVersionCount: policies.length, mapManifestCount: mapManifest.length, mapAssetFamilyCount: mapAssetFamilies.length, reusableLandmarkImageCount: mapAssetFamilies.reduce((sum, family) => sum + family.imageCount, 0), ratios }, null, 2)}\n`),
]);
console.log(`R5 stage-1 catalog built: ${techs.length} technologies, ${projects.length} projects, ${policies.length} policy versions.`);
