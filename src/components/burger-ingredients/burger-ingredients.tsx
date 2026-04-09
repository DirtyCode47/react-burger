import { Tab, Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useEffect } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type Props = {
  ingredients: TIngredient[];
  onIngredientClick: (i: TIngredient) => void;
  constructorItems?: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
  constructorItems = [],
}: Props) => {
  const [currentTab, setCurrentTab] = useState<'bun' | 'main' | 'sauce'>('bun');

  const containerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    return {
      bun: ingredients.filter((i) => i.type === 'bun'),
      main: ingredients.filter((i) => i.type === 'main'),
      sauce: ingredients.filter((i) => i.type === 'sauce'),
    };
  }, [ingredients]);

  const getCount = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      const bun = constructorItems.find((i) => i.type === 'bun');
      return bun && bun._id === ingredient._id ? 2 : 0;
    }

    return constructorItems.filter((i) => i._id === ingredient._id).length;
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>, tab: typeof currentTab) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentTab(tab);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;

      const sections = [
        { type: 'bun', ref: bunRef },
        { type: 'main', ref: mainRef },
        { type: 'sauce', ref: sauceRef },
      ] as const;

      let closest = sections[0];
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

    return () => {
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
            onClick={() => scrollTo(bunRef, 'bun')}
          >
            Булки
          </Tab>

          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => scrollTo(mainRef, 'main')}
          >
            Начинки
          </Tab>

          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => scrollTo(sauceRef, 'sauce')}
          >
            Соусы
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
                  onClick={() => onIngredientClick(item)}
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
                  onClick={() => onIngredientClick(item)}
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
                  onClick={() => onIngredientClick(item)}
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
      </div>
    </section>
  );
};
