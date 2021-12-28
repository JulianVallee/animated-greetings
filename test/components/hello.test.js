/**
 * @jest-environment jsdom
 */

import { shallowMount } from '@vue/test-utils';
import Hello from './../../src/assets/Hello.vue';

describe("Foo", () => {
    test('Hello world!', async () => {
        // render the component
        const wrapper = shallowMount(Hello)

        // should not allow for `username` less than 7 characters, excludes whitespace
        await wrapper.setData({ username: ' '.repeat(7) });

        // assert the error is rendered
        expect(wrapper.find('.error').exists()).toBeTruthy();

        // update the name to be long enough
        await wrapper.setData({ username: '1234567' });

        // assert the error has gone away
        expect(wrapper.find('.error').exists()).toBeFalsy();
    });
});