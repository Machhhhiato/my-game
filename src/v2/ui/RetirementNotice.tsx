import { useV2 } from '../store';

export function RetirementNotice() {
  const retirementNotice = useV2(s => s.retirementNotice);
  const dismissRetirement = useV2(s => s.dismissRetirement);

  if (!retirementNotice) return null;

  return (
    <div className="v2-overlay">
      <div className="v2-retire">
        <div className="v2-retire-title">旧原型已退役</div>
        <p>检测到旧「三人殖民地」原型存档。</p>
        <p>它<strong>不能载入</strong>新的河谷外拓主战役；旧档已作为本地备份保留，不会静默覆盖、也不会被硬转换为新战役数值。</p>
        <p>你将以「河谷应急协调会」身份开始余烬历元年·第 1 计划期的新战役。</p>
        <button className="v2-retire-btn" onClick={dismissRetirement}>保留备份并开始新战役</button>
      </div>
    </div>
  );
}
