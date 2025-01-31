import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomePage from '../HomePage.vue'

describe('HomePage', () => {
  it('renders properly', () => {
    const wrapper = mount(HomePage, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
