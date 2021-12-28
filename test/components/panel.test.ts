/**
 * @jest-environment jsdom
 */

import { shallowMount } from '@vue/test-utils';
import Panel from './../../src/assets/Panel.vue';

const factoryFactory = (component: string, options = {}, data = {}) => {

};

const factory = (options = {}, data = {}) => {
    return shallowMount(Panel, {
        ...options,
        data () {
            return {
                ...data
            }
        }
    });
};

describe('Panel', () => {
    test('shows correct slot content', async () => {
        const wrapper = factory({
            slots: {
                default: 'Slot Content'
            }
        });

        expect(wrapper.html()).toContain('Slot Content');
    });

    test(`add correct class for prop colored=true`, async () => {
        const wrapper = factory();
        await wrapper.setProps({ colored: true });
        expect(wrapper.classes()).toContain('panel--colored');
    });
});