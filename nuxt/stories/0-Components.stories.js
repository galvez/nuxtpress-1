import Button from './Components/Button.vue';
import TheNavbar from '~/components/TheNavbar.vue';
import TheFooter from '~/components/TheFooter.vue';

export default {
  title: 'Components',
};

export const button = () => ({
  components: { Button },
  template: '<Button />',
});

export const navbar = () => ({
  components: { TheNavbar },
  template: '<TheNavbar />',
});

export const footer = () => ({
  components: { TheFooter },
  template: '<TheFooter />',
});
