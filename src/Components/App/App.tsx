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

  // храним таймер тут
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

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

    // третий клик - закрыть открытые каротчки
    if (firstSelectCard !== null && secondSelectCard !== null) {
      closeCard(firstSelectCard);
      closeCard(secondSelectCard);

      // записываем данные в firstSelectCard и останавливаем таймер (он должен был закрыть карточки, но они уже закрыты)
      if (cardItem) {
        setFirstSelectCard(cardItem as HTMLElement);
        console.log("занесли первую карточку которая третья");
        if (timer) {
          stopTimeout(timer);
        }
      }
    }

    // первый клик - firstSelectCard
    if (cardItem && firstSelectCard === null) {
      console.log("занесли первую карточку");
      setFirstSelectCard(cardItem as HTMLElement);
    }

    // второй клик - secondSelectCard
    if (cardItem && firstSelectCard !== null && secondSelectCard === null) {
      console.log("занесли вторую карточку");

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
    console.log("закрываю карточки");

    setFirstSelectCard(null);
    setSecondSelectCard(null);
  };

  // setTimeout на закрытие картинок
  function startTimeout(
    callback: () => void,
    duration: number
  ): ReturnType<typeof setTimeout> {
    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => {
      callback();
      console.log("таймер закончился", timeoutId);
    }, duration);
    return timeoutId;
  }

  // функция для setTimeout
  function timeoutCallback(): void {
    if (firstSelectCard && secondSelectCard) {
      closeCard(firstSelectCard);
      closeCard(secondSelectCard);
    }
  }
  // стоп таймаут
  function stopTimeout(timeoutId: ReturnType<typeof setTimeout>) {
    console.log("убираем таймер", timeoutId);
    clearTimeout(timeoutId);
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

  // переворот карточки когда firstSelectCard или secondSelectCard обновляются
  React.useEffect(() => {
    if (firstSelectCard) {
      openCard(firstSelectCard);
      console.log(firstSelectCard);
    }
    if (secondSelectCard) {
      openCard(secondSelectCard);
      console.log(secondSelectCard);
    }
  }, [firstSelectCard, secondSelectCard]);

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
        console.log("угадали");
        setFirstSelectCard(null);
        setSecondSelectCard(null);

        setScore((score) => score + 1); // когда 8 конец игры

        // небольшая пауза перед тем как скрыть картинки
        setTimeout(() => {
          firstSelectCard.style.visibility = "hidden";
          secondSelectCard.style.visibility = "hidden";

          if (score !== 8) {
            unlockClickCards();
          }
        }, 300);
      }
      //карточки НЕ совпали
      else {
        // таймаут стартует (2 карточки не совпали, то эти карточки закрываются (через 1500мс))
        console.log("не угадали");
        console.log("таймер запустился");
        setTimer(startTimeout(timeoutCallback, 1500));
        console.log("таймаут айди = ", timer);
      }
    }
  }, [secondSelectCard]);

  //  перерендариг картинок!!
  React.useEffect(() => {
    setResultArrayImg(createArrayImg(arrayImg));
  }, []);

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
          {score === 8 ? (
            <WinModal attemptsMade={attemptsMade} restartGame={restartGame} />
          ) : null}

          {gameOff ? <LossModal restartGame={restartGame} /> : null}
        </div>
      </main>
    </React.Fragment>
  );
}
