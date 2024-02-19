import React from "react";
import "./App.sass";
import { Card } from "../Card/Card";
import { LossModal } from "../LossModal/LossModal";
import { WinModal } from "../WinModal/WinModal";

import { arrayImg } from "../../images/images";

export function App() {
  const [attemptsLeft, setAttemptsLeft] = React.useState<number>(40);
  const [attemptsMade, setAttemptsMade] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0); // когда будет 8 выиграл
  const [resultArrayImg, setResultArrayImg] = React.useState<string[]>([]);
  const [firstSelectCard, setFirstSelectCard] =
    React.useState<HTMLElement | null>(null);
  const [secondSelectCard, setSecondSelectCard] =
    React.useState<HTMLElement | null>(null);
  const [gameOff, setGameOff] = React.useState<boolean>(false);

  const mainDiv = document.querySelector(".cards");

  // создание массива карточек
  const createArrayDiv = (): string[] => {
    const countCards = 16;
    let arrayCards: string[] = [];
    for (let i: number = 0; i < countCards; i++) {
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
    clearTimeout(myTimeout);
    console.log("я кликнул");
    // закрывать карточки после 2 открытых
    if (firstSelectCard !== null && secondSelectCard !== null) {
      clearTimeout(myTimeout);
      console.log("я родился");

      closeCard(firstSelectCard);
      closeCard(secondSelectCard);

      setFirstSelectCard(null);
      setSecondSelectCard(null);

      // зачем это, если после сброса они будут нул и пойдут вниз
      if (cardItem) {
        setFirstSelectCard(cardItem as HTMLElement);
      }
    }

    if (cardItem && firstSelectCard === null) {
      setFirstSelectCard(cardItem as HTMLElement);
    }
    if (cardItem && firstSelectCard !== null && secondSelectCard === null) {
      setSecondSelectCard(cardItem as HTMLElement);
    }
  };

  // открыть карточку
  const openCard = (element: HTMLElement) => {
    if (element) {
      element.style.backgroundColor = "#E5E5E5";
      element.classList.add("disabled");
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
      element.classList.remove("disabled");
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

        // багааа или нет
        // setFirstSelectCard(null);
        // setSecondSelectCard(null);
      }
      console.log("time is off");
    }, 1500);
  }

  // блокировка нажатия на карточки
  const blockClickCards = () => {
    if (mainDiv) {
      const htmlMainDiv = mainDiv as HTMLElement;
      htmlMainDiv.classList.add("disabled");
    }
  };

  // разблокировка нажатия на карточки
  const unlockClickCards = () => {
    if (mainDiv) {
      const htmlMainDiv = mainDiv as HTMLElement;
      htmlMainDiv.classList.remove("disabled");
    }
  };

  // изменение кол-ва попыток при сравнивании двух карточек
  const changeAttempts = () => {
    setAttemptsLeft((attemptsLeft) => attemptsLeft - 1);
    setAttemptsMade((attemptsMade) => attemptsMade + 1);
  };

  // провека попыток
  React.useEffect(() => {
    if (attemptsMade === 40) {
      blockClickCards();

      // добавила задержку, чтобы было видно карточки
      setTimeout(() => {
        setGameOff(true);
      }, 400);
    }
  }, [attemptsMade]);

  // сброс игры
  const restartGame = () => {
    location.reload();
  };

  // переворот карточки когда firstSelectCard обновляется
  React.useEffect(() => {
    if (firstSelectCard) {
      openCard(firstSelectCard);
      console.log(firstSelectCard);
    }
  }, [firstSelectCard]);

  // переворот карточки когда secondSelectCard обновляется
  React.useEffect(() => {
    if (secondSelectCard) {
      openCard(secondSelectCard);
      console.log(secondSelectCard);
    }
  }, [secondSelectCard]);

  // сравниваем 1 и 2 карточки
  React.useEffect(() => {
    const firstCard = firstSelectCard?.children[1] as HTMLImageElement;
    const secondCard = secondSelectCard?.children[1] as HTMLImageElement;

    if (firstCard && secondCard) {
      const firstImg = firstCard.src;
      const secondImg = secondCard.src;

      changeAttempts();

      //карточки совпали
      if (
        firstSelectCard !== null &&
        secondSelectCard !== null &&
        firstImg === secondImg
      ) {
        blockClickCards();
        console.log("я угадал");
        setFirstSelectCard(null);
        setSecondSelectCard(null);

        setScore((score) => score + 1); // когда 8 конец игры

        // небольшая пауза перед тем как скрыть картинки
        setTimeout(() => {
          firstSelectCard.style.visibility = "hidden";
          secondSelectCard.style.visibility = "hidden";

          // багааа
          // setFirstSelectCard(null);
          // setSecondSelectCard(null);

          // бага
          if (score !== 8) {
            unlockClickCards();
          }
        }, 300);
      }
      //карточки НЕ совпали
      else {
        // таймаут стартует
        console.log("я не угадал");
        startTimeout();
        setFirstSelectCard(null);
        setSecondSelectCard(null);
      }
    }
  }, [secondSelectCard]);

  //  перерендариг картинок!!
  React.useEffect(() => {
    setResultArrayImg(createArrayImg(arrayImg));
  }, []);

  // console.log(score, "score");

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
          {/* открытие модального окна, если выиграл */}
          {score === 8 ? (
            <WinModal attemptsMade={attemptsMade} restartGame={restartGame} />
          ) : null}

          {gameOff ? <LossModal restartGame={restartGame} /> : null}
        </div>
      </main>
    </React.Fragment>
  );
}

// // проверка счета
// React.useEffect(() => {
//   if (score === 2) {
//     blockClickCards();
//   }
// }, [score]);

// 1/2/1/1 => удалится
