#!/usr/bin/env node

/**
 * Completion gate between the implementation agent and Codex review.
 * It intentionally does not send messages, commit code, or push anything.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const manifestPath = resolve(root, '.codex/review-ready.json');

function fail(message) {
  console.error(`review-handoff: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const result = { artifacts: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--task' || item === '--summary' || item === '--artifact') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error(`缺少 ${item} 的值`);
      i += 1;
      if (item === '--task') result.task = value;
      if (item === '--summary') result.summary = value;
      if (item === '--artifact') result.artifacts.push(value);
    } else {
      throw new Error(`不支持的参数：${item}`);
    }
  }
  return result;
}

function pathInsideRoot(input) {
  const absolute = resolve(root, input);
  const rel = relative(root, absolute);
  return rel !== '' && !rel.startsWith(`..${sep}`) && rel !== '..' && !rel.includes(`${sep}..${sep}`)
    ? { absolute, relative: rel }
    : null;
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} 失败（退出码 ${result.status}）`);
}

function removeStaleManifest() {
  if (existsSync(manifestPath)) unlinkSync(manifestPath);
}

function mark(options) {
  if (!options.task) throw new Error('mark 需要 --task');
  if (!options.summary) throw new Error('mark 需要 --summary');
  if (options.artifacts.length === 0) throw new Error('mark 至少需要一个 --artifact');

  // A failed new attempt must never leave a previous success signal behind.
  removeStaleManifest();

  const artifacts = options.artifacts.map((item) => {
    const checked = pathInsideRoot(item);
    if (!checked) throw new Error(`产物必须位于项目目录内：${item}`);
    if (!existsSync(checked.absolute) || !statSync(checked.absolute).isFile() || statSync(checked.absolute).size === 0) {
      throw new Error(`产物不存在或为空：${checked.relative}`);
    }
    return checked.relative;
  });

  run('npm', ['run', 'typecheck']);
  run('npm', ['run', 'build']);
  run('git', ['diff', '--check']);

  mkdirSync(resolve(root, '.codex'), { recursive: true });
  const manifest = {
    taskId: options.task,
    status: 'ready_for_codex_review',
    completedAt: new Date().toISOString(),
    checks: { typecheck: 'passed', build: 'passed', diffCheck: 'passed' },
    artifacts,
    summary: options.summary,
  };
  const tempPath = `${manifestPath}.${process.pid}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  renameSync(tempPath, manifestPath);
  console.log(`review-handoff: 已写入完成信号（${options.task}）`);
}

function check(options) {
  if (!options.task) throw new Error('check 需要 --task');
  if (!existsSync(manifestPath)) throw new Error('尚未收到正式完成信号');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.taskId !== options.task || manifest.status !== 'ready_for_codex_review') {
    throw new Error('完成信号不属于当前任务或状态无效');
  }
  console.log(JSON.stringify(manifest));
}

const [action, ...argv] = process.argv.slice(2);
try {
  const options = parseArgs(argv);
  if (action === 'mark') mark(options);
  else if (action === 'check') check(options);
  else throw new Error('用法：review-handoff.mjs mark|check --task <任务编号> ...');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
