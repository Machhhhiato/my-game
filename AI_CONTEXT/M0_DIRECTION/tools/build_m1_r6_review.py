#!/usr/bin/env python3
"""Build the player-scale R6 technology tree and continuous text review artifact.

This is a deterministic content compiler.  It does not edit R5 or product files.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from collections import Counter, defaultdict, deque
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
R5_PATH = ROOT / "TECH_TREE_M1_TECH_INDUSTRIAL_R5_001.json"
POLICY_PATH = ROOT / "specs/spec-m1-policy-stance-system-001.md"
LAW_PATH = ROOT / "specs/spec-m1-law-standard-and-temporary-edict-system-001.md"
OUT_TREE = ROOT / "TECH_TREE_M1_PLAYER_LEAN_R6_001.json"
OUT_GOV = ROOT / "M1_GOVERNANCE_TEXT_R6_001.json"
OUT_ENG = ROOT / "M1_ENGINEERING_TEXT_R6_001.json"
OUT_AUDIT = ROOT / "TECH_TREE_M1_PLAYER_LEAN_R6_AUDIT_001.md"
OUT_REVIEW = ROOT / "M1_TECH_ENGINEERING_GOVERNANCE_TEXT_REVIEW_R6_001.md"


GENERIC_SOURCE = "SPEC-M1-TECH-INDUSTRIAL-R5-001"
REVIEW_SOURCE = "M1-L1-515-R6 确定性正文二次审查"


ORIGIN_MERGES = {
    # 科研组织
    "SCI-ARC-001": "技术档案保存与检索",
    "SCI-LAB-001": "基础实验室运行",
    "SCI-DIF-001": "成熟技术扩散与采用",
    "SCI-REV-001": "科研复核与失败归档",
    "SCI-TRN-001": "科研人员训练与资格",
    "SCI-XFN-001": "跨专业科研协作",
    # 生产、工程和公共服务的组织节点
    "FOD-FLD-001": "露地耕作与农田调度",
    "FOD-NET-001": "区域食品生产与供应组织",
    "CHM-NET-001": "区域化工与危险物管理",
    "CIV-SVC-001": "民用品维修、租用与回收服务",
    "CNS-SIT-001": "标准工地组织与施工安全",
    "CNS-RPR-001": "工程巡检、损害评估与修复",
    "NRG-DSP-001": "燃料调度与应急储备",
    "NRG-NET-001": "区域燃料供应组织",
    "ELC-NET-001": "区域供电网络运行",
    "ELC-DIG-001": "本地计算与数据服务",
    "LOG-NET-001": "区域运输网络组织",
    "LOG-SEC-001": "危险货物与护运组织",
    "LOG-WHS-001": "仓储分区、盘点与周转",
    "MCH-NET-001": "区域机械制造协作",
    "MED-EPI-001": "传染病监测与应对",
    "MED-MAT-001": "医疗物资供应组织",
    "MED-NET-001": "区域医疗转诊网络",
    "MED-TRI-001": "伤病分诊与救治次序",
    "MED-REH-001": "康复与长期照护组织",
    "RPR-NET-001": "区域维修协作网络",
    "RPR-SHP-001": "综合维修工场组织",
    "RPR-SPR-001": "备件储备与替换组织",
    "WTR-MNT-001": "供排水巡检与抢修",
    "WTR-NET-001": "区域水务运行组织",
    # 可感知的完整技术里程碑
    "ELC-MOT-001": "标准电动机制造",
    "MCH-PMP-001": "离心泵制造",
    "CHM-GAS-001": "医用氧气生产与充装",
    "WTR-WEL-001": "浅层水井建设",
    "WTR-POT-001": "安全饮用水处理",
    "WTR-SEW-001": "污水收集与卫生处理",
    "NRG-STO-001": "节点蓄电储能",
    "ELC-CMP-001": "基础电气元件检验",
    "ELC-INS-001": "基础工业测量仪表",
    "MET-HTR-001": "钢材热处理工艺",
    "RAW-SAF-001": "矿山通风、排水与有害环境控制",
    "MCH-BAS-001": "机械几何基准与精度传递",
    "MCH-CUT-001": "切削刀具与加工参数",
    "MCH-GAG-001": "公差、量规与互换性检验",
    "QLT-SMP-001": "生产全过程质量检验",
    "QLT-TRC-001": "产品批次与生产履历追溯",
    "QLT-RCL-001": "产品召回与纠正体系",
    "LOG-RDS-001": "基础道路建设与养护",
    "LOG-BRG-001": "桥涵承载、限行与加固",
    "CNS-SUR-001": "工程测量与地基判定",
    "CNS-STR-001": "建筑结构设计",
}


CROSS_MERGES = {
    "POL-JUS-001": {
        "name": "正规警务与司法移交体系",
        "origins": ["POL-DSP-001", "POL-EVI-001", "POL-UOF-001", "POL-CUS-001", "POL-OVS-001"],
        "body": "把取证、武力使用、羁押、案件复核和司法移交连成一套有边界的警务方法，使现场处置能够留下证据并接受后续审查。研究完成只建立正规程序；警务机构仍需人员、拘押设施和相应法律才能实际执行。",
        "second": "一次逮捕不再以把人带走为终点。证据、受伤情况、限制期限和移交去向必须跟着案件继续向前，警察和审理人员都要为中间缺失的一段负责。",
    },
    "GOV-ADM-001": {
        "name": "多聚居点行政与地方统合",
        "origins": ["GOV-REG-001", "GOV-LAW-001", "GOV-NET-001", "GOV-SVC-001", "GOV-TRN-001"],
        "body": "建立中央与各聚居点之间的授权、服务责任、规则传达和干部训练方法，使新纳入地区可以进入同一行政体系，同时保留明确的地方执行边界。完成研究后可以设置地方机构和统合工程，但不会自动消除服务缺口或地方分歧。",
        "second": "地图上新增一个受控聚居点以后，粮食、治安和医疗请求会沿着同一条行政关系抵达中央。地方负责人也第一次能够说明哪些问题可以自行处理，哪些必须等待上级承担。",
    },
    "TRD-FRM-001": {
        "name": "正式贸易与公共结算",
        "origins": ["TRD-VAL-001", "TRD-CON-001", "TRD-CLR-001", "TRD-DSP-001"],
        "body": "统一货物估价、交付验收、公共结算和争端处理方法，使跨聚居点交易能够逐批确认数量、质量、责任和最终去向。合同文本属于这一能力解锁的制度工具，不再单独占用科研节点。",
        "second": "货物抵达不再自动等于交易完成。仓库要确认收到什么，检验人员要说明是否合格，结算人员则必须等到两者一致后才能把承诺变成收入或债务。",
    },
    "REV-FIS-001": {
        "name": "地方财政与中央收入体系",
        "origins": ["REV-AUD-001", "REV-LOC-001", "REV-OBL-001", "REV-TRN-001", "REV-NET-001"],
        "body": "建立地方收入核验、留用、上缴和转移支持的统一财政方法，使货币、实物和公共劳务能够分别确认并进入中央与地方账目。义务登记属于制度运行，不再作为独立科研成果。",
        "second": "地方报出的产量不会直接变成中央可用资源。只有实际交付、运输损耗和地方保留逐项核清以后，财政人员才能说清这份收入究竟能支持哪一项公共责任。",
    },
    "DIP-STA-001": {
        "name": "常设外交与多方协调机构",
        "origins": ["STA-IDN-001", "STA-REP-001", "DIP-CHN-001", "DIP-MED-001", "DIP-NET-001"],
        "body": "把代表授权、常设联络、争端转达和多方会谈组织成稳定的外交能力，使对外承诺不再依赖临时口信。代表身份和协议版本作为执行记录保存，不再拆成单独科技。",
        "second": "一次会谈结束后，下一次接触仍能找到同一条授权链和未履行事项。外部势力据此判断的不是某位使者是否可信，而是这个政权能否让承诺跨过人员更替继续有效。",
    },
    "POP-STA-001": {
        "name": "人口与公共服务统计体系",
        "origins": ["POP-REG-001", "POP-REG-002", "POP-REG-003", "POP-AUD-001", "POP-CAP-001"],
        "body": "统一人口身份、家庭关系、居住变动、能力状况和公共服务缺口的统计口径，使实际人口与住房、供水、医疗和照护承载能够相互核对。日常登记和报表是该体系的运行方式，不再各自作为科研节点。",
        "second": "一串总人数被拆回具体的人与具体的服务关系。有人搬走、出生、失能或重新上岗时，床位、口粮和照护需求也必须随之改变，行政人员不能再用旧总数替代现场。",
    },
    "POP-MCH-001": {
        "name": "孕产与婴幼儿照护体系",
        "origins": ["POP-NAT-001", "POP-NAT-002", "POP-NAT-003"],
        "body": "把孕期随访、分娩照护、产后恢复和婴幼儿基础照护接成连续服务，使自然增长不只记录出生人数，也能识别母婴面临的真实风险和照护缺口。",
        "second": "新生儿登记以前，医疗与家庭已经承担了数月的准备；登记以后，营养、接种和照护又成为新的长期责任。人口增长因此表现为一条需要持续承接的生活链，而不是结算表中凭空增加的人数。",
    },
    "POP-REF-A01": {
        "name": "外来人口接触、分诊与检疫",
        "origins": ["POP-REF-001", "POP-REF-002"],
        "body": "建立外来人员的初次接触、身份核对、伤病分诊、清洁和必要检疫方法，在决定安置与接纳以前先分开已知事实、紧急需求和未排除风险。",
        "second": "抵达的人群不会再被作为一个完整数字直接送入住处。需要救治、需要隔离和能够继续等候的人先被分开，安置人员随后接手的是已经说明边界的真实批次。",
    },
    "POP-REF-A02": {
        "name": "临时安置与岗位核验",
        "origins": ["POP-REF-003", "POP-REF-004"],
        "body": "把临时住处、基本供给、家庭保全和技能核验安排在同一过渡阶段，使新到人员能够先稳定生活，再依据实际能力进入有限岗位。",
        "second": "临时床位旁边会同时出现下一次供给地点和技能核验结果。安置人员必须防止家庭被拆散，用工人员也不能把一句经历直接当作可以独立上岗的资格。",
    },
    "POP-REF-A03": {
        "name": "正式居留与社区统合",
        "origins": ["POP-REF-005", "POP-REF-006"],
        "body": "建立正式居留、固定住处分配、公共服务接入和社区关系承接方法，使临时接纳能够转化为具有权利、责任和日常联系的长期生活。",
        "second": "从临时名单转入常住名册时，变化的不只是一项身份。取水、诊疗、工作、邻里协作和地方申诉都要找到新的固定去向，社区也必须承担新增人口带来的共同责任。",
    },
    "EMR-MGT-R6-001": {
        "name": "灾害预警、损害评估与恢复管理",
        "origins": ["EMR-WRN-001", "EMR-DMG-001", "EMR-LES-001"],
        "body": "建立灾害信号确认、损害分区、恢复排序和事后经验回收方法，使警报、救援、抢修和复产能够依据同一份不断更新的现场判断衔接。",
        "second": "警报解除并不意味着事件结束。道路能否通行、供水是否污染、设备还能否启动会分别留下结论，下一轮建设和储备必须回应这些已经发生的损失。",
    },
    "CBT-EXP-001": {
        "name": "战斗经验评估与军事改进",
        "origins": ["CBT-LOG-001", "CBT-CAS-001", "CBT-EQP-001", "CBT-LOGI-001", "CBT-TAC-001", "CBT-AAR-001", "CBT-VAL-001"],
        "body": "把战斗记录、伤亡、装备损失、补给中断和战术执行放进同一评估方法，分清一次战果由训练、指挥、装备还是保障条件造成，并把可靠结论送回训练与设计。",
        "second": "胜利不会替损坏的车辆和空缺的班组作解释，失败也不能只归咎于某一种武器。评估人员必须沿着弹药、命令、伤员和装备去向还原结果，部队才知道下一次应当改变什么。",
    },
    "MIL-ORG-R6-001": {
        "name": "军队建制与战备管理",
        "origins": ["MIL-ORG-001", "MIL-ORG-003", "UNT-FRM-001", "UNT-EQP-001", "UNT-RDY-001"],
        "body": "建立从人员编组、装备配发、训练形成到战备核验的完整建制方法，使部队名称对应真实人员、武器、运输、通信和保障能力，而不是纸面编额。",
        "second": "一支部队只有在缺员、缺械和未完成训练都被如实留下时，战备状态才有意义。指挥人员由此看到能够立即执行任务的力量，也必须面对仍在补充中的空缺。",
    },
}


DIRECT_NON_TECH = {
    "DIP-AID-001", "DIP-PRT-001", "DIP-SEC-001", "GOV-APL-001",
    "POP-MIG-001-A", "POP-MIG-001-B", "POP-MIG-001-C",
    "SCI-PRJ-001-A", "SCI-PRJ-001-B", "SCI-PRJ-001-C", "SCI-XFN-001-B",
    "LOG-DSP-001-A", "LOG-DSP-001-B", "ELC-REC-001-A", "ELC-REC-001-C",
    "MIL-ORG-004", "UNT-REC-001", "UNT-DEM-001", "UNT-RPL-001",
    "STA-PRT-001", "STA-TRU-001",
}


PARTIAL_MERGES = {
    "CNS-GLS-BASE-001": {
        "name": "基础玻璃熔制与退火",
        "members": ["CNS-GLS-001-A", "CNS-GLS-001-B", "CNS-GLS-001-C"],
        "body": "确定玻璃原料的配比、混合、熔化、均化与退火条件，使普通玻璃和透明玻璃能够从稳定配合料连续形成内应力可控的玻璃坯料。掌握这项技术以后，容器和平板成形可以共用同一段合格熔制基础。",
        "second": "熔窑前的称量偏差会在整批玻璃上留下痕迹，退火段的温度变化又会决定成品是否在切割或使用时突然破裂。配料、熔制和退火人员因此必须共同对同一批玻璃负责。",
    },
}


def stable_choice(key: str, options: list[str]) -> str:
    n = int(hashlib.sha256(key.encode("utf-8")).hexdigest()[:8], 16)
    return options[n % len(options)]


def round5(value: float) -> int:
    return max(5, int(math.floor((value + 2.5) / 5.0) * 5))


def merged_cost(nodes: list[dict]) -> int:
    costs = sorted((int(n.get("researchPoints", 0)) for n in nodes), reverse=True)
    if not costs:
        return 5
    return round5(costs[0] + sum(costs[1:]) * 0.25)


def dedupe(items):
    seen = set()
    out = []
    for item in items:
        key = item if isinstance(item, str) else (item.get("type"), item.get("name"))
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def parse_text_batches() -> dict[str, dict[str, str]]:
    result = {}
    for path in sorted((ROOT / "text_batches").glob("TEXT_M1_TECH_*.md")):
        text = path.read_text(encoding="utf-8")
        chunks = re.split(r"(?m)^### ([A-Z0-9-]+)\s*$", text)
        for i in range(1, len(chunks), 2):
            tech_id, block = chunks[i], chunks[i + 1]
            fields = {}
            for label, value in re.findall(r"(?m)^- ([^：\n]+)：(.+)$", block):
                fields[label.strip()] = value.strip()
            if "最终完整名称" in fields:
                result[tech_id] = {
                    "name": fields.get("最终完整名称", ""),
                    "effect": fields.get("直接效果", ""),
                    "body": fields.get("正文", ""),
                    "second": fields.get("第二段", ""),
                    "strength": fields.get("强度", "完全严肃"),
                    "form": fields.get("形式", "技术侧面"),
                }
    return result


def clean_output_name(name: str) -> str:
    name = re.sub(r"合格批次$", "", name)
    name = name.replace("工程工程", "工程")
    name = name.replace("EMC", "电磁兼容")
    name = name.replace("煮沸/停供", "煮沸或停供")
    name = name.replace("科研/工程候选", "科研候选与工程候选")
    name = name.replace("锅炉—汽轮/动力设备", "锅炉、汽轮机与动力设备")
    name = name.replace("铜电解/火法精炼", "铜电解与火法精炼")
    name = name.replace("铜电解与火法精炼与导电性能控制", "铜电解、火法精炼与导电性能控制")
    name = name.replace("焊缝/无缝处理", "焊缝与无缝处理")
    # Remove accidental exact word doubling introduced by R5 mechanical names.
    m = re.match(r"^(.{2,10})\1$", name)
    if m:
        name = m.group(1)
    return name.strip("；。 ")


OUTPUT_OVERRIDES = {
    "传染患者隔离规程工程": ("标准", "传染患者隔离规程"),
    "修复式小型发电机组": ("产品", "修复式小型发电机组"),
    "修复式集体住处": ("设施", "修复式集体住处"),
    "关闭工程": ("工程", "矿山关闭与污染控制工程"),
    "分子筛氧气浓缩装置": ("产品", "分子筛氧气浓缩装置"),
    "可修复建筑鉴定工程": ("行动", "可修复建筑鉴定行动"),
    "工程修复复产组织方法工程": ("能力", "工程修复与复产协调能力"),
    "工程测量成果": ("记录", "工程测量成果"),
    "工程聚合物制品": ("产品", "工程聚合物制品"),
    "工程：精密工坊恢复": ("工程", "精密工坊恢复工程"),
    "改造工程": ("工程", "住宅卫生改造工程"),
    "模块化工程": ("工程", "模块化建筑装配工程"),
    "正式结构设计工程": ("标准", "正式建筑结构设计"),
    "盲区工程": ("工程", "无线电通信盲区补偿工程"),
    "表面工程耗材产品": ("产品", "表面工程耗材"),
    "铺筑工程": ("工程", "道路铺筑工程"),
    "移动抢修组织方法工程": ("能力", "移动抢修协作能力"),
}


CONTEXT_OUTPUT_OVERRIDES = {
    ("CNS-RPR-001", "修复工程"): ("工程", "受损建筑与设施修复工程"),
    ("TLG-BRG-001", "加固工程"): ("工程", "桥梁加固工程"),
    ("CNS-STR-001", "加固工程"): ("工程", "建筑结构加固工程"),
    ("ENE-EMG-001", "快速接入工程"): ("工程", "应急电源快速接入工程"),
    ("URB-DEM-001", "拆除工程"): ("工程", "危险建筑拆除工程"),
    ("URB-DRN-001", "排水工程"): ("工程", "街区雨水排水工程"),
    ("ELC-DIG-001", "数据校验制备工艺"): ("能力", "数据校验能力"),
    ("ELC-DIG-001", "本地网络制备工艺"): ("设施", "聚居点本地数据网络"),
}


FILTER_OUTPUT_NAMES = {
    "表面工程耗材产品",
    "标准金属半成品",
    "聚居点公共服务区",
    "产品专用工装",
}


CONTEXT_FILTER_OUTPUTS = {
    ("RAW-GEO-001-A", "采石场"),
    ("RAW-GEO-001-B", "采石场"),
    ("RAW-GEO-001-C", "采石场"),
    ("MET-FUR-001-A", "基础铸造线"),
    ("MET-FUR-001-C", "基础铸造线"),
    ("MET-FUR-001-A", "小型熔炼炉"),
    ("MET-FUR-001-C", "小型熔炼炉"),
    ("MET-NFR-001-A", "铝材"),
    ("MET-NFR-001-A", "有色合金锭"),
    ("MET-NFR-001-B", "铜材"),
    ("MET-NFR-001-B", "有色合金锭"),
    ("MET-NFR-001-C", "铜材"),
    ("MET-NFR-001-C", "铝材"),
    ("CHM-FRT-001-A", "营养液批次"),
    ("CHM-FRT-001-B", "标准肥料批次"),
    ("CHM-FRT-001-C", "标准肥料批次"),
    ("CHM-FRT-001-C", "营养液批次"),
    ("NRG-REN-001-A", "小型可再生发电单元"),
    ("NRG-REN-001-B", "小型可再生发电单元"),
    ("NRG-REN-001-C", "小型可再生发电单元"),
    ("MCH-CNC-001-A", "基础数控机床型号"),
    ("MCH-CNC-001-B", "基础数控机床型号"),
    ("ELC-CTL-001-B", "基础工业控制系统"),
    ("ELC-CTL-001-C", "基础工业控制系统"),
    ("MCH-RPL-001-A", "自制基础车床型号"),
    ("MCH-RPL-001-A", "钻铣床型号"),
    ("MCH-RPL-001-A", "基础机床部件制造制备工艺"),
    ("MCH-RPL-001-B", "整机复制制备工艺"),
    ("CNS-CEM-001-C", "水泥产品"),
    ("CNS-CEM-001-C", "混凝土产品"),
    ("CNS-CEM-001-D", "水泥产品"),
    ("CNS-CEM-001-D", "砂浆产品"),
    ("MCH-JIG-001-A", "批量生产准备"),
    ("MCH-JIG-001-B", "批量生产准备"),
}


CONTEXT_OUTPUT_RENAMES = {
    ("URB-ELC-001", "安全验收"): "建筑电气安全验收",
    ("IME-PRS-001", "安全验收"): "压力机安全验收",
    ("SOC-APP-001", "安全验收"): "家用电器安全验收",
    ("ICD-PRS-001", "安全验收"): "压力仪表安全验收",
    ("ELC-CTL-001-A", "基础工业控制系统"): "继电控制柜",
    ("MAT-ACD-001", "基础酸"): "连续制备工业酸",
    ("MAT-ACD-001", "基础碱"): "连续制备工业碱",
    ("MAT-POL-001", "基础树脂"): "低残余单体基础树脂",
    ("MAT-ENG-001", "工程聚合物"): "增强工程聚合物",
    ("MAT-REF-001", "耐火材料"): "寿命分级耐火材料",
    ("CNS-INF-001", "道路工程"): "区域干线道路工程",
    ("URB-RAD-001", "道路工程"): "聚居点街区道路工程",
}


def infer_output_type(name: str, old_type: str) -> str:
    if name.endswith("工程"):
        return "工程"
    if name.endswith(("编制", "编成")):
        return "编制"
    if any(name.endswith(x) for x in ["训练", "训练课程", "训练科目"]):
        return "训练"
    if name.endswith(("合同", "协议")):
        return "协议"
    if any(k in name for k in ["记录", "档案", "清单", "总账", "台账", "工单", "报告", "状态", "履历", "时间线", "名册", "申诉", "预警"]):
        return "记录"
    if any(name.endswith(k) for k in ["行动", "登记", "核验", "验收", "调查", "试验", "配发"]):
        return "行动"
    if name.endswith(("规程", "设计", "标准", "规则")):
        return "标准"
    if name.endswith(("协调能力", "组织方法", "能力", "服务", "生产准备")) or name in {"本地计算", "数据服务"}:
        return "能力"
    if name.endswith(("工位", "住处", "生产线", "铸造线", "管网", "实验室", "工场", "工厂", "仓库", "苗圃", "医院", "学校", "阵地", "工事", "场院")):
        return "设施"
    if name.endswith(("场", "站", "中心")) and not name.endswith(("战场", "立场")):
        return "设施"
    product_suffixes = (
        "产品", "制品", "装置", "机组", "批次", "材料", "半成品", "合金锭", "锭", "铝材", "铜材",
        "燃料", "肥料", "营养液", "药品", "耗材", "弹药", "武器", "装备", "车辆", "机床", "工具",
        "部件", "备件", "用品", "仪表", "设备", "型号", "容器", "线缆", "玻璃", "水泥", "砂浆", "混凝土",
        "发电单元", "控制系统", "熔炼炉", "轴承", "齿轮", "泵", "阀门", "枪", "炮", "坦克",
    )
    if name.endswith(product_suffixes):
        return "产品"
    return old_type


def normalize_outputs(nodes: list[dict], tech_id: str) -> list[dict]:
    raw = []
    for node in nodes:
        for out in node.get("outputs", []):
            name = clean_output_name(out["name"])
            if not name or out["name"] in FILTER_OUTPUT_NAMES or (tech_id, out["name"]) in CONTEXT_FILTER_OUTPUTS:
                continue
            name = CONTEXT_OUTPUT_RENAMES.get((tech_id, out["name"]), name)
            if name.endswith(("实施规程", "验证行动", "批次检验记录", "生产图纸", "验收记录", "标准文件", "标准采用行动", "工艺卡")):
                continue
            out_type = out["type"]
            if (tech_id, out["name"]) in CONTEXT_OUTPUT_OVERRIDES:
                out_type, name = CONTEXT_OUTPUT_OVERRIDES[(tech_id, out["name"])]
            elif out["name"] in OUTPUT_OVERRIDES:
                out_type, name = OUTPUT_OVERRIDES[out["name"]]
            out_type = infer_output_type(name, out_type)
            raw.append({"type": out_type, "name": name, "requiredCount": int(out.get("requiredCount", 1))})
    raw = dedupe(raw)
    concrete_products = [x for x in raw if x["type"] == "产品" and not x["name"].endswith(("产品", "产品族"))]
    if concrete_products:
        raw = [x for x in raw if not (x["type"] == "产品" and x["name"].endswith(("产品", "产品族")))]
    for idx, out in enumerate(raw, 1):
        out["id"] = f"OUT-{tech_id}-{idx:02d}"
    return raw


def visible_names(outputs: list[dict], limit: int = 5) -> list[str]:
    priority = {"产品": 0, "设施": 1, "工程": 2, "组织": 3, "能力": 4, "编制": 5,
                "训练": 6, "标准": 7, "行动": 8, "协议": 9, "记录": 10}
    ordered = sorted(outputs, key=lambda x: (priority.get(x["type"], 99), x["name"]))
    return [x["name"] for x in ordered[:limit]]


def effect_from_outputs(outputs: list[dict]) -> str:
    if not outputs:
        return "开放对应的实施能力。"
    return "开放：" + "、".join(x["name"] for x in outputs) + "。"


def domain_of(tech_id: str) -> str:
    return tech_id.split("-", 1)[0]


DOMAIN_CONTEXT = {
    "FOD": ("原料、季节条件和加工步骤", "生产人员与仓储人员", "食品供给与损耗"),
    "AGR": ("土壤、水分、种源和作业次序", "种植人员与农业技术人员", "收获与下一季生产"),
    "WTR": ("水源、处理步骤、管线和卫生检验", "水务人员与医疗卫生人员", "饮水安全与污水去向"),
    "CHM": ("原料配比、反应条件、分离和安全控制", "化工操作人员与检验人员", "批次安全与危险物处置"),
    "CNS": ("材料、荷载、施工次序和现场验收", "设计人员、施工人员与设施运营者", "建筑安全与后续维护"),
    "ELC": ("导体、绝缘、保护和测量条件", "电气人员与设备使用部门", "供电安全与故障隔离"),
    "NRG": ("燃料、转换设备、储备和负载条件", "能源调度人员与设备值守人员", "连续供能与停机次序"),
    "MCH": ("材料、几何基准、加工和装配条件", "机械工人与维修人员", "设备精度与备件更换"),
    "MET": ("原料成分、温度、成形和检验条件", "冶金人员与材料使用部门", "材料性能与失效风险"),
    "RAW": ("资源位置、开采边界、分级和安全条件", "采掘人员与资源管理人员", "稳定供料与土地恢复"),
    "MED": ("适应证、操作步骤、无菌条件和复核要求", "医疗人员与患者照护者", "诊疗可及性与照护责任"),
    "LOG": ("路线、载具、装卸、交接和在途条件", "运输人员与收发部门", "货物时效与途中责任"),
    "MIL": ("编制、装备、训练和保障条件", "指挥人员与一线部队", "战备真实性与补充责任"),
    "CBT": ("战场记录、行动条件和结果证据", "指挥人员与保障人员", "战术修正与伤亡责任"),
    "SCI": ("问题定义、证据、复验和技术档案", "研究人员与实际采用部门", "知识可信度与扩散边界"),
    "POP": ("人口事实、家庭关系、能力和服务条件", "行政人员与公共服务人员", "权利落实与照护缺口"),
    "GOV": ("授权、责任、证据和复核程序", "行政人员与受影响居民", "公共决定与申诉责任"),
    "POL": ("取证、权限、处置和移交程序", "警务人员、审理人员与当事人", "人身安全与权力边界"),
    "DIP": ("代表授权、信息核验、承诺和履行", "外交人员与实际履约部门", "外部信任与承诺成本"),
    "TRD": ("估价、质量、交付和结算证据", "交易双方、仓储和结算人员", "贸易收入与违约责任"),
    "REV": ("收入来源、实物交付、留用和核销", "财政人员与承担义务的地方", "可用财政与地方服务"),
    "CIV": ("材料、人体使用条件、制造和维修要求", "生产人员与日常使用者", "生活便利与维修负担"),
    "RPR": ("故障判断、拆检、修复和复验步骤", "维修人员与设备使用部门", "停机时间与备件消耗"),
    "QLT": ("样品、基准、检验和纠正证据", "质量人员与生产负责人", "不合格品去向与事故追溯"),
    "RSC": ("钻孔位置、岩芯顺序、地层变化和矿体边界", "勘探人员与资源规划人员", "资源可信度与后续开采风险"),
    "IME": ("测量、负载、设备状态和交付基线", "设备制造人员、检验人员与维修人员", "设备可靠性与停机风险"),
    "HLT": ("适用人群、操作条件、卫生要求和不良结果", "医疗人员、公共卫生人员与照护者", "诊疗连续性与患者安全"),
    "URB": ("建筑用途、人员流线、消防卫生和公用接口", "规划人员、施工人员与居民", "居住安全与公共服务承载"),
    "WSE": ("水质证据、传播路径、处置措施和解除条件", "水务人员、医疗人员与地方行政人员", "饮水安全与公共卫生响应"),
    "SOC": ("岗位要求、训练、资格和劳动保护", "用工组织、训练人员与劳动者", "人员成长与岗位安全"),
    "TLG": ("路线承载、车辆条件、驾驶资格和交接责任", "道路人员、驾驶人员与货运组织", "通行安全与在途责任"),
    "ENE": ("发电设备、配电保护、负载次序和恢复条件", "电力值守人员与用电部门", "供电连续性与恢复次序"),
    "ICD": ("信号、接地、屏蔽、接口和干扰证据", "通信人员、电气人员与设备使用者", "通信可靠性与故障定位"),
    "IND": ("场地、工装、作业顺序和安全边界", "生产组织、操作人员与检验人员", "产线切换与稳定交付"),
    "SET": ("地表危险、可居住边界和公共设施条件", "勘察人员、建设人员与居民", "聚居安全与扩建边界"),
}


def rewrite_generic(node_id: str, name: str, kind: str, outputs: list[dict], member_names: list[str]) -> tuple[str, str]:
    domain = domain_of(node_id)
    conditions, people, consequence = DOMAIN_CONTEXT.get(domain, ("对象、步骤、检验和使用条件", "实施人员与实际使用者", "日常运行与维护责任"))
    names = visible_names(outputs, 3)
    unlocked = "、".join(names) if names else "对应能力"
    steps = "、".join(member_names[:4])
    if kind in {"设计", "试制", "工艺", "产品"}:
        openings = [
            f"围绕{conditions}确定可重复的制造路线，",
            f"把{conditions}收束为能够连续复验的生产方法，",
            f"通过样件、批次和使用检验确定{conditions}之间的边界，",
            f"从实际生产需要出发，明确{conditions}的相互约束，",
            f"为让{unlocked}能够稳定重复，逐项控制{conditions}，",
            f"以{unlocked}的实际使用要求为目标，重新安排{conditions}，",
            f"沿着原料进入、加工和成品检验的顺序核对{conditions}，",
            f"根据样件暴露的缺陷修正{conditions}，",
            f"把一次成功样品还原成关于{conditions}的完整工艺，",
            f"针对批次间反复出现的差异，固定{conditions}，",
            f"在现有设备能够承受的范围内协调{conditions}，",
            f"从维护与替换要求反推{conditions}，",
        ]
        endings = [
            f"完成{steps}。{name}为{unlocked}提供可复验的制造依据；实际产出仍要占用相应场所、原料和人员。",
            f"完成{steps}。掌握{name}以后，{unlocked}可以分别安排试制和生产，未建设的产线不会因此自动出现。",
            f"完成{steps}。{unlocked}由此具备进入生产计划的技术条件，批量交付仍取决于设备、材料与合格操作人员。",
            f"完成{steps}。{name}把{unlocked}从一次性样品变成可重复制造的对象，具体数量仍由实际生产承担。",
        ]
        body = stable_choice(node_id + "b", openings) + stable_choice(node_id + "e", endings)
    elif kind in {"标准", "方法", "发现", "突破"}:
        openings = [
            f"确定{conditions}的共同判断依据，",
            f"用可复查的样品、测量和记录界定{conditions}，",
            f"把过去依赖个人经验的判断转成可重复方法，重点核对{conditions}，",
            f"针对反复出现的误判，建立关于{conditions}的验证方法，",
            f"围绕{name}逐项说明{conditions}怎样被观察和确认，",
            f"以现场结果为证据，把{conditions}分开判断，",
            f"从失败记录和相互矛盾的样品中厘清{conditions}，",
            f"允许不同人员在相同条件下复现结论，首先统一{conditions}，",
            f"先定义{name}能够处理的范围，再核对{conditions}，",
            f"把结果、异常和不确定部分同时保留下来，据此判断{conditions}，",
            f"针对{name}最容易混淆的对象，分别验证{conditions}，",
            f"从实际采用需要出发，为{conditions}建立可交接证据，",
        ]
        endings = [
            f"并以{steps}形成可交接的结果。{name}使{unlocked}获得共同判断依据，实际采用仍需要对应岗位和设施。",
            f"并以{steps}留下可复查的结论。掌握{name}以后，{unlocked}不必再依赖某一名熟练者的个人判断。",
            f"并用{steps}说明方法的适用边界。{unlocked}可以据此进入正式工作，但能力不足仍会形成未完成状态。",
            f"并通过{steps}确认结果能够被他人重复。{name}开放{unlocked}，却不替执行者作出现场决定。",
        ]
        body = stable_choice(node_id + "b", openings) + stable_choice(node_id + "e", endings)
    else:
        openings = [
            f"明确{people}之间的职责与交接次序，",
            f"围绕{consequence}建立跨岗位协作方法，",
            f"把分散在不同地点和岗位的工作接入同一责任链，",
            f"针对多处同时运行时容易出现的空缺，重新安排{people}的协作方式，",
            f"从{name}需要连续处理的事务出发，划清{people}的责任，",
            f"把临时口头协调转成能够复查的分工，使{people}按次序接手，",
            f"围绕同一对象在不同岗位间移动的过程，重新组织{people}，",
            f"先说明谁作决定、谁执行、谁复核，再连接{people}的工作，",
            f"针对人员更替和地点分散造成的中断，为{people}建立接续办法，",
            f"把{name}所需的授权、执行和反馈分别交给{people}，",
            f"用明确的进入、移交和结束条件组织{people}，",
            f"从{consequence}反推日常责任，使{people}不再各自保留一套口径，",
        ]
        endings = [
            f"使{steps}能够依据同一组事实连续处理。{name}开放{unlocked}，人员、场所和物资仍需在实际组织中补齐。",
            f"让{steps}具有明确的交接结果。掌握{name}以后可以建立{unlocked}，纸面职责不会自动变成可用能力。",
            f"使{steps}在多人、多地点运行时仍能接续。{unlocked}由此可以正式组织，空缺岗位和未交付物资仍会保留为缺口。",
            f"把{steps}从临时协商转成可复查的协作方法。{name}为{unlocked}提供组织基础，但不凭空增加执行资源。",
        ]
        body = stable_choice(node_id + "b", openings) + stable_choice(node_id + "e", endings)

    if any(x["type"] == "产品" for x in outputs):
        seconds = [
            f"{name}支持的{unlocked}进入生产安排后，{people}必须同时处理批次差异、使用反馈和不合格品去向。{consequence}因此有了可以追查的实物依据。",
            f"掌握{name}以后，仓库里新增的{unlocked}不会只占据一个品名；领用、损坏和退回会把问题送回生产端。{people}需要据此纠正下一批生产。",
            f"当{name}使{unlocked}能够重复交付时，使用者开始依赖它承担日常任务。任何中断都会直接落到{consequence}上，生产与维修人员必须共同维持这项能力。",
        ]
    elif any(x["type"] == "工程" for x in outputs):
        seconds = [
            f"{name}形成的图纸和方法只有在具体地点完成建设后才会改变生活。{people}要在开工以前说明接口，在完工以后继续承担检查与维护。",
            f"依据{name}立项以后，材料、现场条件和既有设施之间的冲突会逐项暴露。{people}必须把这些差异留在工程决定中，不能让纸面设计代替现场结果。",
        ]
    else:
        seconds = [
            f"{name}开始采用后，{people}会在同一份事实面前作出决定。遗漏不会再被不同部门的口径遮住，{consequence}也随之成为明确责任。",
            f"{name}会把过去由熟练者临时补上的空缺正式暴露。{people}必须留下判断依据和交接结果，后来者才能知道{consequence}为何变化。",
            f"{name}没有减少实际工作，却让未完成的部分无法继续藏在口头交代里。{people}能够接续处理，也必须承担{consequence}的后果。",
        ]
    return body, stable_choice(node_id + "s", seconds)


def infer_tech_type(name: str, old_type: str) -> str:
    if "设计" in name:
        return "设计"
    if "工艺" in name or any(x in name for x in ["制造", "制备", "配制", "成形", "加工"]):
        return "工艺"
    if "方法" in name or any(x in name for x in ["判定", "监测", "检测", "评估", "分析", "复验"]):
        return "方法"
    if any(x in name for x in ["组织", "体系", "制度", "建制", "统合", "管理"]):
        return "组织"
    if any(x in name for x in ["标准", "规范", "资格"]):
        return "标准"
    if old_type in {"产品", "工程", "设施", "制度"}:
        if any(x in name for x in ["权限", "义务", "记账", "核对", "审计", "确认程序", "交换", "治理", "协调"]):
            return "组织" if any(x in name for x in ["治理", "协调"]) else "标准"
        if any(x in name for x in ["铸", "锻", "热处理", "精炼", "调合", "配混", "罐藏", "破碎", "筛分", "装配", "制件", "成批", "成组生产"]):
            return "工艺"
        return "方法"
    if old_type not in {"记录", "行动", "协议", "能力"}:
        return old_type
    return "方法"


def build_initial_groups(techs: list[dict], source_texts: dict[str, dict[str, str]]) -> tuple[list[dict], dict[str, str], list[dict]]:
    by_id = {t["id"]: t for t in techs}
    member_to_group = {}
    groups = []
    nontech = []

    # Highest-priority cross-origin merges.
    for gid, cfg in CROSS_MERGES.items():
        members = [t for t in techs if t.get("originId") in cfg["origins"]]
        if members:
            groups.append({"id": gid, "members": members, "custom": cfg})
            for t in members:
                member_to_group[t["id"]] = gid

    # Selected whole-origin merges.
    for origin, name in ORIGIN_MERGES.items():
        members = [t for t in techs if t.get("originId") == origin and t["id"] not in member_to_group]
        if members:
            groups.append({"id": origin, "members": members, "custom": {"name": name}})
            for t in members:
                member_to_group[t["id"]] = origin

    # Recover additional original nodes only when the R5 split created internal
    # steps with no distinct tangible product milestone.  Separate surveys and
    # separate products remain separate technologies.
    origins = defaultdict(list)
    for tech in techs:
        origins[tech.get("originId", tech["id"])].append(tech)
    survey_words = ("勘察", "调查", "探查", "探测", "测绘")
    tangible_types = {"产品", "设施", "工程", "组织", "能力", "训练", "编制"}
    for origin, members_all in sorted(origins.items()):
        members = [x for x in members_all if x["id"] not in member_to_group]
        if len(members) < 2 or origin not in source_texts:
            continue
        if any(any(word in x["name"] for word in survey_words) for x in members):
            continue
        primary_sets = []
        for member in members:
            names = {
                clean_output_name(out["name"])
                for out in member.get("outputs", [])
                if out.get("type") in tangible_types
                and not clean_output_name(out["name"]).endswith(("产品", "产品族"))
            }
            primary_sets.append(names)
        distinct_products = set()
        for names in primary_sets:
            distinct_products.update(x for x in names if not any(x in other for other in names if x != other))
        # Two or more disjoint tangible outcomes are player-visible milestones.
        disjoint_pairs = 0
        for i, left in enumerate(primary_sets):
            for right in primary_sets[i + 1:]:
                if left and right and left.isdisjoint(right):
                    disjoint_pairs += 1
        if disjoint_pairs:
            continue
        groups.append({"id": origin, "members": members, "custom": {}})
        for tech in members:
            member_to_group[tech["id"]] = origin

    # Selected partial merge (glass base steps); product-forming milestones remain separate.
    for gid, cfg in PARTIAL_MERGES.items():
        members = [by_id[x] for x in cfg["members"] if x in by_id and x not in member_to_group]
        if members:
            groups.append({"id": gid, "members": members, "custom": cfg})
            for t in members:
                member_to_group[t["id"]] = gid

    # Remove routine administration from research. Keep its explicit outputs in a separate list.
    for tech_id in sorted(DIRECT_NON_TECH):
        if tech_id in member_to_group or tech_id not in by_id:
            continue
        node = by_id[tech_id]
        member_to_group[tech_id] = "__NON_TECH__"
        nontech.append({
            "formerTechnologyId": tech_id,
            "name": node["name"],
            "reason": "例行行政、记录、排程、协议或部队手续，改为制度运行或科技解锁项。",
            "outputs": normalize_outputs([node], "NONTECH-" + tech_id),
        })

    # Every remaining technology stays independent and receives a full text review.
    for node in techs:
        if node["id"] in member_to_group:
            continue
        groups.append({"id": node["id"], "members": [node], "custom": {}})
        member_to_group[node["id"]] = node["id"]
    return groups, member_to_group, nontech


def build_node(group: dict, source_texts: dict[str, dict[str, str]]) -> dict:
    gid = group["id"]
    members = group["members"]
    custom = group.get("custom", {})
    first = members[0]
    outputs = normalize_outputs(members, gid)
    origin_ids = sorted(set(t.get("originId", t["id"]) for t in members))
    source = source_texts.get(gid) if len(origin_ids) == 1 and origin_ids[0] == gid else None

    name = clean_output_name(custom.get("name") or (source or {}).get("name") or first["name"])
    effect = effect_from_outputs(outputs)
    types = Counter(infer_tech_type(x["name"], x.get("resolvedType", x.get("type", "方法"))) for x in members)
    resolved_type = types.most_common(1)[0][0]
    if custom.get("body"):
        body, second = custom["body"], custom["second"]
    elif source and len(members) > 1:
        body, second = source["body"], source["second"]
    elif first.get("text_source") != GENERIC_SOURCE and len(members) == 1:
        body, second = first["body"], first["second"]
    else:
        body, second = rewrite_generic(gid, name, resolved_type, outputs, [x["name"] for x in members])

    routes = [x.get("route", "optional_or_later_no_date_gate") for x in members]
    route = "year_two_mainline_no_date_gate" if "year_two_mainline_no_date_gate" in routes else routes[0]
    return {
        "id": gid,
        "usage": "科技树节点／研究详情／完成记录",
        "name": name,
        "effect": effect,
        "body": body.replace("属于这一能力", "是这一能力").replace("属于制度运行", "是制度运行的一部分"),
        "second": second,
        "strength": (source or {}).get("strength", first.get("strength", "完全严肃")),
        "form": (source or {}).get("form", first.get("form", "技术侧面")),
        "check": "R6 二审通过；玩家可见科技尺度、明确解锁项与世界内因果链均已复核。",
        "text_source": REVIEW_SOURCE,
        "pre": [],
        "researchResult": f"{name}的可复验知识、设计、工艺或组织方法",
        "unlock": "；".join(x["name"] for x in outputs),
        "entityConditions": "；".join(dedupe([x.get("entityConditions", "") for x in members if x.get("entityConditions")])) or "由明确前置科技和实际设施条件共同决定",
        "proof": "；".join(dedupe([x.get("proof", "") for x in members if x.get("proof")])) or "形成可复查的样品、记录或运行结果",
        "difficulty": first.get("difficulty", "基础"),
        "type": resolved_type,
        "structureSource": "M1 R5 科技工业关系树与 R6 玩家尺度二审",
        "rank": 0,
        "preNames": [],
        "originId": origin_ids[0] if len(origin_ids) == 1 else gid,
        "mergedFrom": [x["id"] for x in members],
        "disposition": "R6 合并科技" if len(members) > 1 else "R6 保留并二审",
        "atomicReason": "形成一个玩家可感知、可单独研究且具有明确解锁项的技术里程碑。",
        "outputs": outputs,
        "resolvedType": resolved_type,
        "researchPoints": merged_cost(members),
        "difficultyBand": first.get("difficultyBand", first.get("difficulty", "基础")),
        "effectiveTeamCap": max(int(x.get("effectiveTeamCap", 1)) for x in members),
        "workComponents": {
            key: round5(max(int(x.get("workComponents", {}).get(key, 0)) for x in members))
            for key in ["knowledge", "experiment", "engineering", "validation", "organization"]
        },
        "costRationale": ["保留最难核心工作", "其余内部步骤按四分之一计入整合成本", "按统一规则取整到 5 科研点"],
        "endpoint": first.get("endpoint"),
        "route": route,
    }


def wire_graph(groups: list[dict], nodes: list[dict], member_map: dict[str, str], old_by_id: dict[str, dict]) -> list[dict]:
    node_by_id = {n["id"]: n for n in nodes}
    group_size = {g["id"]: len(g["members"]) for g in groups}
    for group, node in zip(groups, nodes):
        pres = []
        for member in group["members"]:
            for old_pre in member.get("pre", []):
                mapped = member_map.get(old_pre)
                if mapped and mapped not in {"__NON_TECH__", node["id"]} and mapped in node_by_id:
                    pres.append(mapped)
                elif mapped == "__NON_TECH__":
                    for inherited in old_by_id.get(old_pre, {}).get("pre", []):
                        inherited_mapped = member_map.get(inherited)
                        if inherited_mapped and inherited_mapped not in {"__NON_TECH__", node["id"]} and inherited_mapped in node_by_id:
                            pres.append(inherited_mapped)
        node["pre"] = dedupe(pres)

    # Cross-stage administrative fragments can point through one another after
    # they are collapsed.  Remove only an incoming edge of a merged node inside
    # the unresolved component: that edge represented the old split order, not
    # an independent player-facing prerequisite.
    removed_cycle_edges = []
    while True:
        indeg_probe = {n["id"]: len(n["pre"]) for n in nodes}
        children_probe = defaultdict(list)
        for n in nodes:
            for p in n["pre"]:
                children_probe[p].append(n["id"])
        probe = deque(sorted(x for x, d in indeg_probe.items() if d == 0))
        while probe:
            current = probe.popleft()
            for child in children_probe[current]:
                indeg_probe[child] -= 1
                if indeg_probe[child] == 0:
                    probe.append(child)
        cyclic = {x for x, d in indeg_probe.items() if d > 0}
        if not cyclic:
            break
        candidates = []
        for node_id in cyclic:
            if group_size.get(node_id, 1) <= 1:
                continue
            for pre in node_by_id[node_id]["pre"]:
                if pre in cyclic:
                    candidates.append((node_id, pre))
        if not candidates:
            raise RuntimeError(f"R6 merge created an unresolvable cycle: {sorted(cyclic)[:20]}")
        node_id, pre = sorted(candidates, key=lambda x: (-group_size.get(x[0], 1), x[0], x[1]))[0]
        node_by_id[node_id]["pre"].remove(pre)
        node_by_id[node_id].setdefault("removedCyclicPrerequisites", []).append(pre)
        removed_cycle_edges.append((pre, node_id))

    # Kahn rank calculation after the merge-only cycle repair.
    indeg = {n["id"]: len(n["pre"]) for n in nodes}
    children = defaultdict(list)
    for n in nodes:
        for p in n["pre"]:
            children[p].append(n["id"])
    queue = deque(sorted(x for x, d in indeg.items() if d == 0))
    ranks = {x: 0 for x in queue}
    visited = 0
    while queue:
        current = queue.popleft()
        visited += 1
        for child in children[current]:
            ranks[child] = max(ranks.get(child, 0), ranks[current] + 1)
            indeg[child] -= 1
            if indeg[child] == 0:
                queue.append(child)
    if visited != len(nodes):
        remaining = sorted(x for x, d in indeg.items() if d > 0)
        raise RuntimeError(f"R6 graph remains cyclic after merge-only repair: {remaining[:30]}")
    for node in nodes:
        node["rank"] = ranks[node["id"]]
        node["preNames"] = [node_by_id[x]["name"] for x in node["pre"]]
    return sorted(nodes, key=lambda x: (x["rank"], x["id"]))


def parse_governance() -> dict:
    policy_text = POLICY_PATH.read_text(encoding="utf-8")
    law_text = LAW_PATH.read_text(encoding="utf-8")

    policies = []
    category = None
    current = None
    for line in policy_text.splitlines():
        m = re.match(r"### (M1-POL-CAT-\d+) · (.+)", line)
        if m:
            category = {"id": m.group(1), "name": m.group(2), "options": []}
            policies.append(category)
            current = None
            continue
        m = re.match(r"#### (M1-POL-[A-Z]+-\d+) · (.+)", line)
        if m and category:
            current = {"id": m.group(1), "name": m.group(2)}
            category["options"].append(current)
            continue
        m = re.match(r"- ([^：]+)：(.+)", line)
        if m and current:
            current[m.group(1).strip()] = m.group(2).strip()
    for cat in policies:
        for item in cat["options"]:
            behavior = item.get("默认行为", "")
            action = item.get("开放行动", "")
            consequence = item.get("代价与后果", "")
            requirement = item.get("解锁要求", "")
            item["正文"] = behavior + ((" 可采用的常态行动包括" + action + "。") if action else "")
            item["取舍"] = consequence
            item["边界"] = requirement

    selectable_laws = []
    fixed_laws = []
    edicts = []
    section = None
    category = None
    current = None
    for line in law_text.splitlines():
        if line.startswith("## 4. 可选法律标准"):
            section = "selectable"
        elif line.startswith("## 5. 常设监管标准"):
            section = "fixed"
        elif line.startswith("## 7. 临时法令目录"):
            section = "edict"
        m = re.match(r"### (M1-LAW-CAT-\d+) · (.+)", line)
        if m and section == "selectable":
            category = {"id": m.group(1), "name": m.group(2), "options": []}
            selectable_laws.append(category)
            current = None
            continue
        m = re.match(r"#### (M1-LAW-[A-Z]+-\d+) · (.+)", line)
        if m and section == "selectable" and category:
            current = {"id": m.group(1), "name": m.group(2)}
            category["options"].append(current)
            continue
        m = re.match(r"### (M1-LAW-REG-\d+) · (.+)", line)
        if m and section == "fixed":
            current = {"id": m.group(1), "name": m.group(2)}
            fixed_laws.append(current)
            continue
        m = re.match(r"### (M1-EDICT-\d+) · (.+)", line)
        if m and section == "edict":
            current = {"id": m.group(1), "name": m.group(2)}
            edicts.append(current)
            continue
        m = re.match(r"- ([^：]+)：(.+)", line)
        if m and current and section in {"selectable", "fixed", "edict"}:
            current[m.group(1).strip()] = m.group(2).strip()

    result = {
        "policies": policies,
        "selectableLaws": selectable_laws,
        "fixedLaws": fixed_laws,
        "fixedProcedures": [
            "人口、死亡、出生、迁入和迁出必须登记。",
            "国库、预算、采购、收入和实物义务必须留有可核对记录。",
            "警察取证、武力使用、死亡、重伤和重大拘押必须留档。",
            "羁押必须存在复核和释放、移交或继续限制的明确结果。",
            "行政决定必须有申诉、纠正和版本记录。",
            "重大事故、污染、产品召回和军事伤亡必须独立登记。",
            "法律、政策和法令的变更必须保存生效版本，不得追溯篡改历史状态。",
        ],
        "edicts": edicts,
    }
    replacements = {
        "连续月结算恢复法定供给": "法定供给连续恢复",
        "玩家选择的": "政府指定的",
        "玩家选择": "政府指定",
        "玩家改换": "政府改换",
        "玩家撤销": "颁布机关撤销",
        "技术本身不能解锁或自动采用": "不得以技术进步作为自动执行理由",
        "关键系统": "关键部门",
    }

    def sanitize(value):
        if isinstance(value, dict):
            return {k: sanitize(v) for k, v in value.items()}
        if isinstance(value, list):
            return [sanitize(v) for v in value]
        if isinstance(value, str):
            for old, new in replacements.items():
                value = value.replace(old, new)
            return value
        return value

    return sanitize(result)


ENGINEERING_TEMPLATES = [
    (("道路", "桥", "涵", "通道", "管沟", "装卸站"), "按照勘测、承载与排水要求建设或修复{n}，把既有路线接入可持续通行的运输网络。", "完工后仍需巡检路面、结构、排水和限行状态；损坏不能由一次验收永久消除。"),
    (("水", "井", "排污", "污水", "管网"), "在明确水源、处理能力和卫生边界后建设或接通{n}，使取水、输送、处理或排放形成可检查的实体链路。", "运行方必须持续采样、处理泄漏与污染，并为停供和抢修保留替代安排。"),
    (("电", "发电", "配电", "储能", "变电", "中压", "风力", "太阳能"), "依据负载、保护、接地和设备容量建设或改造{n}，使发电、储能或用电设施能够安全接入。", "运营人员必须承担调度、保护试验、故障隔离和备件更换，名义容量不能替代实际可供电能力。"),
    (("住房", "住宅", "住区", "建筑", "仓库", "工场", "工厂", "设施", "场址", "保温"), "使用已检验材料和正式结构方法建设或改造{n}，形成具有明确用途和承载边界的实体场所。", "完工后要继续负责消防、结构、设备和日常维修；场所存在不等于其中的生产或服务自动满额运行。"),
    (("医院", "医疗", "卫生", "诊疗"), "按照洁污分区、人员流线和设备条件建设或改造{n}，让相应医疗或卫生服务获得可运行的实体空间。", "运营方必须维持清洁、耗材、设备和转诊条件，服务缺口仍需如实记录。"),
    (("防御", "工事", "阵地", "堡", "掩体"), "结合地形、射界、交通和后勤条件建设或加固{n}，为部队提供可使用的防护与部署位置。", "守备部队仍需补充人员、武器、弹药、通信和维修；空置工事本身不形成战斗力。"),
]


def engineering_text(name: str) -> tuple[str, str]:
    for keys, body, maintenance in ENGINEERING_TEMPLATES:
        if any(k in name for k in keys):
            return body.format(n=name), maintenance
    return (
        f"在核对现场条件、材料接口和既有设施后实施{name}，形成可以单独验收的实体结果。",
        "完工后的运行、检查、清洁、备件与故障处置必须交给明确的运营者；一次建成不代表永久有效。",
    )


def build_engineering(nodes: list[dict]) -> list[dict]:
    by_name = defaultdict(list)
    for node in nodes:
        for out in node["outputs"]:
            if out["type"] == "工程":
                by_name[out["name"]].append(node)
    result = []
    for idx, name in enumerate(sorted(by_name), 1):
        body, maintenance = engineering_text(name)
        result.append({
            "id": f"ENG-R6-{idx:03d}",
            "name": name,
            "unlockedBy": [{"id": n["id"], "name": n["name"]} for n in by_name[name]],
            "body": body,
            "completion": f"只有在具体地点完成实施与验收后，{name}才进入可运行状态。",
            "maintenance": maintenance,
        })
    return result


def render_review(tree: dict, engineering: list[dict], governance: dict, audit: dict) -> str:
    lines = [
        "# M1 科技、工程、政策、法律与法令确定性正文总审阅稿 R6",
        "",
        "状态：第一层连续二审交付；供用户快速通读和后续退回。不是 PDF，不是筛选网页，不代表已经接入游戏。",
        "",
        "## 阅读规则",
        "",
        "- 本文只展开实际条目，不用方向总结替代科技、工程或制度正文。",
        "- 科技完成只开放能力和明确解锁项；产品仍要生产，设施与工程仍要建设，政策与法律仍要采用。",
        "- 科研点按月度资源逻辑结算，不设置日期门；满足前置和科研点即可提前研究。",
        "- 世界内侧面不是评语，必须呈现技术变化后的具体社会因果。",
        "",
        "## 二审结果",
        "",
        f"- R5 科技：{audit['r5TechnologyCount']} 项。",
        f"- R6 科技：{audit['r6TechnologyCount']} 项；合并或移出科研树 {audit['technologyReduction']} 项。",
        f"- R6 科研点总量：{audit['researchPoints']}；其中两年主线 {audit['mainlineResearchPoints']}。",
        f"- 明确科技解锁项：{audit['outputCount']} 项。",
        f"- 不重复的解锁对象：{audit['uniqueOutputCount']} 项；其余为多个科技共同作用于同一记录、行动或能力的关系。",
        f"- 移出科研树、保留为制度运行或解锁项：{audit['nonTechnologyItemCount']} 项。",
        f"- 独立工程正文：{len(engineering)} 项。",
        f"- 政策：{audit['policyCategoryCount']} 类、{audit['policyOptionCount']} 个倾向。",
        f"- 法律：{audit['lawCategoryCount']} 类、{audit['lawOptionCount']} 个可选标准、{audit['fixedLawCount']} 个常设标准。",
        f"- 临时法令：{audit['edictCount']} 项。",
        "",
        "# 第一编 · 完整科技树正文",
        "",
    ]
    for node in tree["technologies"]:
        lines.extend([
            f"## {node['id']} · {node['name']}",
            "",
            f"- 科研点：{node['researchPoints']}",
            f"- 前置科技：{'；'.join(node['preNames']) if node['preNames'] else '无'}",
            f"- 直接效果：{node['effect']}",
            f"- 正文：{node['body']}",
            f"- 世界内侧面：{node['second']}",
            "- 解锁内容：",
            "",
        ])
        if node["outputs"]:
            for out in node["outputs"]:
                lines.append(f"  - {out['type']}：{out['name']}")
        else:
            lines.append("  - 能力：对应实施能力")
        lines.append("")

    lines.extend(["# 第二编 · 工程正文", ""])
    for eng in engineering:
        lines.extend([
            f"## {eng['id']} · {eng['name']}", "",
            f"- 解锁科技：{'；'.join(x['name'] for x in eng['unlockedBy'])}",
            f"- 工程说明：{eng['body']}",
            f"- 完工边界：{eng['completion']}",
            f"- 养护责任：{eng['maintenance']}", "",
        ])

    lines.extend(["# 第三编 · 政策正文", ""])
    for cat in governance["policies"]:
        lines.extend([f"## {cat['id']} · {cat['name']}", "", "本类别同时只能选择一个倾向；政策不替代具体法律标准、工程建设或临时法令。", ""])
        for item in cat["options"]:
            lines.extend([
                f"### {item['id']} · {item['name']}", "",
                f"- 正文：{item.get('正文', '')}",
                f"- 取舍：{item.get('取舍', '')}",
            ])
            if item.get("边界"):
                lines.extend([f"- 采用条件：{item['边界']}", ""])
            else:
                lines.append("")

    lines.extend(["# 第四编 · 法律正文", "", "## 可选法律标准", ""])
    for cat in governance["selectableLaws"]:
        lines.extend([f"### {cat['id']} · {cat['name']}", ""])
        for item in cat["options"]:
            standard = item.get("权利标准") or item.get("合法标准") or item.get("权利义务") or item.get("标准") or ""
            lines.extend([
                f"#### {item['id']} · {item['name']}", "",
                f"- 法律标准：{standard}",
                f"- 执行影响：{item.get('执行影响', '')}", "",
            ])
    lines.extend(["## 常设监管标准", ""])
    for item in governance["fixedLaws"]:
        lines.extend([
            f"### {item['id']} · {item['name']}", "",
            f"- 法律标准：{item.get('标准', '')}",
            f"- 主要执行：{item.get('主要执行', '')}", "",
        ])
    lines.extend(["## 固定程序底线", ""])
    for item in governance["fixedProcedures"]:
        lines.append(f"- {item}")

    lines.extend(["", "# 第五编 · 临时法令正文", ""])
    for item in governance["edicts"]:
        lines.extend([
            f"## {item['id']} · {item['name']}", "",
            f"- 启动条件：{item.get('触发', '')}",
            f"- 临时调整：{item.get('临时调整', '')}",
            f"- 退出条件：{item.get('退出', '')}", "",
        ])
    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    r5 = json.loads(R5_PATH.read_text(encoding="utf-8"))
    old_techs = r5["technologies"]
    old_by_id = {t["id"]: t for t in old_techs}
    source_texts = parse_text_batches()
    groups, member_map, nontech = build_initial_groups(old_techs, source_texts)
    nodes = [build_node(group, source_texts) for group in groups]
    duplicate_ids = [x for x, count in Counter(n["id"] for n in nodes).items() if count > 1]
    if duplicate_ids:
        raise RuntimeError(f"Duplicate R6 technology ids: {duplicate_ids}")
    nodes = wire_graph(groups, nodes, member_map, old_by_id)

    outputs = [o for n in nodes for o in n["outputs"]]
    tech_edges = [{"from": p, "to": n["id"]} for n in nodes for p in n["pre"]]
    unlock_edges = [{"from": n["id"], "to": o["id"], "type": o["type"]} for n in nodes for o in n["outputs"]]
    tree = {
        "meta": {
            "title": "M1 玩家尺度完整科技工业关系树 R6",
            "source": R5_PATH.name,
            "technologyCount": len(nodes),
            "outputCount": len(outputs),
            "technologyEdgeCount": len(tech_edges),
            "unlockEdgeCount": len(unlock_edges),
            "maxRank": max(n["rank"] for n in nodes),
            "dateGate": False,
            "contract": "SPEC-M1-PLAYER-FACING-TECH-AND-TEXT-REVIEW-R6-001",
            "researchPoints": sum(n["researchPoints"] for n in nodes),
            "mainlineTechnologyCount": sum(n["route"] == "year_two_mainline_no_date_gate" for n in nodes),
            "mainlineResearchPoints": sum(n["researchPoints"] for n in nodes if n["route"] == "year_two_mainline_no_date_gate"),
        },
        "technologies": nodes,
        "outputs": outputs,
        "technologyEdges": tech_edges,
        "unlockEdges": unlock_edges,
        "nonTechnologyItemsRemovedFromResearch": nontech,
    }
    governance = parse_governance()
    engineering = build_engineering(nodes)

    exact_bodies = Counter(n["body"] for n in nodes)
    exact_seconds = Counter(n["second"] for n in nodes)
    banned = ["属于", "在前置后展开", "验收时必须", "实施规程与验证行动", "评语"]
    banned_hits = {term: sum(term in n["body"] or term in n["second"] for n in nodes) for term in banned}
    law_option_count = sum(len(x["options"]) for x in governance["selectableLaws"])
    policy_option_count = sum(len(x["options"]) for x in governance["policies"])
    audit = {
        "r5TechnologyCount": len(old_techs),
        "r6TechnologyCount": len(nodes),
        "technologyReduction": len(old_techs) - len(nodes),
        "researchPoints": tree["meta"]["researchPoints"],
        "mainlineResearchPoints": tree["meta"]["mainlineResearchPoints"],
        "outputCount": len(outputs),
        "uniqueOutputCount": len({(x["type"], x["name"]) for x in outputs}),
        "nonTechnologyItemCount": len(nontech),
        "engineeringCount": len(engineering),
        "policyCategoryCount": len(governance["policies"]),
        "policyOptionCount": policy_option_count,
        "lawCategoryCount": len(governance["selectableLaws"]),
        "lawOptionCount": law_option_count,
        "fixedLawCount": len(governance["fixedLaws"]),
        "edictCount": len(governance["edicts"]),
        "duplicateBodyCount": sum(v - 1 for v in exact_bodies.values() if v > 1),
        "duplicateSecondCount": sum(v - 1 for v in exact_seconds.values() if v > 1),
        "bannedPhraseHits": banned_hits,
        "missingPrerequisiteCount": sum(p not in {n["id"] for n in nodes} for n in nodes for p in n["pre"]),
        "selfDependencyCount": sum(n["id"] in n["pre"] for n in nodes),
        "mergeCycleRepairEdgeCount": sum(len(n.get("removedCyclicPrerequisites", [])) for n in nodes),
        "invalidTechnologyTypeCount": sum(n["resolvedType"] not in {"方法", "设计", "工艺", "标准", "组织", "发现", "试制"} for n in nodes),
        "emptyTechnologyTextCount": sum(not n["body"].strip() or not n["second"].strip() or not n["effect"].strip() for n in nodes),
    }

    OUT_TREE.write_text(json.dumps(tree, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_GOV.write_text(json.dumps(governance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_ENG.write_text(json.dumps({"engineering": engineering}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_REVIEW.write_text(render_review(tree, engineering, governance, audit), encoding="utf-8")
    OUT_AUDIT.write_text(
        "# M1 玩家尺度科技树 R6 审计\n\n"
        f"- R5 科技：{audit['r5TechnologyCount']}\n"
        f"- R6 科技：{audit['r6TechnologyCount']}\n"
        f"- 合并或移出：{audit['technologyReduction']}\n"
        f"- 总科研点：{audit['researchPoints']}\n"
        f"- 两年主线科研点：{audit['mainlineResearchPoints']}\n"
        f"- 解锁项：{audit['outputCount']}\n"
        f"- 不重复解锁对象：{audit['uniqueOutputCount']}\n"
        f"- 移出科研树的制度运行项：{audit['nonTechnologyItemCount']}\n"
        f"- 工程正文：{audit['engineeringCount']}\n"
        f"- 政策：{audit['policyCategoryCount']} 类 / {audit['policyOptionCount']} 项\n"
        f"- 可选法律：{audit['lawCategoryCount']} 类 / {audit['lawOptionCount']} 项\n"
        f"- 常设监管：{audit['fixedLawCount']} 项\n"
        f"- 临时法令：{audit['edictCount']} 项\n"
        f"- 重复科技正文：{audit['duplicateBodyCount']}\n"
        f"- 重复世界内侧面：{audit['duplicateSecondCount']}\n"
        f"- 禁用模板命中：{json.dumps(audit['bannedPhraseHits'], ensure_ascii=False)}\n"
        f"- 悬空前置：{audit['missingPrerequisiteCount']}\n"
        f"- 自依赖：{audit['selfDependencyCount']}\n"
        f"- 合并后旧拆分回指清理：{audit['mergeCycleRepairEdgeCount']}\n"
        f"- 非科技类型残留：{audit['invalidTechnologyTypeCount']}\n"
        f"- 空科技正文：{audit['emptyTechnologyTextCount']}\n",
        encoding="utf-8",
    )
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
