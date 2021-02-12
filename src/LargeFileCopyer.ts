import * as es from 'event-stream';
import * as fs from 'fs-extra';

export default class LargeFileCopyer {
	private currentLineNum = 0;
	private readStream: fs.ReadStream;
	private writeStream: fs.WriteStream;

	constructor(
		private fromPath: string,
		private toPath: string
	){}

	async copy(fromLine?: number, toLine?: number) {
		this.init();
		await this.copyFile(fromLine, toLine);
	}

	private init() {
		this.initWriteStream();
		this.initReadStream();
	}

	private initWriteStream() {
		fs.ensureFile(this.toPath, err => {
			if (err) {
				throw err;
			}

			this.writeStream = fs.createWriteStream(this.toPath);
		});
	}

	private initReadStream() {
		this.readStream = fs.createReadStream(this.fromPath);
	}

	private copyFile(fromLineNum = 1, toLineNum?: number) {
		return new Promise<void>((resolve, reject) => {
			this.readStream
			.pipe(es.split())
			.pipe(es.mapSync((line: string) => {
				// pause reading to write the current line
				this.pauseReading();
				
				this.incrementCurrentLine();
	
				if(this.isWithinRequestedLineBoundaries(this.currentLineNum, fromLineNum, toLineNum)) this.writeLine(line);
			
				this.resumeReading();
			}))
			.on("error", (err => {
				this.handleError(err);
				reject();
			}))
			.on("end", () => {
				console.log(`Finished copying from line ${fromLineNum} to line ${toLineNum ? toLineNum : this.currentLineNum}`);
				this.stopWriting();
				resolve();
			});
		});
	}

	private incrementCurrentLine() {
		this.currentLineNum += 1;
	}

	private pauseReading() {
		this.readStream.pause();
	}

	private resumeReading() {
		this.readStream.resume();
	}

	private writeLine(content: string) {
		this.writeStream.write(content);
	}

	private stopWriting() {
		this.writeStream.end();
	}

	private isWithinRequestedLineBoundaries(currentLineNum: number, fromLineNum: number, toLineNum?: number): boolean {
		// If no to line number value is passed, continue until end of file
		if (toLineNum === undefined || toLineNum === null) return currentLineNum >= fromLineNum;
	
		return currentLineNum >= fromLineNum && currentLineNum < toLineNum;
	}

	private handleError(error: Error) {
		console.error("Error while reading file: ", error);
	}

}