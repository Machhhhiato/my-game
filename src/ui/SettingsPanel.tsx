import { useRef } from 'react';
import { useGame } from '../store/useGame';
import { E } from '../engine';
import { exportSave, importSave } from '../core/save';
import { isTauri, showWidgetWindow } from '../lib/tauri';

export function SettingsPanel() {
  const state = useGame(s => s.state);
  const refresh = useGame(s => s.refresh);
  const setToast = useGame(s => s.setToast);
  const toggleMini = useGame(s => s.toggleMini);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    void f.text().then(txt => {
      const s = importSave(txt);
      if (s) {
        E.replace(s);
        refresh();
        setToast('✅ 存档导入成功');
      } else {
        setToast('❌ 存档格式无效');
      }
    });
    e.target.value = '';
  };

  return (
    <div className="panel settings-panel">
      <h2>⚙️ 设置</h2>
      <div className="set-group">
        <button className="btn" onClick={() => { E.save(); setToast('✅ 已保存'); }}>💾 立即保存</button>
        <button className="btn" onClick={() => { exportSave(state); }}>📤 导出存档</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>📥 导入存档</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
      </div>
      <div className="set-group">
        <button
          className="btn"
          onClick={() => { if (isTauri) void showWidgetWindow(); else toggleMini(); }}
        >
          🪐 显示星球视窗(桌面小组件)
        </button>
        {!isTauri && <div className="set-note">浏览器模式:星球视窗以浮动小窗显示;打包成桌面应用后可常驻桌面置顶。</div>}
      </div>
      <div className="set-group">
        <button
          className="btn danger"
          onClick={() => {
            if (window.confirm('确定要放弃当前殖民地,重新开始吗?')) {
              E.reset();
              refresh();
              setToast('🔄 新的殖民地开始了');
            }
          }}
        >
          🔄 重新开始(清空进度)
        </button>
      </div>
      <div className="set-group about">
        <div>群星挂机 v0.1.0 · M1 演示版</div>
        <div>第一幕:坠落殖民地(环世界式) → 火箭升空</div>
        <div>第二幕(母星系)与第三幕(银河时代)开发中</div>
        <div className="set-note">
          挂机提示:离线收益按 60% 效率结算,上限 8 小时;游戏空闲 CPU 占用目标 ≤2%。
        </div>
      </div>
    </div>
  );
}
