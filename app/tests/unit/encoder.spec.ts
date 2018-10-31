import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Encoder from '@/views/Encoder.vue';

describe('Encoder.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(Encoder, {
      propsData: { },
    });
    // expect(wrapper.text()).to.include(msg);
  });
});
