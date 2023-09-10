/* eslint-disable @typescript-eslint/no-unused-vars */
import { addMsg } from 'jest-html-reporters/helper';
import * as Reporter from 'pactum/src/exports/reporter';

export const SimpleReporter = {
  name: 'SimpleReporter',

  async afterSpec(spec: Reporter.SpecData): Promise<void> {
    const { start, end, request, response } = spec;
    await addMsg({
      message: JSON.stringify({ start, end, request, response }, undefined, 4),
      context: null
    });
  },

  afterStep(step: Record<string, unknown>): void {
    // required by contract.
  },

  afterTest(test: Record<string, unknown>): void {
    // required by contract
  },

  end(): void | Promise<void> {
    // required by contract
  }
};
