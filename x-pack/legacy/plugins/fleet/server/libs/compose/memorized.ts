/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import os from 'os';
import { ApiKeyLib } from '../api_keys';
import { AgentLib } from '../agent';
import { FrameworkLib } from '../framework';
import { AgentsRepository } from '../../repositories/agents/default';
import { SODatabaseAdapter } from '../../adapters/saved_objects_database/default';
import { EnrollmentApiKeysRepository } from '../../repositories/enrollment_api_keys/default';
import { FrameworkAdapter } from '../../adapters/framework/default';
import { PolicyLib } from '../policy';
import { EncryptedSavedObjects } from '../../adapters/encrypted_saved_objects/default';
import { FleetServerLib } from '../types';
import { PoliciesRepository } from '../../repositories/policies/default';
import { ArtifactLib } from '../artifact';
import { FileSystemArtifactRepository } from '../../repositories/artifacts/file_system';
import { HttpAdapter } from '../../adapters/http_adapter/default';
import { AgentEventsRepository } from '../../repositories/agent_events/default';
import { InstallLib } from '../install';
import { ElasticsearchAdapter } from '../../adapters/elasticsearch/default';
import { MemorizeSODatabaseAdapter } from '../../adapters/saved_objects_database/memorize_adapter';
import { MemorizedElasticsearchAdapter } from '../../adapters/elasticsearch/memorize_adapter';
import { MemorizeEncryptedSavedObjects } from '../../adapters/encrypted_saved_objects/memorize_adapter';

export function compose(server?: any): FleetServerLib {
  const frameworkAdapter = new FrameworkAdapter(server);
  const policyAdapter = new PoliciesRepository(server ? server.plugins.ingest.policy : undefined);

  const framework = new FrameworkLib(frameworkAdapter);
  const soDatabaseAdapter = new MemorizeSODatabaseAdapter(
    server ? new SODatabaseAdapter(server.savedObjects, server.plugins.elasticsearch) : undefined
  );
  const esAdapter = new MemorizedElasticsearchAdapter(
    server ? new ElasticsearchAdapter(server.plugins.elasticsearch) : undefined
  );
  const encryptedObjectAdapter = new MemorizeEncryptedSavedObjects(
    server
      ? new EncryptedSavedObjects(server.newPlatform.start.plugins.encryptedSavedObjects)
      : undefined
  );
  const agentsRepository = new AgentsRepository(soDatabaseAdapter);
  const agentEventsRepository = new AgentEventsRepository(soDatabaseAdapter);
  const enrollmentApiKeysRepository = new EnrollmentApiKeysRepository(
    soDatabaseAdapter,
    encryptedObjectAdapter
  );

  const policies = new PolicyLib(policyAdapter);
  const apiKeys = new ApiKeyLib(enrollmentApiKeysRepository, esAdapter, framework);
  const agents = new AgentLib(agentsRepository, agentEventsRepository, apiKeys, policies);

  const artifactRepository = new FileSystemArtifactRepository(os.tmpdir());
  const artifacts = new ArtifactLib(artifactRepository, new HttpAdapter());

  const install = new InstallLib(framework);

  return {
    agents,
    apiKeys,
    policies,
    artifacts,
    install,
    framework,
  };
}