import {
  activateCivilizationPolicy,
  advanceNationKernelDays,
  createGlobalUnificationPlaytestState,
  startCivilizationTechnology,
  startNationalDevelopmentProject,
  validateNationKernel,
} from '../src/v2/nationKernel';

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const initial = createGlobalUnificationPlaytestState();
let technologyRoute = startCivilizationTechnology(initial, 'technology.regional-microgrid');
assert(technologyRoute !== initial, 'available timeline technology did not start');
assert(startCivilizationTechnology(technologyRoute, 'technology.ammonia-soil-recovery') === technologyRoute, 'parallel research bypassed the single research slot');
technologyRoute = advanceNationKernelDays(technologyRoute, 110);
assert(technologyRoute.civilizationSystems!.technologies['technology.regional-microgrid'].status === 'completed', 'regional microgrid technology did not complete');
assert(technologyRoute.civilizationSystems!.technologies['technology.satellite-debris-avoidance'].status === 'available', 'completed technology did not unlock its dependent');
assert(technologyRoute.civilizationSystems!.developmentProjects['project.regional-microgrid-program'].status === 'available', 'technology did not unlock national project');

let projectRoute = startNationalDevelopmentProject(technologyRoute, 'project.regional-microgrid-program');
projectRoute = advanceNationKernelDays(projectRoute, 70);
assert(projectRoute.civilizationSystems!.developmentProjects['project.regional-microgrid-program'].status === 'completed', 'national project did not complete through reconstruction allocation');
assert(projectRoute.civilizationSystems!.globalUnification.sharedInfrastructure > technologyRoute.civilizationSystems!.globalUnification.sharedInfrastructure, 'completed project did not create infrastructure outcome');

let policyRoute = activateCivilizationPolicy(initial, 'policy.emergency-power-sunset');
policyRoute = advanceNationKernelDays(policyRoute, 120);
assert(policyRoute.civilizationSystems!.policies['policy.emergency-power-sunset'].status === 'cooldown', 'timeline policy did not enter cooldown');
assert(policyRoute.civilizationSystems!.politics.legitimacy > initial.civilizationSystems!.politics.legitimacy, 'policy daily effect did not change politics');
assert(policyRoute.civilizationSystems!.globalUnification.commonInstitutionScore > initial.civilizationSystems!.globalUnification.commonInstitutionScore, 'policy completion effect did not change institutions');

for (const state of [technologyRoute, projectRoute, policyRoute]) { const validation=validateNationKernel(state); assert(validation.ok, validation.errors.join(', ')); }
console.log(JSON.stringify({ok:true,technology:technologyRoute.civilizationSystems!.technologies['technology.regional-microgrid'],project:projectRoute.civilizationSystems!.developmentProjects['project.regional-microgrid-program'],policy:policyRoute.civilizationSystems!.policies['policy.emergency-power-sunset']},null,2));
