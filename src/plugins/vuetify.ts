import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme:{
        themes:{
            light:{
                primary: colors.teal,
                secondary: '#ffffff'
            },
            dark:{
                primary: '#D17C19',
                secondary: '#ffffff'
            }
        },
        dark: false
    }
});
