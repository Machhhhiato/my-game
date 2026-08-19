import { advanceNationKernelDays, createGlobalUnificationPlaytestState, selectStrategicDirection, strategicBoardObjects, strategicDirectionOptions } from '../src/v2/nationKernel';

const catalog = strategicDirectionOptions();
const boardObjects = strategicBoardObjects();
const domains = [...new Set(Object.values(catalog).map(option=>option.domain))];
if (domains.length !== 21) throw new Error(`expected 21 domains, got ${domains.length}`);

for (const domain of domains) {
  const options = Object.values(catalog).filter(option=>option.domain===domain);
  if (options.length < 4) throw new Error(`${domain} has fewer than four options`);
  if (new Set(options.map(option=>option.title)).size !== options.length) throw new Error(`${domain} has duplicate titles`);
  const axes = Object.keys(options[0].metrics) as Array<keyof typeof options[0]['metrics']>;
  if (!axes.some(axis=>Math.max(...options.map(option=>option.metrics[axis]))-Math.min(...options.map(option=>option.metrics[axis]))>=40)) throw new Error(`${domain} lacks a meaningful opposition gap`);
  if (options.some(option=>option.consequences.length<2||option.beneficiary===option.burdenBearer)) throw new Error(`${domain} lacks social consequence differentiation`);
  const objects=boardObjects[domain];
  if (objects.length<4) throw new Error(`${domain} has fewer than four operating objects`);
  if (objects.some(object=>!object.input||!object.output||!object.nextAction)) throw new Error(`${domain} has an incomplete operating object`);
}

let state = createGlobalUnificationPlaytestState();
const nationOptions = Object.values(catalog).filter(option=>option.domain==='nation');
state = selectStrategicDirection(state,'nation',nationOptions[0].id);
const locked = selectStrategicDirection(state,'nation',nationOptions[1].id);
if (locked !== state) throw new Error('direction revision ignored the 90-day cooldown');
state = advanceNationKernelDays(state,90);
state = selectStrategicDirection(state,'nation',nationOptions[1].id);
if (state.civilizationSystems?.strategicDirections.nation.selectedOptionId!==nationOptions[1].id) throw new Error('direction did not become revisable after cooldown');

console.log(JSON.stringify({ok:true,domains:domains.length,directionOptions:Object.keys(catalog).length,operatingObjects:Object.values(boardObjects).flat().length,minimumPerDomain:4,selectionCooldownDays:90},null,2));
