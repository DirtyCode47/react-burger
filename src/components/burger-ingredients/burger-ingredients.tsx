import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useEffect } from 'react';

import { Ingredient } from '@components/ingredient/ingredient';
import { selectIngredientCounts } from '@services/constructor/slice';
import { useAppSelector, useAppDispatch } from '@services/hooks';
import { setIngredient } from '@services/modal/slice';

//import type { TIngredient } from '@utils/types';
import styles from './burger-ingredients.module.css';

type TTab = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const ingredients = useAppSelector((s) => s.ingredients.items);
  const counts = useAppSelector(selectIngredientCounts);

  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bunRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sauceRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo(
    () => ({
      bun: ingredients.filter((i) => i.type === 'bun'),
      main: ingredients.filter((i) => i.type === 'main'),
      sauce: ingredients.filter((i) => i.type === 'sauce'),
    }),
    [ingredients]
  );

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, tab: TTab): void => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentTab(tab);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;

      const sections = [
        { type: 'bun' as TTab, ref: bunRef },
        { type: 'main' as TTab, ref: mainRef },
        { type: 'sauce' as TTab, ref: sauceRef },
      ];

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
            onClick={() => scrollTo(bunRef, 'bun')}
          >
            Булки
          </Tab>

          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => scrollTo(sauceRef, 'sauce')}
          >
            Соусы
          </Tab>

          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => scrollTo(mainRef, 'main')}
          >
            Начинки
          </Tab>
        </ul>
      </nav>

      <div ref={containerRef} className={`${styles.scroll} custom-scroll`}>
        <section ref={bunRef} className="mt-10">
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <ul className={styles.grid}>
            {grouped.bun.map((item) => (
              <Ingredient
                key={item._id}
                item={item}
                count={counts[item._id] || 0}
                onClick={() => dispatch(setIngredient(item))}
              />
            ))}
          </ul>
        </section>

        <section ref={sauceRef} className="mt-10 mb-10">
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>
          <ul className={styles.grid}>
            {grouped.sauce.map((item) => (
              <Ingredient
                key={item._id}
                item={item}
                count={counts[item._id] || 0}
                onClick={() => dispatch(setIngredient(item))}
              />
            ))}
          </ul>
        </section>

        <section ref={mainRef} className="mt-10">
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>
          <ul className={styles.grid}>
            {grouped.main.map((item) => (
              <Ingredient
                key={item._id}
                item={item}
                count={counts[item._id] || 0}
                onClick={() => dispatch(setIngredient(item))}
              />
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
