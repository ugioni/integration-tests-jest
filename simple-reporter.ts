import { addMsg } from 'jest-html-reporters/helper';
import { Interaction } from 'pactum/src/exports/mock';
import * as Reporter from 'pactum/src/exports/reporter';

export const SimpleReporter = {
    name: 'SimpleReporter',

    async afterSpec(spec: Reporter.SpecData): Promise<void> {
        const { start, end, request, response } = spec;
        //await addMsg(JSON.stringify({ start, end, request, response }, undefined, 4));
    },

    
    afterStep(step: Record<string, unknown>): void {// eslint-disable-line @typescript-eslint/no-unused-vars
        // required by contract.
    },

    afterTest(test: Record<string, unknown>): void {// eslint-disable-line @typescript-eslint/no-unused-vars
        // required by contract
    },

    afterInteraction(interaction: Interaction): void {// eslint-disable-line @typescript-eslint/no-unused-vars
        // required by contract
    },

    end(): void | Promise<void> {
        // required by contract
    },
}
