const SKILL_LEVEL = 20;
const MOVETIME_MS = 500;
const DEPTH = 22;

export class Bot {
	msg;
	resolveBestMove;
	bestMovePromise;

	async init() {
		// eslint-disable-next-line no-undef
		const sf = await Stockfish();
		this.msg = (msg) => {
			console.log('> ' + msg);
			sf.postMessage(msg);
		};
		sf.addMessageListener((line) => {
			console.log(line);
			if (line.startsWith('bestmove')) {
				const moveStr = line.split(' ')[1];
				this.resolveBestMove({
					from: moveStr[0] + moveStr[1],
					to: moveStr[2] + moveStr[3],
					promotion: moveStr[4]
				});
			}
		});
		this.msg(`setoption name Skill Level value ${SKILL_LEVEL}`);
		this.msg('isready');
		this.msg('ucinewgame');
	}

	inform(fen) {
		this.msg(`position fen ${fen}`);
		this.msg(`go movetime ${MOVETIME_MS} depth ${DEPTH}`);
		this.bestMovePromise = new Promise((res) => (this.resolveBestMove = res));
	}

	getMove() {
		return this.bestMovePromise;
	}
}
