/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Logger } from '../../utils/logger';
import { SecOpsContext } from '../index';

import { mockSourceData } from './source.mock';

/* tslint:disable */
export const sourcesDataMock =
[
  mockSourceData,
];
/* tslint:enable */

export const getAllSourcesQueryMock = (logger: Logger) => ({
  allSources: (root: unknown, args: unknown, context: SecOpsContext) => {
    logger.info('Mock allSources');
    const operationName = context.req.payload.operationName.toLowerCase();
    switch (operationName) {
      case 'test': {
        logger.info(`Using mock for test ${sourcesDataMock}`);
        return sourcesDataMock;
      }
      default: {
        logger.error(`Could not find a mock for: ${operationName}`);
        return [];
      }
    }
  },
});
