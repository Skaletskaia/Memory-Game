import React from "react";
import "./App.sass";
import { Card } from "../Card/Card";

import { arrayImg } from "../../images/images";

export function App() {
  const [attemptsLeft, setAttemptsLeft] = React.useState<number>(40);
  const [attemptsMade, setAttemptsMade] = React.useState<number>(0);
  const [game, setGame] = React.useState<number>(1);
  const [score, setScore] = React.useState<number>(0); // когда будет 8 выиграл

  const [resultArrayImg, setResultArrayImg] = React.useState<string[]>([]);

  const [firstSelectCard, setFirstSelectCard] =
    React.useState<HTMLElement | null>(null);
  const [secondSelectCard, setSecondSelectCard] =
    React.useState<HTMLElement | null>(null);

  const countCards = 16;

  // создание массива карточек
  const createArrayDiv = (): string[] => {
    let arrayCards: string[] = [];
    for (let i: number = 1; i < countCards + 1; i++) {
      arrayCards.push(i.toString());
    }

    return arrayCards;
  };

  //создание массива из картинок и его перемешивание
  const createArrayImg = (arrayImg: string[]) => {
    let resoultArrayImg = arrayImg.concat(arrayImg);
    return resoultArrayImg.sort(() => Math.random() - 0.5);
  };

  // получение HTML элемента карточки по клику
  const onClickCard = (e: React.MouseEvent<HTMLElement>) => {
    const cardItem = (e.target as HTMLElement).closest(".cards__item");

    // изменение кол-ва попыток
    setAttemptsLeft((attemptsLeft) => attemptsLeft - 1);
    setAttemptsMade((attemptsMade) => attemptsMade + 1);

    // console.log(firstSelectCard, "test");
    // console.log(secondSelectCard, "test");

    // закрывать карточки после 2 открытых
    if (firstSelectCard !== null && secondSelectCard !== null) {
      clearTimeout(myTimeout);

      closeCard(firstSelectCard);
      closeCard(secondSelectCard);
      setFirstSelectCard(null);
      setSecondSelectCard(null);
    }

    if (cardItem && firstSelectCard === null) {
      setFirstSelectCard(cardItem as HTMLElement);

      console.log(firstSelectCard, "test");
      console.log(secondSelectCard, "test");
    }
    if (cardItem && firstSelectCard !== null && secondSelectCard === null) {
      setSecondSelectCard(cardItem as HTMLElement);
    }
  };

  // открыть карточку
  const openCard = (element: HTMLElement) => {
    if (element) {
      element.style.backgroundColor = "#E5E5E5";
      element.classList.add("cards__item--disabled");
    }
    const imgLogo = element?.children[0];
    const imgGame = element?.children[1];

    imgLogo?.classList.add("cards__item-img--hidden");
    imgGame?.classList.remove("cards__item-img--hidden");
  };

  // закрыть карточку
  const closeCard = (element: HTMLElement) => {
    if (element) {
      element.style.backgroundColor = "";
      element.classList.remove("cards__item--disabled");
    }

    const imgLogo = element?.children[0];
    const imgGame = element?.children[1];

    imgLogo?.classList.remove("cards__item-img--hidden");
    imgGame?.classList.add("cards__item-img--hidden");
  };

  // setTimeout на закрытие картинок

  let myTimeout: ReturnType<typeof setTimeout>;

  function startTimeout() {
    myTimeout = setTimeout(() => {
      if (firstSelectCard && secondSelectCard) {
        closeCard(firstSelectCard);
        closeCard(secondSelectCard);

        setFirstSelectCard(null);
        setSecondSelectCard(null);
      }
      console.log("time is off");
    }, 1500);
  }

  // переворот карточки когда firstSelectCard обновляется
  React.useEffect(() => {
    if (firstSelectCard) {
      openCard(firstSelectCard);
    }
  }, [firstSelectCard]);

  // переворот карточки когда secondSelectCard обновляется
  React.useEffect(() => {
    if (secondSelectCard) {
      openCard(secondSelectCard);
    }
  }, [secondSelectCard]);

  // сравниваем 1 и 2 карточки
  React.useEffect(() => {
    const firstCard = firstSelectCard?.children[1] as HTMLImageElement;
    const secondCard = secondSelectCard?.children[1] as HTMLImageElement;

    // console.log(firstCard);

    if (firstCard) {
      const firstImg = firstCard.src;
      const secondImg = secondCard.src;

      //карточки совпали
      if (
        firstSelectCard !== null &&
        secondSelectCard !== null &&
        firstImg === secondImg
      ) {
        setScore((score) => score + 1); // когда 8 конец игры
        firstSelectCard.style.visibility = "hidden";
        secondSelectCard.style.visibility = "hidden";
      }
      //карточки НЕ совпали
      else {
        startTimeout();
      }
    }
  }, [secondSelectCard]);

  // ! // делается перерендариг картинок!!! должен быть всего 1 раз! или когда кнопка "сыграть еще"
  React.useEffect(() => {
    setResultArrayImg(createArrayImg(arrayImg));

    console.log("tesssst");
  }, [game]);

  return (
    <React.Fragment>
      <main className="main">
        <div className="container">
          <h1 className="main__title">Memory</h1>
          <div className="grid">
            <p className="main__text main__text-made">
              сделано ходов
              <br />
              <span className="main__text--attempts-made">{attemptsMade}</span>
            </p>
            <div className="cards">
              {createArrayDiv().map((item: string, index) => {
                return (
                  <Card
                    key={item}
                    dataId={item}
                    img={resultArrayImg[index]}
                    onClickCard={onClickCard}
                  />
                );
              })}
            </div>
            <p className="main__text main__text-left">
              осталось попыток
              <br />
              <span className="main__text--attempts-left">{attemptsLeft}</span>
            </p>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
