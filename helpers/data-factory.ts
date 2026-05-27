export function createUnitPayload(overrides?: Record<string, unknown>) {
  return {
    name: 'Test excavator unit name',
    model_name: 'CAT320',
    description: 'Test description for unit creation in automated tests',
    features: 'Test features for unit creation in automated tests',
    type_of_work: 'HOUR',
    time_of_work: '',
    phone: '+380991234567',
    minimal_price: 1000,
    money_value: 'UAH',
    payment_method: 'CASH_OR_CARD',
    lat: 48.4647,
    lng: 35.0462,
    manufacturer: 1,
    owner: null,
    category: 146,   // level 3 — палебійні установки
    services: [14],  // Послуги агродронів
    ...overrides,
  };
}