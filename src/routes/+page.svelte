<script>
	import { onMount } from 'svelte';
	import { Chess as ChessJS } from 'chess.js';
	import {
		INPUT_EVENT_TYPE,
		COLOR,
		Chessboard,
		MARKER_TYPE
	} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';
	import 'cm-chessboard/assets/styles/cm-chessboard.css';
	import { Bot } from './bot';

	onMount(() => {
		const bot = new Bot();
		const botInit = bot.init(); // promise that resolves when SF is ready
		const chess = new ChessJS();
		const board = new Chessboard(document.getElementById('boardId'), {
			position: chess.fen(),
			sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' },
			style: { moveFromMarker: undefined, moveToMarker: undefined }, // disable standard markers
			orientation: COLOR.white
		});

		function inputHandler(event) {
			console.log('event', event);
			event.chessboard.removeMarkers(MARKER_TYPE.dot);
			switch (event.type) {
				/* user starts dragging */
				case INPUT_EVENT_TYPE.moveInputStarted: {
					const moves = chess.moves({ square: event.square, verbose: true });
					for (const move of moves) {
						// draw dots on possible squares
						event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
					}
					return moves.length > 0;
				}
				/* user drops */
				case INPUT_EVENT_TYPE.validateMoveInput: {
					const valid = chess.move({ from: event.squareFrom, to: event.squareTo });
					if (valid) {
						// this should be immediate most of the time
						botInit.then(async () => {
							bot.inform(chess.fen()); // tell SF to think about it's move
							event.chessboard.disableMoveInput();
							await this.chessboard.state.moveInputProcess;
							await this.chessboard.setPosition(chess.fen(), true);
							if (!chess.isGameOver()) {
								const botMove = await bot.getMove();
								chess.move(botMove);
								await event.chessboard.setPosition(chess.fen(), true);
								if (!chess.isGameOver()) {
									event.chessboard.enableMoveInput(inputHandler, COLOR.white);
								}
							}
							if (chess.isGameOver()) alert('Game Over');
						});
					} else {
						console.log('Invalid move');
					}
					return valid;
				}
			}
		}

		board.enableMoveInput(inputHandler, COLOR.white);
	});
</script>

<svelte:head>
	<script src="stockfish.js"></script>
	<title>min-chess</title>
</svelte:head>

<main>
	<h1>min-chess</h1>
	<div id="boardId" />
	<p>
		Made by <a target="_blank" href="https://miikat.dev">Miika Tuominen</a>. Check out the
		<a target="_blank" href="https://github.com/discapes/min-chess">source code</a>.
	</p>
</main>

<style>
	#boardId {
		border: 2px solid black;
		height: 400px;
		width: 400px;
	}
	main {
		max-width: 400px;
		margin: auto;
	}
	:global(body) {
		background-color: lightyellow;
		color: #505050;
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
			sans-serif;
	}
</style>
