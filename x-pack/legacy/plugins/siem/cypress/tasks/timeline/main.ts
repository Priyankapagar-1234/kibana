/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { DEFAULT_TIMEOUT } from '../../integration/lib/util/helpers';

import {
  SEARCH_OR_FILTER_CONTAINER,
  TIMELINE_FIELDS_BUTTON,
  SERVER_SIDE_EVENT_COUNT,
  TIMELINE_SETTINGS_ICON,
  TIMELINE_INSPECT_BUTTON,
  CREATE_NEW_TIMELINE,
  CLOSE_TIMELINE_BTN,
} from '../../screens/timeline/main';

export const hostExistsQuery = 'host.name: *';

export const populateTimeline = () => {
  cy.get(`${SEARCH_OR_FILTER_CONTAINER} input`).type(`${hostExistsQuery} {enter}`);
  cy.get(SERVER_SIDE_EVENT_COUNT, { timeout: DEFAULT_TIMEOUT })
    .invoke('text')
    .should('be.above', 0);
};

export const openTimelineFieldsBrowser = () => {
  cy.get(TIMELINE_FIELDS_BUTTON).click({ force: true });
};

export const executeTimelineKQL = (query: string) => {
  cy.get(`${SEARCH_OR_FILTER_CONTAINER} input`).type(`${query} {enter}`);
};

export const openTimelineSettings = () => {
  cy.get(TIMELINE_SETTINGS_ICON).trigger('click', { force: true });
};

export const openTimelineInspectButton = () => {
  cy.get(TIMELINE_INSPECT_BUTTON, { timeout: DEFAULT_TIMEOUT }).should('not.be.disabled');
  cy.get(TIMELINE_INSPECT_BUTTON).trigger('click', { force: true });
};

export const createNewTimeline = () => {
  cy.get(TIMELINE_SETTINGS_ICON).click({ force: true });
  cy.get(CREATE_NEW_TIMELINE).click();
  cy.get(CLOSE_TIMELINE_BTN).click({ force: true });
};
