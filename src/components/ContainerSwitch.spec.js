import { render, fireEvent } from '@testing-library/vue'
import ContainerSwitch from './ContainerSwitch.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

test('changes switch value on click', async () => {

    const { getByTestId, getByText } = render(ContainerSwitch)
  
    // Get switch element by data-testid
    const gatSwitch = getByTestId('gatSwitch')

    const text = gatSwitch.innerText
  
    // Dispatch a native click event to our switch element.
    await fireEvent.click(gatSwitch)

    if (text === 'Testweave is up'){
      getByText('Testweave is down')
    } else{
      getByText('Testweave is up')
    } 
  })