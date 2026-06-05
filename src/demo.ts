import { createPlayer } from "./models/player";
import { createBoard } from "./services/board";
import { getAvailableLines } from "./queries/lines";
import { applyMove } from "./services/move";

function printState(state: any) {
  console.log(`Status: ${state.status}`);
  console.log("Players:");
  for (const p of state.players) {
    console.log(` - ${p.id} ${p.name}: ${p.score}`);
  }
  console.log(`Current player: ${state.currentPlayerId}`);
  console.log(`Available lines: ${getAvailableLines(state).length}`);
}

function main() {
  const p1 = createPlayer("p1", "Alice", "red");
  const p2 = createPlayer("p2", "Bob", "blue");

  let state = createBoard(3, [p1, p2]); // 3 points per side => 2x2 boxes

  console.log("Starting demo game (gridSize=3, players Alice vs Bob)");
  printState(state);

  let moveCount = 0;
  while (state.status === "playing") {
    const available = getAvailableLines(state);
    if (available.length === 0) break;

    // Simple deterministic strategy: pick the first available line
    const line = available[0]!;
    const res = applyMove(state, line);
    moveCount += 1;

    if (!res.ok) {
      console.error("Move failed:", res.error, res.code);
      break;
    }

    state = res.value;
    console.log(`\nMove ${moveCount}: player ${state.currentPlayerId} played ${line.from.row},${line.from.col} -> ${line.to.row},${line.to.col}`);
    printState(state);
  }

  console.log("\nGame finished. Final scores:");
  for (const p of state.players) {
    console.log(` - ${p.name}: ${p.score}`);
  }

  const winners = state.players.filter((p: any) => p.score === Math.max(...state.players.map((x: any) => x.score)));
  if (winners.length === 1) console.log(`Winner: ${winners[0]!.name}`);
  else console.log(`Tie between: ${winners.map((w: any) => w.name).join(", ")}`);
}

main();
