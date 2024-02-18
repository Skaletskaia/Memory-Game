import React from "react";
import "./App.sass";
import { Card } from "../Card/Card";

import { arrayImg } from "../../images/images";

export function App() {
  const [attemptsLeft, setAttemptsLeft] = React.useState<number>(40);
  const [attemptsMade, setAttemptsMade] = React.useState<number>(0);
  const [game, setGame] = React.useState<number>(1);
  const [score, setScore] = React.useState<number>(0);

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

    // console.log(firstSelectCard, secondSelectCard);

    if (cardItem && firstSelectCard === null) {
      setFirstSelectCard(cardItem as HTMLElement);
    }
    if (cardItem && firstSelectCard !== null) {
      setSecondSelectCard(cardItem as HTMLElement);
    }
  };

  // изменение стилей
  const changeCardStyle = (element: HTMLElement) => {};

  // переворот карточки когда firstSelectCard обновляется
  React.useEffect(() => {
    // console.log(firstSelectCard);
    // console.dir(firstSelectCard);

    if (firstSelectCard) {
      firstSelectCard.style.backgroundColor = "#E5E5E5";
    }

    const imgLogo = firstSelectCard?.children[0];
    const imgGame = firstSelectCard?.children[1];

    imgLogo?.classList.add("cards__item-img--hidden");
    imgGame?.classList.remove("cards__item-img--hidden");
  }, [firstSelectCard]);

  // переворот карточки когда firstSelectCard обновляется
  React.useEffect(() => {
    // console.log(firstSelectCard);
    // console.dir(firstSelectCard);

    if (secondSelectCard) {
      secondSelectCard.style.backgroundColor = "#E5E5E5";
    }

    const imgLogo = secondSelectCard?.children[0];
    const imgGame = secondSelectCard?.children[1];

    imgLogo?.classList.add("cards__item-img--hidden");
    imgGame?.classList.remove("cards__item-img--hidden");
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
        // setScore(+1);
        firstSelectCard.style.visibility = "hidden";
        secondSelectCard.style.visibility = "hidden";
      }
      //карточки НЕ совпали
      else {
        setTimeout(() => {
          firstSelectCard;
        }, 1500);

        setFirstSelectCard(null);
        setSecondSelectCard(null);
      }
    }
  }, [secondSelectCard]);

  // ! // делается перерендариг!!! должен быть всего 1 раз! или когда кнопка "сыграть еще"
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

// / const [arrayImages, setArrayImages] = React.useState(null); // тут будет 8 картинок, но ячеек 16

// const idCardItem = (cardItem as HTMLElement).dataset.id;

// if (idCardItem) {
//   setFirstSelectCard(idCardItem);
//   // console.log(cardItem);
// }

// //создание массива из картинок и его перемешивание
// const createArrayImg = (arrayImg: string[]) => {
//   let resoultArrayImg = arrayImg.concat(arrayImg);
//   return resoultArrayImg.sort(() => Math.random() - 0.5);
// };

// const updCardImg = () => {
//   console.log(firstSelectCard);

//   console.dir(firstSelectCard);

//   const imgLogo = firstSelectCard?.children[0];
//   const imgGame = firstSelectCard?.children[1];

//   imgLogo?.classList.add("cards__item-img--hidden");
//   imgGame?.classList.remove("cards__item-img--hidden");
// };
