import arbiter from '../../arbiter/arbiter';
import { useAppContext } from '../../contexts/Context';
import { generateCandidates } from '../../reducer/actions/move';

const Piece = ({
    rank,
    file,
    piece,
}) => {

    const { appState, dispatch } = useAppContext();
    const { turn, castleDirection, position: currentPosition } = appState;

    const showCandidateMoves = () => {
        if (turn === piece[0]) {
            const candidateMoves =
                arbiter.getValidMoves({
                    position: currentPosition[currentPosition.length - 1],
                    prevPosition: currentPosition[currentPosition.length - 2],
                    castleDirection: castleDirection[turn],
                    piece,
                    file,
                    rank
                });
            dispatch(generateCandidates({ candidateMoves }));
        }
    };

    const clearCandidateMoves = () => {
        dispatch(generateCandidates({ candidateMoves: [] }));
    };

    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
        showCandidateMoves();
    };

    const onDragEnd = e => {
        e.target.style.display = 'block';
        clearCandidateMoves(); // optional to clean up after drag
    };

    return (
        <div
            className={`piece ${piece} p-${file}${rank}`}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMouseDown={showCandidateMoves}  // 👈 Show moves while pressed
            onMouseUp={clearCandidateMoves}   // 👈 Clear on release
        />
    );
};

export default Piece;
