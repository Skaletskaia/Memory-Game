import React, { FC } from "react";
import "./LossModal.sass";

export interface Props {
  restartGame: () => void;
}

export const LossModal: FC<Props> = ({ restartGame }) => {
  return (
    <div className="modal">
      <p className="modal__text">
        УВЫ, ВЫ ПРОИГРАЛИ!
        <br />У ВАС КОНЧИЛИСЬ ХОДЫ
      </p>
      <button className="btn-restart" onClick={restartGame}>
        сыграть еще
      </button>
    </div>
  );
};
