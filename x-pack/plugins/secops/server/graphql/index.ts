/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { rootSchema } from '../../common/graphql/root';
import { sharedSchema } from '../../common/graphql/shared';
import { getSourceQueryMock } from '../graphql/sources/source.mock';
import { getAllSourcesQueryMock } from '../graphql/sources/sources.mock';
import { Logger } from '../utils/logger';

import { authenticationsSchema } from './authentications';
import { ecsSchema } from './ecs';
import { eventsSchema } from './events';
import { hostsSchema } from './hosts';
import { kpiNetworkSchema } from './kpi_network';
import { networkTopNFlowSchema } from './network_top_n_flow';
import { dateSchema } from './scalar_date';
import { sourceStatusSchema } from './source_status';
import { sourcesSchema } from './sources';
import { uncommonProcessesSchema } from './uncommon_processes';
import { whoAmISchema } from './who_am_i';

export const schemas = [
  authenticationsSchema,
  ecsSchema,
  eventsSchema,
  dateSchema,
  hostsSchema,
  networkTopNFlowSchema,
  rootSchema,
  sourcesSchema,
  sourceStatusSchema,
  sharedSchema,
  uncommonProcessesSchema,
  whoAmISchema,
  kpiNetworkSchema,
];

// The types from graphql-tools/src/mock.ts 'any' based. I add slightly
// stricter types here, but these should go away when graphql-tools using something
// other than "any" in the future for its types.
// https://github.com/apollographql/graphql-tools/blob/master/src/mock.ts#L406
export interface SecOpsContext {
  req: {
    payload: {
      operationName: string;
    };
  };
}

export const createMocks = (logger: Logger) => ({
  Query: () => ({
    ...getAllSourcesQueryMock(logger),
    ...getSourceQueryMock(logger),
  }),
});
