import React, { FC } from "react";
import "./WinModal.sass";

export interface Props {
  attemptsMade: number;
  restartGame: () => void;
}

export const WinModal: FC<Props> = ({ attemptsMade, restartGame }) => {
  return (
    <div className="modal">
      <p className="modal__text">
        Ура, ВЫ выиграли!
        <br />
        это заняло <span>{`${attemptsMade}`}</span> ходов
      </p>
      <button className="btn-restart" onClick={restartGame}>
        сыграть еще
      </button>
    </div>
  );
};
