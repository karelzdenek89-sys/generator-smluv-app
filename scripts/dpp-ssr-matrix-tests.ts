import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;
const npmCommand = npmCli ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';

for (const enabled of ['false', 'true'] as const) {
  const env = { ...process.env, FREE_FUNNEL_EXPERIMENTS_ENABLED: enabled };
  const label = enabled === 'true' ? 'free_experiment' : 'paid';
  console.log(`\nBuilding DPP SSR matrix variant: ${label}`);

  for (const args of [['run', 'build'], ['run', 'test:dpp-ssr']] as const) {
    const commandArgs = npmCli ? [npmCli, ...args] : [...args];
    const result = spawnSync(npmCommand, commandArgs, { env, stdio: 'inherit' });
    if (result.status !== 0) {
      if (result.error) console.error(result.error);
      process.exit(result.status ?? 1);
    }
  }
}

console.log('\nDPP paid/free SSR matrix passed.');
