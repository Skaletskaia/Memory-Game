import React, { FC } from "react";

import "./Card.sass";

import logo from "../../images/logo.svg";

export interface Props {
  img: string;
  onClickCard: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Card: FC<Props> = ({ img, onClickCard }) => {
  return (
    <React.Fragment>
      <div className="cards__item " onClick={onClickCard}>
        <img
          className="cards__item-img cards__item-img-logo "
          src={`${logo}`}
          alt=""
        />
        <img
          className="cards__item-img cards__item-img-game cards__item-img--hidden"
          src={`${img}`}
          alt=""
        />
      </div>
    </React.Fragment>
  );
};
