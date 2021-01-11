import { prompt } from 'inquirer';
import composeQuestions from './composeQuestions';
import Compose, { ComposeData } from '.';
import { createServices } from '../service/serviceOperations';
import createAdditionalComponents from '../addons/additionalComponentOperations';
import { Services } from '../service';
import { AdditionalComponents } from '../addons';

export async function askForComposeData() {
  return prompt(composeQuestions);
}

export function createCompose(
  services: Services,
  additionalComponents: AdditionalComponents,
  composeData: ComposeData,
): Compose {
  return new Compose(
    composeData['compose-version'],
    services,
    additionalComponents.volumes,
    additionalComponents.networks,
  );
}

export function preprocessComposeData(composeData: ComposeData): ComposeData {
  const result = {};

  Object.keys(composeData).forEach((key) => {
    if (key.endsWith('-quantity')) {
      result[key] = parseInt(composeData[key], 10);
    } else {
      result[key] = composeData[key];
    }
  });

  return result;
}

export function processComposeData({ serviceData, composeData }) {
  const composeDataWithQuantities = preprocessComposeData(composeData);
  const services = createServices(serviceData);
  const additionalComponents = createAdditionalComponents(composeDataWithQuantities);
  return createCompose(services, additionalComponents, composeDataWithQuantities);
}
