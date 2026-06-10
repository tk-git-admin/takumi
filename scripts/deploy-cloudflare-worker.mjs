import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const BASE_WORKER_NAME = 'takumi';
const WRANGLER_PACKAGE = 'wrangler@3.114.17';
const DEFAULT_PRODUCTION_BRANCH = 'main';

export function normalizeBranchName(branch) {
	return String(branch || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function getBranchName(env) {
	return (
		env.WORKERS_CI_BRANCH ||
		env.CF_BRANCH ||
		env.CF_PAGES_BRANCH ||
		env.GITHUB_REF_NAME ||
		env.BRANCH ||
		''
	);
}

export function resolveWorkerName(env = process.env) {
	const branchName = normalizeBranchName(getBranchName(env));
	const productionBranchName = normalizeBranchName(
		env.WORKERS_CI_PRODUCTION_BRANCH || env.CF_PRODUCTION_BRANCH || DEFAULT_PRODUCTION_BRANCH,
	);

	if (!branchName || branchName === productionBranchName) {
		return BASE_WORKER_NAME;
	}

	return `${branchName}-${BASE_WORKER_NAME}`;
}

export function buildWranglerArgs(commandArgs, env = process.env) {
	const args = [WRANGLER_PACKAGE, '--cwd', '.output', ...commandArgs];

	if (!commandArgs.includes('--name')) {
		args.push('--name', resolveWorkerName(env));
	}

	return args;
}

function deploy(commandArgs) {
	if (commandArgs.length === 0) {
		console.error('Usage: node scripts/deploy-cloudflare-worker.mjs <wrangler command>');
		process.exitCode = 1;
		return;
	}

	const args = buildWranglerArgs(commandArgs);
	console.log(`Deploying Cloudflare Worker: ${resolveWorkerName()}`);

	const result = spawnSync('npx', args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
	});

	if (result.error) {
		console.error(result.error);
		process.exitCode = 1;
		return;
	}

	process.exitCode = result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	deploy(process.argv.slice(2));
}
