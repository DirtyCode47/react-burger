import { expect, test } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const ingredientNames = {
  bun: 'Краторная булка N-200i',
  main: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X',
};

const closeModal = async (modal: Locator): Promise<void> => {
  await modal.locator('svg').first().click();
  await expect(modal).not.toBeVisible();
};

const addIngredientToConstructor = async (
  ingredient: Locator,
  constructor: Locator
): Promise<void> => {
  await ingredient.dragTo(constructor);
};

const prepareUser = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./e2e/mocks/api.har', {
    url: '**/api/**',
    update: false,
  });

  await prepareUser(page);
});

test('checks ingredient details modal and creates order from constructor', async ({
  page,
}) => {
  await page.goto('/');

  const modal = page.getByTestId('modal');
  const constructor = page.getByTestId('burger-constructor');
  const bunIngredient = page.getByTestId('ingredient-bun-id');
  const mainIngredient = page.getByTestId('ingredient-main-id');
  const sauceIngredient = page.getByTestId('ingredient-sauce-id');
  const constructorBunTop = page.getByTestId('constructor-bun-top');
  const constructorBunBottom = page.getByTestId('constructor-bun-bottom');
  const constructorIngredients = page.getByTestId('constructor-ingredients');
  const orderButton = page.getByTestId('order-button');
  const orderNumber = page.getByTestId('order-number');

  await bunIngredient.click();

  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Детали ингредиента');
  await expect(modal).toContainText(ingredientNames.bun);
  await expect(modal).toContainText('420');
  await expect(modal).toContainText('80');
  await expect(modal).toContainText('24');
  await expect(modal).toContainText('53');

  await closeModal(modal);

  await addIngredientToConstructor(bunIngredient, constructor);
  await addIngredientToConstructor(mainIngredient, constructor);
  await addIngredientToConstructor(sauceIngredient, constructor);

  await expect(constructorBunTop).toContainText(`${ingredientNames.bun} (верх)`);
  await expect(constructorBunBottom).toContainText(`${ingredientNames.bun} (низ)`);
  await expect(constructorIngredients).toContainText(ingredientNames.main);
  await expect(constructorIngredients).toContainText(ingredientNames.sauce);

  await orderButton.click();

  await expect(modal).toBeVisible();
  await expect(orderNumber).toHaveText('12345');
  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

  await closeModal(modal);

  await expect(page.getByText('Выберите булки').first()).toBeVisible();
  await expect(page.getByText('Выберите начинку')).toBeVisible();
});
