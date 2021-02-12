import yargs from 'yargs';
import LargeFileCopier from './LargeFileCopier';
import ora from 'ora';

(async () => {
	const args = yargs.options({
		'from-path': { type: 'string', demandOption: true, alias: 'fp' },
		'to-path': { type: 'string', demandOption: true, alias: 'tp' },
		'from-line': { type: 'number', demandOption: false, alias: 'fl' },
		'to-line': { type: 'number', demandOption: false, alias: 'tl' },
	}).argv;

	const beginCopyText = `Copying ${args['from-path']} to ${args['to-path']}\n\n`
	
	const spinner = ora(beginCopyText).start();
	
	const largeFileCopyer = new LargeFileCopier(args['from-path'], args['to-path']);
	
	await largeFileCopyer.copy(args['from-line'], args['to-line']);
	
	spinner.stop();
	process.exit(0);
})().catch(err => {
	console.error(err);
	process.exit(1);
});

