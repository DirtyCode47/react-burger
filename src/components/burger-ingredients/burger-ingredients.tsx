import { Tab, Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useEffect } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type Props = {
  ingredients: TIngredient[];
  onIngredientClick: (i: TIngredient) => void;
  constructorItems?: TIngredient[];
};

type TTab = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
  constructorItems = [],
}: Props): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bunRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sauceRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo((): Record<TTab, TIngredient[]> => {
    return {
      bun: ingredients.filter((i) => i.type === 'bun'),
      main: ingredients.filter((i) => i.type === 'main'),
      sauce: ingredients.filter((i) => i.type === 'sauce'),
    };
  }, [ingredients]);

  const getCount = (ingredient: TIngredient): number => {
    if (ingredient.type === 'bun') {
      const bun = constructorItems.find((i) => i.type === 'bun');
      return bun && bun._id === ingredient._id ? 2 : 0;
    }

    return constructorItems.filter((i) => i._id === ingredient._id).length;
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, tab: TTab): void => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentTab(tab);
  };

  useEffect((): (() => void) => {
    const handleScroll = (): void => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;

      const sections: { type: TTab; ref: React.RefObject<HTMLDivElement | null> }[] = [
        { type: 'bun', ref: bunRef },
        { type: 'main', ref: mainRef },
        { type: 'sauce', ref: sauceRef },
      ];

      let closest: { type: TTab; ref: React.RefObject<HTMLDivElement | null> } =
        sections[0];

      let minDiff = Infinity;

      sections.forEach((section) => {
        if (!section.ref.current) return;

        const diff = Math.abs(
          section.ref.current.getBoundingClientRect().top - containerTop
        );

        if (diff < minDiff) {
          minDiff = diff;
          closest = section;
        }
      });

      setCurrentTab(closest.type);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return (): void => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={(): void => scrollTo(bunRef, 'bun')}
          >
            Булки
          </Tab>

          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={(): void => scrollTo(sauceRef, 'sauce')}
          >
            Соусы
          </Tab>

          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={(): void => scrollTo(mainRef, 'main')}
          >
            Начинки
          </Tab>
        </ul>
      </nav>

      <div ref={containerRef} className={`${styles.scroll} custom-scroll`}>
        <section ref={bunRef} className="mt-10">
          <h2 className="text text_type_main-medium mb-6">Булки</h2>

          <ul className={styles.grid}>
            {grouped.bun.map((item) => {
              const count = getCount(item);

              return (
                <li
                  key={item._id}
                  className={styles.card}
                  onClick={(): void => onIngredientClick(item)}
                >
                  {count > 0 && (
                    <Counter count={count} size="default" extraClass={styles.counter} />
                  )}

                  <img src={item.image} alt={item.name} className={styles.image} />

                  <div className={styles.price}>
                    <p className="text text_type_digits-default mr-2">{item.price}</p>
                    <CurrencyIcon type="primary" />
                  </div>

                  <p className={`${styles.name} text text_type_main-default`}>
                    {item.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section ref={sauceRef} className="mt-10 mb-10">
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>

          <ul className={styles.grid}>
            {grouped.sauce.map((item) => {
              const count = getCount(item);

              return (
                <li
                  key={item._id}
                  className={styles.card}
                  onClick={(): void => onIngredientClick(item)}
                >
                  {count > 0 && (
                    <Counter count={count} size="default" extraClass={styles.counter} />
                  )}

                  <img src={item.image} alt={item.name} className={styles.image} />

                  <div className={styles.price}>
                    <p className="text text_type_digits-default mr-2">{item.price}</p>
                    <CurrencyIcon type="primary" />
                  </div>

                  <p className={`${styles.name} text text_type_main-default`}>
                    {item.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section ref={mainRef} className="mt-10">
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>

          <ul className={styles.grid}>
            {grouped.main.map((item) => {
              const count = getCount(item);

              return (
                <li
                  key={item._id}
                  className={styles.card}
                  onClick={(): void => onIngredientClick(item)}
                >
                  {count > 0 && (
                    <Counter count={count} size="default" extraClass={styles.counter} />
                  )}

                  <img src={item.image} alt={item.name} className={styles.image} />

                  <div className={`${styles.price} mt-1`}>
                    <p className="text text_type_digits-default mr-2">{item.price}</p>
                    <CurrencyIcon type="primary" />
                  </div>

                  <p className={`${styles.name} text text_type_main-default`}>
                    {item.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </section>
  );
};
